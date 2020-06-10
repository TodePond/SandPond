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
	JAVASCRIPT.makeConstructorCode = (name, data, args) => {
	
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
	const makeEmptyTemplate = () => ({
	
		// Head contains stores of global functions that we need
		head: {
			given: [],
			change: [],
			keep: [],
			behave: [],
		},
		
		// Cache stores global variables that we might use more than once
		cache: [],
		
		// Main is an array of stuff that happens in order
		// Strings just get naively added to the code
		// Chunk objects specify more fancy stuff
		main: [
			
		],
	})
	
	const buildTemplate = (template) => {
		
		const lines = []
		
		// BUFFER
		/*lines.push("//=======//")
		lines.push("// CACHE //")
		lines.push("//=======//")
		for (const name of template.cache) {
			lines.push(`let ${name}`)
		}
		lines.push("")*/
		
		// HEAD
		lines.push("//======//")
		lines.push("// HEAD //")
		lines.push("//======//")
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
		
		// DIAGRAMS
		/*lines.push("//==========//")
		lines.push("// DIAGRAMS //")
		lines.push("//==========//")
		const alreadyGots = []
		for (const i in template.main) {
			const chunk = template.main[i]
			if (chunk.is(String)) continue
			
			const name = `diagram${i}`
			lines.push(`const ${name} = (origin, selfElement, time, self) => {`)
			
			for (const needer of chunk.input.needers) {
				lines.push(...makeNeederLines(needer, `	`, alreadyGots, true))
			}
			
			const conditionInnerCode = chunk.conditions.join(" && ")
			if (chunk.conditions.length === 0) lines.push(`	{`)
			else lines.push(`	if (${conditionInnerCode}) {`)
			
			for (const needer of chunk.output.needers) {
				lines.push(...makeNeederLines(needer, `		`, alreadyGots, false))
			}
			
			lines.push(`		return true`)
			lines.push(`	}`)
			lines.push(`	return false`)
			lines.push(`}`)
			lines.push(``)
			const diagramCode = lines.join("\n")
		}*/
		
		// MAIN
		lines.push("//======//")
		lines.push("// MAIN //")
		lines.push("//======//")
		lines.push(`const behave = (origin, selfElement, time, self = selfElement.atom) => {`)
		/*for (const i in template.main) {
			const chunk = template.main[i]
			if (chunk.is(String)) {
				lines.push(`	` + chunk)
				continue
			}
			const name = `diagram${i}`
			lines.push(`	if (${name}(origin, selfElement, time, self)) return`)
		}*/
		const alreadyGots = []
		const startLines = []
		const endLines = []
		let margin = `	`
		for (const chunk of template.main) {
			startLines.push(``)
			if (chunk.is(String)) {
				startLines.push(`${margin}` + chunk)
				continue
			}
			
			for (const needer of chunk.input.needers) {
				startLines.push(...makeNeederLines(needer, `${margin}`, alreadyGots, true))
			}
			
			const conditionInnerCode = chunk.conditions.join(" && ")
			if (chunk.conditions.length === 0) startLines.push(`	{`)
			else startLines.push(`${margin}if (!(${conditionInnerCode})) {`)
			
			const diagramEndLines = []
			diagramEndLines.push(`${margin}	return`)
			diagramEndLines.push(`${margin}}`)
			for (const needer of chunk.output.needers) {
				diagramEndLines.push(...makeNeederLines(needer, `${margin}`, alreadyGots, false))
			}
			
			endLines.push(...diagramEndLines.reversed)
			margin += `	`
		}
		
		lines.push(...startLines)
		lines.push(...endLines.reversed)
		
		
		lines.push(`}`)
		lines.push(``)
		lines.push(`return behave`)
		
		const code = lines.join("\n")
		return code
	}
	
	const makeNeederLines = (needer, indent, alreadyGots, cache = true) => {
		const lines = []
		const need = needer.need
		// OPTIMISATION - alreadyGots stops redundantly getting needs that I already got
		if (need.generateGet && !alreadyGots.includes(needer.name)) {
			const getCode = need.generateGet(needer.x, needer.y, needer.z, needer.id, needer.argNames, needer.idResultName)
			lines.push(`${indent}const ${needer.name} = ${getCode}`)
			if (cache) alreadyGots.push(needer.name)
		}
		if (need.generateExtra) {
			const extraCode = need.generateExtra(needer.x, needer.y, needer.z, needer.id, needer.argNames, needer.idResultName)
			lines.push(`${indent}${extraCode}`)
		}
		return lines
	}
	
	//========//
	// Behave //
	//========//
	const makeBehaveCode = (instructions, name) => {
	
		let template = makeEmptyTemplate()
		
		const blockStart = {type: INSTRUCTION.TYPE.NAKED, value: undefined}
		const blockEnd = {type: INSTRUCTION.TYPE.BLOCK_END, value: undefined}
		const fullInstructions = [blockStart, ...instructions, blockEnd]
	
		for (let i = 0; i < fullInstructions.length; i++) {
			const instruction = fullInstructions[i]
			const type = instruction.type
			const value = instruction.value
			const tail = fullInstructions.slice(i+1)
			const jumps = type.generate(template, value, tail)
			if (jumps.is(Number)) i += jumps
		}
		
		// OPTIMISATION - remove redundant needers from chunks - because they are in previous chunks
		// note - just because a needer is in a previous chunk, it doesnt mean it will be processed
		// eg: if it was part of the output (which maybe didn't happen)
		// eg: if this chunk is an action, and the previous chunk was a rule that didn't get done
		// eg: it was optimised away, eg: from a 'maybe' keyword?
		// TODO
		// WOAH WOAH wait, check notes before doing this. need to change the core structure of generated js first
		
		//if (name == "_Sand") print(template)
	
		const code = buildTemplate(template)
		if (name == "_Sand") print(code)
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


