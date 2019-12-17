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
		
		const ruleFuncs = {}
		const symmetryArrays = {}
		const symmetryFuncs = {}
		const givenFuncs = []
		
		//======================//
		// MAIN FUNC GENERATION //
		//======================//
		// Header
		const mainFuncName = `${name}Behave0`
		let mainCode = ""
		mainCode += `const ${mainFuncName} = (self, sites) => {\n`
		
		// Go through each rule
		for (let r = 0; r < rules.length; r++) {
		
			//======================//
			// RULE FUNC GENERATION //
			//======================//
			// Header
			const rule = rules[r]
			const ruleFuncName = `${name}Input${r}`
			let ruleCode = ""
			ruleCode += `(self, sites) => {\n`
			
			// Prepare One Symmetries
			const oneSymmetryNumberName = `one${rule.oneSymmetries.as(UpperCase)}`
			const symmetryArrayName = `${ruleFuncName}Symmetries`
			ruleCode += `const ${oneSymmetryNumberName} = Math.floor(Math.random() * ${rule.oneSymmetriesCount})\n`
			ruleCode += `return ${symmetryArrayName}[${oneSymmetryNumberName}](self, sites)\n`
			
			// End rule func
			ruleCode += "}\n"
			ruleCode = indentInnerCode(ruleCode)
			ruleFuncs[ruleFuncName] = ruleCode
			mainCode += `if (${ruleFuncName}(self, sites)) return ${name}Output${r}(self, sites)\n`
			//============================================//
			
			//===========================//
			// SYMMETRY ARRAY GENERATION //
			//===========================//
			let symmetryArrayCode = ""
			symmetryArrayCode += "[\n"
			
			// Go through each symmetry
			for (let s = 0; s < rule.oneSymmetriesCount; s++) {
				const symmetryFuncName = `${ruleFuncName}Symmetry${rule.oneSymmetries.as(UpperCase)}${s}`
				symmetryArrayCode += `${symmetryFuncName},\n`
				
				//==========================//
				// SYMMETRY FUNC GENERATION //
				//==========================//
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
				symmetryFuncs[symmetryFuncName] = symmetryCode
			}
			
			// End symmetry array
			symmetryArrayCode += "]\n"
			symmetryArrayCode = indentInnerCode(symmetryArrayCode)
			symmetryArrays[symmetryArrayName] = symmetryArrayCode
			//============================================//
			

			
		}
		
		// End behave func
		mainCode += `}\n`
		mainCode = indentInnerCode(mainCode)
		//============================================//
		
		// Group all rule functions together
		let rulesCode = ""
		for (const ruleFuncName in ruleFuncs) {
			const ruleCode = ruleFuncs[ruleFuncName]
			rulesCode += `const ${ruleFuncName} = ${ruleCode}\n`
		}
		
		// Group all symmetry arrays together
		let symmetryArraysCode = ""
		for (const symmetryArrayName in symmetryArrays) {
			const symmetryArrayCode = symmetryArrays[symmetryArrayName]
			symmetryArraysCode += `const ${symmetryArrayName} = ${symmetryArrayCode}\n`
		}
		
		// Group all symmetry funcs together
		let symmetryFuncsCode = ""
		for (const symmetryFuncName in symmetryFuncs) {
			const symmetryFuncCode = symmetryFuncs[symmetryFuncName]
			symmetryFuncsCode += `const ${symmetryFuncName} = ${symmetryFuncCode}\n`
		}
		
		// Group all given funcs together
		let givensCode = ""
		givenFuncs.forEach((given, g) => {
			const givenName = `${name}Given${g}`
			givensCode += `const ${givenName} = ${given}\n`
		})
		
		// Group everything together
		let code = ""
		code += `//======//\n`
		code += `// MAIN //\n`
		code += `//======//\n`
		code += mainCode
		code += "\n"
		code += `//========//\n`
		code += `// INPUTS //\n`
		code += `//========//\n`
		code += rulesCode
		code += `//==================//\n`
		code += `// INPUT SYMMETRIES //\n`
		code += `//==================//\n`
		code += symmetryFuncsCode
		code += `//=======================//\n`
		code += `// INPUT SYMMETRY ARRAYS //\n`
		code += `//=======================//\n`
		code += symmetryArraysCode
		code += `//========//\n`
		code += `// GIVENS //\n`
		code += `//========//\n`
		code += givensCode
		code += "\n"
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

