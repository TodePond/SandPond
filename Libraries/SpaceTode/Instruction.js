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
		template.main.push(`behave${id}(origin, selfElement, self)`)
	})
	
	INSTRUCTION.TYPE.DIAGRAM = INSTRUCTION.make("Diagram", (template, diagram) => {
		const {head, cache, main} = template
		const chunk = makeEmptyChunk()
		
		for (const spot of diagram) {
			const {x, y} = spot
			const {given} = spot.input
			const {change, keep} = spot.output
			
			const givenIds = addFuncsToHead(head, "given", given)
			const changeIds = addFuncsToHead(head, "change", change)
			const keepIds = addFuncsToHead(head, "keep", keep)
			
			const givenNeeds = getNeedsFromFuncs(given, x, y)
			const changeNeeds = getNeedsFromFuncs(change, x, y)
			const keepNeeds = getNeedsFromFuncs(keep, x, y)
			
			cache.pushUnique(...givenNeeds)
			cache.pushUnique(...changeNeeds)
			cache.pushUnique(...keepNeeds)
			for (const id of givenIds) cache.pushUnique(getLocalName(`given${id}Result`, x, y))
			
			chunk.inputNeeds.pushUnique(...givenNeeds)
			chunk.outputNeeds.pushUnique(...changeNeeds)
			chunk.outputNeeds.pushUnique(...keepNeeds)
		}
	})
	
	//=======//
	// Chunk //
	//=======//
	const makeEmptyChunk = () => ({
		type: INSTRUCTION.TYPE.DIAGRAM,
		inputNeeds: [],
		outputNeeds: [],
		inputCode: undefined,
		outputCode: undefined,
	})
	
	//======//
	// Head //
	//======//
	const addFuncsToHead = (head, name, funcs) => {
		const store = head[name]
		const ids = []
		for (const func of funcs) {
			if (func === undefined) continue
			const id = store.pushUnique(func)
			ids.push(id)
		}
		return ids
	}
	
	//=======//
	// Cache //
	//=======//
	const addNamesToCache = (cache, names) => {
		for (const name of names) {
			cache.pushUnique(name)
		}
	}
	
	//=======//
	// Needs //
	//=======//
	const getNeedsFromFuncs = (funcs, x, y) => {
		const needs = []
		for (const func of funcs) {
			if (func === undefined) continue
			const params = getParams(func)
			for (const param of params) {
				needs.pushUnique(...getNeedsFromParam(param, x, y))
			}
		}
		return needs
	}
	
	const getNeedsFromParam = (param, x, y) => {
		const needs = []
		const symbolParam = namedParams[param]
		
		if (symbolParam.needs === undefined) throw new Error(`[SpaceTode] Unrecognised parameter: '${param}'`)
		for (const need of symbolParam.needs) needs.pushUnique(...getNeedsFromParam(need, x, y))
		
		const type = symbolParam.type
		if (type === NAMED_PARAM_TYPE.GLOBAL) needs.pushUnique(param)
		else if (type === NAMED_PARAM_TYPE.LOCAL) needs.pushUnique(getLocalName(param, x, y))
		else if (type === NAMED_PARAM_TYPE.ARG) {}
		else throw new Error(`[SpaceTode] Unrecognised named param type: ${type.description}`)
		return needs
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
	
	//==============//
	// Named Params //
	//==============//
	const NAMED_PARAM_TYPE = {
		ARG: Symbol("Arg"),
		GLOBAL: Symbol("Global"),
		LOCAL: Symbol("Local"),
	}
	
	const namedParams = {}
	const defineNamedParam = (name, type, needs = [], code = () => "") => {
		const namedParam = {name, type, needs, code}
		namedParams[name] = namedParam
		return namedParam
	}
	
	const getLocalName = (name, x, y) => {
		if (x === undefined) throw new Error(`[SpaceTode] Missing argument 'x' in 'getLocalName' function`)
		if (y === undefined) throw new Error(`[SpaceTode] Missing argument 'y' in 'getLocalName' function`)
		const xy = `${x}${y}`
		return name + xy.replace("-", "_")
	}
	
	defineNamedParam("self", NAMED_PARAM_TYPE.ARG)
	defineNamedParam("origin", NAMED_PARAM_TYPE.ARG)
	defineNamedParam("sites", NAMED_PARAM_TYPE.GLOBAL, ["origin"], (x, y) => {
		return `sites = origin.sites`
	})
	
	defineNamedParam("space", NAMED_PARAM_TYPE.LOCAL, ["sites"], (x, y) => {
		const spaceName = getLocalName("space", x, y)
		const siteNumber = EVENTWINDOW.getSiteNumber(x, y, 0)
		return `${spaceName} = sites[${siteNumber}]`
	})
	
	defineNamedParam("atom", NAMED_PARAM_TYPE.LOCAL, ["space"], (x, y) => {
		const atomName = getLocalName("atom", x, y)
		const spaceName = getLocalName("space", x, y)
		return `${atomName} = ${spaceName}.atom`
	})
	
	defineNamedParam("element", NAMED_PARAM_TYPE.LOCAL, ["space"], (x, y) => {
		const elementName = getLocalName("element", x, y)
		const spaceName = getLocalName("space", x, y)
		return `${elementName} = ${spaceName}.element`
	})
	
}


