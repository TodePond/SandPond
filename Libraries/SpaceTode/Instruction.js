//=============//
// Instruction //
//=============//
const POV = {}
POV.TYPE = {
	FRONT: Symbol("Front"),
	BACK: Symbol("Back"),
	RIGHT: Symbol("Side"),
	LEFT: Symbol("Right"),
	BOTTOM: Symbol("Bottom"),
	TOP: Symbol("Top"),
}

const INSTRUCTION = {}
INSTRUCTION.TYPE = {}
INSTRUCTION.make = (name, generate = () => "") => ({name, generate})

{
	INSTRUCTION.TYPE.BLOCK_END = INSTRUCTION.make("EndBlock")		
	INSTRUCTION.TYPE.NAKED = INSTRUCTION.make("NakedBlock")
	INSTRUCTION.TYPE.ANY = INSTRUCTION.make("AnyBlock")
	INSTRUCTION.TYPE.FOR = INSTRUCTION.make("ForBlock")
	INSTRUCTION.TYPE.MAYBE = INSTRUCTION.make("MaybeBlock")
	INSTRUCTION.TYPE.ACTION = INSTRUCTION.make("ActionBlock")
	INSTRUCTION.TYPE.MIMIC = INSTRUCTION.make("Mimic")
	INSTRUCTION.TYPE.POV = INSTRUCTION.make("PointOfView")

	INSTRUCTION.TYPE.BEHAVE = INSTRUCTION.make("Behave", (template, behave) => {
		const id = template.head.behave.push(behave) - 1
		template.main.push(`behave${id}(self, origin)`)
	})
	
	INSTRUCTION.TYPE.DIAGRAM = INSTRUCTION.make("Diagram", (template, diagram) => {
		const {head, buffer} = template
		for (const spot of diagram) {
			const {x, y} = spot
			const {given} = spot.input
			const {change, keep} = spot.output
			addFuncsToHead(head, "given", given)
			addFuncsToHead(head, "change", change)
			addFuncsToHead(head, "keep", keep)
			if (given !== undefined) for (const i in given) addNameToBuffer(buffer, `given${i}Result`, x, y)
			addFuncsToBuffer(buffer, given, x, y)
			addFuncsToBuffer(buffer, change, x, y)
			addFuncsToBuffer(buffer, keep, x, y)
		}
		
	})
	const addFuncsToHead = (head, name, funcs) => {
		if (funcs === undefined) return
		const store = head[name]
		for (const func of funcs) {
			if (func === undefined) continue
			if (store.includes(func)) continue
			store.push(func)
		}
	}
	
	const addNameToBuffer = (buffer, name, x, y) => {
		const xy = `${x}${y}`
		const _xy = xy.replace("-", "_")
		const bufferName = name + _xy
		if (buffer.includes(bufferName)) return
		buffer.push(bufferName)
	}
	
	const addFuncsToBuffer = (buffer, funcs, x, y) => {
		if (funcs === undefined) return
		for (const func of funcs) {
			if (func === undefined) continue
			const params = getParams(func)
			for (const param of params) addNameToBuffer(buffer, param, x, y)
		}
	}
	
	const getParams = (func) => {
		const code = func.as(String)
		const params = []
		let buffer = ""
		for (let i = 0; i < code.length; i++) {
			const char = code[i]
			if ((char == "(" || char == " " || char == "	") && buffer == "") continue
			
			if (char.match(/[a-zA-Z0-9$_]/)) buffer += char
			else if (char == " " || char == "," || char == "	" || char == ")") {
				if (buffer != "") {
					params.push(buffer)
					buffer = ""
				}
			}
			else throw new Error(`[SpaceTode] Unexpected character in named parameters: '${char}'\n\nPlease don't do anything fancy with your parameters in symbol functions :)\nGOOD: (element, space) => { ... }\nBAD: (element = Empty, {atom}) => { ... }\n\nPlease feel free to contact @todepond if you want to ask for help or complain about this :D\n`)
			
			if (char == "}" || char == ")") break
		}
		return params
	}
	
}


