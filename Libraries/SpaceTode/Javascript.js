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
		for (const instruction of element.instructions) print(instruction)
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
		lines.push("//=======//")
		lines.push("// CACHE //")
		lines.push("//=======//")
		for (const name of template.cache) {
			lines.push(`let ${name}`)
		}
		lines.push("")
		
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
		
		// MAIN
		lines.push("//======//")
		lines.push("// MAIN //")
		lines.push("//======//")
		lines.push(`const behave = (origin, selfElement, self) => {`)
		for (const chunk of template.main) {
			lines.push("")
			if (chunk.is(String)) {
				lines.push(`	` + chunk)
				continue
			}
			for (const needer of chunk.input.needers) {
				const getCode = needer.need.generateGet(needer.x, needer.y, needer.id, needer.argNames)
				if (getCode !== undefined) lines.push(`	${needer.name} = ${getCode}`)
				const extraCode = needer.need.generateExtra(needer.x, needer.y, needer.id, needer.argNames)
				if (extraCode !== undefined) lines.push(`	${extraCode}`)
				
			}
		}
		lines.push(`}`)
		lines.push(``)
		lines.push(`return behave`)
		
		const code = lines.join("\n")
		return code
	}
	
	//================================//
	// Local Name Parsing (pointless) //
	//================================//
	const getLocalNamePosition = (name, need) => {
		const head = need.name
		const tail = name.slice(head.length)
		const {x, y} = eatTailPosition(tail)
		return {x, y}
	}
	
	const eatTailPosition = (source) => {
		let x = undefined
		let y = undefined
		let result = undefined
		result = {source, number: x} = eatTailNumber(source)
		result = {source, number: y} = eatTailNumber(source)
		return {x, y}
	}
	
	const eatTailNumber = (source) => {
		if (source === "") return {source: ""}
		let i = 0
		let sign = 1
		if (source[0] == "_") {
			sign = -1
			i++
		}
		const digit = source[i].as(Number)
		i++
		
		const number = digit.as(Number) * sign
		source = source.slice(i)
		return {source, number}
	}
	
	//========//
	// behave //
	//========//
	const makeBehaveCode = (instructions, name) => {
	
		let template = makeEmptyTemplate()
	
		for (let i = 0; i < instructions.length; i++) {
			const instruction = instructions[i]
			const type = instruction.type
			const value = instruction.value
			type.generate(template, value)
		}
		
		if (name == "_Sand") print(template)
	
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


