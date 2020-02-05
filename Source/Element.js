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
	
		const code = makeCode(rules, name)
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
			const element = function ${name}(args) {
				const atom = {element, ...element.data, ...args}
				return atom
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
	let isSand = false
	const makeCode = (rules, name) => {
	
		if (name == "Sand") isSand = true
		else isSand = false
		
		const globals = {
			givens: gatherGivens(rules),
			changes: gatherChanges(rules),
			selects: gatherSelects(rules),
			keeps: gatherKeeps(rules),
		}
	
		const mainCode = makeMainCode()
		const givensCode = makeGivensCode(globals)
		const changesCode = makeChangesCode(globals)
		const keepsCode = makeKeepsCode(globals)
		const selectsCode = makeSelectsCode(globals)
		
		const symmetriesCode = makeSymmetriesCode(rules, globals)
		
		let code = `// ${name}\n`
		code += mainCode
		code += givensCode
		code += selectsCode
		code += changesCode
		code += keepsCode
		code += symmetriesCode
		code += `return main`
		
		//if (isSand) print(code)
		return code
		
	}
	
	const makeSelectsCode = (globals) => {
		let code = Code `
			//=========//
			// SELECTS //
			//=========//
		`
		
		for (let s = 0; s < globals.selects.length; s++) {
			const select = globals.selects[s]
			code += `const select${s} = ${select.as(String)}\n`
		}
		
		code += `\n`
		return code
	}
	
	const makeChangesCode = (globals) => {
	
		let code = Code `
			//=========//
			// CHANGES //
			//=========//
		`
		
		for (let c = 0; c < globals.changes.length; c++) {
			const change = globals.changes[c]
			code += `const change${c} = ${change.as(String)}\n`
		}
		
		code += `\n`
		return code
	}
	
	const makeKeepsCode = (globals) => {
	
		let code = Code `
			//=======//
			// KEEPS //
			//=======//
		`
		
		for (let k = 0; k < globals.keeps.length; k++) {
			const keep = globals.keeps[k]
			code += `const keep${k} = ${keep? keep.as(String) : "() => {}"}\n`
		}
		
		code += `\n`
		return code
	}
	
	const makeGivensCode = (globals) => {
	
		let code = Code `
			//========//
			// GIVENS //
			//========//
		`
		
		for (let g = 0; g < globals.givens.length; g++) {
			const given = globals.givens[g]
			code += `const given${g} = ${given.as(String)}\n`
		}
		
		code += `\n`
		return code
	}
	
	const gatherSelects = (rules) => {
		
		const globalSelects = []
		
		for (let r = 0; r < rules.length; r++) {
			const rule = rules[r]
			const events = rule.reflections[0]
			for (let e = 0; e < events.length; e++) {
				const event = events[e]
				const input = event.input
				const selects = input.selects
				for (let s = 0; s < selects.length; s++) {
					const select = selects[s]
					if (!globalSelects.includes(select)) globalSelects.push(select)
				}
			}
		}
		
		return globalSelects
	}
	
	const gatherKeeps = (rules) => {
		
		const globalKeeps = []
		
		for (let r = 0; r < rules.length; r++) {
			const rule = rules[r]
			const events = rule.reflections[0]
			for (let e = 0; e < events.length; e++) {
				const event = events[e]
				const output = event.output
				const keeps = output.keeps
				for (let k = 0; k < keeps.length; k++) {
					const keep = keeps[k]
					if (!globalKeeps.includes(keep)) globalKeeps.push(keep)
				}
			}
		}
		
		return globalKeeps
	}
	
	const gatherChanges = (rules) => {
		
		const globalChanges = []
		
		for (let r = 0; r < rules.length; r++) {
			const rule = rules[r]
			const events = rule.reflections[0]
			for (let e = 0; e < events.length; e++) {
				const event = events[e]
				const output = event.output
				const changes = output.changes
				for (let c = 0; c < changes.length; c++) {
					const change = changes[c]
					if (!globalChanges.includes(change)) globalChanges.push(change)
				}
			}
		}
		
		return globalChanges
	}
	
	const gatherGivens = (rules) => {
		
		const globalGivens = []
		
		for (let r = 0; r < rules.length; r++) {
			const rule = rules[r]
			const events = rule.reflections[0]
			for (let e = 0; e < events.length; e++) {
				const event = events[e]
				const input = event.input
				const givens = input.givens
				for (let g = 0; g < givens.length; g++) {
					const given = givens[g]
					if (!globalGivens.includes(given)) globalGivens.push(given)
				}
			}
		}
		
		return globalGivens
	}
	
	// nothing to see hear
	// perfectly clean code
	// well maintained
	// highly readable
	const makeInnerSymmetryCode = (rules, globals, symmetryNumber) => {
		
		const locals = []
		
		let code = `(self, sites) => {\n`
		//code += `\n	let ruleDone = false\n`
		
		for (let r = 0; r < rules.length; r++) {
			const rule = rules[r]
			
			const ruleCodes = []
			
			for (let i = 0; i < 1; i++) { //lol
			
				let iterationNumber = i + symmetryNumber
				if (iterationNumber >= 48) iterationNumber -= 48
				const iteration = rule.reflections
				
				let iterationCode = ``
				let ruleCode = ``
				const events = iteration[symmetryNumber]
				iterationCode += `\n`
				
				// Given Result 
				//==============
				for (let e = 0; e < events.length; e++) {
					const event = events[e]
					const s = event.siteNumber
					const input = event.input
					const givens = input.givens
					
					for (let g = 0; g < givens.length; g++) {
						const given = givens[g]
						const givenId = globals.givens.indexOf(given)
						const givenResultName = `given${givenId}Result${s}`
						if (locals.includes(givenResultName)) continue
						
						locals.push(givenResultName)
						const givenParams = getParams(given)
						const givenSiteParams = givenParams.map(param => {
							if (param == "space" || param == "atom" || param == "element") return `${param}${s}`
							else return param
						})
						
						const spaceName = `space${event.siteNumber}`
						if (!locals.includes(spaceName))
						if (givenParams.includes("space") || givenParams.includes("atom") || givenParams.includes("element")) {
							iterationCode += `	const ${spaceName} = sites[${event.siteNumber}]\n`
							locals.push(spaceName)
						}
						
						const atomName = `atom${event.siteNumber}`
						if (!locals.includes(atomName))
						if (givenParams.includes("atom") || givenParams.includes("element")) {
							iterationCode += `	const ${atomName} = ${spaceName}? ${spaceName}.atom : undefined\n`
							locals.push(atomName)
						}
						
						const elementName = `element${event.siteNumber}`
						if (!locals.includes(elementName))
						if (givenParams.includes("element")) {
							iterationCode += `	const ${elementName} = ${atomName}? ${atomName}.element : undefined\n`
							locals.push(elementName)
						}
						
						iterationCode += `	const ${givenResultName} = given${givenId}(${givenSiteParams.join(", ")})\n`
						
					}
				}
				
				// Given If Statement
				//====================
				ruleCode += `	if (`
				let firstGiven = true
				for (let e = 0; e < events.length; e++) {
					const event = events[e]
					const s = event.siteNumber
					const input = event.input
					const givens = input.givens
					for (let g = 0; g < givens.length; g++) {
						const given = givens[g]
						const givenId = globals.givens.indexOf(given)
						const givenResultName = `given${givenId}Result${s}`
						
						if (firstGiven) {
							firstGiven = false
							ruleCode += `${givenResultName}`
						}
						else ruleCode += ` && ${givenResultName}`
					}
				}
				
				ruleCode += `) {\n`
				
				const outputLocals = []
				
				// Selects
				//=========
				const selectedRegister = {}
				for (let e = 0; e < events.length; e++) {
					const event = events[e]
					const s = event.siteNumber
					const input = event.input
					const select = input.selects[0]
					
					if (input.selects.length > 1) throw new Error(`[TodeSplat] You can't have multiple select events in one space.`)
					if (!select) continue
					
					const selectId = globals.selects.indexOf(select)
					selectedRegister[input.name] = selectId
					const selectedName = `selected${selectId}`
					
					if (outputLocals.includes(selectedName)) throw new Error (`[TodeSplat] You can't have multiple copies of a select event in a rule diagram (yet).`)
					outputLocals.push(selectedName)
					
					const selectParams = getParams(select)
					
					const spaceName = `space${event.siteNumber}`
					if (!locals.includes(spaceName) && !outputLocals.includes(spaceName))
					if (selectParams.includes("space") || selectParams.includes("atom") || selectParams.includes("element")) {
						ruleCode += `		const ${spaceName} = sites[${event.siteNumber}]\n`
						outputLocals.push(spaceName)
					}
					
					const atomName = `atom${event.siteNumber}`
					if (!locals.includes(atomName) && !outputLocals.includes(atomName))
					if (selectParams.includes("atom") || selectParams.includes("element")) {
						ruleCode += `		const ${atomName} = ${spaceName}? ${spaceName}.atom : undefined\n`
						outputLocals.push(atomName)
					}
					
					const elementName = `element${event.siteNumber}`
					if (!locals.includes(elementName) && !outputLocals.includes(elementName))
					if (selectParams.includes("element")) {
						ruleCode += `		const ${elementName} = ${atomName}? ${atomName}.element : undefined\n`
						outputLocals.push(elementName)
					}
					
					const selectSiteParams = selectParams.map(param => {
						if (param == "space" || param == "atom" || param == "element") return `${param}${s}`
						else return param
					})
					ruleCode += `		const ${selectedName} = select${selectId}(${selectSiteParams.join(", ")})\n`
				}
				
				// Changes 
				//=========
				for (let e = 0; e < events.length; e++) {
					const event = events[e]
					const s = event.siteNumber
					const output = event.output
					const change = output.changes[0]
					
					if (output.changes.length > 1) throw new Error(`[TodeSplat] You can't have multiple change events in one space.`)
					if (!change) continue
					
					const spaceName = `space${s}`
					if (!locals.includes(spaceName) && !outputLocals.includes(spaceName)) {
						ruleCode += `		const ${spaceName} = sites[${s}]\n`
					}
					outputLocals.push(spaceName)
					
					const changeParams = getParams(change)
					const changeSiteParams = changeParams.map(param => {
						if (param == "selected") {
							const selectedId = selectedRegister[output.name]
							return `selected${selectedId}`
						}
						else return param
					})
					const changeId = globals.changes.indexOf(change)
					ruleCode += `		const newAtom${s} = change${changeId}(${changeSiteParams.join(", ")})\n`
					ruleCode += `		SPACE.setAtom(space${s}, newAtom${s})\n`
				}
				
				// Keeps 
				//=======
				for (let e = 0; e < events.length; e++) {
					const event = events[e]
					const s = event.siteNumber
					const output = event.output
					const keep = output.keeps[0]
					
					if (output.keeps.length > 1) throw new Error(`[TodeSplat] You can't have multiple keep events in one space because I was too lazy to implement it yet. Please send me a message to tell me to stop slacking :) :)`)
					if (!keep) continue
					
					const keepParams = getParams(keep)
					
					const spaceName = `space${event.siteNumber}`
					if (!locals.includes(spaceName) && !outputLocals.includes(spaceName))
					if (keepParams.includes("space") || keepParams.includes("atom") || keepParams.includes("element")) {
						ruleCode += `		const ${spaceName} = sites[${event.siteNumber}]\n`
						outputLocals.push(spaceName)
					}
					
					const atomName = `atom${event.siteNumber}`
					if (!locals.includes(atomName) && !outputLocals.includes(atomName))
					if (keepParams.includes("atom") || keepParams.includes("element")) {
						ruleCode += `		const ${atomName} = ${spaceName}? ${spaceName}.atom : undefined\n`
						outputLocals.push(atomName)
					}
					
					const elementName = `element${event.siteNumber}`
					if (!locals.includes(elementName) && !outputLocals.includes(elementName))
					if (keepParams.includes("element")) {
						ruleCode += `		const ${elementName} = ${atomName}? ${atomName}.element : undefined\n`
						outputLocals.push(elementName)
					}
					
					const keepSiteParams = keepParams.map(param => {
						if (param == "selected") {
							const selectedId = selectedRegister[output.name]
							return `selected${selectedId}`
						}
						if (param == "space" || param == "atom" || param == "element") return `${param}${s}`
						else return param
					})
					
					const keepId = globals.keeps.indexOf(keep)
					ruleCode += `		keep${keepId}(${keepSiteParams.join(", ")})\n`
				}
				
				//ruleCode += `		ruleDone = true\n`
				if (!rule.isAction) ruleCode += `		return true\n`
				ruleCode += `	}\n`
				
				if (!ruleCodes.includes(ruleCode)) {
					iterationCode += ruleCode
					code += iterationCode	
					ruleCodes.push(ruleCode)
				}
			}
			
			
		}
		
		code += `	\n`
		code += `	return false\n`
		code += `}\n\n`
		
		return code
	}
	
	const makeSymmetriesCode = (rules, globals) => {
	
		const symmetryCodes = []
	
		let arrayCode = Code `
			//==================//
			// SYMMETRIES ARRAY //
			//==================//
			const symmetries = [
		`
		
		const arrayIds = {}
	
		let code = Code `
			//============//
			// SYMMETRIES //
			//============//
		`
		for (let s = 0; s < 48; s++) {
			let symmetryCode = makeInnerSymmetryCode(rules, globals, s)
			let arrayIndex = s
			const duplicateIndex = symmetryCodes.indexOf(symmetryCode)
			if (duplicateIndex != -1) {
				arrayIndex = duplicateIndex
			}
			else {
				code += `const symmetry${s} = `
				code += symmetryCode
			}
			symmetryCodes.push(symmetryCode)
			if (arrayIds[arrayIndex] == undefined) {
				arrayIds[arrayIndex] = 0
			}
			arrayIds[arrayIndex]++
		}
		code += `\n`
		
		const reducedIds = Math.reduce(...Object.values(arrayIds))
		let i = 0
		for (const id in arrayIds) {
			arrayIds[id] = reducedIds[i]
			i++
		}
		
		for (const id in arrayIds) {
			const idCount = arrayIds[id]
			for (let c = 0; c < idCount; c++) arrayCode += `	symmetry${id},\n`
		}
		
		const arrayLength = Object.values(arrayIds).reduce((a, b) => a + b, 0)
		
		arrayCode += `]\n\n`
		code += arrayCode
		
		code += Code `
			//====================//
			// SYMMETRY SELECTION //
			//====================//
			const selectSymmetry = () => {
				const symmetryNumber = Math.floor(Math.random() * ${arrayLength})
				return symmetries[symmetryNumber]
			}
			
		`
		
		return code
	}
	
	const makeMainCode = () => {
		const code = Code `
			//======//
			// MAIN //
			//======//
			const main = (self, sites) => {
				const symmetry = selectSymmetry()
				return symmetry(self, sites)
			}
			
		`
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
