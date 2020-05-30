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
				resultEnabled: true,
			})
			
			processFunc ({
				name: "check",
				func: check,
				spot,
				template,
				chunk,
				side: "input",
				resultEnabled: true,
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
		}
		
		template.main.push(chunk)
	})
	
	//======//
	// Func //
	//======//
	const processFunc = ({name, func, spot, template, chunk, side, resultEnabled=false}) => {
		if (func === undefined) return
		const {x, y} = spot
		const {head, cache, main} = template
		
		// Head
		const id = head[name].pushUnique(func)
		
		// Args
		const paramNames = getParamNames(func)
		const params = paramNames.map(paramName => getParam(paramName))
		const argNames = params.map(param => getName(param, x, y))
		
		// Cache
		const needs = []
		for (const param of params) needs.pushUnique(...getNeeds(param))
		
		// Result
		if (resultEnabled) {
			const resultParamName = `${name}Result`
			const result = getParam(resultParamName, true)
			const resultNeeds = getNeeds(result)
			const resultOtherNeeds = resultNeeds.without(result)
			const resultIdParam = makeIdParam(result, id)
			needs.pushUnique(...resultOtherNeeds, resultIdParam)
		}
		
		const needNames = needs.map(need => getName(need, x, y))
		cache.pushUnique(...needNames)
		
		// Chunk
		chunk[side].needs.pushUnique(...needs)
	}
	
	//=======//
	// Chunk //
	//=======//
	const makeEmptyChunk = () => ({
		type: INSTRUCTION.TYPE.DIAGRAM,
		input: {needs: [], needers: []},
		output: {needs: [], needers: []},
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
	const getParam = (name, hidden=false) => {
		let param = params[name]
		if (param === undefined && hidden) param = hiddenParams[name]
		if (param === undefined) throw new Error(`[SpaceTode] Unrecognised parameter: '${name}'`)
		return param
	}
	
	const getName = (param, x, y) => {
		const type = param.type
		let name = param.name
		if (type === PARAM_TYPE.ARG) return name
		if (type === PARAM_TYPE.GLOBAL) return name
		if (type === PARAM_TYPE.LOCAL) return getLocalName(name, x, y)
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
		return `origin.sites`
	})
	
	params.space = makeParam("space", PARAM_TYPE.LOCAL, ["sites"], (x, y) => {
		const siteNumber = EVENTWINDOW.getSiteNumber(x, y, 0)
		return `sites[${siteNumber}]`
	})
	
	params.atom = makeParam("atom", PARAM_TYPE.LOCAL, ["space"], (x, y) => {
		const spaceName = getLocalName("space", x, y)
		return `${spaceName}.atom`
	})
	
	params.element = makeParam("element", PARAM_TYPE.LOCAL, ["space"], (x, y) => {
		const spaceName = getLocalName("space", x, y)
		return `${spaceName}.element`
	})
	
	const hiddenParams = {}
	hiddenParams.givenResult = makeParam("givenResult", PARAM_TYPE.LOCAL, [], (x, y, id, args) => {
		const argsInner = args.join(", ")
		return `given${id}(${argsInner})`
	})
	
	hiddenParams.checkResult = makeParam("checkResult", PARAM_TYPE.GLOBAL, [], (x, y, id, args) => {
		const argsInner = args.join(", ")
		return `check${id}(${argsInner})`
	})
	
	
	hiddenParams.changeResult = makeParam("changeResult", PARAM_TYPE.LOCAL, ["space"], (x, y, id, args) => {
		const spaceName = getLocalName("space", x, y)
		const argsInner = args.join(", ")
		const line = []
		lines.push(`change${id}(${argsInner})`)
		lines.push(`SPACE.setAtom(${spaceName}, ${changeResultName})`)
		return lines.join("\n")
	})
	
	const idParams = {}
	const makeIdParam = (param, id) => {
		if (param.name.slice(-"Result".length) !== "Result") throw new Error(`[SpaceTode] Can't make a result param from '${param.name}' because it doesn't end in 'Result'`)
		const name = param.name.slice(0, -"Result".length) + id + "Result"
		if (idParams.has(name)) return idParams[name]
		const idParam = makeParam(name, param.type, param.needs, param.code)
		idParams[name] = idParam
		return idParam
	}
	
}


