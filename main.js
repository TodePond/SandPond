//===========//
// Constants //
//===========//
const CAMERA_START_X = 0
const CAMERA_START_Y = 150
const CAMERA_START_Z = 225

const CAMERA_FOV = 35
const CAMERA_SPEED = 2

const MAX_X = 50
const MAX_Z = MAX_X
const MAX_Y = 40

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

const TRANSPARENT_MATERIAL = new THREE.MeshBasicMaterial({visible: false})

//const SPACES_PER_TICK = 500000

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

stage.start()

//=============//
// World Setup //
//=============//
const world = new World(scene, SPACES_AREA)
const spaceCount = world.spaces.length.d

//=======//
// Stuff //
//=======//
on.process(o=> {
	orbit.update()
})

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
const fallRule = new Rule({y: true}, [
	{input: "@", output: "_"},
	{y: -1, input: "_", output: "@"},
])

const slideRule = new Rule({y: true}, [
	{input: "@", output: "_"},
	{y: -1, input: "s", output: "s"},
	{y: -1, x: 1, input: "_", output: "@"},
])

Sand = new AtomType({
	name: "Sand",
	colour: "#ffcc00",
	emissive: "#ffa34d",
	rules: [fallRule, slideRule],
	key: "S",
	state: "solid",
	scene,
})

const bombRule = new Rule({}, [
	{input: "@", output: "@"},
	{input: "_", output: "@", x: 1},
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
	{input: "@", output: "_"},
	{input: "#", output: "#", y: -1},
	{input: "_", output: "@", x: 1},
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
	{input: "@", output: "_"},
	{input: "_", output: "@", x: 1},
])

Floater = new AtomType({
	name: "Floater",
	colour: "pink",
	emissive: "deeppink",
	rules: [floatRule],
	key: "F",
	state: "solid",
	scene,
})

/*for (const z of MIN_Z.to(MAX_Z)) {
	for (const y of MIN_Y.to(MAX_Y)) {

		const atom1 = new Atom(ForkBomb)
		world.$Space(MIN_X, y, z).setAtom(atom1)
	}
}*/
