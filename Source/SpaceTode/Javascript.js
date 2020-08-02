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
				constructorArgNames += `, ${argName} = ${argName}Default`
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
		lines.push(`			opacity: ${D2_MODE? 255 : shaderOpacity}`)
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
			select: [],
			check: [],
			change: [],
			keep: [],
			behave: [],
		},
		
		// Stores the characters for symbol parts held in head
		chars: {
			given: [],
			select: [],
			check: [],
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
		lines.push(`const behave = (origin, Self, time, self = origin.atom) => {`)
		const constants = []
		lines.push(...makeChunksLines(template.main, `	`, [], constants, false, template))
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
	
	const makeChunksLines = (chunks, margin, gots, constants, missGap = false, template) => {
		let alreadyGots = gots
		const lines = []
		const maybeBlocks = []
		const maybeGots = []
		const maybeSymms = []
		let prevForSymmId = []
		
		for (let i = 0; i < chunks.length; i++) {
			const chunk = chunks[i]
			if (missGap) missGap = false
			else lines.push(``)
			if (chunk.is(String)) {
				lines.push(`${margin}` + chunk)
				continue
			}
			
			// Update gots each time
			if (maybeBlocks.length > 0) alreadyGots = maybeGots.last
			else alreadyGots = gots
			
			//=======//
			// Maybe //
			//=======//
			let maybes = chunk.maybes
			if (maybes === undefined) maybes = []
			
			const oldId = maybeBlocks.last? maybeBlocks.last.id : undefined
			const newId = maybes.last? maybes.last.id : undefined
			
			const maybesLength = maybes.length
			const maybeBlocksLength = maybeBlocks.length
			
			// End Maybe
			if (maybesLength < maybeBlocksLength && oldId !== newId) {
				const afterMaybeGots = [...maybeGots.last]
				maybeBlocks.pop()
				maybeGots.pop()
				
				const tail = chunks.slice(i)
				for (const t in tail) {
					if (tail[t].forSymmId !== undefined) {
						if (tail[t].forSymmId === prevForSymmId.last) {
							tail[t] = {...tail[t], forSymmId: undefined}
						}
					}
				}
				
				const afterLines = makeChunksLines(tail, `${margin}`, afterMaybeGots, constants, true, template)
				lines.push(`${margin}// Continue rules after successful 'maybe'`)
				lines.push(...afterLines)
				lines.push(`${margin}return`)
				
				margin = margin.slice(0, -1)
				lines.push(`${margin}}`)
				lines.push(`${margin}`)
				lines.push(`${margin}// Continue rules after failing 'maybe'`)
				i--
				missGap = true
				continue
			}
			
			//=========//
			// End For //
			//=========//
			const nextForSymmId = chunk.forSymmId
			if (prevForSymmId.length !== 0 && nextForSymmId !== prevForSymmId.last) {
				prevForSymmId.pop()
				margin = margin.slice(0, -1)
				lines.push(`${margin}}`)
			}
			
			//================//
			// Pre-Loop Input //
			//================//
			//lines.push(...chunk.debug.source.split("\n").map(s => `${margin}// ${s}`))
			for (const needer of chunk.input.needers) {
				if (needer.need.preLoop) lines.push(...makeNeederLines(needer, `${margin}`, alreadyGots, true, constants, template))
			}
			
			//===========//
			// Start For //
			//===========//
			if (nextForSymmId !== undefined && prevForSymmId.last !== nextForSymmId) {
				const iName = `i${nextForSymmId}`
				if (!chunk.forSymmIsAll) lines.push(`${margin}const transNumsShuffledSymm${nextForSymmId} = transformationNumbersSymm${nextForSymmId}Const.shuffled`)
				lines.push(`${margin}for(let ${iName} = 0; ${iName} < ${chunk.forSymmTransCount}; ${iName}++) {`)
				lines.push(``)
				margin += `	`
				prevForSymmId.push(nextForSymmId)
			}
			
			// Start Maybe
			if (maybesLength > maybeBlocksLength) {
				const maybe = maybes.last
				maybeBlocks.push(maybe)
				maybeGots.push([...alreadyGots])
				lines.push(`${margin}// maybe(${maybes.last.chance})`)
				lines.push(`${margin}if (Math.random() < ${maybe.chance}) {`)
				lines.push(`${margin}`)
				margin += `	`
			}
			
			// Update gots after potentially changing block
			if (maybeBlocks.length > 0) alreadyGots = maybeGots.last
			else alreadyGots = gots
			
			//=======//
			// Input //
			//=======//
			lines.push(...chunk.debug.source.split("\n").map(s => `${margin}// ${s}`))
			for (const needer of chunk.input.needers) {
				if (!needer.need.preLoop) lines.push(...makeNeederLines(needer, `${margin}`, alreadyGots, true, constants, template))
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
				lines.push(...makeNeederLines(needer, `${margin}	`, outputAlreadyGots, true, constants, template))
			}
			
			//=================//
			// Remaining Rules //
			//=================//
			if (chunk.isInAction) {
				const tail = chunks.slice(i+1).filter(c => {
					if (c.actionIds === undefined) return true
					if (c.actionIds.length === chunk.actionIds.length && c.actionIds.last !== chunk.actionIds.last) return true
					if ((c.actionIds.length > chunk.actionIds.length) && c.actionIds[chunk.actionIds.length-1] !== chunk.actionIds[chunk.actionIds.length-1]) return true
					if (c.actionIds.length < chunk.actionIds.length) return true
					return false
				})
				const afterLines = makeChunksLines(tail, `${margin}	`, outputAlreadyGots, constants, true, template)
				if (afterLines.length > 0) {
					lines.push(`${margin}	`)
					lines.push(`${margin}	// Continue rules after successful 'action'`)
				}
				lines.push(...afterLines)
			}
			
			//===================//
			// Remaining Actions //
			//===================//
			/*else {
				const tail = chunks.slice(i+1)
				const tailActions = tail.filter(chunk => chunk.isInAction)
				if (tailActions[0] !== undefined) {
					const afterLines = makeChunksLines(tailActions, `${margin}	`, outputAlreadyGots, constants, true, template)
					lines.push(`${margin}	`)
					lines.push(`${margin}	// Continue 'action's after matching a rule`)
					lines.push(...afterLines)
				}
			}*/
			
			lines.push(`${margin}	return`)
			lines.push(`${margin}}`)
		}
		
		//==========//
		// Tidy For //
		//==========//
		while (prevForSymmId.length !== 0) {
			prevForSymmId.pop()
			margin = margin.slice(0, -1)
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
	
	const makeNeederLines = (needer, indent, alreadyGots, cache = true, constants, template) => {
		const lines = []
		const need = needer.need
		if (need.generateGet && !alreadyGots.includes(needer.name)) {
			// "I'll just add one more parameter to this function. This is the last one, I swear."
			// "I'll just add one more parameter to this function. This is the last one, I swear."
			// "I'll just add one more parameter to this function. This is the last one, I swear."
			// "I'll just add one more parameter to this function. This is the last one, I swear."
			// "I'll just add one more parameter to this function. This is the last one, I swear."
			// "I'll just add one more parameter to this function. This is the last one, I swear."
			// "I'll just add one more parameter to this function. This is the last one, I swear."
			// "I'll just add one more parameter to this function. This is the last one, I swear."
			// "I'll just add one more parameter to this function. This is the last one, I swear."
			// "I'll just add one more parameter to this function. This is the last one, I swear."
			// "I'll just add one more parameter to this function. This is the last one, I swear."
			const getCode = need.generateGet(needer.x, needer.y, needer.z, needer.symmetry, needer.symmetryId, needer.id, needer.argNames, needer.idResultName, needer.forSymmId, needer.char, template, needer.diagram, needer.isAll, needer.spotMods)
			if (getCode !== undefined) lines.push(`${indent}const ${needer.name} = ${getCode}`)
			if (cache) alreadyGots.push(needer.name)
		}
		if (need.generateConstant) {
			const constantCode = need.generateConstant(needer.x, needer.y, needer.z, needer.symmetry, needer.symmetryId, needer.id, needer.argNames, needer.idResultName, needer.forSymmId, needer.char, template, needer.diagram, needer.isAll, needer.spotMods)
			if (constantCode !== undefined) constants.pushUnique(`const ${needer.name}Const = ${constantCode}`)
		}
		if (need.generateExtra) {
			const extraCode = need.generateExtra(needer.x, needer.y, needer.z, needer.symmetry, needer.symmetryId, needer.id, needer.argNames, needer.idResultName, needer.forSymmId, needer.char, template, needer.diagram, needer.isAll, needer.spotMods)
			if (extraCode !== undefined) lines.push(`${indent}${extraCode}`)
		}
		return lines
	}
	
	//========//
	// Behave //
	//========//
	const makeBehaveCode = (instructions, name) => {
		INSTRUCTION.resetIdResultCache() //spent one whole hour hunting a bug because i forgot to reset the cache for each element. caches are evil
		INSTRUCTION.resetCharIdCache() //lol made another cache instead of doing it properly. im sure njothing will go wrong
		const template = JAVASCRIPT.makeEmptyTemplate()
		
		const blockStart = {type: INSTRUCTION.TYPE.NAKED}
		const blockEnd = {type: INSTRUCTION.TYPE.BLOCK_END}
		const fullInstructions = [blockStart, ...instructions, blockEnd]
	
		for (let i = 0; i < fullInstructions.length; i++) {
			const instruction = fullInstructions[i]
			const type = instruction.type
			const value = instruction.value
			const tail = fullInstructions.slice(i+1)
			const diagramId = `D${i}`
			const jumps = type.generate(template, value, tail, undefined, undefined, undefined, undefined, undefined, undefined, diagramId)
			if (jumps !== undefined) i += jumps
		}
		
		const code = buildTemplate(template)
		//if (name == "DReg") print(code)
		return code
	}
	
	const indentInnerCode = (code) => {
		const lines = code.split("\n")
		const indentedLines = lines.map((line, i) => (i == 0 || i >= lines.length-2)? line : `	${line}`)
		const indentedCode = indentedLines.join("\n")
		return indentedCode
	}
	
}


