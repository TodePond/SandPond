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
			
			const givenIds = given.map(g => head.given.pushUnique(g))
			const changeIds = change.map(c => head.change.pushUnique(c))
			const keepIds = keep.map(k => head.keep.pushUnique(k))
			
			const givenParams = given.map(g => getParams(g))
			const changeParams = change.map(c => getParams(c))
			const keepParams = keep.map(k => getParams(k))
		
			const givenArgs = givenParams.map(p => getArgsFromParams(p, x, y))
			const changeArgs = changeParams.map(p => getArgsFromParams(p, x, y))
			const keepArgs = keepParams.map(p => getArgsFromParams(p, x, y))
		
			const givenNeeds = givenParams.map(p => getNeedsFromParams(p, x, y)).flat()
			const changeNeeds = givenParams.map(p => getNeedsFromParams(p, x, y)).flat()
			const keepNeeds = givenParams.map(p => getNeedsFromParams(p, x, y)).flat()
			const givenResults = givenIds.map(id => getLocalName(`given${id}Result`, x, y))
			
			cache.pushUnique(...givenNeeds)
			cache.pushUnique(...changeNeeds)
			cache.pushUnique(...keepNeeds)
			cache.pushUnique(...givenResults)
			
			chunk.inputNeeds.pushUnique(...givenNeeds)
			chunk.inputNeeds.pushUnique(...givenResults)
			chunk.outputNeeds.pushUnique(...changeNeeds)
			chunk.outputNeeds.pushUnique(...keepNeeds)
			
			//chunk.inputCode = makeGivenResultsCode(x, y, givenIds, givenArgs)
			//chunk.conditionCode = makeConditionCode(x, y, givenIds)
		}
		
		main.push(chunk)
		
	})
	
	//=======//
	// Chunk //
	//=======//
	const makeEmptyChunk = () => ({
		type: INSTRUCTION.TYPE.DIAGRAM,
		inputNeeds: [],
		outputNeeds: [],
		//inputCode: undefined,
		//conditions: undefined,
		//outputCode: undefined,
	})
	
	/*const makeGivenResultsCode = (x, y, givenIds, givenArgs) => {
		if (givenIds.length !== givenArgs.length) throw new Error(`[SpaceTode] Givens: ID array did not have the same length as Args array`)
		const lines = []
		for (let i = 0; i < givenIds.length; i++) {
			const id = givenIds[i]
			const args = givenArgs[i].join(", ")
			const name = getLocalName(`given${id}Result`, x, y)
			const line = `if (${name} === undefined) ${name} = given${id}(${args})`
			lines.push(line)
		}
		lines.push("")
		const code = lines.join("\n")
		return code
	}*/
	
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
	
	const getNeedsFromParams = (params, x, y) => params.map(param => getNeedsFromParam(param, x, y)).flat()
	const getArgsFromParams = (params, x, y) => params.map(param => getArgFromParam(param, x, y)).flat()
	
	const getNeedsFromParam = (param, x, y) => {
		const namedParam = namedParams[param]
		if (namedParam.needs === undefined) throw new Error(`[SpaceTode] Unrecognised parameter: '${param}'`)
		
		const needs = []
		for (const need of namedParam.needs) needs.pushUnique(...getNeedsFromParam(need, x, y))
		
		const type = namedParam.type
		if (type === NAMED_PARAM_TYPE.ARG) return needs
		const need = getArgFromParam(param, x, y)
		needs.pushUnique(need)
		return needs
	}
	
	const getArgFromParam = (param, x, y) => {
		const namedParam = namedParams[param]
		if (namedParam.needs === undefined) throw new Error(`[SpaceTode] Unrecognised parameter: '${param}'`)
		
		const type = namedParam.type
		if (type === NAMED_PARAM_TYPE.ARG) return param
		if (type === NAMED_PARAM_TYPE.GLOBAL) return param
		if (type === NAMED_PARAM_TYPE.LOCAL) return getLocalName(param, x, y)
		throw new Error(`[SpaceTode] Unrecognised named param type: ${type.description}`)
	}
	
	const getParams = (func) => {
		if (func === undefined) return []
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
	
	const makeNamedParam = (name, type, needs = [], code = () => "") => {
		const namedParam = {name, type, needs, code}
		return namedParam
	}
	
	const getLocalName = (name, x, y) => {
		if (x === undefined) throw new Error(`[SpaceTode] Missing argument 'x' in 'getLocalName' function`)
		if (y === undefined) throw new Error(`[SpaceTode] Missing argument 'y' in 'getLocalName' function`)
		const xy = `${x}${y}`
		return name + xy.replace("-", "_")
	}
	
	const namedParams = {}
	namedParams.self = makeNamedParam("self", NAMED_PARAM_TYPE.ARG)
	namedParams.origin = makeNamedParam("origin", NAMED_PARAM_TYPE.ARG)
	namedParams.sites = makeNamedParam("sites", NAMED_PARAM_TYPE.GLOBAL, ["origin"], (x, y) => {
		return `sites = origin.sites`
	})
	
	namedParams.space = makeNamedParam("space", NAMED_PARAM_TYPE.LOCAL, ["sites"], (x, y) => {
		const spaceName = getLocalName("space", x, y)
		const siteNumber = EVENTWINDOW.getSiteNumber(x, y, 0)
		return `${spaceName} = sites[${siteNumber}]`
	})
	
	namedParams.atom = makeNamedParam("atom", NAMED_PARAM_TYPE.LOCAL, ["space"], (x, y) => {
		const atomName = getLocalName("atom", x, y)
		const spaceName = getLocalName("space", x, y)
		return `${atomName} = ${spaceName}.atom`
	})
	
	namedParams.element = makeNamedParam("element", NAMED_PARAM_TYPE.LOCAL, ["space"], (x, y) => {
		const elementName = getLocalName("element", x, y)
		const spaceName = getLocalName("space", x, y)
		return `${elementName} = ${spaceName}.element`
	})
	
}


