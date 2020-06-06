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
		const chunk = makeEmptyChunk()
		for (const spot of diagram) {
			const {given, check} = spot.input
			const {change, keep} = spot.output
			
			processFunc ({
				name: "given",
				func: given,
				spot,
				template,
				chunk,
				side: "input",
			})
			
			processFunc ({
				name: "check",
				func: check,
				spot,
				template,
				chunk,
				side: "input",
			})
			
			processFunc ({
				name: "change",
				func: change,
				spot,
				template,
				chunk,
				side: "output",
			})
			
			processFunc ({
				name: "keep",
				func: keep,
				spot,
				template,
				chunk,
				side: "output",
			})
		}
		
		template.main.push(chunk)
	})
	
	//======//
	// Func //
	//======//
	const processFunc = ({name, func, spot, template, chunk, side}) => {
		if (func === undefined) return
		const {x, y} = spot
		const {head, cache} = template
		
		const id = head[name].pushUnique(func)
		const result = getResult(name)
		const paramNames = getParamNames(func)
		const params = paramNames.map(paramName => getParam(paramName))
		const argNames = params.map(param => getName(param, x, y))
		
		const idResult = makeIdResult(result, id, paramNames)
		const needs = getNeeds(idResult)
		const needers = needs.map(need => makeNeeder({need, x, y, id, argNames}))
		for (const needer of needers) {
			chunk[side].needers[needer.name] = needer
		}
		
		const neederGets = needers.filter(needer => needer.need.generateGet)
		const neederGetNames = neederGets.map(neederGet => neederGet.name)
		cache.pushUnique(...neederGetNames)
		
	}
	
	//=======//
	// Chunk //
	//=======//
	const makeEmptyChunk = () => ({
		type: INSTRUCTION.TYPE.DIAGRAM,
		input: {needers: {}},
		output: {needers: {}},
	})
	
	//=======//
	// Needs //
	//=======//	
	const getNeeds = (param) => {
		const needs = []
		const otherNeeds = param.needNames.map(needName => getParam(needName))
		for (const otherNeed of otherNeeds) needs.pushUnique(...getNeeds(otherNeed))
		if (param.type !== PARAM_TYPE.ARG) needs.pushUnique(param)
		return needs
	}
	
	const makeNeeder = ({need, x, y, id, argNames}) => {
		const name = getName(need, x, y)
		return {need, name, x, y, id, argNames}
	}
	
	//====================//
	// Params - Functions //
	//====================//
	const getParam = (name) => {
		const param = PARAM[name]
		if (param === undefined) throw new Error(`[SpaceTode] Unrecognised parameter: '${name}'`)
		return param
	}
	
	const getResult = (name) => {
		const result = RESULT[name]
		if (result === undefined) throw new Error(`[SpaceTode] No result found for param: '${name}'`)
		return result
	}
	
	const getName = (param, x, y) => {
		const type = param.type
		let name = param.name
		if (type === PARAM_TYPE.ARG) return name
		if (type === PARAM_TYPE.GLOBAL) return name
		if (type === PARAM_TYPE.LOCAL) return getLocalName(name, x, y)
		throw new Error(`[SpaceTode] Unrecognised named param type: ${type}`)
	}
	
	const getParamNames = (func) => {
		if (func === undefined) return []
		const code = func.as(String)
		const paramNames = []
		let buffer = ""
		for (let i = 0; i < code.length; i++) {
			const char = code[i]
			if ((char == "(" || char == " " || char == "	") && buffer == "") continue
			if (char.match(/[a-zA-Z0-9$_]/)) buffer += char
			else if (char == " " || char == "," || char == "	" || char == ")") {
				if (buffer != "") {
					paramNames.push(buffer)
					buffer = ""
				}
			}
			else throw new Error(`[SpaceTode] Unexpected character in named parameters: '${char}'\n\nPlease don't do anything fancy with your parameters in symbol functions :)\nGOOD: (element, space) => { ... }\nBAD: (element = Empty, {atom}) => { ... }\n\nPlease feel free to contact @todepond if you want to ask for help or complain about this :D\n`)
			if (char == ")") break
		}
		return paramNames
	}
	
	const getLocalName = (name, x, y) => {
		const xy = `${x}${y}`
		return name + xy.replace("-", "_")
	}
	
	//======================//
	// Params - Definitions //
	//======================//
	const makeParam = ({
		name,
		type,
		needNames = [],
		generateGet,
		generateExtra,
		isCondition = false
	}) => ({
		name,
		type,
		needNames,
		generateGet,
		generateExtra,
		isCondition,
	})
	
	const PARAM_TYPE = {
		ARG: Symbol("Arg"),
		GLOBAL: Symbol("Global"),
		LOCAL: Symbol("Local"),
	}
	
	const PARAM = {}
	PARAM.self = makeParam({name: "self", type: PARAM_TYPE.ARG})
	PARAM.origin = makeParam({name: "origin", type: PARAM_TYPE.ARG})
	PARAM.sites = makeParam({
		name: "sites",
		type: PARAM_TYPE.GLOBAL, 
		needNames: ["origin"],
		generateGet: () => `origin.sites`,
	})
	
	PARAM.space = makeParam({
		name: "space",
		type: PARAM_TYPE.LOCAL,
		needNames: ["sites"],
		generateGet: (x, y) => {
			const siteNumber = EVENTWINDOW.getSiteNumber(x, y, 0)
			return `sites[${siteNumber}]`
		},
	})
	
	PARAM.atom = makeParam({
		name: "atom",
		type: PARAM_TYPE.LOCAL,
		needNames: ["space"],
		generateGet: (x, y) => {
			const spaceName = getLocalName("space", x, y)
			return `${spaceName}.atom`
		},
	})
	
	PARAM.element = makeParam({
		name: "element",
		type: PARAM_TYPE.LOCAL,
		needNames: ["space"],
		generateGet: (x, y) => {
			const spaceName = getLocalName("space", x, y)
			return `${spaceName}.element`
		},
	})
	
	//===============//
	// Result Params //
	//===============//
	const RESULT = {}
	RESULT.given = makeParam({
		name: "given",
		type: PARAM_TYPE.LOCAL,
		generateGet: (x, y, id, args) => {
			const argsInner = args.join(", ")
			return `given${id}(${argsInner})`
		},
		isCondition: true,
	})
	
	RESULT.keep = makeParam({
		name: "keep",
		type: PARAM_TYPE.LOCAL,
		needs: [],
		generateExtra: (x, y, id, args) => {
			const argsInner = args.join(", ")
			return `keep${id}(${argsInner})`
		},
	})
	
	RESULT.check = makeParam({
		name: "check",
		type: PARAM_TYPE.GLOBAL,
		needNames: [],
		generateGet: (x, y, id, args) => {
			const argsInner = args.join(", ")
			return `check${id}(${argsInner})`
		},
	})
	
	RESULT.change = makeParam({
		name: "change",
		type: PARAM_TYPE.LOCAL,
		needNames: ["space"],
		generateGet: (x, y, id, args) => {
			const argsInner = args.join(", ")
			return `change${id}(${argsInner})`
		},
		generateExtra: (x, y, id, args, resultName) => {
			const spaceName = getLocalName("space", x, y)
			return `SPACE.setAtom(${spaceName}, ${resultName})`
		}
	})
	
	//============//
	// ID Results //
	//============//
	const idResultsCache = {}
	const makeIdResult = (result, id, paramNames) => {
		const name = `${result.name}${id}Result`
		if (idResultsCache.has(name)) return idResultsCache[name]
		
		const needNames = [...result.needNames]
		needNames.pushUnique(...paramNames)
		
		const options = {...result, name, needNames}
		const idResult = makeParam(options)
		idResultsCache[name] = idResult
		return idResult
	}
	
}


