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
	
		const code = makeCode(rules)
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
	const makeCode = (rules) => {
	
		const globals = {
			givens: gatherGivens(rules),
			changes: gatherChanges(rules),
		}
	
		const mainCode = makeMainCode()
		const givensCode = makeGivensCode(globals)
		const changesCode = makeChangesCode(globals)
		
		const symmetrySelectionCode = makeSymmetrySelectionCode()
		const symmetriesArrayCode = makeSymmetriesArrayCode()
		const symmetriesCode = makeSymmetriesCode(rules, globals)
		
		let code = ``
		code += mainCode
		code += givensCode
		code += changesCode
		code += symmetriesCode
		code += symmetrySelectionCode
		code += symmetriesArrayCode
		code += `return main`
		
		print(code)
		return code
		
	}
	
	const makeChangesCode = (globals) => {
	
		let code = Code `
			//========//
			// CHANGES //
			//========//
		`
		
		for (let c = 0; c < globals.changes.length; c++) {
			const change = globals.changes[c]
			code += `const change${c} = ${change.as(String)}\n`
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
	
	const gatherChanges = (rules) => {
		
		const globalChanges = []
		
		for (let r = 0; r < rules.length; r++) {
			const rule = rules[r]
			const events = rule.eventLists[0]
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
			const events = rule.eventLists[0]
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
	
	const makeSymmetryCode = (rules, globals, symmetryNumber) => {
		
		const locals = []
		
		let code = Code `
			const symmetry${symmetryNumber} = (self, sites) => {
		`
		
		for (let r = 0; r < rules.length; r++) {
			const rule = rules[r]
			const events = rule.eventLists[symmetryNumber]
			code += `\n`
			
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
						code += `	const ${spaceName} = sites[${event.siteNumber}]\n`
						locals.push(spaceName)
					}
					
					const atomName = `atom${event.siteNumber}`
					if (!locals.includes(atomName))
					if (givenParams.includes("atom") || givenParams.includes("element")) {
						code += `	const ${atomName} = ${spaceName}? ${spaceName}.atom : undefined\n`
						locals.push(atomName)
					}
					
					const elementName = `element${event.siteNumber}`
					if (!locals.includes(elementName))
					if (givenParams.includes("element")) {
						code += `	const ${elementName} = ${atomName}? ${atomName}.element : undefined\n`
						locals.push(elementName)
					}
					
					code += `	const ${givenResultName} = given${givenId}(${givenSiteParams.join(", ")})\n`
					
				}
			}
			
			// Given If Statement
			//====================
			for (let e = 0; e < events.length; e++) {
				const event = events[e]
				const s = event.siteNumber
				const input = event.input
				const givens = input.givens		
				for (let g = 0; g < givens.length; g++) {
					const given = givens[g]
					const givenId = globals.givens.indexOf(given)
					const givenResultName = `given${givenId}Result${s}`
					
					if (e == 0) code += `	if (${givenResultName}`
					else code += ` && ${givenResultName}`
					if (e == events.length-1) code += `)`
				}
			}
			
			// Changes 
			//=========
			code += ` {\n`
			for (let e = 0; e < events.length; e++) {
				const event = events[e]
				const s = event.siteNumber
				const output = event.output
				const change = output.changes[0]
				
				if (!change) continue
				
				const spaceName = `space${s}`
				if (!locals.includes(spaceName)) {
					code += `		const ${spaceName} = sites[${s}]\n`
				}
				
				const changeParams = getParams(change)
				const changeId = globals.changes.indexOf(change)
				code += `		const newAtom${s} = change${changeId}(${changeParams.join(", ")})\n`
				code += `		SPACE.setAtom(space${s}, newAtom${s})\n`
			}
			code += `		return true\n`
			code += `	}\n`
		}
		
		code += `	\n`
		code += `	return false\n`
		code += `}\n\n`
		
		return code
	}
	
	const makeSymmetriesCode = (rules, globals) => {
		let code = Code `
			//============//
			// SYMMETRIES //
			//============//
		`
		for (let s = 0; s < 2; s++) {
			code += makeSymmetryCode(rules, globals, s)
			code += ``
		}
		return code
	}
	
	const makeSymmetriesArrayCode = () => {
		const code = Code `
			//==================//
			// SYMMETRIES ARRAY //
			//==================//
			const symmetries = [
				symmetry0,
				symmetry1
			]
			
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
	
	const makeSymmetrySelectionCode = () => {
		let code = Code `
			//====================//
			// SYMMETRY SELECTION //
			//====================//
			const selectSymmetry = () => {
				const symmetryNumber = Math.floor(Math.random() * 2)
				return symmetries[symmetryNumber]
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

