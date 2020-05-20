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
		
		for (const instruction of element.instructions) {
		
			print(instruction)
			//print(instruction.type.toDescription())
			
			if (instruction.type == INSTRUCTION.TYPE.DIAGRAM) {
				for (const space of instruction.value) {
					const sn = EVENTWINDOW.getSiteNumber(space.x, space.y, 0)
					//print(space)
				}
			}
			
			if (instruction.type == INSTRUCTION.TYPE.MIMIC) {
				//print(instruction.value)
			}
		}
	}
	
	JAVASCRIPT.makeConstructor = (name, data, args) => {
	
		let closureArgNames = ``
		let constructorArgNames = ``
		let propertyNames = ``
	
		for (const argName in data) {
			if (closureArgNames.length == 0) {
				closureArgNames += `${argName}Default`
				propertyNames += `${argName}: ${argName}Default`
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
	
		return (`(${closureArgNames}) => {\n` +
		`\n`+
		`const element = function ${name}(${constructorArgNames}) {\n`+
		`	const atom = {element, visible: element.visible, colour: element.shaderColour, emissive: element.shaderEmissive, opacity: element.shaderOpacity, ${propertyNames}}\n`+
		`	return atom\n`+
		`}\n`+
		`	return element\n`+
		`}`)
	}
	
	//=========//
	// Private //
	//=========//
	const makeTemplate = () => ({
		head: {
			given: [],
			change: [],
			keep: [],
			behave: [],
		},
		main: [],
	})
	
	const buildTemplate = (template) => {
		
		const lines = []
		
		for (const scriptTypeName in template.head) {
			const scriptType = template.head[scriptTypeName]
			for (let i = 0; i < scriptType.length; i++) {
				const script = scriptType[i]
				if (script.split("\n").length > 1) lines.push(``)
				lines.push(`const ${scriptTypeName}${i} = ${script}`)
				if (script.split("\n").length > 1) lines.push(``)
			}
		}
		
		lines.push(`const behave = (self, origin) => {`)
		
		for (const part of template.main) {
			if (part.is(String)) lines.push(`	` + part)
		}
		
		lines.push(`}`)
		lines.push(``)
		lines.push(`return behave`)
		
		const code = lines.join("\n")
		return code
		
	}
	
	const makeBehaveCode = (instructions, name) => {
	
		let template = makeTemplate()
	
		for (let i = 0; i < instructions.length; i++) {
			const instruction = instructions[i]
			const type = instruction.type
			const value = instruction.value
			type.generate(template, value)
		}
	
		const code = buildTemplate(template)
		if (name == "Sand") print(code)
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
	
}


