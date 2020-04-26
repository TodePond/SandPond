//===========//
// Constants //
//===========//
const urlParams = new URLSearchParams(window.location.search)

const SMALL_MODE = urlParams.has("small") || !urlParams.has("big")
const D2_MODE = urlParams.has("2d")
const D1_MODE = urlParams.has("1d")
const VR_MODE = urlParams.has("vr")
const TINY_MODE = urlParams.has("tiny")
const LONG_MODE = urlParams.has("long")

const FLOOR_TYPE = urlParams.has("nofloor")? "nofloor" : "floor"

let MAX_X = (SMALL_MODE? 30 : 50) * (D1_MODE? 2 : 1) * (D2_MODE? 5 : 1)
let MAX_Z = D1_MODE? 0 : (D2_MODE? 0 : MAX_X)
let MAX_Y = D1_MODE? 0 : (SMALL_MODE? 30 : 40) * (D2_MODE? 8 : 1)

if (TINY_MODE) {
	MAX_X = Math.floor(MAX_X * 0.4)
	MAX_Z = Math.floor(MAX_Z * 0.4)
	MAX_Y = Math.floor(MAX_Y * 0.7)
}

if (LONG_MODE) {
	MAX_X = Math.floor(MAX_X * 1.3)
	MAX_Z = Math.floor(MAX_Z * 1)
	MAX_Y = Math.floor(MAX_Y * 0.75)
}

let SIZE = SMALL_MODE? "small" : "big"
if (TINY_MODE) SIZE = "tiny"

const SHAPE = LONG_MODE? "long" : "cube"

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

const CAMERA_START_X = 0
let CAMERA_START_Y = (D2_MODE? WORLD_HEIGHT/2 : SMALL_MODE? 85 : 150) * ATOM_SIZE
let CAMERA_START_Z = (SMALL_MODE? 100 : 225) * (D2_MODE? 2 : 1) * ATOM_SIZE

if (TINY_MODE) {
	CAMERA_START_Y = CAMERA_START_Y * 0.65
	CAMERA_START_Z = CAMERA_START_Z * 0.7
}

const CAMERA_SPEED = 2

//=============//
// Stage Setup //
//=============//
const stage = new Stage(document.body, {start: false})
const {canvas, renderer, scene, camera, raycaster, cursor, dummyCamera} = stage
if (VR_MODE) {
	renderer.vr.enabled = true
	stage.vrEnabled = true
	document.body.appendChild(THREE.WEBVR.createButton(renderer))
	
	/*const gamepads = navigator.getGamepads()
	for (const gamepad of gamepads) {
		print(gamepad)
	}
	
	window.addEventListener("gamepadconnected", ()=> print("hi"))*/
	
}

//camera.position.set(0, 1.6, 0)
camera.position.set(CAMERA_START_X, CAMERA_START_Y, CAMERA_START_Z)
camera.lookAt(0, MAX_Y/2 * ATOM_SIZE, 0)
dummyCamera.lookAt(0, 0, 0)

const background = makeBackground()
scene.background = background

const sun = makeSun(D2_MODE)
scene.add(sun)

const floor = D2_MODE? make2DFloor(FLOOR_TYPE, WORLD_WIDTH * ATOM_SIZE, WORLD_HEIGHT * ATOM_SIZE) : makeFloor(FLOOR_TYPE, WORLD_WIDTH * ATOM_SIZE, WORLD_DEPTH * ATOM_SIZE)
scene.add(floor)

let orbit
if (!VR_MODE) {
	orbit = new THREE.OrbitControls(camera)
	orbit.mouseButtons.LEFT = undefined
	orbit.mouseButtons.MIDDLE = THREE.MOUSE.DOLLY
	orbit.mouseButtons.RIGHT = THREE.MOUSE.ROTATE
	orbit.enableKeys = false
	orbit.enableDamping = true
	orbit.target.set(0, MAX_Y/2 * ATOM_SIZE, 0)
	on.process(orbit.o.update)
}

stage.start()

//=============//
// World Setup //
//=============//
const world = WORLD.make(WORLD_AREA)
const spaceCount = world.spaces.length

const MIN_SPACE = 0
const MAX_SPACE = spaceCount - 1

const spaces = shuffleArray(world.spaces)

$("#loading").innerHTML = ""

//=======//
// Stuff //
//=======//
on.process(() => {
	const cursorPosition3D = stage.getCursorPosition3D((mesh) => mesh == floor)
	DROPPER.tryDrop(cursorPosition3D)
})

let paused = false
let stepCount = 0
on.process(() => {
	if (paused) {
		if (stepCount <= 0) return
		stepCount--
	}
	for (let i = 0; i < spaceCount; i++) {
		const space = world.spaces[i]
		const atom = space.atom
		const element = atom.element
		if (element != Empty) element.behave(atom, space)
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

//print(Sand.code)
