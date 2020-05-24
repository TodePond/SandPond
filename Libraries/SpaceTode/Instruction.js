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
			
			addFuncsToBuffer(buffer, given, x, y)
			addFuncsToBuffer(buffer, change, x, y)
			addFuncsToBuffer(buffer, keep, x, y)
			if (given !== undefined) for (const i in given) addNameToBuffer(buffer, getLocalName(`given${i}Result`, x, y))
			if (change !== undefined) for (const i in change) addNameToBuffer(buffer, getLocalName(`change${i}Result`, x, y))
		}
	})
	
	//======//
	// Head //
	//======//
	const addFuncsToHead = (head, name, funcs) => {
		if (funcs === undefined) return
		const store = head[name]
		for (const func of funcs) {
			if (func === undefined) continue
			if (store.includes(func)) continue
			store.push(func)
		}
	}
	
	//========//
	// Buffer //
	//========//
	const addNameToBuffer = (buffer, name) => {
		if (buffer.includes(name)) return
		buffer.push(name)
	}
	
	const addFuncsToBuffer = (buffer, funcs, x, y) => {
		if (funcs === undefined) return
		for (const func of funcs) {
			if (func === undefined) continue
			const params = getParams(func)
			for (const param of params) {
				addArgToBuffer(buffer, param, x, y)
			}
		}
	}
	
	const addArgToBuffer = (buffer, arg, x, y) => {
	
		const symbolArg = symbolArgs[arg]
	
		const needs = symbolArg.needs
		if (needs === undefined) throw new Error(`[SpaceTode] Unrecognised argument: '${arg}'`)
		for (const need of needs) addArgToBuffer(buffer, need, x, y)
		
		const type = symbolArg.type
		if (type == SYMBOL_ARG_TYPE.GIVEN) return
		if (type == SYMBOL_ARG_TYPE.GLOBAL) return addNameToBuffer(buffer, arg)
		if (type == SYMBOL_ARG_TYPE.LOCAL) return addNameToBuffer(buffer, getLocalName(arg.d, x, y))
	}
	
	//=============//
	// Symbol Args //
	//=============//
	const symbolArgs = {}
	const defineSymbolArg = (name, type, needs = [], code = () => "") => {
		const symbolArg = {name, type, needs, code}
		symbolArgs[name] = symbolArg
		return symbolArg
	}
	
	SYMBOL_ARG_TYPE = {
		GIVEN: Symbol("Given"),
		GLOBAL: Symbol("Global"),
		LOCAL: Symbol("Local"),
	}
	
	defineSymbolArg("self", SYMBOL_ARG_TYPE.GIVEN)
	defineSymbolArg("origin", SYMBOL_ARG_TYPE.GIVEN)
	defineSymbolArg("sites", SYMBOL_ARG_TYPE.GLOBAL, ["origin"], (x, y) => {
		return `const sites = origin.sites`
	})
	
	defineSymbolArg("space", SYMBOL_ARG_TYPE.LOCAL, ["sites"], (x, y) => {
		const spaceName = getLocalName("space", x, y)
		const siteNumber = EVENTWINDOW.getSiteNumber(x, y, 0)
		return `const ${spaceName} = sites[${siteNumber}]`
	})
	
	defineSymbolArg("atom", SYMBOL_ARG_TYPE.LOCAL, ["space"], (x, y) => {
		const atomName = getLocalName("atom", x, y)
		const spaceName = getLocalName("space", x, y)
		return `const ${atomName} = ${spaceName}.atom`
	})
	
	defineSymbolArg("element", SYMBOL_ARG_TYPE.LOCAL, ["space"], (x, y) => {
		const elementName = getLocalName("element", x, y)
		const spaceName = getLocalName("space", x, y)
		return `const ${elementName} = ${spaceName}.element`
	})
	
	//=========//
	// Usefuls //
	//=========//
	const getLocalName = (name, x, y) => {
		if (x === undefined) throw new Error(`[SpaceTode] Missing argument 'x' in 'getLocalName' function`)
		if (y === undefined) throw new Error(`[SpaceTode] Missing argument 'y' in 'getLocalName' function`)
		const xy = `${x}${y}`
		return name + xy.replace("-", "_")
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


