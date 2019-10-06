//===========//
// Constants //
//===========//
const debugMode = false

CAMERA_START_X = 0
CAMERA_START_Y = 150
CAMERA_START_Z = 225

const CAMERA_FOV = 35
const CAMERA_SPEED = 2

MAX_X = 50
MAX_Z = MAX_X
MAX_Y = 40

if (debugMode) {
	MAX_X = 20
	MAX_Z = MAX_X
	MAX_Y = 20

	CAMERA_START_X = 0
	CAMERA_START_Y = 85
	CAMERA_START_Z = 100
}

const MIN_X = -MAX_X
const MIN_Z = -MAX_Z
const MIN_Y = 0

const WORLD_WIDTH = MAX_X * 2 + 1
const WORLD_DEPTH = MAX_Z * 2 + 1
const WORLD_HEIGHT = MAX_Y

const SPACES_AREA = {
	x: [MIN_X, MAX_X],
	y: [MIN_Y, MAX_Y],
	z: [MIN_Z, MAX_Z],
}

//=============//
// Stage Setup //
//=============//
const stage = new Stage(document.body, {start: false})
const {canvas, renderer, scene, camera, raycaster, cursor} = stage

camera.position.set(CAMERA_START_X, CAMERA_START_Y, CAMERA_START_Z)

const background = makeBackground()
scene.background = background

const sun = makeSun()
scene.add(sun)

const floor = makeFloor(WORLD_WIDTH, WORLD_DEPTH)
scene.add(floor)

const orbit = new THREE.OrbitControls(camera)
orbit.mouseButtons.LEFT = undefined
orbit.mouseButtons.MIDDLE = THREE.MOUSE.DOLLY
orbit.mouseButtons.RIGHT = THREE.MOUSE.ROTATE
orbit.enableKeys = true
orbit.enableDamping = true
on.process(orbit.o.update)

stage.start()

//=============//
// World Setup //
//=============//
const world = new World(scene, SPACES_AREA)
const spaceCount = world.spaces.length

//=======//
// Stuff //
//=======//
on.process(o=> {
	dropAtomsMaybe(world, scene, stage.cursor.position3D)
})

let currentSpaceId = 0
on.process(o=> {
	for (let i = 0; i < spaceCount; i++) {
		const space = world.spaces[i]
		if (space && space.atom) {
			space.atom.think()
		}
	}
})

let splatHidden = true
on.keydown(e => {
	if (e.key == " ") {
		if (splatHidden) {
			showSplat()
		}
		else {
			hideSplat()
		}
		splatHidden = !splatHidden
	}
	else if (e.key == "p") {
		paused = !paused
	}
})

//============//
// Atom Types //
//============//
const Input = {}
Input.this = makeInput("@", (space, atom) => space && space.atom && space.atom.type == atom.type)
Input.empty = makeInput("_", (space) => space && space.atom === undefined)
Input.any = makeInput(".", (space) => space)
Input.notEmpty = makeInput("#", (space) => space && space.atom)
Input.solid = makeInput("s", (space) => space && space.atom && space.atom.type.state == "solid")
Input.Water = makeInput("W", (space) => space && space.atom && space.atom.type == Water)

const Output = {}
Output.any = makeOutput(".", () => {})
Output.empty = makeOutput("_", (space) => setSpaceAtom(world, space, undefined))
Output.same = makeOutput("^", () => {})
Output.this = makeOutput("@", (space, atom) => {
	const newAtom = new Atom(atom.type)
	setSpaceAtom(world, space, newAtom)
})

const fallRule = new Rule({y: true}, [
	{input: Input.this, output: Output.empty},
	{y: -1, input: Input.empty, output: Output.this},
])

const slideRule = new Rule({y: true}, [
	{input: Input.this, output: Output.empty},
	{y: -1, input: Input.solid, output: Output.same},
	{y: -1, x: 1, input: Input.empty, output: Output.this},
])

/*Sand = new AtomType({
	name: "Sand",
	colour: "#ffcc00",
	emissive: "#ffa34d",
	rules: [fallRule, slideRule],
	key: "S",
	state: "solid",
	scene,
})*/

const bombRule = new Rule({}, [
	{input: Input.this, output: Output.same},
	{input: Input.empty, output: Output.this, x: 1},
])

ForkBomb = new AtomType({
	name: "ForkBomb",
	colour: "grey",
	emissive: "black",
	rules: [bombRule],
	key: "B",
	scene,
})

const spreadRule = new Rule({y: true}, [
	{input: Input.this, output: Output.empty},
	{input: Input.notEmpty, output: Output.same, y: -1},
	{input: Input.empty, output: Output.this, x: 1},
])

