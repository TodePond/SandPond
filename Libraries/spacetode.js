

//==== Source/SpaceTode.js ====//
;
try {
	HABITAT
}
catch {
	throw new Error(`\n\n[SpaceTode] Habitat.js is required by SpaceTode.\n\nIts source is at http://habitat.todepond.cool.\nFor more info, go to https://github.com/l2wilson94/Habitat.\n`)
}

if (HABITAT.EAT_LEGACY !== true) throw new Error(`\n\n[SpaceTode] EatLegacy.js is required by SpaceTode.\n\nIts source is at http://habitat.todepond.cool/Build/EatLegacy.js.\n`)


//==== Source/EventWindow.js ====//
;//=============//
// EventWindow //
//=============//
const EVENTWINDOW = {}

{

	// Event Window Job Description
	//=============================
	// "I am responsible for my SITES."

	//========//
	// Public //
	//========//
	EVENTWINDOW.getSiteNumber = (x, y, z) => {
		const key = getSiteKey(x, y, z)
		return SITE_NUMBERS[key]
	}
	
	EVENTWINDOW.updateWorld = (world) => {
		const area = world.area
		const grid = world.grid
		for (const y of area.yStart.to(area.yEnd)) {
			for (const x of area.xStart.to(area.xEnd)) {
				for (const z of area.zStart.to(area.zEnd)) {
				
					const space = grid[y][x][z]
					const sites = makeSites(world, x, y, z)
					for (let siteNumber = 0; siteNumber < sites.length; siteNumber++) {
						const site = sites[siteNumber]
						space.sites.push(site)
					}
					
					//const siteRefs = getSiteRefs(sites)
					//space.siteRefs = siteRefs
				}
			}
		}
	}
	
	//===========//
	// Constants //
	//===========//	
	SITE_POSITIONS = [
		// >x ^y
		// looking from the front
		[-2,2,0],  [-1,2,0],  [0,2,0],  [1,2,0],  [2,2,0],
		[-2,1,0],  [-1,1,0],  [0,1,0],  [1,1,0], [2,1,0],
		[-2,0,0],  [-1,0,0],  [0,0,0],  [1,0,0], [2,0, 0],
		[-2,-1,0], [-1,-1,0], [0,-1,0], [1,-1,0],[2,-1,0],
		[-2,-2,0], [-1,-2,0], [0,-2,0], [1,-2,0], [2,-2,0],
		
		// >x ^z
		// looking from the top
		[-2,0,2],  [-1,0,2],  [0,0,2],  [1,0,2],  [2,0,2],
		[-2,0,1],  [-1,0,1],  [0,0,1],  [1,0,1],  [2,0,1],
		/*[-2,0,0], [-1,0,0], [0,0,0], [1,0,0], [2,0,0],*/
		[-2,0,-1], [-1,0,-1], [0,0,-1], [1,0,-1], [2,0,-1],
		[-2,0,-2], [-1,0,-2], [0,0,-2], [1,0,-2], [2,0,-2],
		
		//>z ^y
		// looking from the side
		[0,2,-2], [0,2,-1], /*[0,2,0],*/ [0,2,1], [0,2,2],
		[0,1,-2], [0,1,-1], /*[0,1,0],*/ [0,1,1], [0,1,2],
		/*[0,0,-2], [0,0,-1], [0,0,0], [0,0,1], [0,0,2],*/
		[0,-1,-2], [0,-1,-1], /*[0,-1,0],*/ [0,-1,1], [0,-1,2],
		[0,-2,-2], [0,-2,-1], /*[0,-1,0],*/ [0,-2,1], [0,-2,2],
		
	]
	
	const SITE_NUMBERS = []
	
	//=======//
	// Setup //
	//=======//
	const getSiteKey = (x, y, z) => {
		return `${x}${y}${z}`
	}
	
	for (const i in SITE_POSITIONS) {
		const position = SITE_POSITIONS[i]
		const key = getSiteKey(...position)
		SITE_NUMBERS[key] = parseInt(i)
	}
	
	//===========//
	// Functions //
	//===========//	
	const getSiteRefs = (sites) => {
		const length = sites.length
		const array = new Uint32Array(length)
		for (let i = 0; i < length; i++) {
			array[i] = sites[i].id
		}
		return array
	}
	
	const makeSites = (world, x, y, z) => {
	
		// Written by hand because it made lookup faster compared to dynamically filling the array
		const sites = [
			SITE.make(WORLD.selectSpace(world, x + -2, y + 2, z + 0), x + -2, y + 2, z + 0),
			SITE.make(WORLD.selectSpace(world, x + -1, y + 2, z + 0), x + -1, y + 2, z + 0),
			SITE.make(WORLD.selectSpace(world, x + 0, y + 2, z + 0), x + 0, y + 2, z + 0),
			SITE.make(WORLD.selectSpace(world, x + 1, y + 2, z + 0), x + 1, y + 2, z + 0),
			SITE.make(WORLD.selectSpace(world, x + 2, y + 2, z + 0), x + 2, y + 2, z + 0),
			
			SITE.make(WORLD.selectSpace(world, x + -2, y + 1, z + 0), x + -2, y + 1, z + 0),
			SITE.make(WORLD.selectSpace(world, x + -1, y + 1, z + 0), x + -1, y + 1, z + 0),
			SITE.make(WORLD.selectSpace(world, x + 0, y + 1, z + 0), x + 0, y + 1, z + 0),
			SITE.make(WORLD.selectSpace(world, x + 1, y + 1, z + 0), x + 1, y + 1, z + 0),
			SITE.make(WORLD.selectSpace(world, x + 2, y + 1, z + 0), x + 2, y + 1, z + 0),
			
			SITE.make(WORLD.selectSpace(world, x + -2, y + 0, z + 0), x + -2, y + 0, z + 0),
			SITE.make(WORLD.selectSpace(world, x + -1, y + 0, z + 0), x + -1, y + 0, z + 0),
			SITE.make(WORLD.selectSpace(world, x + 0, y + 0, z + 0), x + 0, y + 0, z + 0),
			SITE.make(WORLD.selectSpace(world, x + 1, y + 0, z + 0), x + 1, y + 0, z + 0),
			SITE.make(WORLD.selectSpace(world, x + 2, y + 0, z + 0), x + 2, y + 0, z + 0),
			
			SITE.make(WORLD.selectSpace(world, x + -2, y + -1, z + 0), x + -2, y + -1, z + 0),
			SITE.make(WORLD.selectSpace(world, x + -1, y + -1, z + 0), x + -1, y + -1, z + 0),
			SITE.make(WORLD.selectSpace(world, x + 0, y + -1, z + 0), x + 0, y + -1, z + 0),
			SITE.make(WORLD.selectSpace(world, x + 1, y + -1, z + 0), x + 1, y + -1, z + 0),
			SITE.make(WORLD.selectSpace(world, x + 2, y + -1, z + 0), x + 2, y + -1, z + 0),
			
			SITE.make(WORLD.selectSpace(world, x + -2, y + -2, z + 0), x + -2, y + -2, z + 0),
			SITE.make(WORLD.selectSpace(world, x + -1, y + -2, z + 0), x + -1, y + -2, z + 0),
			SITE.make(WORLD.selectSpace(world, x + 0, y + -2, z + 0), x + 0, y + -2, z + 0),
			SITE.make(WORLD.selectSpace(world, x + 1, y + -2, z + 0), x + 1, y + -2, z + 0),
			SITE.make(WORLD.selectSpace(world, x + 2, y + -2, z + 0), x + 2, y + -2, z + 0),
			
			SITE.make(WORLD.selectSpace(world, x + -2, y + 0, z + 2), x + -2, y + 0, z + 2),
			SITE.make(WORLD.selectSpace(world, x + -1, y + 0, z + 2), x + -1, y + 0, z + 2),
			SITE.make(WORLD.selectSpace(world, x + 0, y + 0, z + 2), x + 0, y + 0, z + 2),
			SITE.make(WORLD.selectSpace(world, x + 1, y + 0, z + 2), x + 1, y + 0, z + 2),
			SITE.make(WORLD.selectSpace(world, x + 2, y + 0, z + 2), x + 2, y + 0, z + 2),
			
			SITE.make(WORLD.selectSpace(world, x + -2, y + 0, z + 1), x + -2, y + 0, z + 1),
			SITE.make(WORLD.selectSpace(world, x + -1, y + 0, z + 1), x + -1, y + 0, z + 1),
			SITE.make(WORLD.selectSpace(world, x + 0, y + 0, z + 1), x + 0, y + 0, z + 1),
			SITE.make(WORLD.selectSpace(world, x + 1, y + 0, z + 1), x + 1, y + 0, z + 1),
			SITE.make(WORLD.selectSpace(world, x + 2, y + 0, z + 1), x + 2, y + 0, z + 1),
			/*
			SITE.make(WORLD.selectSpace(world, x + -2, y + 0, z + 0), x + -2, y + 0, z + 0),
			SITE.make(WORLD.selectSpace(world, x + -1, y + 0, z + 0), x + -1, y + 0, z + 0),
			SITE.make(WORLD.selectSpace(world, x + 0, y + 0, z + 0), x + 0, y + 0, z + 0),
			SITE.make(WORLD.selectSpace(world, x + 1, y + 0, z + 0), x + 1, y + 0, z + 0),
			SITE.make(WORLD.selectSpace(world, x + 2, y + 0, z + 0), x + 2, y + 0, z + 0),
			*/
			SITE.make(WORLD.selectSpace(world, x + -2, y + 0, z + -1), x + -2, y + 0, z + -1),
			SITE.make(WORLD.selectSpace(world, x + -1, y + 0, z + -1), x + -1, y + 0, z + -1),
			SITE.make(WORLD.selectSpace(world, x + 0, y + 0, z + -1), x + 0, y + 0, z + -1),
			SITE.make(WORLD.selectSpace(world, x + 1, y + 0, z + -1), x + 1, y + 0, z + -1),
			SITE.make(WORLD.selectSpace(world, x + 2, y + 0, z + -1), x + 2, y + 0, z + -1),
			
			SITE.make(WORLD.selectSpace(world, x + -2, y + 0, z + -2), x + -2, y + 0, z + -2),
			SITE.make(WORLD.selectSpace(world, x + -1, y + 0, z + -2), x + -1, y + 0, z + -2),
			SITE.make(WORLD.selectSpace(world, x + 0, y + 0, z + -2), x + 0, y + 0, z + -2),
			SITE.make(WORLD.selectSpace(world, x + 1, y + 0, z + -2), x + 1, y + 0, z + -2),
			SITE.make(WORLD.selectSpace(world, x + 2, y + 0, z + -2), x + 2, y + 0, z + -2),
			
			SITE.make(WORLD.selectSpace(world, x + 0, y + 2, z + -2), x + 0, y + 2, z + -2),
			SITE.make(WORLD.selectSpace(world, x + 0, y + 2, z + -1), x + 0, y + 2, z + -1),
			/*WORLD.selectSpace(world, x + 0, y + 2, z + 0),*/
			SITE.make(WORLD.selectSpace(world, x + 0, y + 2, z + 1), x + 0, y + 2, z + 1),
			SITE.make(WORLD.selectSpace(world, x + 0, y + 2, z + 2), x + 0, y + 2, z + 2),
			
			SITE.make(WORLD.selectSpace(world, x + 0, y + 1, z + -2), x + 0, y + 1, z + -2),
			SITE.make(WORLD.selectSpace(world, x + 0, y + 1, z + -1), x + 0, y + 1, z + -1),
			/*WORLD.selectSpace(world, x + 0, y + 1, z + 0),*/
			SITE.make(WORLD.selectSpace(world, x + 0, y + 1, z + 1), x + 0, y + 1, z + 1),
			SITE.make(WORLD.selectSpace(world, x + 0, y + 1, z + 2), x + 0, y + 1, z + 2),
			/*
			SITE.make(WORLD.selectSpace(world, x + 0, y + 0, z + -2), x + 0, y + 0, z + -2),
			SITE.make(WORLD.selectSpace(world, x + 0, y + 0, z + -1), x + 0, y + 0, z + -1),
			SITE.make(WORLD.selectSpace(world, x + 0, y + 0, z + 0), x + 0, y + 0, z + 0),
			SITE.make(WORLD.selectSpace(world, x + 0, y + 0, z + 1), x + 0, y + 0, z + 1),
			SITE.make(WORLD.selectSpace(world, x + 0, y + 0, z + 2), x + 0, y + 0, z + 2),
			*/
			SITE.make(WORLD.selectSpace(world, x + 0, y + -1, z + -2), x + 0, y + -1, z + -2),
			SITE.make(WORLD.selectSpace(world, x + 0, y + -1, z + -1), x + 0, y + -1, z + -1),
			/*WORLD.selectSpace(world, x + 0, y + -1, z + 0),*/
			SITE.make(WORLD.selectSpace(world, x + 0, y + -1, z + 1), x + 0, y + -1, z + 1),
			SITE.make(WORLD.selectSpace(world, x + 0, y + -1, z + 2), x + 0, y + -1, z + 2),
			
			SITE.make(WORLD.selectSpace(world, x + 0, y + -2, z + -2), x + 0, y + -2, z + -2),
			SITE.make(WORLD.selectSpace(world, x + 0, y + -2, z + -1), x + 0, y + -2, z + -1),
			/*WORLD.selectSpace(world, x + 0, y + -2, z + 0),*/
			SITE.make(WORLD.selectSpace(world, x + 0, y + -2, z + 1), x + 0, y + -2, z + 1),
			SITE.make(WORLD.selectSpace(world, x + 0, y + -2, z + 2), x + 0, y + -2, z + 2),
		]
		return sites
	}
	
}

