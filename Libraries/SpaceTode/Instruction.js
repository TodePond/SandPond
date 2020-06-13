//=============//
// Instruction //
//=============//
const POV = {}
POV.TYPE = {}
POV.make = (name, mod) => ({name, mod})
POV.TYPE.FRONT = POV.make("Front", (x, y, z) => [x, y, z])
POV.TYPE.BACK = POV.make("Back", (x, y, z) => [-x, y, -z])
POV.TYPE.RIGHT = POV.make("Right", (x, y, z) => [-z, y, -x])
POV.TYPE.LEFT = POV.make("Left", (x, y, z) => [z, y, x])
POV.TYPE.BOTTOM = POV.make("Bottom", (x, y, z) => [x, z, y])
POV.TYPE.TOP = POV.make("Top", (x, y, z) => [x, z, -y])


const INSTRUCTION = {}
INSTRUCTION.TYPE = {}
INSTRUCTION.make = (name, generate = () => { throw new Error(`[SpaceTode] The ${name} instruction is not supported yet`) }) => ({name, generate})

{
	INSTRUCTION.TYPE.FOR = INSTRUCTION.make("ForBlock")
	INSTRUCTION.TYPE.MAYBE = INSTRUCTION.make("MaybeBlock")
	INSTRUCTION.TYPE.MIMIC = INSTRUCTION.make("Mimic")
	INSTRUCTION.TYPE.POV = INSTRUCTION.make("PointOfView")

	INSTRUCTION.TYPE.BLOCK_END = INSTRUCTION.make("BlockEnd", () => {
		throw new Error(`[SpaceTode] The BlockEnd instruction should never be parsed on its own. Something has gone wrong with parsing.`)
	})
	
	INSTRUCTION.TYPE.BEHAVE = INSTRUCTION.make("Behave", (template, behave) => {
		const id = template.head.behave.push(behave) - 1
		template.main.push(`behave${id}(origin, selfElement, time, self)`)
	})
	
	// Placeholder - does nothing
	INSTRUCTION.TYPE.ANY = INSTRUCTION.make("AnyBlock", (template, selfSymmetry, instructions, spotMods = [], chunkMods = [], symmetry) => {
		const totalSymmetry = selfSymmetry//combineSymmetries(selfSymmetry, symmetry)
		for (let i = 0; i < instructions.length; i++) {
			const instruction = instructions[i]
			const type = instruction.type
			if (type === INSTRUCTION.TYPE.BLOCK_END) return i + 1
			const value = instruction.value
			const tail = instructions.slice(i+1)
			const jumps = type.generate(template, value, tail, spotMods, chunkMods, totalSymmetry)
			if (jumps !== undefined) i += jumps
		}
	})
	
	INSTRUCTION.TYPE.ACTION = INSTRUCTION.make("ActionBlock", (template, v, instructions, spotMods = [], chunkMods = [], symmetry) => {
		const actionId = Symbol("ActionId")
		const actionMods = [...chunkMods, (chunk) => {
			chunk.isInAction = true
			chunk.actionId = actionId
		}]
		for (let i = 0; i < instructions.length; i++) {
			const instruction = instructions[i]
			const type = instruction.type
			if (type === INSTRUCTION.TYPE.BLOCK_END) return i + 1
			const value = instruction.value
			const tail = instructions.slice(i+1)
			const jumps = type.generate(template, value, tail, spotMods, actionMods, symmetry)
			if (jumps !== undefined) i += jumps
		}
	})
	
	INSTRUCTION.TYPE.POV = INSTRUCTION.make("PointOfView", (template, pov, instructions, spotMods = [], chunkMods = [], symmetry) => {
		const povMods = [...spotMods, pov.mod]
		for (let i = 0; i < instructions.length; i++) {
			const instruction = instructions[i]
			const type = instruction.type
			if (type === INSTRUCTION.TYPE.BLOCK_END) return i + 1
			const value = instruction.value
			const tail = instructions.slice(i+1)
			const jumps = type.generate(template, value, tail, povMods, chunkMods, symmetry)
			if (jumps !== undefined) i += jumps
		}
	})
	
	INSTRUCTION.TYPE.NAKED = INSTRUCTION.make("NakedBlock", (template, v, instructions, spotMods = [], chunkMods = [], symmetry) => {
		for (let i = 0; i < instructions.length; i++) {
			const instruction = instructions[i]
			const type = instruction.type
			if (type === INSTRUCTION.TYPE.BLOCK_END) return i + 1
			const value = instruction.value
			const tail = instructions.slice(i+1)
			const jumps = type.generate(template, value, tail, spotMods, chunkMods, symmetry)
			if (jumps !== undefined) i += jumps
		}
	})
	
	INSTRUCTION.TYPE.DIAGRAM = INSTRUCTION.make("Diagram", (template, diagram, instructions, spotMods = [], chunkMods = [], symmetry) => {
		const moddedDiagram = modDiagram(diagram, spotMods)
		const chunk = makeEmptyChunk()
		for (const spot of moddedDiagram) {
			const {given, check} = spot.input
			const {change, keep} = spot.output
			
			processFunc ({
				name: "given",
				func: given,
				spot,
				template,
				chunk,
				side: "input",
				symmetry,
			})
			
			processFunc ({
				name: "check",
				func: check,
				spot,
				template,
				chunk,
				side: "input",
				symmetry,
			})
			
			processFunc ({
				name: "change",
				func: change,
				spot,
				template,
				chunk,
				side: "output",
				symmetry,
			})
			
			processFunc ({
				name: "keep",
				func: keep,
				spot,
				template,
				chunk,
				side: "output",
				symmetry,
			})
		}
		
		// OPTIMISATION - remove redundant needers from output - because they are already in input
		// should probably do this on the fly instead of retroactively doing it
		// but this is sort of a patch that gets done afterwards
		// makes it very easy to change its behaviour in the future
		// if it was more embedded, it would be harder to adjust
		for (const neederName in chunk.output.needers) {
			const needer = chunk.output.needers[neederName]
			if (chunk.input.needers.has(neederName)) delete chunk.output.needers[neederName]
		}
		
		for (const mod of chunkMods) {
			mod(chunk)
		}
		
		template.main.push(chunk)
	})
	
	const modDiagram = (diagram, spotMods) => {
		const moddedDiagram = []
		for (const spot of diagram) {
			let {x, y, z} = spot
			for (const mod of spotMods) {
				[x, y, z] = mod(spot.x, spot.y, spot.z)
			}
			const moddedSpot = {...spot, x, y, z}
			moddedDiagram.push(moddedSpot)
		}
		return moddedDiagram
	}
	
	//======//
	// Func //
	//======//
	const processFunc = ({name, func, spot, template, chunk, side, symmetry}) => {
		if (func === undefined) return
		
		const {x, y, z} = spot
		const {head, cache} = template
		
		const id = head[name].pushUnique(func)
		const result = getResult(name)
		const paramNames = getParamNames(func)
		const params = paramNames.map(paramName => getParam(paramName))
		const argNames = params.map(param => getName(param, x, y, z, symmetry))
		
		const idResult = makeIdResult(result, id, paramNames)
		const needs = getNeeds(idResult)
		const idResultName = getName(idResult, x, y, z, symmetry)
		const needers = needs.map(need => makeNeeder({need, x, y, z, symmetry, id, argNames, idResultName}))
		for (const needer of needers) {
			if (needer.need.isCondition) chunk.conditions.pushUnique(needer.name)
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
		conditions: [],
		output: {needers: {}},
	})
	
	//=======//
	// Needs //
	//=======//	
	const getNeeds = (param) => {
		const needs = []
		const otherNeeds = param.needNames.map(needName => getParam(needName))
		for (const otherNeed of otherNeeds) needs.pushUnique(...getNeeds(otherNeed))
		if (param.type !== NEED_TYPE.ARG) needs.pushUnique(param)
		return needs
	}
	
	const makeNeeder = ({need, x, y, z, id, symmetry, argNames, idResultName}) => {
		const name = getName(need, x, y, z, symmetry)
		return {need, name, x, y, z, symmetry, id, argNames, idResultName}
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
	
	const getName = (param, x, y, z, symmetry) => {
		const type = param.type
		let name = param.name
		if (type === NEED_TYPE.ARG) return name
		if (type === NEED_TYPE.GLOBAL) return name
		if (type === NEED_TYPE.SYMMETRY) return getSymmetryName(name, symmetry)
		if (type === NEED_TYPE.LOCAL) return getLocalName(name, x, y, z, symmetry)
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
	
	const getSymmetryName = (name, symmetry) => {
		const symmetryTail = symmetry !== undefined? "Symm" + symmetry.name : ""
		return name + symmetryTail
	}
	
	const getLocalName = (name, x, y, z, symmetry) => {
		const xyzTail = `${x}${y}${z}`
		const symmetryTail = symmetry !== undefined? "Symm" + symmetry.name : ""
		return name + xyzTail.replace(/-/g, "_") + symmetryTail
	}
	
	//======================//
	// Params - Definitions //
	//======================//
	const makeNeed = ({
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
	
	const NEED_TYPE = {
		ARG: Symbol("Arg"),
		GLOBAL: Symbol("Global"),
		SYMMETRY: Symbol("Symmetry"),
		LOCAL: Symbol("Local"),
	}
	
	const PARAM = {}
	PARAM.self = makeNeed({name: "self", type: NEED_TYPE.ARG})
	PARAM.selfElement = makeNeed({name: "selfElement", type: NEED_TYPE.ARG})
	PARAM.time = makeNeed({name: "time", type: NEED_TYPE.ARG})
	PARAM.origin = makeNeed({name: "origin", type: NEED_TYPE.ARG})
	PARAM.sites = makeNeed({
		name: "sites",
		type: NEED_TYPE.GLOBAL, 
		needNames: ["origin"],
		generateGet: () => `origin.sites`,
	})
	
	PARAM.symmetryNumber = makeNeed({
		name: "symmetryNumber",
		type: NEED_TYPE.SYMMETRY,
		needNames: [],
		generateGet: (x, y, z, symmetry) => {
			if (symmetry === undefined) return undefined
			return `"lol"`
		}
	})
	
	PARAM.siteNumber = makeNeed({
		name: "siteNumber",
		type: NEED_TYPE.LOCAL,
		needNames: ["symmetryNumber"],
		generateGet: (x, y, z, symmetry) => {
			if (x === 0 && y === 0 && z === 0) return undefined
			if (symmetry === undefined) return undefined
			const siteNumber = EVENTWINDOW.getSiteNumber(x, y, z)
			return `${siteNumber}`
		},
	})
	
	PARAM.space = makeNeed({
		name: "space",
		type: NEED_TYPE.LOCAL,
		needNames: ["sites", "siteNumber"],
		generateGet: (x, y, z, symmetry) => {
			if (x === 0 && y === 0 && z === 0) return "origin"
			if (symmetry === undefined) {
				const siteNumber = EVENTWINDOW.getSiteNumber(x, y, z)
				return `sites[${siteNumber}]`
			}
			const siteNumberName = getLocalName("siteNumber", x, y, z, symmetry)
			return `sites[${siteNumberName}]`
		},
	})
	
	PARAM.atom = makeNeed({
		name: "atom",
		type: NEED_TYPE.LOCAL,
		needNames: ["space"],
		generateGet: (x, y, z, symmetry) => {
			const spaceName = getLocalName("space", x, y, z, symmetry)
			return `${spaceName}.atom`
		},
	})
	
	PARAM.element = makeNeed({
		name: "element",
		type: NEED_TYPE.LOCAL,
		needNames: ["space"],
		generateGet: (x, y, z, symmetry) => {
			const spaceName = getLocalName("space", x, y, z, symmetry)
			return `${spaceName}.element`
		},
	})
	
	//===============//
	// Result Params //
	//===============//
	const RESULT = {}
	RESULT.given = makeNeed({
		name: "given",
		type: NEED_TYPE.LOCAL,
		generateGet: (x, y, z, symmetry, id, args) => {
			const argsInner = args.join(", ")
			return `given${id}(${argsInner})`
		},
		isCondition: true,
	})
	
	RESULT.keep = makeNeed({
		name: "keep",
		type: NEED_TYPE.LOCAL,
		needs: [],
		generateExtra: (x, y, z, symmetry, id, args) => {
			const argsInner = args.join(", ")
			return `keep${id}(${argsInner})`
		},
	})
	
	RESULT.check = makeNeed({
		name: "check",
		type: NEED_TYPE.GLOBAL,
		needNames: [],
		generateGet: (x, y, z, symmetry, id, args) => {
			const argsInner = args.join(", ")
			return `check${id}(${argsInner})`
		},
	})
	
	RESULT.change = makeNeed({
		name: "change",
		type: NEED_TYPE.LOCAL,
		needNames: ["space"],
		generateGet: (x, y, z, symmetry, id, args) => {
			const argsInner = args.join(", ")
			return `change${id}(${argsInner})`
		},
		generateExtra: (x, y, z, symmetry, id, args, idResultName) => {
			const spaceName = getLocalName("space", x, y, z, symmetry)
			return `SPACE.setAtom(${spaceName}, ${idResultName})`
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
		const idResult = makeNeed(options)
		idResultsCache[name] = idResult
		return idResult
	}
	
	//===============//
	// Symmetry Need //
	//===============//
	/*const makeSymmetryNeed = (need, symmetry) => {
		const name = `${need.name}Symmetry${symmetry.name}`.d
		makeNeed()
	}*/
	
}


