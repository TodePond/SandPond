//=============//
// Stage Setup //
//=============//
const stage = new Stage(document.body, {start: false, shadow: SHADOW_MODE, postProcess: DOF_MODE})
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
//scene.background = background

const sun = makeSun(D2_MODE)
scene.add(sun)

const floor = D2_MODE? make2DFloor(FLOOR_TYPE, WORLD_WIDTH * ATOM_SIZE, WORLD_HEIGHT * ATOM_SIZE) : makeFloor(FLOOR_TYPE, WORLD_WIDTH * ATOM_SIZE, WORLD_DEPTH * ATOM_SIZE)
scene.add(floor)

createScreen()

let bokehPass = undefined
if (DOF_MODE) {
	bokehPass = new THREE.BokehPass(scene, camera, {
		maxblur: 0.009,
		//focus: 1.1,
		aperture: 0.02,
	})
	stage.composer.addPass(bokehPass)
}

let orbit = new THREE.OrbitControls(camera, document.body)
orbit.mouseButtons.LEFT = undefined
orbit.mouseButtons.MIDDLE = THREE.MOUSE.PAN
orbit.mouseButtons.RIGHT = THREE.MOUSE.ROTATE
orbit.touches.ONE = undefined
orbit.touches.TWO = THREE.TOUCH.DOLLY_ROTATE
orbit.enableKeys = false
orbit.enableDamping = true
orbit.screenSpacePanning = D2_MODE
orbit.panSpeed = 1.8
orbit.target.set(0, MAX_Y/2 * ATOM_SIZE, 0)
on.process(() => {
	orbit.update()
	//screen.position.set(-camera.position.x, 0, -camera.position.z)
	//screen.lookAt(camera)
	//screen.rotateY(Math.PI/2)
	//screen.rotateX(Math.PI/2)
})

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
	shuffleWorker = new WorkerProxy("Source/ShuffleWorker.js")
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
let listenToMouse = 1
on.touchstart(() => listenToMouse = -1)
on.touchend(() => listenToMouse = -1)
on.touchcancel(() => listenToMouse = -1)
on.mousedown(() => {
	if (listenToMouse == -1) listenToMouse = 0
	else if (listenToMouse == 0) listenToMouse = 1
})
const middleOfWorld = new THREE.Vector3(0, 0, 0)
on.process(() => {
	const touchPosition3D = stage.getTouchPosition3D(0, (mesh) => mesh == floor)
	if (touchPosition3D != undefined) {
		DROPPER.tryDrop(touchPosition3D)
	}
	else if (listenToMouse >= 1) {
		const cursorIntersection = stage.getCursorIntersect((mesh) => mesh == floor)
		const cursorPosition3D = cursorIntersection? cursorIntersection.point : undefined
		DROPPER.tryDrop(cursorPosition3D)
		if (DOF_MODE === true) {
		
			const cameraDist = camera.position.distanceTo(middleOfWorld)
			//bokehPass.uniforms.aperture.value = (1 / cameraDist * 0.05)
			
			if (cursorPosition3D !== undefined) {
			
				const x = Math.round(cursorPosition3D.x)
				const y = Math.round(cursorPosition3D.y)
				const z = Math.round(cursorPosition3D.z)
				
				let space = WORLD.selectSpace(world, x, y, z)
				let i = 0
				while (space.element !== Empty && space.element !== Void) {
					space = WORLD.selectSpace(world, x, (y + i), z)
					i++
				}
				const focusPoint = new THREE.Vector3(x * ATOM_SIZE, (y + i) * ATOM_SIZE, z * ATOM_SIZE)
				
				const dist = cursorIntersection.distance
				//const dist = cursorIntersection.distance + (cursorIntersection.distance - camera.position.distanceTo(focusPoint))
				bokehPass.uniforms.focus.value = dist
				
				//bokehPass.uniforms.aperture.value = 1 / dist * 0.025
				//bokehPass.uniforms.maxblur.value = 5
			}
		}
	}
	else {
		DROPPER.tryDrop(undefined)
	}
})

function getHeightAtPosition(position) {
	print(position)
}

let paused = false
let stepCount = 0
let shuffleCounter = 0

let currentTrack = true
	
if (SHUFFLE_MODE) {
	let time = 0
	on.process(() => {
		if (paused) {
			if (stepCount <= 0) return
			stepCount--
		}
		for (let i = 0; i < spaceCount; i++) {
			const id = spaceIds[i]
			const space = spaces[id]
			const element = space.element
			if (element === Empty) continue
			element.behave(space, element, time)
		}
		time++
	})
}
else if (PURE_RANDOM_MODE) {
	let time = 0
	on.process(() => {
		if (paused) {
			if (stepCount <= 0) return
			stepCount--
		}
		for (let i = 0; i < spaceCount; i++) {
			const space = spacesShuffled[i]
			const element = space.element
			if (element === Empty) continue
			element.behave(space, element, time)
		}
		time++		
	})
}
else {

	let time = 0
	on.process(() => {
		if (paused === true) {
			if (stepCount <= 0) return
			stepCount--
		}

		for (let i = 0; i < spaceCount; i++) {
			const space = spaces[i]
			const element = space.element
			if (element === Empty) continue
			const atom = space.atom
			if (atom.track === currentTrack) continue
			atom.track = currentTrack
			element.behave(space, element, time, atom)
		}
		currentTrack = !currentTrack
		time++
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

