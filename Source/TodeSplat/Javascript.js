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
	JAVASCRIPT.makeBehave = (instructions, name) => {
	
		/*print("")
		print(name)
		
		let behave = `(self, sites) => {\n`
	
		for (const instruction of instructions) {
		
			print(instruction.type.toDescription())
			if (instruction.type == INSTRUCTION.TYPE.DIAGRAM) {
				for (const space of instruction.spaces) {
					const sn = EVENTWINDOW.getSiteNumber(space.x, space.y, 0)
					print(space)
				}
				
			}
		}
		
		behave += `	}\n`
		
		let code = `() => {\
		\n\
		\n	const behave = ${behave}\
		\n\
		\n	return behave\
		\n}`
		
		return code*/
		
		return "() => () => {}"
	}
	
	showInstructions = (element) => {
		element.instructions.forEach(instruction => print(instruction))
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
	
		let dataCode = ``
		let dataArgs = ``
		for (const dataName in data) {
			if (dataArgs.length == 0) dataArgs += `${dataName}`
			else dataArgs += `, ${dataName}`
			dataCode += `, ${dataName}`
		}
		
	
		return `(${dataArgs}) => {
		
			const element = function ${name}() {
				const atom = {element${dataCode}}
				return atom
			}
			return element
		}`
	}
	
	//=========//
	// Private //
	//=========//
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


