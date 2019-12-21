//=========//
// Element //
//=========//
const ELEMENT = {}

{
	// Element Job Description
	//========================
	// "I describe how I look and behave."

	//========//
	// Public //
	//========//
	ELEMENT.globalElements = {}
	ELEMENT.make = ({
		name, colour = "white", emissive = colour, opacity = 1.0,
		precise = false, floor = false, hidden = false, pour = true,
		rules = [], data = {}, ...properties
	}) => {
	
		const code = makeCode(rules, {name})
		const func = new Function(code)()
		
		const elementInfo = {
			
			// Appearance
			name, colour, emissive, opacity,
			
			// Dropper
			precise, floor, hidden, pour,
			
			// Debug
			code, rules,
			
			// Behaviour
			func, data, ...properties
			
		}
		
		const elementMaker = JS `() => {
			const element = function ${name}() {
				return {element}
			}
			return element
		}`
		
		const element = elementMaker()
		element.o= elementInfo
		
		ELEMENT.globalElements[name] = element
		createShaderColours(element)
		return element
	}
	
	//===========//
	// Functions //
	//===========//
	const makeCode = (rules, {name}) => {
		
		// Buffers
		let mainCode = ""
		let symmetryArrayCode = ""
		let symmetryFuncsCode = ""
		let givensCode = ""
		let changesCode = ""
		let code = ""
		
		const doneParams = []
		const doneGivens = []
		const doneChanges = []
		
		// Constants
		const mainFuncName = `${name}Main`
		const symmetryArrayName = `${name}Symmetries`
		const symmetryNumberName = `symmetryNumber`
		const symmetryFuncName = `${name}Symmetry`
		const maxSymmetryCount = 2
		
		// Main
		mainCode += `const ${mainFuncName} = (self, sites) => {\n`
		mainCode += `const ${symmetryNumberName} = Math.floor(Math.random() * ${maxSymmetryCount})\n`
		mainCode += `return ${symmetryArrayName}[${symmetryNumberName}](self, sites)\n`
		mainCode += "}\n"
		mainCode = indentInnerCode(mainCode)
		
		// Symmetry Array
		symmetryArrayCode += `const ${symmetryArrayName} = [\n`
		for (let s = 0; s < maxSymmetryCount; s++) {
			symmetryArrayCode += `${symmetryFuncName}${s}Rule0,\n`
		}
		symmetryArrayCode += `]\n`
		symmetryArrayCode = indentInnerCode(symmetryArrayCode)
		
		// Symmetry Funcs
		for (let s = 0; s < maxSymmetryCount; s++) {
			
			for (let r = 0; r < rules.length; r++) {
				const rule = rules[r]
				const events = rule.eventLists[s]
				
				let ruleCode = ""
				ruleCode += `const ${symmetryFuncName}${s}Rule${r} = (self, sites, ${doneParams.join(", ")}) => {\n`
				ruleCode += "\n// INPUTS\n"
				ruleCode += "//========\n"
				
				for (let e = 0; e < events.length; e++) {
					const event = events[e]
					
					// Givens
					const givens = event.input.givens
					for (let g = 0; g < givens.length; g++) {
						const given = givens[g]
						if (!doneGivens.includes(given)) {
							const number = doneGivens.push(given) - 1
							givensCode += `const ${name}Given${number} = ${given}\n`
						}
						const givenNumber = doneGivens.indexOf(given)
						const givenName = `${name}Given${givenNumber}`
						const givenParams = getParams(given)
						const givenSiteParams = givenParams.map(param => {
							if (param == "space" || param == "atom" || param == "element") return `${param}${event.siteNumber}`
							else return param
						})
						
						
						const spaceName = `space${event.siteNumber}`
						if (!doneParams.includes(spaceName))
						if (givenParams.includes("space") || givenParams.includes("atom") || givenParams.includes("element")) {
							ruleCode += `const ${spaceName} = sites[${event.siteNumber}]\n`
							doneParams.push(spaceName)
						}
						
						const atomName = `atom${event.siteNumber}`
						if (!doneParams.includes(atomName))
						if (givenParams.includes("atom") || givenParams.includes("element")) {
							ruleCode += `const ${atomName} = ${spaceName} && ${spaceName}.atom\n`
							doneParams.push(atomName)
						}
						
						const elementName = `element${event.siteNumber}`
						if (!doneParams.includes(elementName))
						if (givenParams.includes("element")) {
							ruleCode += `const ${elementName} = ${atomName} && ${atomName}.element\n`
							doneParams.push(elementName)
						}
						
						const givenParamsCode = givenSiteParams.join(", ")
						if (r == rules.length - 1) ruleCode += `if (!${givenName}(${givenParamsCode})) return false\n`
						else ruleCode += `if (!${givenName}(${givenParamsCode})) return ${symmetryFuncName}${s}Rule${r+1}(self, sites, ${doneParams.join(", ")})\n`
						ruleCode += `\n`
					}
					
				}
				
				ruleCode += "// OUTPUTS\n"
				ruleCode += "//=========\n"
				for (let e = 0; e < events.length; e++) {
					const event = events[e]
					
					// Changes
					const changes = event.output.changes
					for (let c = 0; c < changes.length; c++) {
						const change = changes[c]
						if (!doneChanges.includes(change)) {
							const number = doneChanges.push(change) - 1
							changesCode += `const ${name}Change${number} = ${change}\n`
						}
						const changeNumber = doneChanges.indexOf(change)
						const changeName = `${name}Change${changeNumber}`
						const changeParams = getParams(change)
						const changeSiteParams = changeParams.map(param => {
							if (param == "space" || param == "atom" || param == "element") return `${param}${event.siteNumber}`
							else return param
						})
						
						const spaceName = `space${event.siteNumber}`
						if (!doneParams.includes(spaceName)) {
							ruleCode += `const space${event.siteNumber} = sites[${event.siteNumber}]\n`
							doneParams.push(spaceName)
						}
						
						const changeParamsCode = changeSiteParams.join(", ")
						ruleCode += `SPACE.setAtom(space${event.siteNumber}, ${changeName}(${changeParamsCode}))\n`
						ruleCode += `\n`
					}
				}
				
				ruleCode += `}\n`
				ruleCode = indentInnerCode(ruleCode)
				ruleCode += `\n`
				symmetryFuncsCode += ruleCode
				
			}
			
		}
		
		// Stitch it all together
		code += `//======//\n`
		code += `// MAIN //\n`
		code += `//======//\n`
		code += mainCode
		code += `\n`
		code += `//================//\n`
		code += `// SYMMETRY FUNCS //\n`
		code += `//================//\n`
		code += symmetryFuncsCode
		code += `//================//\n`
		code += `// SYMMETRY ARRAY //\n`
		code += `//================//\n`
		code += symmetryArrayCode
		code += `\n`
		code += `//========//\n`
		code += `// GIVENS //\n`
		code += `//========//\n`
		code += givensCode
		code += `\n`
		code += `//=========//\n`
		code += `// CHANGES //\n`
		code += `//=========//\n`
		code += changesCode
		code += `\n`
		code += `return ${mainFuncName}`
		
		print(code)
		return code
		
	}
	
	const makeCodeOld = (rules, {name}) => {
		
		const ruleFuncs = {}
		const symmetryInputArrays = {}
		const symmetryInputFuncs = {}
		const symmetryOutputArrays = {}
		const symmetryOutputFuncs = {}
		const givenFuncs = []
		const changeFuncs = []
		
		const doneOneSymmetries = []
		
		//======================//
		// MAIN FUNC GENERATION //
		//======================//
		// Header
		const mainFuncName = `${name}Main`
		let mainCode = ""
		mainCode += `const ${mainFuncName} = (self, sites) => {\n`
		
		// Go through each rule
		for (let r = 0; r < rules.length; r++) {
		
			//======================//
			// RULE CODE GENERATION //
			//======================//
			// Header
			const rule = rules[r]
			const ruleInputName = `${name}Rule${r}Input`
			let ruleCode = "\n"
			
			const symmetryArrayName = `${ruleInputName}Symmetries`
			const symmetryOutputArrayName = `${name}Rule${r}OutputSymmetries`
			const oneSymmetryNumberName = `one${rule.oneSymmetries.as(UpperCase)}`
			
			// Prepare One Symmetries
			if (!doneOneSymmetries.includes(rule.oneSymmetries)) {
				ruleCode += `const ${oneSymmetryNumberName} = Math.floor(Math.random() * ${rule.oneSymmetriesCount})\n`
				doneOneSymmetries.push(rule.oneSymmetries)
			}
			
			// End rule func
			//ruleCode += "}\n"
			//ruleCode = indentInnerCode(ruleCode)
			ruleFuncs[ruleInputName] = ruleCode
			mainCode += ruleCode
			
			
			const outputFuncName = `${name}RuleOutput${r}`
			mainCode += `if (${symmetryArrayName}[${oneSymmetryNumberName}](self, sites)) {\n	return ${symmetryOutputArrayName}[${oneSymmetryNumberName}](self, sites)\n}\n`
			//============================================//
			
			//===========================//
			// SYMMETRY ARRAY GENERATION //
			//===========================//
			
			let symmetryArrayCode = ""
			symmetryArrayCode += "[\n"
			
			let symmetryOutputArrayCode = ""
			symmetryOutputArrayCode += "[\n"
			
			// Go through each symmetry
			for (let s = 0; s < rule.oneSymmetriesCount; s++) {
				
				//================================//
				// INPUT SYMMETRY FUNC GENERATION //
				//================================//
				{
					const symmetryFuncName = `${ruleInputName}Symmetry${rule.oneSymmetries.as(UpperCase)}${s}`
					symmetryArrayCode += `${symmetryFuncName},\n`
					
					let symmetryCode = ""
					let innerSymmetryCode = ""
					const symmetryParams = []
					
					const events = rule.eventLists[s]
					for (let e = 0; e < events.length; e++) {
						const event = events[e]
						const givens = event.input.givens
						for (let g = 0; g < givens.length; g++) {
							innerSymmetryCode += "\n"
							const given = givens[g]
							const givenIndex = givenFuncs.indexOf(given)
							const givenNumber = givenIndex != -1? givenIndex : givenFuncs.push(given) - 1
							const givenName = `${name}Given${givenNumber}`
							const givenParams = getParams(given)
							const givenSiteParams = givenParams.map(param => {
								if (param == "space" || param == "atom" || param == "element") return `${param}${event.siteNumber}`
								else return param
							})
							
							// Retrieve Params
							if (givenParams.includes("space") || givenParams.includes("atom") || givenParams.includes("element")) {
								innerSymmetryCode += `const space${event.siteNumber} = sites[${event.siteNumber}]\n`
							}
							
							if (givenParams.includes("atom") || givenParams.includes("element")) {
								innerSymmetryCode += `const atom${event.siteNumber} = space${event.siteNumber} && space${event.siteNumber}.atom\n`
							}
							
							if (givenParams.includes("element")) {
								innerSymmetryCode += `const element${event.siteNumber} = atom${event.siteNumber} && atom${event.siteNumber}.element\n`
							}
							
							const givenParamsCode = givenSiteParams.join(", ")
							innerSymmetryCode += `if (!${givenName}(${givenParamsCode})) return false\n`
						}
						
					}
					
					symmetryCode += `(self, sites) => {\n`
					symmetryCode += innerSymmetryCode
					symmetryCode += "\n"
					symmetryCode += `return true\n`
					symmetryCode += `}\n`
					symmetryCode = indentInnerCode(symmetryCode)
					symmetryInputFuncs[symmetryFuncName] = symmetryCode
				}
				
				//================================//
				// OUTPUT SYMMETRY FUNC GENERATION //
				//================================//
				{
					const symmetryOutputFuncName = `${name}${r}OutputSymmetry${rule.oneSymmetries.as(UpperCase)}${s}`
					symmetryOutputArrayCode += `${symmetryOutputFuncName},\n`
					
					let symmetryCode = ""
					let innerSymmetryCode = ""
					const symmetryParams = []
					
					const events = rule.eventLists[s]
					for (let e = 0; e < events.length; e++) {
						const event = events[e]
						const changes = event.output.changes
						for (let c = 0; c < changes.length; c++) {
							innerSymmetryCode += "\n"
							const change = changes[c]
							const changeIndex = changeFuncs.indexOf(change)
							const changeNumber = changeIndex != -1? changeIndex : changeFuncs.push(change) - 1
							const changeName = `${name}Change${changeNumber}`
							const changeParams = getParams(change)
							const changeSiteParams = changeParams.map(param => {
								if (param == "space" || param == "atom" || param == "element") return `${param}${event.siteNumber}`
								else return param
							})
							
							// Retrieve Params
							innerSymmetryCode += `const space${event.siteNumber} = sites[${event.siteNumber}]\n`
							
							const changeParamsCode = changeSiteParams.join(", ")
							innerSymmetryCode += `SPACE.setAtom(space${event.siteNumber}, ${changeName}(${changeParamsCode}))\n`
						}
						
					}
					
					symmetryCode += `(self, sites) => {\n`
					symmetryCode += innerSymmetryCode
					symmetryCode += "\n"
					symmetryCode += `}\n`
					symmetryCode = indentInnerCode(symmetryCode)
					symmetryOutputFuncs[symmetryOutputFuncName] = symmetryCode
				}
			}
			
			// End symmetry array
			symmetryArrayCode += "]\n"
			symmetryArrayCode = indentInnerCode(symmetryArrayCode)
			symmetryInputArrays[symmetryArrayName] = symmetryArrayCode
			//============================================================//
				
			// End symmetry array
			symmetryOutputArrayCode += "]\n"
			symmetryOutputArrayCode = indentInnerCode(symmetryOutputArrayCode)
			symmetryOutputArrays[`${name}Rule${r}OutputSymmetries`] = symmetryOutputArrayCode
			//============================================================//
			
			//============================================//
			

			
		}
		
		// End behave func
		mainCode += `}\n`
		mainCode = indentInnerCode(mainCode)
		//============================================//
		
		// Group all symmetry input arrays together
		let inputArraysCode = ""
		for (const symmetryInputArrayName in symmetryInputArrays) {
			const symmetryArrayCode = symmetryInputArrays[symmetryInputArrayName]
			inputArraysCode += `const ${symmetryInputArrayName} = ${symmetryArrayCode}\n`
		}
		
		// Group all symmetry input funcs together
		let inputFuncsCode = ""
		for (const symmetryInputFuncName in symmetryInputFuncs) {
			const symmetryFuncCode = symmetryInputFuncs[symmetryInputFuncName]
			inputFuncsCode += `const ${symmetryInputFuncName} = ${symmetryFuncCode}\n`
		}
		
		// Group all symmetry output arrays together
		let outputArraysCode = ""
		for (const symmetryOutputArrayName in symmetryOutputArrays) {
			const symmetryArrayCode = symmetryOutputArrays[symmetryOutputArrayName]
			outputArraysCode += `const ${symmetryOutputArrayName} = ${symmetryArrayCode}\n`
		}
		
		// Group all symmetry output funcs together
		let outputFuncsCode = ""
		for (const symmetryOutputFuncName in symmetryOutputFuncs) {
			const symmetryFuncCode = symmetryOutputFuncs[symmetryOutputFuncName]
			outputFuncsCode += `const ${symmetryOutputFuncName} = ${symmetryFuncCode}\n`
		}
		
		// Group all given funcs together
		let givensCode = ""
		givenFuncs.forEach((given, g) => {
			const givenName = `${name}Given${g}`
			givensCode += `const ${givenName} = ${given}\n`
		})
		
		// Group all change funcs together
		let changesCode = ""
		changeFuncs.forEach((change, g) => {
			const changeName = `${name}Change${g}`
			changesCode += `const ${changeName} = ${change}\n`
		})
		
		// Group everything together
		let code = ""
		code += `//======//\n`
		code += `// MAIN //\n`
		code += `//======//\n`
		code += mainCode
		code += "\n"
		code += `//========//\n`
		code += `// GIVENS //\n`
		code += `//========//\n`
		code += givensCode
		code += "\n"
		code += `//=========//\n`
		code += `// CHANGES //\n`
		code += `//=========//\n`
		code += changesCode
		code += "\n"
		code += `//==================//\n`
		code += `// INPUT SYMMETRIES //\n`
		code += `//==================//\n`
		code += inputFuncsCode
		code += `//===================//\n`
		code += `// OUTPUT SYMMETRIES //\n`
		code += `//===================//\n`
		code += outputFuncsCode
		code += `//=======================//\n`
		code += `// INPUT SYMMETRY ARRAYS //\n`
		code += `//=======================//\n`
		code += inputArraysCode
		code += `//========================//\n`
		code += `// OUTPUT SYMMETRY ARRAYS //\n`
		code += `//========================//\n`
		code += outputArraysCode
		code += `return ${mainFuncName}`
		print(code)
		return code
	}
	
	const indentInnerCode = (code) => {
		const lines = code.split("\n")
		const indentedLines = lines.map((line, i) => (i == 0 || i >= lines.length-2)? line : `	${line}`)
		const indentedCode = indentedLines.join("\n")
		return indentedCode
	}
	
	const ALPHABET = "abcdefghijklmnopqrstuvwxyz"
	
	const getParams = (func) => {
		const code = func.as(String)
		const params = []
		let buffer = ""
		for (let i = 0; i < code.length; i++) {
			const char = code[i]
			if ((char == "(" || char == "{" || char == " " || char == "	") && buffer == "") continue
			
			if (char.match(/[a-zA-Z0-9]/)) buffer += char
			else if (char == " " || char == "," || char == "	" || char == "}" || char == ")") {
				if (buffer != "") {
					params.push(buffer)
					buffer = ""
				}
			}
			else throw new Error(`[TodeSplat] Unexpected character in named parameters: '${char}'`)
			
			if (char == "}" || char == ")") break
		}
		return params
	}
	
	const createShaderColours = (element) => {
		const colourColour = new THREE.Color(element.colour)
		const emissiveColour = new THREE.Color(element.emissive)
		
		element.shaderColour = {
			r: colourColour.r * 255,
			g: colourColour.g * 255,
			b: colourColour.b * 255,
		}
		
		element.shaderOpacity = element.opacity * 255
		
		element.shaderEmissive = {
			r: emissiveColour.r * 255,
			g: emissiveColour.g * 255,
			b: emissiveColour.b * 255,
		}
	}
	
}