Water = new AtomType({
	name: "Water",
	colour: "lightblue",
	emissive: "blue",
	rules: [fallRule, spreadRule],
	key: "W",
	state: "liquid",
	scene,
	opacity: 1.0,
})

const floatRule = new Rule({}, [
	{input: Input.this, output: Output.empty},
	{input: Input.empty, output: Output.this, x: 1},
])

/*Floater = new AtomType({
	name: "Floater",
	colour: "pink",
	emissive: "deeppink",
	rules: [floatRule],
	key: "F",
	state: "solid",
	scene,
})*/

const fall2D = new Rule({y: true, x: true}, [
	{input: Input.this, output: Output.empty},
	{input: Input.empty, output: Output.this, x: -1},
])

const slide2D = new Rule({y: true, x: true}, [
	{input: Input.this, output: Output.empty},
	{input: Input.solid, output: Output.same, x: -1},
	{input: Input.empty, output: Output.this, x: -1, z: 1},
])
 
/*Sandboy2D = new AtomType({
	name: "Sandboy2D",
	colour: "darkorange",
	emissive: "brown",
	rules: [fall2D, slide2D],
	key: "C",
	state: "solid",
	scene,
	floor: true,
})*/

const spread2D = new Rule({y: true, x: true}, [
	{input: Input.this, output: Output.empty},
	{input: Input.notEmpty, output: Output.same, x: -1},
	{input: Input.empty, output: Output.this, z: 1},
])
 
/*Water2D = new AtomType({
	name: "Water2D",
	colour: "darkblue",
	emissive: "darkblue",
	rules: [fall2D, spread2D],
	key: "w",
	state: "solid",
	scene,
	floor: true,
})*/

const grow = new Rule({}, [
	{input: Input.this, output: Output.same},
	{input: Input.Water, output: Output.this, x: 1},
])

Plant = new AtomType({
	name: "Plant",
	colour: "green",
	emissive: "darkgreen",
	rules: [fallRule, grow],
	key: "P",
	state: "solid",
	scene,
})

Input.maybeEmpty = (chance) => makeInput("?", (space) => space && Math.random() < chance && space.atom == undefined)

const windDown = new Rule({x: true, y: true}, [
	{input: Input.this, output: Output.empty},
	{input: Input.maybeEmpty(0.3), output: Output.this, x: -1, y: -1}
])

const windSide = new Rule({x: true}, [
	{input: Input.this, output: Output.empty},
	{input: Input.maybeEmpty(0.2), output: Output.this, x: -1}
])

const windSlide = new Rule({x: true}, [
	{input: Input.this, output: Output.empty},
	{input: Input.solid, output: Output.same},
	{input: Input.maybeEmpty(0.1), output: Output.this, x: -1, z: 1}
])

Dust = new AtomType({
	name: "Dust",
	colour: "tan",
	emissive: "sienna",
	rules: [windDown, windSide, windSlide, fallRule, slideRule],
	key: "L",
	state: "solid",
	scene,
})

Res = new AtomType({
	name: "Res",
	colour: "slategrey",
	emissive: "grey",
	rules: [floatRule],
	key: "R",
	scene,
	opacity: 0.35
})

Output.create = (atomType) => makeOutput(atomType.key, (space) => {
	const newAtom = new Atom(atomType)
	setSpaceAtom(world, space, newAtom)
})

Output.createDReg = makeOutput("D", (space) => {
	const newAtom = new Atom(DReg)
	setSpaceAtom(world, space, newAtom)
})

Input.maybeThis = (chance) => makeInput("@", (space, atom) => {
	return space && space.atom && space.atom.type == atom.type && Math.random() < chance
})

spawnRes = new Rule({}, [
	{input: Input.maybeThis(0.01), output: Output.create(Res)},
	{input: Input.empty, output: Output.this, x: 1}
])

spawnDReg = new Rule({}, [
	{input: Input.maybeThis(0.001), output: Output.createDReg},
	{input: Input.empty, output: Output.this, x: 1}
])

deleteSite = new Rule({}, [
	{input: Input.maybeThis(1), output: Output.empty},
	{input: Input.any, output: Output.this, x: 1},
])

DReg = new AtomType({
	name: "DReg",
	colour: "brown",
	emissive: "brown",
	rules: [spawnRes, spawnDReg, deleteSite, floatRule],
	key: "D",
	scene,
	precise: true,
	opacity: 0.35,
})

/*for (const z of MIN_Z.to(MAX_Z)) {
	for (const y of MIN_Y.to(MAX_Y)) {
		for (const x of MIN_X.to(MAX_X)) {
			const atom = new Atom(ForkBomb)
			const space = world.$Space(x, y, z)
			setSpaceAtom(world, space, atom)
		}
	}
}*/
