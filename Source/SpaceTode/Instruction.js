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
	
	INSTRUCTION.TYPE.MIMIC = INSTRUCTION.make("Mimic", (template, targetGetter, instructions, spotMods = [], chunkMods = [], symmetry, symmetryId, forSymmId, char, diagramId, isAll) => {
		const target = targetGetter()
		
		const blockStart = {type: INSTRUCTION.TYPE.NAKED}
		const blockEnd = {type: INSTRUCTION.TYPE.BLOCK_END}
		const fullInstructions = [blockStart, ...target.instructions, blockEnd]
	
		for (let i = 0; i < fullInstructions.length; i++) {
			const instruction = fullInstructions[i]
			const type = instruction.type
			const value = instruction.value
			const tail = fullInstructions.slice(i+1)
			const newDiagramId = `${diagramId}D${i}`
			const jumps = type.generate(template, value, tail, spotMods, chunkMods, symmetry, symmetryId, forSymmId, char, newDiagramId, isAll)
			if (jumps !== undefined) i += jumps
		}
		//print(instructions)
	})

	INSTRUCTION.TYPE.BLOCK_END = INSTRUCTION.make("BlockEnd", () => {
		throw new Error(`[SpaceTode] The BlockEnd instruction should never be parsed on its own. Something has gone wrong with parsing.`)
	})
	
	INSTRUCTION.TYPE.BEHAVE = INSTRUCTION.make("Behave", (template, behave) => {
		const id = template.head.behave.push(behave) - 1
		template.main.push(`behave${id}(origin, selfElement, time, self)`)
	})
	
	INSTRUCTION.TYPE.FOR = INSTRUCTION.make("ForBlock", (template, forSymmetry, instructions, spotMods = [], chunkMods = [], symmetry, symmetryId, forSymmId, char, diagramId, oldIsAll) => {
		if (forSymmId !== undefined) throw new Error(`[SpaceTode] You can't have a 'for' block inside another 'for' block because I haven't figured out how I want it to work yet.`)
		if (symmetry !== undefined) throw new Error(`[SpaceTode] You can't have an 'for' block inside an 'any' block because I haven't figured out how I want it to work yet.`)
		const isAll = forSymmetry.type === "all"
		const totalSymmetry = forSymmetry
		const totalSymmetryId = template.symmetry.push(totalSymmetry) - 1
		const newForSymmId = totalSymmetryId
		const forChunkMods = [...chunkMods, (chunk) => {
			chunk.forSymmId = newForSymmId
			chunk.forSymmTransCount = totalSymmetry.transformations.length
			chunk.forSymmIsAll = isAll
		}]
		for (let i = 0; i < instructions.length; i++) {
			const instruction = instructions[i]
			const type = instruction.type
			if (type === INSTRUCTION.TYPE.BLOCK_END) return i + 1
			const value = instruction.value
			const tail = instructions.slice(i+1)
			const newDiagramId = `${diagramId}D${i}`
			const jumps = type.generate(template, value, tail, spotMods, forChunkMods, totalSymmetry, totalSymmetryId, newForSymmId, char, newDiagramId, isAll)
			if (jumps !== undefined) i += jumps
		}
	})
	
	INSTRUCTION.TYPE.ANY = INSTRUCTION.make("AnyBlock", (template, selfSymmetry, instructions, spotMods = [], chunkMods = [], symmetry, symmetryId, forSymmId, char, diagramId, isAll) => {
		if (forSymmId !== undefined) throw new Error(`[SpaceTode] You can't have an 'any' block inside a 'for' block because I haven't figured out how I want it to work yet.`)
		if (symmetry !== undefined) throw new Error(`[SpaceTode] You can't have an 'any' block inside another 'any' block because I haven't figured out how I want it to work yet.`)
		const totalSymmetry = selfSymmetry
		const totalSymmetryId = template.symmetry.push(totalSymmetry) - 1
		for (let i = 0; i < instructions.length; i++) {
			const instruction = instructions[i]
			const type = instruction.type
			if (type === INSTRUCTION.TYPE.BLOCK_END) return i + 1
			const value = instruction.value
			const tail = instructions.slice(i+1)
			const newDiagramId = `${diagramId}D${i}`
			const jumps = type.generate(template, value, tail, spotMods, chunkMods, totalSymmetry, totalSymmetryId, forSymmId, char, newDiagramId, isAll)
			if (jumps !== undefined) i += jumps
		}
	})
	
	INSTRUCTION.TYPE.MAYBE = INSTRUCTION.make("MaybeBlock", (template, chance, instructions, spotMods = [], chunkMods = [], symmetry, symmetryId, forSymmId, char, diagramId, isAll) => {
		const maybeId = Symbol("MaybeId")
		const maybeMods = [...chunkMods, (chunk) => {
			chunk.maybeChance = chance
			if (chunk.maybes === undefined) chunk.maybes = []
			chunk.maybes = [...chunk.maybes, {id: maybeId, chance}]
		}]
		for (let i = 0; i < instructions.length; i++) {
			const instruction = instructions[i]
			const type = instruction.type
			if (type === INSTRUCTION.TYPE.BLOCK_END) return i + 1
			const value = instruction.value
			const tail = instructions.slice(i+1)
			const newDiagramId = `${diagramId}D${i}`
			const jumps = type.generate(template, value, tail, spotMods, maybeMods, symmetry, symmetryId, forSymmId, char, newDiagramId, isAll)
			if (jumps !== undefined) i += jumps
		}
	})
	
	INSTRUCTION.TYPE.ACTION = INSTRUCTION.make("ActionBlock", (template, v, instructions, spotMods = [], chunkMods = [], symmetry, symmetryId, forSymmId, char, diagramId, isAll) => {
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
			const newDiagramId = `${diagramId}D${i}`
			const jumps = type.generate(template, value, tail, spotMods, actionMods, symmetry, symmetryId, forSymmId, char, newDiagramId, isAll)
			if (jumps !== undefined) i += jumps
		}
	})
	
	INSTRUCTION.TYPE.POV = INSTRUCTION.make("PointOfView", (template, pov, instructions, spotMods = [], chunkMods = [], symmetry, symmetryId, forSymmId, char, diagramId, isAll) => {
		const povMods = [...spotMods, pov.mod]
		for (let i = 0; i < instructions.length; i++) {
			const instruction = instructions[i]
			const type = instruction.type
			if (type === INSTRUCTION.TYPE.BLOCK_END) return i + 1
			const value = instruction.value
			const tail = instructions.slice(i+1)
			const newDiagramId = `${diagramId}D${i}`
			const jumps = type.generate(template, value, tail, povMods, chunkMods, symmetry, symmetryId, forSymmId, char, newDiagramId, isAll)
			if (jumps !== undefined) i += jumps
		}
	})
	
	INSTRUCTION.TYPE.NAKED = INSTRUCTION.make("NakedBlock", (template, v, instructions, spotMods = [], chunkMods = [], symmetry, symmetryId, forSymmId, char, diagramId, isAll) => {
		for (let i = 0; i < instructions.length; i++) {
			const instruction = instructions[i]
			const type = instruction.type
			if (type === INSTRUCTION.TYPE.BLOCK_END) return i + 1
			const value = instruction.value
			const tail = instructions.slice(i+1)
			const newDiagramId = `${diagramId}D${i}`
			const jumps = type.generate(template, value, tail, spotMods, chunkMods, symmetry, symmetryId, forSymmId, char, newDiagramId, isAll)
			if (jumps !== undefined) i += jumps
		}
	})
	
	INSTRUCTION.TYPE.DIAGRAM = INSTRUCTION.make("Diagram", (template, diagram, instructions, spotMods = [], chunkMods = [], symmetry, symmetryId, forSymmId, char, diagramId, isAll) => {
		const moddedDiagram = modDiagram(diagram, spotMods)
		const chunk = makeEmptyChunk()
		chunk.debug = diagram.debug
		for (const spot of moddedDiagram) {
		
			const {inputChar, outputChar} = spot
			const {given, select, check} = spot.input
			const {change, keep} = spot.output
			
			processFunc ({
				name: "given",
				func: given,
				spot,
				template,
				chunk,
				side: "input",
				symmetry,
				symmetryId,
				forSymmId,
				char: inputChar,
				diagram,
				diagramId,
				isAll,
			})
			
			processFunc ({
				name: "select",
				func: select,
				spot,
				template,
				chunk,
				side: "input",
				symmetry,
				symmetryId,
				forSymmId,
				char: inputChar,
				diagram,
				diagramId,
				isAll,
			})
			
			processFunc ({
				name: "check",
				func: check,
				spot,
				template,
				chunk,
				side: "input",
				symmetry,
				symmetryId,
				forSymmId,
				char: inputChar,
				diagram,
				diagramId,
				isAll,
			})
			
			processFunc ({
				name: "change",
				func: change,
				spot,
				template,
				chunk,
				side: "output",
				symmetry,
				symmetryId,
				forSymmId,
				char: outputChar,
				diagram,
				diagramId,
				isAll,
			})
			
			processFunc ({
				name: "keep",
				func: keep,
				spot,
				template,
				chunk,
				side: "output",
				symmetry,
				symmetryId,
				forSymmId,
				char: outputChar,
				diagram,
				diagramId,
				isAll,
			})
		}
		
		// Remove redundant needers from output - because they are already in input
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
	const processFunc = ({name, func, spot, template, chunk, side, symmetry, symmetryId, forSymmId, char, diagram, diagramId, isAll}) => {
		if (func === undefined) return
		
		const {x, y, z} = spot
		const {head, cache, chars} = template
		
		const id = head[name].pushUnique(func)
		chars[name][id] = char
		const result = getResult(name)
		const paramNames = getParamNames(func)
		const params = paramNames.map(paramName => getParam(paramName))
		const argNames = params.map(param => getName(param, x, y, z, symmetryId, char, diagramId))
		
		const idResult = makeIdResult(result, id, paramNames)
		const needs = getNeeds(idResult)
		const idResultName = getName(idResult, x, y, z, symmetryId, char, diagramId)
		const needers = needs.map(need => makeNeeder({need, x, y, z, symmetry, symmetryId, forSymmId, id, argNames, idResultName, char, diagram, diagramId, isAll}))
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
		debug: {},
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
	
	const makeNeeder = ({need, x, y, z, id, symmetry, symmetryId, argNames, idResultName, forSymmId, char, diagram, diagramId, isAll}) => {
		const name = getName(need, x, y, z, symmetryId, char, diagramId)
		return {need, name, x, y, z, symmetry, symmetryId, id, argNames, idResultName, forSymmId, char, diagram, diagramId, isAll}
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
	
	const getName = (param, x, y, z, symmetryId, char, diagramId) => {
		const type = param.type
		let name = param.name
		if (type === NEED_TYPE.ARG) return name
		if (type === NEED_TYPE.GLOBAL) return name
		if (type === NEED_TYPE.SYMMETRY) return getSymmetryName(name, symmetryId)
		if (type === NEED_TYPE.LOCAL) return getLocalName(name, x, y, z, symmetryId)
		if (type === NEED_TYPE.SYMBOL) return getSymbolName(name, char, diagramId)
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
			else {
				throw new Error(`[SpaceTode] Unexpected character in named parameters: '${char}'\n\nPlease don't do anything fancy with your parameters in symbol functions :)\nGOOD: (element, space) => { ... }\nBAD: (element = Empty, {atom}) => { ... }\n\nPlease feel free to contact @todepond if you want to ask for help or complain about this :D\n`)
			}
			if (char == ")") break
		}
		return paramNames
	}
	
	const getSymbolName = (name, char, diagramId) => {
		const id = getCharId(char)
		return name + diagramId + "Char" + id
	}
	
	const uniqueCache = {}
	const getUniqueName = (name) => {
		if (uniqueCache.has(name)) {
			uniqueCache[name]++
			return name + uniqueCache[name]
		}
		uniqueCache[name] = 0
		return name + uniqueCache[name]
	}
	
	const getSymmetryName = (name, symmetryId) => {
		const symmetryTail = symmetryId !== undefined? "Symm" + symmetryId : ""
		return name + symmetryTail
	}
	
	const getLocalName = (name, x, y, z, symmetryId, isConst) => {
		const xyzTail = `${x}${y}${z}`
		const symmetryTail = symmetryId !== undefined? "Symm" + symmetryId : ""
		const constTail = isConst? `Const` : ``
		return name + xyzTail.replace(/-/g, "_") + symmetryTail + constTail
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
		generateConstant,
		preLoop = false,
		isCondition = false,
	}) => ({
		name,
		type,
		needNames,
		generateGet,
		generateExtra,
		generateConstant,
		preLoop,
		isCondition,
	})
	
	const NEED_TYPE = {
		ARG: Symbol("Arg"),
		GLOBAL: Symbol("Global"),
		SYMMETRY: Symbol("Symmetry"),
		LOCAL: Symbol("Local"),
		SYMBOL: Symbol("Symbol"), //TODO: bugged
	}
	
	const PARAM = {}
	PARAM.self = makeNeed({name: "self", type: NEED_TYPE.ARG})
	PARAM.selfElement = makeNeed({name: "selfElement", type: NEED_TYPE.ARG})
	PARAM.time = makeNeed({name: "time", type: NEED_TYPE.ARG})
	PARAM.origin = makeNeed({name: "origin", type: NEED_TYPE.ARG})
	PARAM.sites = makeNeed({
		name: "sites",
		type: NEED_TYPE.GLOBAL,
		preLoop: true,
		needNames: ["origin"],
		generateGet: () => `origin.sites`,
	})
	
	PARAM.transformationNumber = makeNeed({
		name: "transformationNumber",
		type: NEED_TYPE.SYMMETRY,
		needNames: ["transformationNumbers"],
		generateGet: (x, y, z, symmetry, symmetryId, id, argNames, idResultName, forSymmId, char, template, diagram, isAll) => {
			if (symmetry === undefined) return undefined
			if (forSymmId !== undefined) {
				if (isAll) return `transformationNumbersSymm${symmetryId}Const[i${symmetryId}]`
				return `transNumsShuffledSymm${symmetryId}[i${symmetryId}]`
			}
			return `Math.floor(Math.random() * ${symmetry.transformations.length})`
		}
	})
	
	PARAM.transformationNumbers = makeNeed({
		name: "transformationNumbers",
		type: NEED_TYPE.SYMMETRY,
		needNames: [],
		generateConstant: (x, y, z, symmetry, symmetryId, id, argNames, idResultName, forSymmId) => {
			if (forSymmId === undefined) return undefined
			return "[" + (0).to(symmetry.transformations.length-1).join(", ") + "]"
		}
	})
	
	PARAM.possibleSiteNumbers = makeNeed({
		name: "possibleSiteNumbers",
		type: NEED_TYPE.LOCAL,
		needNames: [],
		preLoop: true,
		generateConstant: (x, y, z, symmetry, symmetryId) => {
			if (x === 0 && y === 0 && z === 0) return undefined
			if (symmetry === undefined) return undefined
			const siteNumbers = symmetry.transformations.map(t => EVENTWINDOW.getSiteNumber(...t(x, y, z)))
			return `[${siteNumbers.join(", ")}]`
		},
		/*generateGet: (x, y, z, symmetry, symmetryId, id, argNames, idResultName, forSymmId) => {
			if (x === 0 && y === 0 && z === 0) return undefined
			if (forSymmId === undefined) return undefined
			const possibleSiteNumbersName = getLocalName("possibleSiteNumbers", x, y, z, symmetryId, true)
			return `${possibleSiteNumbersName}.shuffled`
		},*/
	})
	
	PARAM.siteNumber = makeNeed({
		name: "siteNumber",
		type: NEED_TYPE.LOCAL,
		needNames: ["transformationNumber", "possibleSiteNumbers"],
		generateGet: (x, y, z, symmetry, symmetryId, id, argNames, idResultName, forSymmId) => {
			if (x === 0 && y === 0 && z === 0) return undefined
			if (symmetry === undefined) return undefined
			const possibleSiteNumbersName = getLocalName("possibleSiteNumbers", x, y, z, symmetryId, true)
			const transformationNumberName = getSymmetryName("transformationNumber", symmetryId)
			return `${possibleSiteNumbersName}[${transformationNumberName}]`
		},
	})
	
	PARAM.space = makeNeed({
		name: "space",
		type: NEED_TYPE.LOCAL,
		needNames: ["sites", "siteNumber"],
		generateGet: (x, y, z, symmetry, symmetryId) => {
			if (x === 0 && y === 0 && z === 0) return "origin"
			if (symmetry === undefined) {
				const siteNumber = EVENTWINDOW.getSiteNumber(x, y, z)
				return `sites[${siteNumber}]`
			}
			const siteNumberName = getLocalName("siteNumber", x, y, z, symmetryId)
			return `sites[${siteNumberName}]`
		},
	})
	
	PARAM.atom = makeNeed({
		name: "atom",
		type: NEED_TYPE.LOCAL,
		needNames: ["space"],
		generateGet: (x, y, z, symmetry, symmetryId) => {
			const spaceName = getLocalName("space", x, y, z, symmetryId)
			return `${spaceName}.atom`
		},
	})
	
	PARAM.element = makeNeed({
		name: "element",
		type: NEED_TYPE.LOCAL,
		needNames: ["space"],
		generateGet: (x, y, z, symmetry, symmetryId) => {
			const spaceName = getLocalName("space", x, y, z, symmetryId)
			return `${spaceName}.element`
		},
	})
	
	PARAM.selected = makeNeed({
		name: "selected",
		type: NEED_TYPE.SYMBOL,
		needNames: [],
		generateGet: (x, y, z, symmetry, symmetryId, id, args, idResultName, forSymmId, char, template, diagram) => {
			const selectId = getSymbolId(char, "select", template)
			let selectResultPos = undefined
			for (const spot of diagram) {
				if (spot.inputChar === char) {
					// TODO: randomly select from multiple selects
					if (selectResultPos !== undefined) throw new Error(`[SpaceTode] You can only have one '${char}' symbol in the left-hand-side of a diagram because it has a 'select' keyword.`)
					selectResultPos = [spot.x, spot.y, spot.z]
				}
			}
			const selectResultName = getLocalName(`select${selectId}Result`, ...selectResultPos, symmetryId)
			return selectResultName
		},
	})
	
	//===============//
	// Result Params //
	//===============//
	const RESULT = {}
	RESULT.given = makeNeed({
		name: "given",
		type: NEED_TYPE.LOCAL,
		generateGet: (x, y, z, symmetry, symmetryId, id, args) => {
			const argsInner = args.join(", ")
			return `given${id}(${argsInner})`
		},
		isCondition: true,
	})
	
	RESULT.select = makeNeed({
		name: "select",
		type: NEED_TYPE.LOCAL,
		generateGet: (x, y, z, symmetry, symmetryId, id, args) => {
			const argsInner = args.join(", ")
			return `select${id}(${argsInner})`
		},
	})
	
	RESULT.keep = makeNeed({
		name: "keep",
		type: NEED_TYPE.LOCAL,
		needs: [],
		generateExtra: (x, y, z, symmetry, symmetryId, id, args) => {
			const argsInner = args.join(", ")
			return `keep${id}(${argsInner})`
		},
	})
	
	RESULT.check = makeNeed({
		name: "check",
		type: NEED_TYPE.GLOBAL,
		needNames: [],
		generateGet: (x, y, z, symmetry, symmetryId, id, args) => {
			const argsInner = args.join(", ")
			return `check${id}(${argsInner})`
		},
	})
	
	RESULT.change = makeNeed({
		name: "change",
		type: NEED_TYPE.LOCAL,
		needNames: ["space"],
		generateGet: (x, y, z, symmetry, symmetryId, id, args) => {
			const argsInner = args.join(", ")
			return `change${id}(${argsInner})`
		},
		generateExtra: (x, y, z, symmetry, symmetryId, id, args, idResultName) => {
			const spaceName = getLocalName("space", x, y, z, symmetryId)
			return `SPACE.setAtom(${spaceName}, ${idResultName})`
		}
	})
	
	//============//
	// ID Results //
	//============//
	let idResultsCache = {}
	INSTRUCTION.resetIdResultCache = () => idResultsCache = {} 
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
	
	//=========//
	// Char ID //
	//=========//
	let charIdCache = []
	INSTRUCTION.resetCharIdCache = () => charIdCache = []
	const getCharId = (char) => {
		let id = charIdCache.indexOf(char)
		if (id !== -1) return id
		return charIdCache.push(char) - 1
	}
	
	//===========//
	// Symbol ID //
	//===========//
	const getSymbolId = (char, partName, template) => {
		return template.chars[partName].indexOf(char)
	}
	
}


