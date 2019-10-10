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
$("#loading").innerHTML = ""

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
			atomThink(space.atom, space)
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
