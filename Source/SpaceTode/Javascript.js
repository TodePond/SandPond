//============//
// Javascript //
//============//
const JAVASCRIPT = {}

{
	// Javascript Job Description
	//===========================
	// "I generate Javascript for an element's 'behave' function."

	//========//
	// Public //
	//========//
	JAVASCRIPT.makeBehaveCode = (instructions, name) => {
		return makeBehaveCode(instructions, name)
	}
	
	show = (element) => {
		print(element.name)
		for (const instruction of element.instructions) print(instruction.type, instruction.value)
	}
	
	// messy as hell
	JAVASCRIPT.makeConstructorCode = (name, data, args, visible, shaderColour, shaderEmissive, shaderOpacity) => {
	
		let closureArgNames = ``
		let constructorArgNames = ``
		let propertyNames = ``
	
		for (const argName in data) {
			if (closureArgNames.length == 0) {
				closureArgNames += `${argName}Default`
				propertyNames += `,\n ${argName}: ${argName}Default`
			}
			else {
				closureArgNames += `, ${argName}Default`
				propertyNames += `, ${argName}: ${argName}Default`
			}
		}
		
		for (const argName in args) {
			if (closureArgNames.length == 0) {
				closureArgNames += `${argName}Default`
			}
			else {
				closureArgNames += `, ${argName}Default`
			}
			if (constructorArgNames.length == 0) {
				constructorArgNames += `${argName} = ${argName}Default`
				propertyNames += `, ${argName}: ${argName}`
			}
			else {
				constructorArgNames += `${argName} = ${argName}Default`
				propertyNames += `, ${argName}: ${argName}`
			}
		}
		
		const lines = []
		lines.push(`(${closureArgNames}) => {`)
		lines.push(`	`)
		lines.push(`	const element = function ${name}(${constructorArgNames}) {`)
		lines.push(`		const atom = {`)
		lines.push(`			element,`)
		lines.push(`			visible: ${visible},`)
		lines.push(`			colour: {r: ${shaderColour.r}, g: ${shaderColour.g}, b: ${shaderColour.b}},`)
		lines.push(`			emissive: {r: ${shaderEmissive.r}, g: ${shaderEmissive.g}, b: ${shaderEmissive.b}},`)
		lines.push(`			opacity: ${shaderOpacity}`)
		lines.push(`			${propertyNames}`)
		lines.push(`		}`)
		lines.push(`		return atom`)
		lines.push(`	}`)
		lines.push(`	return element`)
		lines.push(`}`)
		const code = lines.join("\n")
		
		return code
		return (`(${closureArgNames}) => {\n` +
		`\n`+
		`const element = function ${name}(${constructorArgNames}) {\n`+
		`	const atom = {element, visible: element.visible, colour: element.shaderColour, emissive: element.shaderEmissive, opacity: element.shaderOpacity${propertyNames}}\n`+
		`	return atom\n`+
		`}\n`+
		`	return element\n`+
		`}`)
	}
	
	//==========//
	// Template //
	//==========//
	JAVASCRIPT.makeEmptyTemplate = () => ({
	
		// Head contains stores of global functions that we need
		head: {
			given: [],
			change: [],
			keep: [],
			behave: [],
		},
		
		// Cache stores global variables that we might use more than once
		cache: [],
		
		// 
		symmetry: [],
		
		// Main is an array of stuff that happens in order
		// Strings just get naively added to the code
		// Chunk objects specify more fancy stuff
		main: [
			
		],
	})
	
	const buildTemplate = (template) => {
		
		const lines = []
		
		
		lines.push("//=========//")
		lines.push("// SYMBOLS //")
		lines.push("//=========//")
		for (const storeName in template.head) {
			const store = template.head[storeName]
			for (let i = 0; i < store.length; i++) {
				const script = store[i]
				if (script === undefined) continue
				if (script.split("\n").length > 1) lines.push(``)
				lines.push(`const ${storeName}${i} = ${script}`)
				if (script.split("\n").length > 1) lines.push(``)
			}
		}
		lines.push("")
		lines.push("//========//")
		lines.push("// BEHAVE //")
		lines.push("//========//")
		lines.push(`const behave = (origin, selfElement, time, self = origin.atom) => {`)
		const constants = []
		lines.push(...makeChunksLines(template.main, `	`, [], constants))
		lines.push(`}`)
		lines.push(``)
		lines.push(`return behave`)
		
		const constantLines = []
		constantLines.push(`//===========//`)
		constantLines.push(`// CONSTANTS //`)
		constantLines.push(`//===========//`)
		constantLines.push(...constants)
		constantLines.push(``)
		lines.unshift(...constantLines)
		
		const code = lines.join("\n")
		return code
	}
	
	const makeChunksLines = (chunks, margin, alreadyGots, constants) => {
		const lines = []
		
		const maybeBlocks = []
		
		for (let i = 0; i < chunks.length; i++) {
			const chunk = chunks[i]
			lines.push(``)
			if (chunk.is(String)) {
				lines.push(`${margin}` + chunk)
				continue
			}
			
			//=======//
			// Maybe // TODO: fix this. it messes things up if it's not the last thing. should copy its own alreadygots, or something
			//=======//
			let maybes = chunk.maybes
			if (maybes === undefined) maybes = []
			if (maybes.length > maybeBlocks.length) {
				const maybe = maybes.last
				maybeBlocks.push(maybe)
				lines.push(`${margin}if (Math.random() < ${maybe.chance}) {`)
				margin += `	`
			}
			else if (maybes.length < maybeBlocks.length) {
				maybeBlocks.pop()
				margin = margin.slice(0, -1)
				lines.push(`${margin}}`)
			}
			
			//=======//
			// Input //
			//=======//
			lines.push(...chunk.debug.source.split("\n").map(s => `${margin}// ${s}`))
			for (const needer of chunk.input.needers) {
				lines.push(...makeNeederLines(needer, `${margin}`, alreadyGots, true, constants))
			}
			
			//===========//
			// Condition //
			//===========//
			const conditionInnerCode = chunk.conditions.join(" && ")
			if (chunk.conditions.length === 0) lines.push(`${margin}{`)
			else lines.push(`${margin}if (${conditionInnerCode}) {`)
			
			//========//
			// Output //
			//========//
			const outputAlreadyGots = [...alreadyGots]
			for (const needer of chunk.output.needers) {
				lines.push(...makeNeederLines(needer, `${margin}	`, outputAlreadyGots, true, constants))
			}
			
			//=================//
			// Remaining Rules //
			//=================//
			if (chunk.isInAction) {
				const tail = chunks.slice(i+1).filter(c => c.actionId !== chunk.actionId)
				const afterLines = makeChunksLines(tail, `${margin}	`, outputAlreadyGots, constants)
				lines.push(...afterLines)
			}
			
			//===================//
			// Remaining Actions //
			//===================//
			else {
				const tail = chunks.slice(i+1)
				const tailActions = tail.filter(chunk => chunk.isInAction)
				if (tailActions[0] !== undefined) {
					const afterLines = makeChunksLines(tailActions, `${margin}	`, outputAlreadyGots, constants)
					lines.push(...afterLines)
				}
			}
			
			lines.push(`${margin}	return`)
			lines.push(`${margin}}`)
		}
			
		//============//
		// Tidy Maybe //
		//============//
		while (maybeBlocks.length > 0) {
			maybeBlocks.pop()
			margin = margin.slice(0, -1)
			lines.push(`${margin}}`)
		}
		
		return lines
	}
	
	const makeNeederLines = (needer, indent, alreadyGots, cache = true, constants) => {
		const lines = []
		const need = needer.need
		if (need.generateGet && !alreadyGots.includes(needer.name)) {
			const getCode = need.generateGet(needer.x, needer.y, needer.z, needer.symmetry, needer.symmetryId, needer.id, needer.argNames, needer.idResultName, needer.symmetry)
			if (getCode !== undefined) lines.push(`${indent}const ${needer.name} = ${getCode}`)
			if (cache) alreadyGots.push(needer.name)
		}
		if (need.generateConstant) {
			const constantCode = need.generateConstant(needer.x, needer.y, needer.z, needer.symmetry, needer.symmetryId, needer.id, needer.argNames, needer.idResultName, needer.symmetry)
			if (constantCode !== undefined) constants.pushUnique(`const ${needer.name} = ${constantCode}`)
		}
		if (need.generateExtra) {
			const extraCode = need.generateExtra(needer.x, needer.y, needer.z, needer.symmetry, needer.symmetryId, needer.id, needer.argNames, needer.idResultName, needer.symmetry)
			if (extraCode !== undefined) lines.push(`${indent}${extraCode}`)
		}
		return lines
	}
	
	//========//
	// Behave //
	//========//
	const makeBehaveCode = (instructions, name) => {
	
		let template = JAVASCRIPT.makeEmptyTemplate()
		
		const blockStart = {type: INSTRUCTION.TYPE.NAKED}
		const blockEnd = {type: INSTRUCTION.TYPE.BLOCK_END}
		const fullInstructions = [blockStart, ...instructions, blockEnd]
	
		for (let i = 0; i < fullInstructions.length; i++) {
			const instruction = fullInstructions[i]
			const type = instruction.type
			const value = instruction.value
			const tail = fullInstructions.slice(i+1)
			const jumps = type.generate(template, value, tail)
			if (jumps !== undefined) i += jumps
		}
		
		//if (name == "_Sand") print(template)
	
		const code = buildTemplate(template)
		if (name == "_Lava") print(code)
		return code
	}
	
	const indentInnerCode = (code) => {
		const lines = code.split("\n")
		const indentedLines = lines.map((line, i) => (i == 0 || i >= lines.length-2)? line : `	${line}`)
		const indentedCode = indentedLines.join("\n")
		return indentedCode
	}
	
	const ALPHABET = "abcdefghijklmnopqrstuvwxyz"
	
	
	
}


