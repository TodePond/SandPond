//===========//
// Constants //
//===========//
const urlParams = new URLSearchParams(window.location.search)

const SMALL_MODE = urlParams.has("small")
const D2_MODE = urlParams.has("2d")
const D1_MODE = urlParams.has("1d")

const CAMERA_START_X = 0
const CAMERA_START_Y = SMALL_MODE? 85 : 150
const CAMERA_START_Z = SMALL_MODE? 100 : 225

const CAMERA_FOV = 35
const CAMERA_SPEED = 2

const MAX_X = (SMALL_MODE? 30 : 50) * (D1_MODE? 1.5 : 1) * (D2_MODE? 2 : 1)
const MAX_Z = D1_MODE? 0 : (D2_MODE? 0 : MAX_X)
const MAX_Y = D1_MODE? 0 : (SMALL_MODE? 30 : 40) * (D2_MODE? 3 : 1)

const MIN_X = -MAX_X
const MIN_Z = -MAX_Z
const MIN_Y = 0

const WORLD_WIDTH = MAX_X * 2 + 1
const WORLD_DEPTH = MAX_Z * 2 + 1
const WORLD_HEIGHT = MAX_Y

const WORLD_AREA = {
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

const sun = makeSun(D2_MODE)
scene.add(sun)

const floor = D2_MODE? make2DFloor(WORLD_WIDTH, WORLD_HEIGHT) : makeFloor(WORLD_WIDTH, WORLD_DEPTH)
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
const universe = Universe.make(WORLD_AREA)
const world = universe.world
const spaceCount = world.spaces.length

const MIN_SPACE = 0
const MAX_SPACE = spaceCount - 1

const spaces = shuffleArray(world.spaces)

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


function measureConcentration() {
	let atomCount = 0
	for (let i = 0; i < spaceCount; i++) {
		const space = world.spaces[i]
		if (space && space.atom) {
			atomCount++
		}
	}
	return atomCount / spaceCount
}