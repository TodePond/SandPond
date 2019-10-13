//===========//
// Constants //
//===========//
const urlParams = new URLSearchParams(window.location.search)

const SMALL_MODE = urlParams.has("small")
const D2_MODE = urlParams.has("2d")

const CAMERA_START_X = 0
const CAMERA_START_Y = SMALL_MODE? 85 : 150
const CAMERA_START_Z = SMALL_MODE? 100 : 225

const CAMERA_FOV = 35
const CAMERA_SPEED = 2

const MAX_X = (SMALL_MODE? 30 : 50) * (D2_MODE? 4 : 1)
const MAX_Z = MAX_X
const MAX_Y = D2_MODE? 0 : SMALL_MODE? 30 : 40

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
