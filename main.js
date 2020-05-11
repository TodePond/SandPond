//=============//
// Stage Setup //
//=============//
const stage = new Stage(document.body, {start: false, shadow: SHADOW_MODE})
const {canvas, renderer, scene, camera, raycaster, cursor, dummyCamera} = stage
if (VR_MODE) {
	alert("Sorry VR mode is broken at the moment.")
	/*renderer.vr.enabled = true
	stage.vrEnabled = true
	document.body.appendChild(THREE.WEBVR.createButton(renderer))*/
	
	/*const gamepads = navigator.getGamepads()
	for (const gamepad of gamepads) {
		print(gamepad)
	}
	
	window.addEventListener("gamepadconnected", ()=> print("hi"))*/
	
}

//camera.position.set(0, 1.6, 0)
camera.position.set(CAMERA_START_X, CAMERA_START_Y, CAMERA_START_Z)
camera.lookAt(0, MAX_Y/2 * ATOM_SIZE, 0)

const background = makeBackground()
scene.background = background

const sun = makeSun(D2_MODE)
scene.add(sun)

const floor = D2_MODE? make2DFloor(FLOOR_TYPE, WORLD_WIDTH * ATOM_SIZE, WORLD_HEIGHT * ATOM_SIZE) : makeFloor(FLOOR_TYPE, WORLD_WIDTH * ATOM_SIZE, WORLD_DEPTH * ATOM_SIZE)
scene.add(floor)

let orbit = new THREE.OrbitControls(camera, document.body)
orbit.mouseButtons.LEFT = undefined
orbit.mouseButtons.MIDDLE = THREE.MOUSE.PAN
orbit.mouseButtons.RIGHT = THREE.MOUSE.ROTATE
orbit.touches.ONE = undefined
orbit.touches.TWO = THREE.TOUCH.ROTATE
orbit.enableKeys = false
orbit.enableDamping = true
orbit.screenSpacePanning = D2_MODE
orbit.panSpeed = 1.8
orbit.target.set(0, MAX_Y/2 * ATOM_SIZE, 0)
on.process(orbit.o.update)

stage.start()

//=============//
// World Setup //
//=============//
const world = WORLD.make(WORLD_AREA)
const spaceCount = world.spaces.length

const MIN_SPACE = 0
const MAX_SPACE = spaceCount - 1

const spaces = world.spaces
const spacesShuffled = world.spacesShuffled

let spaceIds = spaces.map(space => space.id).sort(() => Math.random() - 0.5)

let shuffleWorker = undefined
try {
	shuffleWorker = new WorkerProxy("Source/SandboysEngine/ShuffleWorker.js")
}
catch {
	if (RANDOM == "shuffle") {
		const warning = "ERROR: Shuffle worker mode was selected but I couldn't make a web worker...\nIf you see this error, please let @todepond know :)"
		alert(warning)
		console.error(warning)
	}
}

if (shuffleWorker != undefined && SHUFFLE_MODE) {
	shuffleWorker.onmessage = (({data}) => spaceIds = data)
	shuffleWorker.shuffle(spaceIds)
}

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
let shuffleCounter = 0

let currentTrack = true
	
if (SHUFFLE_MODE) {
	on.process(() => {
		if (paused) {
			if (stepCount <= 0) return
			stepCount--
		}
		for (let i = 0; i < spaceCount; i++) {
			const id = spaceIds[i]
			const space = spaces[id]
			const atom = space.atom
			const element = atom.element
			if (element != Empty) element.behave(atom, space)
		}
	})
}
else if (PURE_RANDOM_MODE) {
	on.process(() => {
		if (paused) {
			if (stepCount <= 0) return
			stepCount--
		}
		for (let i = 0; i < spaceCount; i++) {
			const space = spacesShuffled[i]
			const atom = space.atom
			const element = space.element
			if (element === Empty) continue
			element.behave(atom, space)
		}
		
	})
}
else {


	on.process(() => {
		if (paused === true) {
			if (stepCount <= 0) return
			stepCount--
		}

		for (let i = 0; i < spaceCount; i++) {
			const space = spaces[i]
			const atom = space.atom
			const element = space.element
			if (element === Empty) continue
			if (atom.track === currentTrack) continue
			atom.track = currentTrack
			element.behave(atom, space)
		}
		currentTrack = !currentTrack
		
		/*if (currentTrack === true) {
			for (const space of spaces) {
				const atom = space.atom
				const element = atom.element
				if (atom.element === Empty) continue
				if (atom.track === true) continue
				atom.track = true
				element.behave(atom, space)
			}
			currentTrack = false
		}
		else {
			for (const space of spaces) {
				const atom = space.atom
				const element = atom.element
				if (atom.element === Empty) continue
				if (atom.track === false) continue
				atom.track = false
				element.behave(atom, space)
			}
			currentTrack = true
		}*/
	})
}

function measureConcentration(filter = (atom => atom.element != Empty)) {
	let atomCount = 0
	for (let i = 0; i < spaceCount; i++) {
		const space = world.spaces[i]
		const atom = space.atom
		if (filter(atom)) atomCount++
	}
	return `${((atomCount / spaceCount) * 100).toFixed(2)}%`
}

function measureConcentrationForever(filter = (atom => atom.element != Empty)) {
	print(measureConcentration(filter))
	setTimeout(() => measureConcentrationForever(filter), 1000)
}
