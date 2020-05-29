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
			const {given} = spot.input
			const {change, keep} = spot.output
			
			processFunc ({
				name: "given",
				func: given,
				spot,
				template,
				chunk,
				side: "input",
				resultEnabled: true,
				resultCacheEnabled: true,
			})
			
			processFunc ({
				name: "change",
				func: change,
				spot,
				template,
				chunk,
				side: "output",
				resultEnabled: true,
			})
			
			processFunc ({
				name: "keep",
				func: keep,
				spot,
				template,
				chunk,
				side: "output",
			})
			
			/*
			const givenParamNames = given.map(g => getParamNames(g))
			const changeParamNames = change.map(c => getParamNames(c))
			const keepParamNames = keep.map(k => getParamNames(k))
			
			const givenNeedNames = givenParamNames.map(p => getNeedNames(p, x, y)).flat()
			const changeNeedNames = changeParamNames.map(p => getNeedNames(p, x, y)).flat()
			const keepNeedNames = keepParamNames.map(p => getNeedNames(p, x, y)).flat()
			cache.pushUnique(...givenNeedNames)
			cache.pushUnique(...changeNeedNames)
			cache.pushUnique(...keepNeedNames)
			
			const givenIds = given.map(g => head.given.pushUnique(g))
			const changeIds = change.map(c => head.change.pushUnique(c))
			const keepIds = keep.map(k => head.keep.pushUnique(k))
			
			const givenArgNames = givenParamNames.map(p => getArgNames(p, x, y))
			const changeArgNames = changeParamNames.map(p => getArgNames(p, x, y))
			const keepArgNames = keepParamNames.map(p => getArgNames(p, x, y))
			
			const givenResultNames = givenIds.map(id => getLocalName(`given${id}Result`, x, y))
			const changeResultNames = changeIds.map(id => getLocalName(`change${id}Result`, x, y))
			cache.pushUnique(...givenResultNames)
			cache.pushUnique(...changeResultNames)
			*/
			//for (const i in givenNeeds) chunk.inputNeeds[givenNeeds[i]] = givenNamedParams[i]
			/*chunk.inputNeeds.pushUnique(...givenNeeds)
			chunk.inputNeeds.pushUnique(...givenResults)
			chunk.outputNeeds.pushUnique(...changeNeeds)
			chunk.outputNeeds.pushUnique(...keepNeeds)*/
		}
		template.main.push(chunk)
	})
	
	//======//
	// Func //
	//======//
	const processFunc = ({name, func, spot, template, chunk, side, resultEnabled=false, resultCacheEnabled=false}) => {
		if (func === undefined) return
		const {x, y} = spot
		const {head, cache, main} = template
		
		// Head
		const id = head[name].pushUnique(func)
		
		// Cache
		const paramNames = getParamNames(func)
		const params = paramNames.map(paramName => getParam(paramName))
		const argNames = params.map(param => getName(param, x, y))
		const needs = []
		for (const param of params) needs.pushUnique(...getNeeds(param))
		const needNames = needs.map(need => getName(need, x, y))
		cache.pushUnique(...needNames)
		
		// Result
		const resultName = `${name}${id}Result`
		if (resultEnabled && resultCacheEnabled) cache.pushUnique(resultName)
		if (resultEnabled) needNames.pushUnique(resultName)
		
		// Chunk
		chunk[side].needs.pushUnique(...needs)
	}
	
	//=======//
	// Chunk //
	//=======//
	const makeEmptyChunk = () => ({
		type: INSTRUCTION.TYPE.DIAGRAM,
		input: {needs: []},
		output: {needs: []},
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
	
	//====================//
	// Params - Functions //
	//====================//
	const getParam = (name) => {
		const param = params[name]
		if (param === undefined) throw new Error(`[SpaceTode] Unrecognised parameter: '${name}'`)
		return param
	}
	
	const getName = (param, x, y) => {
		const type = param.type
		if (type === PARAM_TYPE.ARG) return param.name
		if (type === PARAM_TYPE.GLOBAL) return param.name
		if (type === PARAM_TYPE.LOCAL) return getLocalName(param.name, x, y)
		throw new Error(`[SpaceTode] Unrecognised named param type: ${type.description}`)
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
	
	//===========================//
	// Named Params - Definition //
	//===========================//
	const makeParam = (name, type, needNames = [], code = () => "") => ({name, type, needNames, code})
	const PARAM_TYPE = {
		ARG: Symbol("Arg"),
		GLOBAL: Symbol("Global"),
		LOCAL: Symbol("Local"),
	}
	
	const params = {}
	params.self = makeParam("self", PARAM_TYPE.ARG)
	params.origin = makeParam("origin", PARAM_TYPE.ARG)
	params.sites = makeParam("sites", PARAM_TYPE.GLOBAL, ["origin"], (x, y) => {
		return `sites = origin.sites`
	})
	
	params.space = makeParam("space", PARAM_TYPE.LOCAL, ["sites"], (x, y) => {
		const spaceName = getLocalName("space", x, y)
		const siteNumber = EVENTWINDOW.getSiteNumber(x, y, 0)
		return `${spaceName} = sites[${siteNumber}]`
	})
	
	params.atom = makeParam("atom", PARAM_TYPE.LOCAL, ["space"], (x, y) => {
		const atomName = getLocalName("atom", x, y)
		const spaceName = getLocalName("space", x, y)
		return `${atomName} = ${spaceName}.atom`
	})
	
	params.element = makeParam("element", PARAM_TYPE.LOCAL, ["space"], (x, y) => {
		const elementName = getLocalName("element", x, y)
		const spaceName = getLocalName("space", x, y)
		return `${elementName} = ${spaceName}.element`
	})
	
	const givenResultNamedParam = makeParam("givenResult", PARAM_TYPE.LOCAL, [], (x, y, id, args) => {
		const givenResultName = getLocalName(`given${id}Result`, x, y)
		const argsInner = args.join(", ")
		return `${givenResultName} = given${id}(${argsInner})`
	})
	
}