//==== Source/Symmetry.js ====//
;//==========//
// Symmetry //
//==========//
const SYMMETRY = {}

{
	
	const transformationCache = {}
	const getTransformation = (sig) => {
		if (transformationCache.has(sig)) return transformationCache[sig]
		const xAxis = getAxisAxis(sig, 0)
		const yAxis = getAxisAxis(sig, 1)
		const zAxis = getAxisAxis(sig, 2)
		const xSign = getAxisSign(sig, xAxis)
		const ySign = getAxisSign(sig, yAxis)
		const zSign = getAxisSign(sig, zAxis)
		const code = `(x, y, z) => [${xSign}${xAxis}, ${ySign}${yAxis}, ${zSign}${zAxis}]`
		return JS(code)
		
	}
	
	const getAxisSign = (sig, axis) => {
		const head = sig.split(axis)[0]
		if (head[head.length-1] === "-") return "-"
		return ""
	}
	
	const getAxisAxis = (sig, axisId) => {
		const uSig = sig.filter(c => c === "x" || c === "y" || c === "z")
		return uSig[axisId]
	}
	
	const T = getTransformation
	
	SYMMETRY.make = (name, transformations) => ({name, transformations})
	SYMMETRY.TYPE = {}
	SYMMETRY.TYPE.x = SYMMETRY.make("X", [
		T("xyz"),
		T("-xyz"),
	])
	
	SYMMETRY.TYPE.y = SYMMETRY.make("X", [
		T("xyz"),
		T("x-yz"),
	])
	
	SYMMETRY.TYPE.z = SYMMETRY.make("X", [
		T("xyz"),
		T("xy-z"),
	])
	
	SYMMETRY.TYPE.xy = SYMMETRY.make("XY", [
		T("xyz"),
		T("-xyz"),
		T("x-yz"),
		T("-x-yz"),
		T("yxz"),
		T("-yxz"),
		T("y-xz"),
		T("-y-xz"),
	])
	
	SYMMETRY.TYPE.xy.reflections = SYMMETRY.make("XY.REFLECTIONS", [
		T("xyz"),
		T("yxz"),
	])
	
	SYMMETRY.TYPE.xy.shifts = SYMMETRY.make("XY.SHIFTS", [...SYMMETRY.TYPE.xy.transformations])
	
	SYMMETRY.TYPE.xy.rotations = SYMMETRY.make("XY.ROTATIONS", [
		T("xyz"),
		T("-yxz"),
		T("-x-yz"),
		T("y-xz"),
	])
	
	SYMMETRY.TYPE.xy.directions = SYMMETRY.make("XY.DIRECTIONS", [
		T("xyz"),
		T("-x-yz"),
		T("yxz"),
		T("-y-xz"),
	])
	
	SYMMETRY.TYPE.xy.others = SYMMETRY.make("XY.OTHERS", [
		() => [-2,2,0],  () => [-1,2,0],  () => [0,2,0],  () => [1,2,0], () => [2,2,0],
		() => [-2,1,0],  () => [-1,1,0],  () => [0,1,0],  () => [1,1,0], () => [2,1,0],
		() => [-2,0,0],  () => [-1,0,0],/*() => [0,0,0],*/  () => [1,0,0], () => [2,0, 0],
		() => [-2,-1,0], () => [-1,-1,0], () => [0,-1,0], () => [1,-1,0],() => [2,-1,0],
		() => [-2,-2,0], () => [-1,-2,0], () => [0,-2,0], () => [1,-2,0], () => [2,-2,0],
	])
	
	SYMMETRY.TYPE.xz = SYMMETRY.make("XZ", [
		T("xyz"),
		T("-xyz"),
		T("xy-z"),
		T("-xy-z"),
		T("zyx"),
		T("-zyx"),
		T("zy-x"),
		T("-zy-x"),
	])
	
	SYMMETRY.TYPE.xz.swaps = SYMMETRY.make("XZ.SWAPS", [
		T("xyz"),
		T("zyx")
	])
	
	SYMMETRY.TYPE.xz.rotations = SYMMETRY.make("XZ.ROTATIONS", [
		T("xyz"),
		T("zy-x"),
		T("-xy-z"),
		T("-zyx"),
	])
	
	SYMMETRY.TYPE.xz.directions = SYMMETRY.make("XZ.ROTATIONS", [
		T("xyz"),
		T("-xy-z"),
		T("zyx"),
		T("-zy-x"),
	])
	
	SYMMETRY.TYPE.yz = SYMMETRY.make("YZ", [
		T("xyz"),
		T("x-yz"),
		T("xy-z"),
		T("x-y-z"),
		T("xzy"),
		T("x-zy"),
		T("xz-y"),
		T("x-z-y"),
	])
	
	SYMMETRY.TYPE.yz.rotations = SYMMETRY.make("YZ.ROTATIONS", [
		T("xyz"),
		T("x-y-z"),
		T("xzy"),
		T("x-z-y"),
	])
	
	SYMMETRY.TYPE.yz.directions = SYMMETRY.make("YZ.DIRECTIONS", [
		T("xyz"),
		T("x-y-z"),
		T("xzy"),
		T("x-z-y"),
	])
	
	SYMMETRY.TYPE.xyz = {}
	
	SYMMETRY.TYPE.xyz.directions = SYMMETRY.make("XYZ.DIRECTIONS", [
		T("xyz"),
		T("-x-yz"),
		
		T("zxy"),
		T("z-x-y"),
		
		T("yzx"),
		T("-yz-x"),
	])
	
	SYMMETRY.TYPE.xyz.shifts = SYMMETRY.make("XYZ.SHIFTS", [
		T("xyz"),
		T("x-yz"),
		T("-xyz"),
		T("-x-yz"),
		
		T("zxy"),
		T("z-xy"),
		T("zx-y"),
		T("z-x-y"),
		
		T("yzx"),
		T("yz-x"),
		T("-yzx"),
		T("-yz-x"),
	])
	
	SYMMETRY.TYPE.xyz.rotations = SYMMETRY.make("XYZ.ROTATIONS", [
		T("xyz"),	T("xzy"),
		T("x-yz"),	T("xz-y"),
		T("-xyz"),	T("-xzy"),
		T("-x-yz"),	T("-xz-y"),
		
		T("zyx"),	T("yxz"),
		T("z-yx"),	T("-yxz"),
		T("zy-x"),	T("y-xz"),
		T("z-y-x"),	T("-y-xz"),
		
		T("zxy"),	T("yzx"),
		T("zx-y"),	T("-yzx"),
		T("z-xy"),	T("yz-x"),
		T("z-x-y"),	T("-yz-x"),
	])
	
	SYMMETRY.TYPE.xyz.others = SYMMETRY.make("XYZ.OTHERS", SITE_POSITIONS.filter((p, i) => i !== 12).map(p => () => p))
}


//==== Source/Element.js ====//
;//=========//
// Element //
//=========//
const ELEMENT = {}

{
	// Element Job Description
	//========================
	// "I describe how I look and behave."

	//========//
	// Public //
	//========//
	ELEMENT.make = ({name, instructions = [], data = {}, args = {}, categories = [], elements = []}, {
		colour = "grey", emissive = colour, opacity = 1.0, visible = true, source = "",
		hidden = false, pour = true,
		...otherProperties
	} = {}) => {
	
		const behaveCode = JAVASCRIPT.makeBehaveCode(instructions, name)
		const behaveMaker = new Function(behaveCode)
		const behave = behaveMaker()
		//print(otherScopeProperties)
		const shaderColours = makeShaderColours(colour, emissive, opacity)
		colour = shaderColours.colour
		emissive = shaderColours.emissive
		const constructorCode = JAVASCRIPT.makeConstructorCode(name, data, args, visible, ...shaderColours)
		const element = JS(constructorCode)(...data, ...args)
		
		element.o={
			
			// Scope
			elements, data, args,
			
			// Appearance
			name, colour, emissive, opacity, categories, ...shaderColours, visible,
			
			// Dropper
			hidden, pour,
			
			// Debug
			source, constructorCode, behaveCode, instructions,
			
			// Behaviour
			behave, ...otherProperties
			
		}
		
		for (const child of element.elements) {
			element[child.name] = child
		}
		
		return element
	}
	
	//=========//
	// Private //
	//=========//
	const makeShaderColours = (colour, emissive, opacity) => {
		let colourColour = new THREE.Color(colour)
		let emissiveColour = new THREE.Color(emissive)

		if (!colourColour.hasOwnProperty("r")) {
			colourColour = new THREE.Color("red")
			colour = "red"
		}
		if (!emissiveColour.hasOwnProperty("r")) {
			emissiveColour = new THREE.Color("red")
			emissive = "red"
		}
		
		const shaderColour = {
			r: colourColour.r * 255,
			g: colourColour.g * 255,
			b: colourColour.b * 255,
		}
		
		const shaderOpacity = opacity * 255
		const shaderEmissive = {
			r: emissiveColour.r * 255,
			g: emissiveColour.g * 255,
			b: emissiveColour.b * 255,
		}
		
		return {shaderColour, shaderEmissive, shaderOpacity, colour, emissive}
		
	}
	
}


