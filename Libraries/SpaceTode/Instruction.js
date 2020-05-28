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
		const {head, cache, main} = template
		const chunk = makeDiagramChunk()
		
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
			
			addNamesToCache(cache, givenNeeds)
			addNamesToCache(cache, changeNeeds)
			addNamesToCache(cache, keepNeeds)
			
			for (const id of givenIds) addNameToCache(cache, getLocalName(`given${id}Result`, x, y))
			
			//addNeedsToChunk(chunk, givenNeeds)
		}
	})
	
	//=======//
	// Chunk //
	//=======//
	const makeDiagramChunk = () => ({
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
			const index = store.indexOf(func)
			if (index !== -1) {
				ids.push(index)
				continue
			}
			const id = store.push(func) - 1
			ids.push(id)
		}
		return ids
	}
	
	//=======//
	// Cache //
	//=======//
	const addNamesToCache = (cache, names) => {
		for (const name of names) {
			addNameToCache(cache, name)
		}
	}
	
	const addNameToCache = (cache, name) => {
		if (cache.includes(name)) return
		cache.push(name)
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
				needs.push(...getNeedsFromParam(param, x, y))
			}
		}
		return [...new Set(needs)]
	}
	
	const getNeedsFromParam = (param, x, y) => {
		const needs = []
		const symbolParam = symbolParams[param]
		
		if (symbolParam.needs === undefined) throw new Error(`[SpaceTode] Unrecognised parameter: '${param}'`)
		for (const need of symbolParam.needs) needs.push(...getNeedsFromParam(need, x, y))
		
		const type = symbolParam.type
		if (type === SYMBOL_PARAM_TYPE.GLOBAL) needs.push(param)
		else if (type === SYMBOL_PARAM_TYPE.LOCAL) needs.push(getLocalName(param, x, y))
		else if (type === SYMBOL_PARAM_TYPE.GIVEN) {}
		return [...new Set(needs)]
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
	
	//===============//
	// Symbol Params //
	//===============//
	const SYMBOL_PARAM_TYPE = {
		GIVEN: Symbol("Given"),
		GLOBAL: Symbol("Global"),
		LOCAL: Symbol("Local"),
	}
	
	const symbolParams = {}
	const defineSymbolParam = (name, type, needs = [], code = () => "") => {
		const symbolParam = {name, type, needs, code}
		symbolParams[name] = symbolParam
		return symbolParam
	}
	
	const getLocalName = (name, x, y) => {
		if (x === undefined) throw new Error(`[SpaceTode] Missing argument 'x' in 'getLocalName' function`)
		if (y === undefined) throw new Error(`[SpaceTode] Missing argument 'y' in 'getLocalName' function`)
		const xy = `${x}${y}`
		return name + xy.replace("-", "_")
	}
	
	defineSymbolParam("self", SYMBOL_PARAM_TYPE.GIVEN)
	defineSymbolParam("origin", SYMBOL_PARAM_TYPE.GIVEN)
	defineSymbolParam("sites", SYMBOL_PARAM_TYPE.GLOBAL, ["origin"], (x, y) => {
		return `sites = origin.sites`
	})
	
	defineSymbolParam("space", SYMBOL_PARAM_TYPE.LOCAL, ["sites"], (x, y) => {
		const spaceName = getLocalName("space", x, y)
		const siteNumber = EVENTWINDOW.getSiteNumber(x, y, 0)
		return `${spaceName} = sites[${siteNumber}]`
	})
	
	defineSymbolParam("atom", SYMBOL_PARAM_TYPE.LOCAL, ["space"], (x, y) => {
		const atomName = getLocalName("atom", x, y)
		const spaceName = getLocalName("space", x, y)
		return `${atomName} = ${spaceName}.atom`
	})
	
	defineSymbolParam("element", SYMBOL_PARAM_TYPE.LOCAL, ["space"], (x, y) => {
		const elementName = getLocalName("element", x, y)
		const spaceName = getLocalName("space", x, y)
		return `${elementName} = ${spaceName}.element`
	})
	
}