//==== Source/Instruction.js ====//
;//=============//
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

;{
	
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
	
	INSTRUCTION.TYPE.BEHAVE = INSTRUCTION.make("Behave", (template, behave, instructions, spotMods = [], chunkMods = [], symmetry, symmetryId, forSymmId, char, diagramId, isAll) => {
		const id = template.head.behave.push(behave) - 1
		const chunk = makeEmptyChunk()
		chunk.debug = {source: `behave${id}`}
		
		processFunc ({
			name: "behave",
			func: behave,
			undefined,
			template,
			chunk,
			side: "input",
			symmetry,
			symmetryId,
			forSymmId,
			char: "behave",
			undefined,
			diagramId,
			isAll,
		})
		
		for (const mod of chunkMods) {
			mod(chunk)
		}
		
		template.main.push(chunk)
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
			if (chunk.actionIds === undefined) chunk.actionIds = []
			chunk.actionIds = [...chunk.actionIds, actionId]
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
				spotMods,
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
				spotMods,
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
				spotMods,
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
				spotMods,
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
				spotMods,
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
	const processFunc = ({name, func, spot = {}, template, chunk, side, symmetry, symmetryId, forSymmId, char, diagram, diagramId, isAll, spotMods}) => {
		if (func === undefined) return
		
		const {x, y, z} = spot
		const {head, cache, chars} = template
		const id = head[name].pushUnique(func)
		if (chars[name][id] === undefined) chars[name][id] = []
		chars[name][id].pushUnique(char)
		const result = getResult(name)
		const paramNames = getParamNames(func)
		const params = paramNames.map(paramName => getParam(paramName))
		const argNames = params.map(param => getName(param, x, y, z, symmetryId, char, diagramId))
		
		const idResult = makeIdResult(result, id, paramNames)
		const needs = getNeeds(idResult)
		const idResultName = getName(idResult, x, y, z, symmetryId, char, diagramId)
		const needers = needs.map(need => makeNeeder({need, x, y, z, symmetry, symmetryId, forSymmId, id, argNames, idResultName, char, diagram, diagramId, isAll, spotMods}))
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
	
	const makeNeeder = ({need, x, y, z, id, symmetry, symmetryId, argNames, idResultName, forSymmId, char, diagram, diagramId, isAll, spotMods}) => {
		const name = getName(need, x, y, z, symmetryId, char, diagramId)
		return {need, name, x, y, z, symmetry, symmetryId, id, argNames, idResultName, forSymmId, char, diagram, diagramId, isAll, spotMods}
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
		if (type === NEED_TYPE.LOCAL) {
			if (x === undefined) throw new Error(`\n\n[SpaceTode] Can't get local parameter '${name}' in a global setting.\n\nAre you trying to use '${name}' in a 'behave' function?\nYou can only use global parameters, such as 'origin', 'sites', 'self' and 'Self'.\n`)
			return getLocalName(name, x, y, z, symmetryId)
		}
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
	PARAM.Self = makeNeed({name: "Self", type: NEED_TYPE.ARG})
	PARAM.time = makeNeed({name: "time", type: NEED_TYPE.ARG})
	PARAM.origin = makeNeed({name: "origin", type: NEED_TYPE.ARG})
	
	// Legacy
	PARAM.selfElement = makeNeed({
		name: "selfElement",
		type: NEED_TYPE.GLOBAL,
		needNames: ["Self"],
		generateGet: () => `Self`,
	})
	
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
	
	PARAM.possibleXs = makeNeed({
		name: "possibleXs",
		type: NEED_TYPE.LOCAL,
		needNames: [],
		preLoop: true,
		generateConstant: (x, y, z, symmetry, symmetryId) => {
			if (x === 0 && y === 0 && z === 0) return undefined
			if (symmetry === undefined) return undefined
			const xs = symmetry.transformations.map(t => t(x, y, z)[0])
			return `[${xs.join(", ")}]`
		},
	})
	
	PARAM.x = makeNeed({
		name: "x",
		type: NEED_TYPE.LOCAL,
		needNames: ["transformationNumber", "possibleXs"],
		generateGet: (x, y, z, symmetry, symmetryId, id, argNames, idResultName, forSymmId) => {
			if (x === 0 && y === 0 && z === 0) return 0
			if (symmetry === undefined) return x
			const possibleXsName = getLocalName("possibleXs", x, y, z, symmetryId, true)
			const transformationNumberName = getSymmetryName("transformationNumber", symmetryId)
			return `${possibleXsName}[${transformationNumberName}]`
		}
	})
	
	PARAM.possibleYs = makeNeed({
		name: "possibleYs",
		type: NEED_TYPE.LOCAL,
		needNames: [],
		preLoop: true,
		generateConstant: (x, y, z, symmetry, symmetryId) => {
			if (x === 0 && y === 0 && z === 0) return undefined
			if (symmetry === undefined) return undefined
			const ys = symmetry.transformations.map(t => t(x, y, z)[1])
			return `[${ys.join(", ")}]`
		},
	})
	
	PARAM.y = makeNeed({
		name: "y",
		type: NEED_TYPE.LOCAL,
		needNames: ["transformationNumber", "possibleYs"],
		generateGet: (x, y, z, symmetry, symmetryId, id, argNames, idResultName, forSymmId) => {
			if (x === 0 && y === 0 && z === 0) return 0
			if (symmetry === undefined) return y
			const possibleYsName = getLocalName("possibleYs", x, y, z, symmetryId, true)
			const transformationNumberName = getSymmetryName("transformationNumber", symmetryId)
			return `${possibleYsName}[${transformationNumberName}]`
		}
	})
	
	PARAM.possibleZs = makeNeed({
		name: "possibleZs",
		type: NEED_TYPE.LOCAL,
		needNames: [],
		preLoop: true,
		generateConstant: (x, y, z, symmetry, symmetryId) => {
			if (x === 0 && y === 0 && z === 0) return undefined
			if (symmetry === undefined) return undefined
			const zs = symmetry.transformations.map(t => t(x, y, z)[2])
			return `[${zs.join(", ")}]`
		},
	})
	
	PARAM.z = makeNeed({
		name: "z",
		type: NEED_TYPE.LOCAL,
		needNames: ["transformationNumber", "possibleZs"],
		generateGet: (x, y, z, symmetry, symmetryId, id, argNames, idResultName, forSymmId) => {
			if (x === 0 && y === 0 && z === 0) return 0
			if (symmetry === undefined) return z
			const possibleZsName = getLocalName("possibleZs", x, y, z, symmetryId, true)
			const transformationNumberName = getSymmetryName("transformationNumber", symmetryId)
			return `${possibleZsName}[${transformationNumberName}]`
		}
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
		generateGet: (x, y, z, symmetry, symmetryId, id, args, idResultName, forSymmId, char, template, diagram, isAll, spotMods) => {
			const selectId = getSymbolId(char, "select", template)
			let selectResultPos = undefined
			const moddedDiagram = modDiagram(diagram, spotMods)
			for (const spot of moddedDiagram) {
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
		type: NEED_TYPE.SYMBOL,
		needNames: [],
		isCondition: true,
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
	
	RESULT.behave = makeNeed({
		name: "behave",
		type: NEED_TYPE.GLOBAL,
		needs: [],
		isCondition: true,
		generateGet: (x, y, z, symmetry, symmetryId, id, args) => {
			const argsInner = args.join(", ")
			return `behave${id}(${argsInner})`
		},
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
	
	//=============//
	// Behave Need //
	//=============//
	/*const makeBehaveNeed = (func, id) => {
		const params = getParamNames(func)
		return makeNeed({
			name: `behave${id}`,
			type: NEED_TYPE.GLOBAL,
			needNames: params,
			generateExtra: () => {
				return `behave${id}`
			}
		})
	}*/
	
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
		const arr = template.chars[partName]
		for (const i in arr) {
			const e = arr[i]
			if (e.includes(char)) return i.as(Number)
		}
		return -1
	}
	
}




//==== Source/Javascript.js ====//
;//============//
// Javascript //
//============//
const JAVASCRIPT = {}

{
	// Javascript Job Description
	//===========================
	// "I generate Javascript for an element's 'behave' function."

	//========//
	// Public //
	//========//
	JAVASCRIPT.makeBehaveCode = (instructions, name) => {
		return makeBehaveCode(instructions, name)
	}
	
	show = (element) => {
		print(element.name)
		for (const instruction of element.instructions) print(instruction.type, instruction.value)
	}
	
	// messy as hell
	JAVASCRIPT.makeConstructorCode = (name, data, args, visible, shaderColour, shaderEmissive, shaderOpacity) => {
	
		let closureArgNames = ``
		let constructorArgNames = ``
		let propertyNames = ``
	
		for (const argName in data) {
			if (closureArgNames.length == 0) {
				closureArgNames += `${argName}Default`
				propertyNames += `,\n ${argName}: ${argName}Default`
			}
			else {
				closureArgNames += `, ${argName}Default`
				propertyNames += `, ${argName}: ${argName}Default`
			}
		}
		
		for (const argName in args) {
			if (closureArgNames.length == 0) {
				closureArgNames += `${argName}Default`
			}
			else {
				closureArgNames += `, ${argName}Default`
			}
			if (constructorArgNames.length == 0) {
				constructorArgNames += `${argName} = ${argName}Default`
				propertyNames += `, ${argName}: ${argName}`
			}
			else {
				constructorArgNames += `, ${argName} = ${argName}Default`
				propertyNames += `, ${argName}: ${argName}`
			}
		}
		
		const lines = []
		lines.push(`(${closureArgNames}) => {`)
		lines.push(`	`)
		lines.push(`	const element = function ${name}(${constructorArgNames}) {`)
		lines.push(`		const atom = {`)
		lines.push(`			element,`)
		lines.push(`			visible: ${visible},`)
		lines.push(`			colour: {r: ${shaderColour.r}, g: ${shaderColour.g}, b: ${shaderColour.b}},`)
		lines.push(`			emissive: {r: ${shaderEmissive.r}, g: ${shaderEmissive.g}, b: ${shaderEmissive.b}},`)
		lines.push(`			opacity: ${window.D2_MODE? 255 : shaderOpacity}`)
		lines.push(`			${propertyNames}`)
		lines.push(`		}`)
		lines.push(`		return atom`)
		lines.push(`	}`)
		lines.push(`	return element`)
		lines.push(`}`)
		const code = lines.join("\n")
		
		return code
		return (`(${closureArgNames}) => {\n` +
		`\n`+
		`const element = function ${name}(${constructorArgNames}) {\n`+
		`	const atom = {element, visible: element.visible, colour: element.shaderColour, emissive: element.shaderEmissive, opacity: element.shaderOpacity${propertyNames}}\n`+
		`	return atom\n`+
		`}\n`+
		`	return element\n`+
		`}`)
	}
	
	//==========//
	// Template //
	//==========//
	JAVASCRIPT.makeEmptyTemplate = () => ({
	
		// Head contains stores of global functions that we need
		head: {
			given: [],
			select: [],
			check: [],
			change: [],
			keep: [],
			behave: [],
		},
		
		// Stores the characters for symbol parts held in head
		chars: {
			given: [],
			select: [],
			check: [],
			change: [],
			keep: [],
			behave: [],
		},
		
		// Cache stores global variables that we might use more than once
		cache: [],
		
		// 
		symmetry: [],
		
		// Main is an array of stuff that happens in order
		// Strings just get naively added to the code
		// Chunk objects specify more fancy stuff
		main: [
			
		],
	})
	
	const buildTemplate = (template) => {
		
		const lines = []
		
		
		lines.push("//=========//")
		lines.push("// SYMBOLS //")
		lines.push("//=========//")
		for (const storeName in template.head) {
			const store = template.head[storeName]
			for (let i = 0; i < store.length; i++) {
				const script = store[i]
				if (script === undefined) continue
				if (script.split("\n").length > 1) lines.push(``)
				lines.push(`const ${storeName}${i} = ${script}`)
				if (script.split("\n").length > 1) lines.push(``)
			}
		}
		lines.push("")
		lines.push("//========//")
		lines.push("// BEHAVE //")
		lines.push("//========//")
		lines.push(`const behave = (origin, Self, time, self = origin.atom) => {`)
		const constants = []
		lines.push(...makeChunksLines(template.main, `	`, [], constants, false, template))
		lines.push(`}`)
		lines.push(``)
		lines.push(`return behave`)
		
		const constantLines = []
		constantLines.push(`//===========//`)
		constantLines.push(`// CONSTANTS //`)
		constantLines.push(`//===========//`)
		constantLines.push(...constants)
		constantLines.push(``)
		lines.unshift(...constantLines)
		
		const code = lines.join("\n")
		return code
	}
	
	const makeChunksLines = (chunks, margin, gots, constants, missGap = false, template) => {
		let alreadyGots = gots
		const lines = []
		const maybeBlocks = []
		const maybeGots = []
		const maybeSymms = []
		let prevForSymmId = []
		
		for (let i = 0; i < chunks.length; i++) {
			const chunk = chunks[i]
			if (missGap) missGap = false
			else lines.push(``)
			if (chunk.is(String)) {
				lines.push(`${margin}` + chunk)
				continue
			}
			
			// Update gots each time
			if (maybeBlocks.length > 0) alreadyGots = maybeGots.last
			else alreadyGots = gots
			
			//=======//
			// Maybe //
			//=======//
			let maybes = chunk.maybes
			if (maybes === undefined) maybes = []
			
			const oldId = maybeBlocks.last? maybeBlocks.last.id : undefined
			const newId = maybes.last? maybes.last.id : undefined
			
			const maybesLength = maybes.length
			const maybeBlocksLength = maybeBlocks.length
			
			// End Maybe
			if (maybesLength < maybeBlocksLength && oldId !== newId) {
				const afterMaybeGots = [...maybeGots.last]
				maybeBlocks.pop()
				maybeGots.pop()
				
				const tail = chunks.slice(i)
				for (const t in tail) {
					if (tail[t].forSymmId !== undefined) {
						if (tail[t].forSymmId === prevForSymmId.last) {
							tail[t] = {...tail[t], forSymmId: undefined}
						}
					}
				}
				
				const afterLines = makeChunksLines(tail, `${margin}`, afterMaybeGots, constants, true, template)
				lines.push(`${margin}// Continue rules after successful 'maybe'`)
				lines.push(...afterLines)
				lines.push(`${margin}return`)
				
				margin = margin.slice(0, -1)
				lines.push(`${margin}}`)
				lines.push(`${margin}`)
				lines.push(`${margin}// Continue rules after failing 'maybe'`)
				i--
				missGap = true
				continue
			}
			
			//=========//
			// End For //
			//=========//
			const nextForSymmId = chunk.forSymmId
			if (prevForSymmId.length !== 0 && nextForSymmId !== prevForSymmId.last) {
				prevForSymmId.pop()
				margin = margin.slice(0, -1)
				lines.push(`${margin}}`)
			}
			
			//================//
			// Pre-Loop Input //
			//================//
			//lines.push(...chunk.debug.source.split("\n").map(s => `${margin}// ${s}`))
			for (const needer of chunk.input.needers) {
				if (needer.need.preLoop) lines.push(...makeNeederLines(needer, `${margin}`, alreadyGots, true, constants, template))
			}
			
			//===========//
			// Start For //
			//===========//
			if (nextForSymmId !== undefined && prevForSymmId.last !== nextForSymmId) {
				const iName = `i${nextForSymmId}`
				if (!chunk.forSymmIsAll) lines.push(`${margin}const transNumsShuffledSymm${nextForSymmId} = transformationNumbersSymm${nextForSymmId}Const.shuffled`)
				lines.push(`${margin}for(let ${iName} = 0; ${iName} < ${chunk.forSymmTransCount}; ${iName}++) {`)
				lines.push(``)
				margin += `	`
				prevForSymmId.push(nextForSymmId)
			}
			
			// Start Maybe
			if (maybesLength > maybeBlocksLength) {
				const maybe = maybes.last
				maybeBlocks.push(maybe)
				maybeGots.push([...alreadyGots])
				lines.push(`${margin}// maybe(${maybes.last.chance})`)
				lines.push(`${margin}if (Math.random() < ${maybe.chance}) {`)
				lines.push(`${margin}`)
				margin += `	`
			}
			
			// Update gots after potentially changing block
			if (maybeBlocks.length > 0) alreadyGots = maybeGots.last
			else alreadyGots = gots
			
			//=======//
			// Input //
			//=======//
			lines.push(...chunk.debug.source.split("\n").map(s => `${margin}// ${s}`))
			for (const needer of chunk.input.needers) {
				if (!needer.need.preLoop) lines.push(...makeNeederLines(needer, `${margin}`, alreadyGots, true, constants, template))
			}
			
			//===========//
			// Condition //
			//===========//
			const conditionInnerCode = chunk.conditions.join(" && ")
			if (chunk.conditions.length === 0) lines.push(`${margin}{`)
			else lines.push(`${margin}if (${conditionInnerCode}) {`)
			
			//========//
			// Output //
			//========//
			const outputAlreadyGots = [...alreadyGots]
			for (const needer of chunk.output.needers) {
				lines.push(...makeNeederLines(needer, `${margin}	`, outputAlreadyGots, true, constants, template))
			}
			
			//=================//
			// Remaining Rules //
			//=================//
			if (chunk.isInAction) {
				const tail = chunks.slice(i+1).filter(c => {
					if (c.actionIds === undefined) return true
					if (c.actionIds.length === chunk.actionIds.length && c.actionIds.last !== chunk.actionIds.last) return true
					if ((c.actionIds.length > chunk.actionIds.length) && c.actionIds[chunk.actionIds.length-1] !== chunk.actionIds[chunk.actionIds.length-1]) return true
					if (c.actionIds.length < chunk.actionIds.length) return true
					return false
				})
				const afterLines = makeChunksLines(tail, `${margin}	`, outputAlreadyGots, constants, true, template)
				if (afterLines.length > 0) {
					lines.push(`${margin}	`)
					lines.push(`${margin}	// Continue rules after successful 'action'`)
				}
				lines.push(...afterLines)
			}
			
			//===================//
			// Remaining Actions //
			//===================//
			/*else {
				const tail = chunks.slice(i+1)
				const tailActions = tail.filter(chunk => chunk.isInAction)
				if (tailActions[0] !== undefined) {
					const afterLines = makeChunksLines(tailActions, `${margin}	`, outputAlreadyGots, constants, true, template)
					lines.push(`${margin}	`)
					lines.push(`${margin}	// Continue 'action's after matching a rule`)
					lines.push(...afterLines)
				}
			}*/
			
			lines.push(`${margin}	return`)
			lines.push(`${margin}}`)
		}
		
		//==========//
		// Tidy For //
		//==========//
		while (prevForSymmId.length !== 0) {
			prevForSymmId.pop()
			margin = margin.slice(0, -1)
			lines.push(`${margin}}`)
		}
			
		//============//
		// Tidy Maybe //
		//============//
		while (maybeBlocks.length > 0) {
			maybeBlocks.pop()
			margin = margin.slice(0, -1)
			lines.push(`${margin}}`)
		}
		
		return lines
	}
	
	const makeNeederLines = (needer, indent, alreadyGots, cache = true, constants, template) => {
		const lines = []
		const need = needer.need
		if (need.generateGet && !alreadyGots.includes(needer.name)) {
			// "I'll just add one more parameter to this function. This is the last one, I swear."
			// "I'll just add one more parameter to this function. This is the last one, I swear."
			// "I'll just add one more parameter to this function. This is the last one, I swear."
			// "I'll just add one more parameter to this function. This is the last one, I swear."
			// "I'll just add one more parameter to this function. This is the last one, I swear."
			// "I'll just add one more parameter to this function. This is the last one, I swear."
			// "I'll just add one more parameter to this function. This is the last one, I swear."
			// "I'll just add one more parameter to this function. This is the last one, I swear."
			// "I'll just add one more parameter to this function. This is the last one, I swear."
			// "I'll just add one more parameter to this function. This is the last one, I swear."
			// "I'll just add one more parameter to this function. This is the last one, I swear."
			const getCode = need.generateGet(needer.x, needer.y, needer.z, needer.symmetry, needer.symmetryId, needer.id, needer.argNames, needer.idResultName, needer.forSymmId, needer.char, template, needer.diagram, needer.isAll, needer.spotMods)
			if (getCode !== undefined) lines.push(`${indent}const ${needer.name} = ${getCode}`)
			if (cache) alreadyGots.push(needer.name)
		}
		if (need.generateConstant) {
			const constantCode = need.generateConstant(needer.x, needer.y, needer.z, needer.symmetry, needer.symmetryId, needer.id, needer.argNames, needer.idResultName, needer.forSymmId, needer.char, template, needer.diagram, needer.isAll, needer.spotMods)
			if (constantCode !== undefined) constants.pushUnique(`const ${needer.name}Const = ${constantCode}`)
		}
		if (need.generateExtra) {
			const extraCode = need.generateExtra(needer.x, needer.y, needer.z, needer.symmetry, needer.symmetryId, needer.id, needer.argNames, needer.idResultName, needer.forSymmId, needer.char, template, needer.diagram, needer.isAll, needer.spotMods)
			if (extraCode !== undefined) lines.push(`${indent}${extraCode}`)
		}
		return lines
	}
	
	//========//
	// Behave //
	//========//
	const makeBehaveCode = (instructions, name) => {
		INSTRUCTION.resetIdResultCache() //spent one whole hour hunting a bug because i forgot to reset the cache for each element. caches are evil
		INSTRUCTION.resetCharIdCache() //lol made another cache instead of doing it properly. im sure njothing will go wrong
		const template = JAVASCRIPT.makeEmptyTemplate()
		
		const blockStart = {type: INSTRUCTION.TYPE.NAKED}
		const blockEnd = {type: INSTRUCTION.TYPE.BLOCK_END}
		const fullInstructions = [blockStart, ...instructions, blockEnd]
	
		for (let i = 0; i < fullInstructions.length; i++) {
			const instruction = fullInstructions[i]
			const type = instruction.type
			const value = instruction.value
			const tail = fullInstructions.slice(i+1)
			const diagramId = `D${i}`
			const jumps = type.generate(template, value, tail, undefined, undefined, undefined, undefined, undefined, undefined, diagramId)
			if (jumps !== undefined) i += jumps
		}
		
		const code = buildTemplate(template)
		//if (name == "DReg") print(code)
		return code
	}
	
	const indentInnerCode = (code) => {
		const lines = code.split("\n")
		const indentedLines = lines.map((line, i) => (i == 0 || i >= lines.length-2)? line : `	${line}`)
		const indentedCode = indentedLines.join("\n")
		return indentedCode
	}
	
}




//==== Source/Parse.js ====//
;
{
	//=======//
	// Scope //
	//=======//
	const makeScope = (parent) => ({
		parent,
		elements: {},
		data: {},
		args: {},
		instructions: [],
		symbols: {_: undefined, o: undefined, d: undefined},
		properties: {},
		categories: [],
	})
	
	const absorbScope = (receiver, target, propsOnly = false, copySymbols = true) => {
		receiver.args.o= target.args
		receiver.data.o= target.data
		receiver.elements.o= target.elements
		receiver.global = target.global
		if (!propsOnly) receiver.instructions.push(...target.instructions)
		
		receiver.categories.push(...target.categories)
		receiver.properties.o= target.properties
		
		if (!copySymbols) return
		for (const symbolName in target.symbols) {
			if (target.symbols[symbolName] === undefined) continue
			if (receiver.symbols[symbolName] === undefined) {
				receiver.symbols[symbolName] = {}
			}
			receiver.symbols[symbolName].o= target.symbols[symbolName]
		}
	}
	
	const getSymbol = (name, scope, {parentOnly = false} = {}) => {
		if (!parentOnly && scope.symbols[name] != undefined) {
			return scope.symbols[name]
		}
		else if (scope.parent != undefined) {
			return getSymbol(name, scope.parent)
		}
	}
	
	const getElement = (name, scope) => {
		if (scope.elements[name] != undefined) {
			return scope.elements[name]
		}
		else if (scope.parent != undefined) {
			return getElement(name, scope.parent)
		}
	}
	
	//========//
	// Indent //
	//========//
	let indentBase = undefined
	let indentUnit = undefined
	let indentDepth = undefined
	
	const resetIndentInfo = () => {
		indentBase = undefined
		indentUnit = undefined
		indentDepth = 0
	}
	
	const getMargin = (depth) => {
		const margin = indentBase + [indentUnit].repeated(depth).join("")
		return margin
	}
	
	const getStringMarginLeft = (string) => {
		for (let i = 0; i < string.length; i++) {
			const char = string[i]
			if (char != " ") return i
		}
	}
	
	const getStringMarginRight = (string) => {
		return getStringMarginLeft(string.split("").reverse().join(""))
	}
	
	EAT.oneNonindent = (source, args) => EAT.nonindent(source, {...args, oneOnly: true})
	
	// Stay on the same indent level
	EAT.nonindent = (source, {oneOnly=false} = {}) => {
		
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success, snippet} = EAT.emptyLines(code)
		if (!success) return EAT.fail(code)
		
		const numberOfLines = snippet.split("\n").length - 1
		if (oneOnly == true && numberOfLines > 1) return EAT.fail(code)
		
		// NO BASE INDENT
		if (indentBase == undefined) {
			result = {code, snippet} = EAT.maybe(EAT.margin)(code)
			indentBase = snippet
			result.snippet = "\n"
			return result
		}
		
		// FULL CHECK
		else if (indentBase != undefined && indentUnit != undefined) {
			const expectedMargin = getMargin(indentDepth)
			result = {success, code, snippet} = EAT.string(expectedMargin)(code)
			if (success) {
				result.snippet = "\n"
				return result
			}
		}
		
		// PARTIAL CHECK
		else if (indentBase != undefined) {
			if (indentDepth == 0) {
				result = {success} = EAT.string(indentBase)(code)
				if (success) {
					result.snippet = "\n"
					return result
				}
			}
		}
		
		return EAT.fail(code)
		
	}
	
	// Go one indent level deeper
	EAT.indent = (source) => {
		
		indentDepth++
		
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success, snippet} = EAT.emptyLines(code)
		if (!success) {
			return EAT.fail(code)
		}
		
		// NO BASE INDENT
		if (indentBase == undefined) throw new Error(`[SpaceTode] The base indent level should have been discovered by now - something has gone wrong`)
		
		// GET INDENT UNIT
		else if (indentUnit == undefined) {
			result = {code, snippet} = EAT.maybe(EAT.margin)(code)
			if (snippet.slice(0, indentBase.length) != indentBase) return EAT.fail(code)
			const unit = snippet.slice(indentBase.length)
			if (unit.length == 0) return EAT.fail(code)
			indentUnit = unit
			if (indentBase.length > 0 && indentBase[0] != indentUnit[0]) return EAT.fail(code)
			return result
		}
		
		// CHECK INDENT
		const expectedMargin = getMargin(indentDepth)
		result = {code, snippet} = EAT.string(expectedMargin)(code)
		return result
		
	}
	
	// Go one indent level back
	EAT.unindent = (source) => {
	
		indentDepth--
		if (indentDepth < 0) throw new Error(`[SpaceTode] Can't reduce indent level below zero. This shouldn't happen.`)
		
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success, snippet} = EAT.emptyLines(code)
		if (!success) return EAT.fail(code)
		
		//result = {code, snippet} = EAT.maybe(EAT.margin)(code)
		
		if (indentBase == undefined) throw new Error(`[SpaceTode] The base indent level should have been discovered by now - something has gone wrong`)
		if (indentUnit == undefined) throw new Error(`[SpaceTode] The indent unit should have been discovered by now - something has gone wrong`)
		
		// CHECK INDENT
		const expectedMargin = getMargin(indentDepth)
		result = {code, snippet} = EAT.string(expectedMargin)(code)
		return result	
		
	}
	
	//=======//
	// Block //
	//=======//
	EAT.BLOCK_INLINE = Symbol("BlockInline")
	EAT.BLOCK_SINGLE = Symbol("BlockSingle")
	EAT.BLOCK_MULTI = Symbol("BlockMulti")
	
	EAT.block = (inner, noInline = false) => (source, ...args) => {
		
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code} = EAT.gap(code)
		result = {success} = EAT.string("{")(code)
		if (success) return EAT.blockBrace(inner)(code, ...args)
		else if (noInline) return EAT.fail(source)
		else return EAT.blockInline(inner)(code, ...args)
		
	}
	
	EAT.blockBrace = (inner) => (source, ...args) => {
		
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.string("{")(code)
		if (!success) return EAT.fail(code)
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.newline(code)
		if (!success) return EAT.blockSingle(inner)(source, ...args)
		else return EAT.blockMulti(inner)(source, ...args)
		
	}
	
	EAT.blockMulti = (inner) => (source, ...args) => {
	
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.string("{")(code)
		if (!success) return EAT.fail(code)
		
		result = {code, success} = inner(EAT.BLOCK_MULTI)(code, ...args)
		if (!success) return EAT.fail(code)
		const resultProperties = result
		
		result = {code, success} = EAT.string("}")(code)
		if (!success) return EAT.fail(code)
		
		return {...resultProperties, success: true, code: result.code}
	}
	
	EAT.blockSingle = (inner) => (source, ...args) => {
		
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.string("{")(code)
		if (!success) return EAT.fail(code)
		
		result = {code} = EAT.gap(code)
		result = {code, success} = inner(EAT.BLOCK_SINGLE)(code, ...args)
		if (!success) return EAT.fail(code)
		const resultProperties = result
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.string("}")(code)
		return {...resultProperties, ...result}
	}
	
	EAT.blockInline = (inner) => (source, ...args) => {
		
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code} = EAT.gap(code)
		result = {code, success} = inner(EAT.BLOCK_INLINE)(code, ...args)
		return result
		
	}
	
	//===========//
	// SpaceTode //
	//===========//
	function SpaceTode([source]) {
	
		resetIndentInfo()
	
		let result = undefined
		let success = undefined
		let code = source
		
		result = {code} = EAT.stripComments(code)
		
		// When SpaceTode is written at the top level, it is in its own scope.
		// It is then copied to the global scope.
		const scope = makeScope(SpaceTode.global)
		scope.global = true
		result = {success, code} = EAT.todeSplatMultiInner(code, scope)
		absorbScope(SpaceTode.global, scope)
		
		return scope
		
	}
	
	SpaceTode.global = makeScope()
	
	EAT.todeSplatBlock = (source, scope) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		const blockScope = makeScope(scope)
		result = {code, success} = EAT.block(EAT.todeSplat)(code, blockScope)
		if (!success) return EAT.fail(code)
		
		return {...result, blockScope}
		
	}
	
	EAT.todeSplat = (type) => (source, scope) => {
		
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		if (type == EAT.BLOCK_INLINE) {
			return EAT.maybe(EAT.todeSplatLine)(code, scope)
		}
		
		else if (type == EAT.BLOCK_SINGLE) {
			
			// bandage for inline javascript
			let lineResult = {snippet} = EAT.line(code)
			let edoc = snippet.split("").reverse().join("")
			lineResult = {code: edoc} = EAT.gap(edoc)
			lineResult = {code: edoc} = EAT.string("}")(edoc)
			code = edoc.split("").reverse().join("")
			const lineCode = code
			const nextCode = source.slice(lineCode.length)
			// bandage ends
			
			result = {code, success} = EAT.maybe(EAT.todeSplatLine)(code, scope)
			return {success, snippet: lineCode, code: nextCode}
		}
		
		else if (type == EAT.BLOCK_MULTI) {
		
			// EMPTY
			result = {success} = EAT.list (
				EAT.nonindent,
				EAT.string("}"),
			)(code)
			
			if (success) return EAT.nonindent(code)
			
			// NON-EMPTY
			return EAT.todeSplatMulti(code, scope)
		}
		
	}
	
	EAT.todeSplatMulti = (source, scope) => {
	
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.indent(code)
		if (!success) return EAT.fail(code)
		
		result = {code, success} = EAT.todeSplatMultiInner(code, scope)
		if (!success) return EAT.fail(code)
	
		result = {code, success} = EAT.unindent(code)
		if (!success) return EAT.fail(code)
		
		return result
		
	}
	
	EAT.todeSplatMultiInner = (source, scope) => {
	
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.todeSplatLine(code, scope)
		result = {code} = EAT.many (
			EAT.list (
				EAT.nonindent,
				EAT.todeSplatLine,
			)
		)(code, scope)
		
		return {success, code, snippet: result.snippet}
	}
	
	EAT.todeSplatLine = (source, scope, ignoreDiagram=false) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		// 'element' keyword
		result = {success} = EAT.string("element")(code)
		if (success) return EAT.element(code, scope)
		
		// 'prop'
		result = {success} = EAT.customProperty(code, scope)
		if (success) return result
		
		// 'data'
		result = {success} = EAT.data(code, scope)
		if (success) return result
		
		result = {success} = EAT.arg(code, scope)
		if (success) return result
		
		result = {success} = EAT.mimic(code, scope)
		if (success) return result
		
		// behave
		result = {success} = EAT.behave(code, scope)
		if (success) return result
		
		// 'colour', 'emissive', 'category', etc
		result = {success} = EAT.property(code, scope)
		if (success) return result
		
		// symbol part
		result = {success} = EAT.symbolPart(code, scope)
		if (success) return result
		
		// DIAGRAM SHENANIGENS BELOW
		if (ignoreDiagram) {
			const testResult = EAT.or(
				EAT.string("maybe"),
				EAT.string("action"),
				EAT.string("any"),
				EAT.string("for"),
				EAT.string("all"),
				EAT.string("pov"),
				EAT.string("rule"),
				EAT.string("{"),
			)(code)
			if (testResult.success) return testResult
			else return EAT.fail(code)
		}
		
		result = {success} = EAT.random(code, scope)
		if (success) return result
		
		result = {success} = EAT.action(code, scope)
		if (success) return result
		
		result = {success} = EAT.any(code, scope)
		if (success) return result
		
		result = {success} = EAT.for(code, scope)
		if (success) return result
		
		result = {success} = EAT.all(code, scope)
		if (success) return result
		
		result = {success} = EAT.pov(code, scope)
		if (success) return result
		
		// rule block
		const ruleBlockCode = code
		result = {success, code} = EAT.string("rule")(code)
		if (success) {
			result = {code} = EAT.gap(code)
			const blockScope = makeScope(scope)
			result = {code, success} = EAT.block(EAT.todeSplat)(code, blockScope)
			absorbScope(scope, blockScope)
			scope.instructions.push({type: INSTRUCTION.TYPE.NAKED})
			absorbScope(scope, blockScope, false, false)
			scope.instructions.push({type: INSTRUCTION.TYPE.BLOCK_END})
			return {...result, blockScope}
		}
		
		// naked block
		const blockScope = makeScope(scope)
		result = {code, success} = EAT.block(EAT.todeSplat, true)(code, blockScope)
		if (success) {
			scope.instructions.push({type: INSTRUCTION.TYPE.NAKED})
			absorbScope(scope, blockScope, false, false)
			scope.instructions.push({type: INSTRUCTION.TYPE.BLOCK_END})
			return {...result, blockScope}
		}
		
		// IF ALL ELSE FAILS
		// rule diagram!
		if (!ignoreDiagram) {
			result = {success} = EAT.diagram(code, scope)
			if (success) return result
		}
		
		return EAT.fail(code)
	}
	
	//=========//
	// Comment //
	//=========//
	// Has issues with Regex literals
	EAT.stripComments = (source) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		let codeStripped = ""
		
		let state = "normal"
		let stringEnder = undefined
		
		for (let i = 0; i < code.length; i++) {
			const char = code[i]
			if (state == "normal") {
				if (char == "/") {
					const nextChar = code[i+1]
					if (nextChar == "/") {
						state = "lineComment"
						i++
					}
					else if (nextChar == "*") {
						state = "blockComment"
						i++
					}
					else {
						codeStripped += char
					}
				}
				else if (char == '"') {
					codeStripped += char
					state = "string"
					stringEnder = '"'
				}
				else if (char == "'") {
					codeStripped += char
					state = "string"
					stringEnder = "'"
				}
				else if (char == "`") {
					throw new Error(`[SpaceTode] Template strings are not supported, sorry...`)
				}
				else {
					codeStripped += char
				}
			}
			else if (state == "blockComment") {
				if (char == "*") {
					const nextChar = code[i+1]
					if (nextChar == "/") {
						i++
						state = "normal"
					}
				}
			}
			else if (state == "lineComment") {
				if (char == "\n") {
					codeStripped += char
					state = "normal"
				}
			}
			else if (state == "string") {
				codeStripped += char
				if (char == "\\") {
					state = "stringEscape"
				}
				if (char == stringEnder) {
					state = "normal"
					stringEnder = undefined
				}
			}
			else if (state == "stringEscape") {
				codeStripped += char
				state = "string"
			}
			else {
				throw new Error (`[SpaceTode] Undeclared state while stripping comments: '${state}'`)
			}
		}
	
		return {result: success, code: codeStripped, snippet: source}
	}
	
	//=========//
	// Element //
	//=========//
	EAT.element = (source, parentScope) => {
		
		const scope = makeScope(parentScope)
		
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.string("element")(code)
		if (!success) throw new Error(`[SpaceTode] Expected 'element' keyword at start of element but got '${code[0]}'`)
		
		result = {code, success} = EAT.gap(code)
		if (!success) throw new Error(`[SpaceTode] Expected gap after 'element' keyword but got '${code[0]}'`)
		
		result = {code, success, snippet} = EAT.name(code)
		if (!success) throw new Error(`[SpaceTode] Expected element name but got '${code[0]}'`)
		scope.name = snippet
		
		//scope.instructions.push({type: INSTRUCTION.TYPE.BLOCK_START})
		const preBlockCode = code
		result = {code, success} = EAT.block(EAT.todeSplat)(code, scope)
		if (!success) throw new Error(`[SpaceTode] Expected element block but got something else:\n\n${code.split("\n").slice(0, 10).join("\n")}\n...\n`)
		
		//scope.instructions.push({type: INSTRUCTION.TYPE.BLOCK_END})
		
		snippet = source.slice(0, source.length - result.code.length)
		scope.properties.source = snippet
		
		const element = ELEMENT.make(scope, scope.properties)
		parentScope.elements[scope.name] = element
		
		if (parentScope.global == true) {
			if (window[scope.name] !== undefined) console.warn(`[SpaceTode] Overriding existing value with new element: '${scope.name}'`)
			window[scope.name] = element
		}
		
		return {success: true, snippet, code: result.code}
	}
	
	//========//
	// Symbol //
	//========//
	const SYMBOL_PART_NAMES = [
		"origin",
		"given",
		"change",
		"keep",
		"symbol",
		"select",
		"check",
	]
	
	EAT.symbolName = EAT.many(EAT.regex(/[^ 	\n]/))
	
	EAT.symbolPartReference = (source) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success, snippet} = EAT.name(code)
		if (!success) return EAT.fail(code)
		if (!SYMBOL_PART_NAMES.includes(snippet)) return EAT.fail(code)
		
		return result
	}
	
	EAT.symbolPart = (source, scope) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success, snippet} = EAT.symbolPartReference(code)
		const symbolPartName = snippet
		if (!success) return EAT.fail(code)
		
		result = {code} = EAT.gap(code)
		result = {code, success, snippet} = EAT.symbolName(code)
		const symbolName = snippet
		if (!success) return EAT.fail(code)
		
		const existingSymbol = getSymbol(symbolName, scope, {parentOnly: true})
		if (existingSymbol !== undefined) {
			throw new Error(`[SpaceTode] You can't define a symbol over multiple scopes: '${symbolName}'`)
		}
		
		const nojsResult = result
		
		result = {code} = EAT.gap(code)
		
		// TODO: before checking for javascript, check for:
		// (a) another symbol name to copy from
		//      note: what is copied should be different for symbol, input and output
		// (b) an element to base myself on - resultant code depends on what part it is
		
		// TODO: throw warning if you add javascript to a symbol part that doesn't use it
		// eg: origin, symbol
		result = {code, success, snippet, funcCode} = EAT.javascript(code, undefined, undefined, undefined, undefined, symbolPartName === "symbol")
		const javascript = funcCode
		
		if (scope.symbols[symbolName] == undefined) {
			scope.symbols[symbolName] = {}
			/*for (const symbolPartName of SYMBOL_PART_NAMES) {
				scope.symbols[symbolName][symbolPartName] = []
			}*/
		}
		const symbol = scope.symbols[symbolName]
		
		if (symbol.has(symbolPartName)) {
			throw new Error(`[SpaceTode] You can't define more than one '${symbolPartName}' on the '${symbolName}' symbol.`)
		}
		symbol[symbolPartName] = javascript		
		
		if (symbolPartName === "symbol") {
			symbol.given = `(element) => element === (${javascript})`
			symbol.change = `() => new (${javascript})()`
		}
		
		if (!success) return nojsResult
		else return result
	}
	
	EAT.behave = (source, scope) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.string("behave")(code)
		if (!success) return EAT.fail(code)
		
		result = {code} = EAT.gap(code)
		result = {code, success, snippet} = EAT.javascript(code, undefined, undefined, undefined, undefined, true)
		if (!success) return EAT.fail(code)
		scope.instructions.push({type: INSTRUCTION.TYPE.BEHAVE, value: result.funcCode})
		return result
	}
	
	//=============//
	// Declaration //
	//=============//
	const PROPERTY_NAMES = [
		"colour",
		"emissive",
		"opacity",
		"precise",
		"floor",
		"hidden",
		"category",
		"pour",
		"default",
		"visible",
	]
	
	EAT.propertyName = (source) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success, snippet} = EAT.name(code)
		if (!success) return EAT.fail(code)
		if (!PROPERTY_NAMES.includes(snippet)) return EAT.fail(code)
		
		return result
		
	}
	
	EAT.property = (source, scope) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success, snippet} = EAT.propertyName(code)
		const propertyName = snippet
		if (!success) return EAT.fail(code)
		const name = result.snippet
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.javascript(code)
		if (!success) return EAT.fail(code)
		
		if (propertyName == "category") {
			scope.categories.push(result.value)
		}
		else scope.properties[name] = result.value
		
		return result
	}
	
	EAT.data = (source, scope) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.string("data")(code)
		if (!success) return EAT.fail(code)
		
		result = {code, success} = EAT.gap(code)
		if (!success) return EAT.fail(code)
		
		result = {code, success, snippet} = EAT.name(code)
		if (!success) return EAT.fail(code)
		const name = result.snippet
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.javascript(code)
		//if (!success) return EAT.fail(code)
		
		scope.data[name] = result.value
		
		return {...result, success: true}
		
	}
	
	EAT.arg = (source, scope) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.string("arg")(code)
		if (!success) return EAT.fail(code)
		
		result = {code, success} = EAT.gap(code)
		if (!success) return EAT.fail(code)
		
		result = {code, success, snippet} = EAT.name(code)
		if (!success) return EAT.fail(code)
		const name = result.snippet
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.javascript(code)
		//if (!success) code 
		
		scope.args[name] = result.value
		
		return {...result, success: true}
		
	}
	
	EAT.customProperty = (source, scope) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.string("prop")(code)
		if (!success) return EAT.fail(code)
		
		result = {code, success} = EAT.gap(code)
		if (!success) return EAT.fail(code)
		
		result = {code, success, snippet} = EAT.name(code)
		if (!success) return EAT.fail(code)
		const name = result.snippet
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.javascript(code)
		if (!success) return EAT.fail(code)
		
		scope.properties[name] = result.value
		
		return result
		
	}
	
	//==========//
	// Function //
	//==========//
	EAT.mimic = (source, scope) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.string("mimic")(code)
		if (!success) return EAT.fail(code)
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.string("(")(code)
		if (!success) return EAT.fail(code)
		
		result = {code} = EAT.gap(code)
		result = {code, success, snippet} = EAT.javascriptArg(code, undefined, undefined, undefined, undefined, true)
		if (!success) return EAT.fail(code)
		
		scope.instructions.push({type: INSTRUCTION.TYPE.MIMIC, value: result.value})
		
		return result
		
	}
	
	EAT.random = (source, scope) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.string("maybe")(code)
		if (!success) return EAT.fail(code)
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.string("(")(code)
		if (!success) return EAT.fail(code)
		
		result = {code} = EAT.gap(code)
		result = {code, success, snippet} = EAT.javascriptArg(code)
		if (!success) return EAT.fail(code)
		
		const chance = result.value
		
		scope.instructions.push({type: INSTRUCTION.TYPE.MAYBE, value: result.value})
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.todeSplatBlock(code, scope)
		if (!success) return EAT.fail(code)
		
		absorbScope(scope, result.blockScope, false, false)
		//scope.instructions.push(...result.blockScope.instructions)
		scope.instructions.push({type: INSTRUCTION.TYPE.BLOCK_END})
		
		return result
		
	}
	
	EAT.pov = (source, scope) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.string("pov")(code)
		if (!success) return EAT.fail(code)
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.string("(")(code)
		if (!success) return EAT.fail(code)
		
		let jsHead = ``
		for (const povName in POV.TYPE) {
			jsHead += `const ${povName.as(LowerCase)} = POV.TYPE.${povName}\n`
		}
		
		result = {code} = EAT.gap(code)
		result = {code, success, snippet} = EAT.javascriptArg(code, jsHead)
		if (!success) return EAT.fail(code)
		
		const chance = result.value
		
		scope.instructions.push({type: INSTRUCTION.TYPE.POV, value: result.value})
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.todeSplatBlock(code, scope)
		if (!success) return EAT.fail(code)
		
		absorbScope(scope, result.blockScope, false, false)
		//scope.instructions.push(...result.blockScope.instructions)
		scope.instructions.push({type: INSTRUCTION.TYPE.BLOCK_END})
		
		return result
		
	}
	
	EAT.for = (source, scope) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.string("for")(code)
		if (!success) return EAT.fail(code)
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.string("(")(code)
		if (!success) return EAT.fail(code)
		
		let jsHead = ``
		for (const symmetryName in SYMMETRY.TYPE) {
			jsHead += `const ${symmetryName.as(LowerCase)} = SYMMETRY.TYPE.${symmetryName}\n`
		}
		
		result = {code} = EAT.gap(code)
		result = {code, success, snippet} = EAT.javascriptArg(code, jsHead)
		if (!success) return EAT.fail(code)
		
		const symm = result.value
		if (symm === undefined || symm.transformations === undefined) {
			throw new Error(`[SpaceTode] Unrecognised symmetry: '${snippet.slice(0, -1)}'`)
		}
		
		scope.instructions.push({type: INSTRUCTION.TYPE.FOR, value: result.value})
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.todeSplatBlock(code, scope)
		if (!success) return EAT.fail(code)
		
		absorbScope(scope, result.blockScope, false, false)
		/*scope.properties.o= result.blockScope.properties
		scope.instructions.push(...result.blockScope.instructions)*/
		scope.instructions.push({type: INSTRUCTION.TYPE.BLOCK_END})
		
		return result
		
	}
	
	EAT.all = (source, scope) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.string("all")(code)
		if (!success) return EAT.fail(code)
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.string("(")(code)
		if (!success) return EAT.fail(code)
		
		let jsHead = ``
		for (const symmetryName in SYMMETRY.TYPE) {
			jsHead += `const ${symmetryName.as(LowerCase)} = SYMMETRY.TYPE.${symmetryName}\n`
		}
		
		result = {code} = EAT.gap(code)
		result = {code, success, snippet} = EAT.javascriptArg(code, jsHead)
		if (!success) return EAT.fail(code)
		
		const symm = result.value
		if (symm === undefined || symm.transformations === undefined) {
			throw new Error(`[SpaceTode] Unrecognised symmetry: '${snippet.slice(0, -1)}'`)
		}
		
		scope.instructions.push({type: INSTRUCTION.TYPE.FOR, value: {...result.value, type: "all"}})
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.todeSplatBlock(code, scope)
		if (!success) return EAT.fail(code)
		
		absorbScope(scope, result.blockScope, false, false)
		/*scope.properties.o= result.blockScope.properties
		scope.instructions.push(...result.blockScope.instructions)*/
		scope.instructions.push({type: INSTRUCTION.TYPE.BLOCK_END})
		
		return result
		
	}
	
	EAT.any = (source, scope) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.string("any")(code)
		if (!success) return EAT.fail(code)
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.string("(")(code)
		if (!success) return EAT.fail(code)
		
		let jsHead = ``
		for (const symmetryName in SYMMETRY.TYPE) {
			jsHead += `const ${symmetryName.as(LowerCase)} = SYMMETRY.TYPE.${symmetryName}\n`
		}
		
		result = {code} = EAT.gap(code)
		result = {code, success, snippet} = EAT.javascriptArg(code, jsHead)
		if (!success) return EAT.fail(code)
		
		const symm = result.value
		if (symm === undefined || symm.transformations === undefined) {
			throw new Error(`[SpaceTode] Unrecognised symmetry: '${snippet.slice(0, -1)}'`)
		}
		
		scope.instructions.push({type: INSTRUCTION.TYPE.ANY, value: result.value})
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.todeSplatBlock(code, scope)
		if (!success) return EAT.fail(code)
		
		absorbScope(scope, result.blockScope, false, false)
		/*scope.properties.o= result.blockScope.properties
		scope.instructions.push(...result.blockScope.instructions)*/
		scope.instructions.push({type: INSTRUCTION.TYPE.BLOCK_END})
		
		return result
		
	}
	
	EAT.action = (source, scope) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.string("action")(code)
		if (!success) return EAT.fail(code)
		
		scope.instructions.push({type: INSTRUCTION.TYPE.ACTION})
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.todeSplatBlock(code, scope)
		if (!success) return EAT.fail(code)
		
		absorbScope(scope, result.blockScope, false, false)
		//scope.instructions.push(...result.blockScope.instructions)
		scope.instructions.push({type: INSTRUCTION.TYPE.BLOCK_END})
		
		return result
		
	}
	
	//=====//
	// Arg //
	//=====//
	EAT.javascriptArg = (source, head="", innerHead="", innerTail="", tail="", lazy=false) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		let innerCode = ""
		let state = "normal"
		let nestLevel = 1
		let stringEnder = undefined
		
		for (let i = 0; i < code.length; i++) {
			const char = code[i]
			
			if (state == "normal") {
				if (char == "(") {
					nestLevel++
				}
				else if (char == ")") {
					nestLevel--
					if (nestLevel <= 0) {
						state = "finished"
						break
					}
				}
				else if (char == '"') {
					state = "string"
					stringEnder = '"'
				}
				else if (char == "'") {
					state = "string"
					stringEnder = "'"
				}
				else if (char == "`") {
					throw new Error(`[SpaceTode] Template strings are not supported, sorry...`)
				}
				innerCode += char
			}
			
			else if (state == "string") {
				innerCode += char
				if (char == "\\") {
					state = "stringEscape"
				}
				if (char == stringEnder) {
					state = "normal"
					stringEnder = undefined
				}
			}
			
			else if (state == "stringEscape") {
				innerCode += char
				state = "string"
			}
		}
		
		if (state != "finished") return EAT.fail(code)
		
		result = {success} = EAT.javascript(innerCode, head, innerHead, innerTail, tail, lazy)
		if (!success) return EAT.fail(code)
		
		return {success, snippet: innerCode+")", code: source.slice(innerCode.length+1), value: result.value}
		
	}
	
	//=========//
	// Diagram //
	//=========//
	EAT.diagram = (source, scope, arrowOnly=false) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		const lines = code.split("\n")
		
		// CUTOUT DIAGRAM
		const diagram = []
		
		// reject empty starting line
		if (lines[0].is(WhiteSpace)) return EAT.fail(code)
		
		// reject non-arrow lines
		if (arrowOnly && !lines[0].includes("=>")) return EAT.fail(code)
		
		// scoop up first line
		const notes = {arrowFound: false, firstLine: true}
		result = {code, success, snippet} = EAT.diagramLine(code, notes)
		if (!success) return EAT.fail(code)
		diagram.push(snippet)
		
		// scoop up each line
		result = {code, success, snippet} = EAT.many (
			EAT.list (
				EAT.oneNonindent,
				EAT.diagramLine,
			)	
		)(code, notes)
		
		if (success) diagram.push(...snippet.split("\n").slice(1))
		
		// pad ends of diagram lines if they're too short
		const maxLength = Math.max(...diagram.map(line => line.length))
		for (const i in diagram) {
			const line = diagram[i]
			if (line.length < maxLength) {
				diagram[i] = line + [" "].repeated(maxLength - line.length).join("")
			}
		}
		
		// READ DIAGRAM
		// find arrow position
		let arrowX = undefined
		let arrowY = undefined
		for (let i = 0; i < diagram.length; i++) {
			const line = diagram[i]
			const arrowIndex = line.indexOf("=>")
			if (arrowIndex != -1) {
				arrowX = arrowIndex
				arrowY = i
				break
			}
		}
		
		if (arrowX == undefined) throw new Error(`[SpaceTode] Couldn't find arrow's x position.\n\nNOTE: I am trying to interpret a line of code as a diagram, but it is possible that you intended to write something else. The line in question is:\n\n${diagram[0]}\n`)
		if (arrowY == undefined) throw new Error(`[SpaceTode] Couldn't find arrow's y position. This shouldn't happen.`)
		
		// split into lhs and rhs
		let lhs = diagram.map(line => line.slice(0, arrowX))
		const mid = diagram.map(line => line.slice(arrowX, arrowX + "=>".length))
		let rhs = diagram.map(line => line.slice(arrowX + "=>".length))
		
		// reject if junk in middle
		for (let i = 0; i < mid.length; i++) {
			if (i == arrowY) continue
			const line = mid[i]
			if (!line.is(WhiteSpace)) throw new Error(`[SpaceTode] You can't have any symbols crossing over with a diagram's arrow.`)
		}
		
		// find the shortest margins of the diagram
		const lhsMarginLeft = Math.min(...lhs.map(getStringMarginLeft))
		const lhsMarginRight = Math.min(...lhs.map(getStringMarginRight))
		const rhsMarginLeft = Math.min(...rhs.map(getStringMarginLeft))
		const rhsMarginRight = Math.min(...rhs.map(getStringMarginRight))
		
		// trim each side down
		const lhsTrimmed = lhs.map(line => line.slice(lhsMarginLeft, line.length - lhsMarginRight))
		const rhsTrimmed = rhs.map(line => line.slice(rhsMarginLeft, line.length - rhsMarginRight))
		
		lhs = lhsTrimmed
		rhs = rhsTrimmed
		
		// check that the silhouettes of both sides are the same
		for (let i = 0; i < diagram.length; i++) {
		
			const lhsLine = lhs[i]
			const rhsLine = rhs[i]
			if (lhsLine.length != rhsLine.length) throw new Error(`[SpaceTode] Right-hand-side silhouette did not match left-hand-side silhouette.\n\nNOTE: I am trying to interpret a line of code as a diagram, but it is possible that you intended to write something else. The line in question is:\n\n${diagram[0]}\n`)
		
			for (let j = 0; j < lhs.length; j++) {
				if (lhs[i][j] == " " && rhs[i][j] != " ") throw new Error(`[SpaceTode] Right-hand-side silhouette did not match left-hand-side silhouette.`)
				if (rhs[i][j] == " " && lhs[i][j] != " ") throw new Error(`[SpaceTode] Right-hand-side silhouette did not match left-hand-side silhouette.`)
			}
		}
		
		// find origin
		let originX = undefined
		let originY = undefined
		if (lhs.length == 1 && lhs[0].trim().length == 1) {
			originX = 0
			originY = 0
		}
		else for (let i = 0; i < lhs.length; i++) {
			const line = lhs[i]
			for (let j = 0; j < line.length; j++) {
				const char = line[j]
				const symbol = getSymbol(char, scope)
				if (symbol && symbol.has("origin")) {
					if (originX != undefined) throw new Error(`[SpaceTode] You can't have more than one origin in the left-hand-side of a diagram.`)
					originX = j
					originY = i
				}
			}
		}
		
		if (originX == undefined) throw new Error(`[SpaceTode] Couldn't find origin in left-hand-side of diagram.\n\n${diagram.join("\n")}\n`)
		if (originY == undefined) throw new Error(`[SpaceTode] Couldn't find origin's y position. This shouldn't happen.`)
		
		// get positions of symbols
		const spaces = []
		for (let i = 0; i < lhs.length; i++) {
			const lhsLine = lhs[i]
			const rhsLine = rhs[i]
			for (let j = 0; j < lhsLine.length; j++) {
				const lhsChar = lhsLine[j]
				const rhsChar = rhsLine[j]
				
				if (lhsChar == " ") continue
				
				const x = j - originX
				const y = originY - i
				
				const input = getSymbol(lhsChar, scope)
				const output = getSymbol(rhsChar, scope)
				
				if (input == undefined) throw new Error(`[SpaceTode] Unrecognised symbol: ${lhsChar}`)
				if (output == undefined) throw new Error(`[SpaceTode] Unrecognised symbol: ${rhsChar}`)
				
				if (!input.has("origin") && !input.has("given") && !input.has("select") && !input.has("check")) {
					throw new Error(`[SpaceTode] Symbol '${lhsChar}' used on left-hand-side of diagram but doesn't have any left-hand-side parts, eg: given`)
				}
				
				if (!output.has("change") && !output.has("keep")) {
					throw new Error(`[SpaceTode] Symbol '${rhsChar}' used on right-hand-side of diagram but doesn't have any right-hand-side parts, eg: change`)
				}
				
				const space = {x, y, z:0, input, output, inputChar: lhsChar, outputChar: rhsChar}
				spaces.push(space)
			}
		}
		
		spaces.debug = {
			source: diagram.join("\n"),
		}
		
		const instruction = {type: INSTRUCTION.TYPE.DIAGRAM, value: spaces}
		scope.instructions.push(instruction)
		
		return {success: true, code: result.code, snippet: diagram.join("\n")}
		
	}
	
	EAT.diagramLine = (source, notes) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		const lines = code.split("\n")
		const line = lines[0]
		
		// reject if it's another todesplat line
		if (!notes.firstLine) {
			const dummyScope = makeScope()
			try {
				result = {success} = EAT.todeSplatLine(code, dummyScope, true)
				if (success) return EAT.fail(code)
			}
			catch {return EAT.fail(code)}
		}
		else notes.firstLine = false
		
		// reject tabs
		if (line.includes("	")) throw new Error(`[SpaceTode] You can't use tabs inside a diagram.\n\n${line}\n`)
		
		// find arrow
		if (line.includes("=>")) {
			if (!notes.arrowFound) notes.arrowFound = true
			else return EAT.fail(code)
		}
		
		return EAT.line(code)
		
	}
	
	//============//
	// Javascript //
	//============//
	EAT.javascript = (source, head="", innerHead="", innerTail="", tail="", lazy=false) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.block(EAT.javascriptInner)(code, head, innerHead, innerTail, tail, lazy)
		if (!success) return EAT.fail(code)
		
		return result
	}
	
	EAT.javascriptInner = (type) => (source, head="", innerHead="", innerTail="", tail="", lazy=false) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		if (type == EAT.BLOCK_INLINE) {
			return EAT.or (
				EAT.javascriptInlineMulti,
				EAT.javascriptInlineSingle,
			)(code, head, innerHead, innerTail, tail, lazy)
			
		}
		
		if (type == EAT.BLOCK_SINGLE) {
			result = {code, snippet, success} = EAT.many(EAT.regex(/[^}](?!\n)/))(code) //????
			if (!success) return EAT.fail(code)
			const funcCode = head + snippet + tail
			const func = new Function(funcCode)
			const value = lazy? func : func()
			result.value = value
			const niceFuncCode = `(() => {`+ funcCode + `})()`
			return {...result, snippet: funcCode, funcCode: niceFuncCode}
		}
		
		if (type == EAT.BLOCK_MULTI) {
			indentDepth++
			result = {code, snippet, success} = EAT.list (
				EAT.maybe(EAT.many(EAT.javascriptBraceLine)),
			)(code)
			let endResult = {code, success} = EAT.unindent(code)
			if (!success) return endResult
			const funcCode = head + snippet + tail
			const func = new Function(funcCode)
			const value = lazy? func : func()
			result.value = value
			const niceFuncCode = `(() => {`+ funcCode + `\n})()`
			return {...result, snippet: funcCode, funcCode: niceFuncCode, code}
		}
		
		return result
	}
	
	EAT.javascriptInlineSingle = (source, head="", innerHead="", innerTail="", tail="", lazy=false) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, snippet, success} = EAT.line(code)
		if (!success) return EAT.fail(code)
		const funcCode = head + "return " + innerHead + snippet + innerTail + tail
		const func = new Function(funcCode)
		const value = lazy? func : func()
		result.value = value
		const niceFuncCode = head + innerHead + snippet + innerTail + tail
		result.funcCode = niceFuncCode
		return result
	}
	
	EAT.javascriptInlineMulti = (source, head="", innerHead="", innerTail="", tail="", lazy=false) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		let js = ""
		result = {code, snippet, success} = EAT.line(code)
		if (!success) return EAT.fail(code)
		js += snippet
		
		result = {success} = EAT.indent(code)
		indentDepth--
		if (!success) {
			return EAT.fail(code)
		}
		
		indentDepth++
		result = {code, success, snippet} = EAT.many(EAT.javascriptInlineMultiLine)(code)
		js += snippet
		
		indentDepth--
		result = {code, success, snippet} = EAT.nonindent(code)
		if (!success) return EAT.fail(code)
		js += "\n"
		
		result = {code, success, snippet} = EAT.line(code)
		if (!success) return EAT.fail(code)
		js += snippet
		const funcCode = head + "return " + innerHead + js + innerTail + tail
		const func = new Function(funcCode)
		const value = lazy? func : func()
		result.value = value
		const niceFuncCode = head + innerHead + js + innerTail + tail
		result.funcCode = niceFuncCode
		
		return result
	}
	
	EAT.javascriptInlineMultiLine = (source) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {success} = EAT.nonindent(code)
		if (!success) return EAT.fail(code)
		
		result = {code, success} = EAT.newline(code)
		if (!success) return EAT.fail(code)
		
		result = {code, success} = EAT.line(code)
		if (!success) return EAT.fail(code)
		
		return {...result, snippet: "\n" + result.snippet}
	}
	
	EAT.javascriptBraceLine = (source) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.newline(code)
		
		const emptyResult = EAT.list (
			EAT.maybe(EAT.gap),
			EAT.newline,
			
		)(code)
		
		if (emptyResult.success) return {...emptyResult, code: "\n" + emptyResult.code}
		
		result = {code, success} = EAT.maybe(EAT.margin)(code)
		const actualMargin = result.snippet
		if (!success) return EAT.fail(code)
		
		const margin = getMargin(indentDepth)
		if (actualMargin.slice(0, margin.length) != margin) return EAT.fail(code)
		
		const marginDifference = actualMargin.length - margin.length
		const niceMargin = actualMargin.slice(0, marginDifference+1)
		
		result = {snippet} = EAT.line(code)
		result.snippet = "\n" + niceMargin + snippet
		
		return result

	}
	
}
