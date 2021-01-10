//======//
// Drop //
//======//
const DROPPER = {}
let UIstarted = false
let DROPPER_LOCATION = "default"
let DROPPER_SHADOW = true
let MAX_DROPPER = 2
let MAX_SHADOW = 21

let DROPPER_POUR = "default"
let DROPPER_HEIGHT = 5

let DROPPER_ARGS_NEEDS_EVAL = false
let DROPPER_ARGS_SOURCE = ""
let DROPPER_ARGS = []

let DROPPER_OVERRIDE = true

{

	//===========//
	// Constants //
	//===========//
	const SPREAD_CHANCE = 1
	
	//=========//
	// Globals //
	//=========//
	let previousPosition
	let down
	
	const dropperShadowMaterial = new THREE.MeshLambertMaterial({
		transparent: true,
		opacity: 0.5,
		//flatShading: true,
		side: THREE.DoubleSide,
	})
	const dropperShadowGeometry = new THREE.BoxBufferGeometry(1 * ATOM_SIZE * ATOM_SCALE, 1 * ATOM_SIZE * ATOM_SCALE, 1 * ATOM_SIZE * ATOM_SCALE)
	const dropperShadow = []
	
	for (let i = 0; i < MAX_SHADOW*MAX_SHADOW; i++) {
		dropperShadow[i] = new THREE.Mesh(dropperShadowGeometry, dropperShadowMaterial)
	}
	
	DROPPER.refreshShadows = () => {
		const cutoff = MAX_DROPPER * 2 + 1
		for (let i = cutoff; i < MAX_SHADOW*MAX_SHADOW; i++) {
			dropperShadow[i].visible = false
		}
	}
	
	//========//
	// Public //
	//========//
	DROPPER.tryDrop = (position) => {
	
		if (!UIstarted && !Mouse.down && Touches.length == 0) return
		if (UI.clicking) return
		
		if (position == undefined) {
			previousPosition = undefined
			for (const shadow of dropperShadow) {
				shadow.visible = false
			}
			return
		}
		
		position.x /= ATOM_SIZE
		position.y /= ATOM_SIZE
		position.z /= ATOM_SIZE
		
		if (position.y < 0) position.y = 0
		
		if (DROPPER_SHADOW) {
			const x = Math.round(position.x)
			const y = Math.round(position.y)
			const z = Math.round(position.z)
			
			dropAtom(x, y, z, 0, true, 0)
			if (true || (DROPPER_POUR == "default" && UI.selectedElement.pour) || DROPPER_POUR == "pour") {
				let id = 1
				for (let i = -MAX_DROPPER; i <= MAX_DROPPER; i++) {
					for (let j = -MAX_DROPPER; j <= MAX_DROPPER; j++) {
						if (i == 0 && j == 0) continue
						dropAtom(x + i, y, z + j, 0, true, id)
						id++
					}
				}
				/*dropAtom(x + 1, y, z, 0, true, 1)
				dropAtom(x - 1, y, z, 0, true, 2)
				dropAtom(x, y, z + 1, 0, true, 3)
				dropAtom(x, y, z - 1, 0, true, 4)
				
				dropAtom(x + 1, y, z + 1, 0, true, 5)
				dropAtom(x + 1, y, z - 1, 0, true, 6)
				dropAtom(x - 1, y, z + 1, 0, true, 7)
				dropAtom(x - 1, y, z - 1, 0, true, 8)*/
			}
		}
		
		const previousDown = down
		down = Mouse.down
		if (Touches.length == 1) {
			down = true
		}
		
		if (!((DROPPER_POUR == "default" && UI.selectedElement.pour) || DROPPER_POUR == "pour")) {
			if (!position) return
			if (down && !previousDown) {
				const x = Math.round(position.x)
				const y = Math.round(position.y)
				const z = Math.round(position.z)
				dropAtom(x, y, z)
				//if (!UI.selectedElement.pour) return
				let id = 1
				for (let i = -MAX_DROPPER; i <= MAX_DROPPER; i++) {
					for (let j = -MAX_DROPPER; j <= MAX_DROPPER; j++) {
						if (i == 0 && j == 0) continue
						dropAtom(x + i, y, z + j)
						id++
					}
				}
				/*if (Math.random() < SPREAD_CHANCE) dropAtom(x + 1, y, z)
				if (Math.random() < SPREAD_CHANCE) dropAtom(x - 1, y, z)
				if (Math.random() < SPREAD_CHANCE) dropAtom(x, y, z + 1)
				if (Math.random() < SPREAD_CHANCE) dropAtom(x, y, z - 1)
				
				if (Math.random() < SPREAD_CHANCE) dropAtom(x + 1, y, z + 1)
				if (Math.random() < SPREAD_CHANCE) dropAtom(x + 1, y, z - 1)
				if (Math.random() < SPREAD_CHANCE) dropAtom(x - 1, y, z + 1)
				if (Math.random() < SPREAD_CHANCE) dropAtom(x - 1, y, z - 1)*/
				//if (Math.random() < SPREAD_CHANCE) dropAtom(x, y + 1, z)
				//if (Math.random() < SPREAD_CHANCE) dropAtom(x, y - 1, z)
			}
			return 
		}
		
		if (!down || !position) {
			previousPosition = undefined
			return
		}
		
		//if (position.y < 0) position.y = 0
		if (previousPosition == undefined) {
			previousPosition = position
			return
		}
		
		const xDiff = position.x - previousPosition.x
		const zDiff = position.z - previousPosition.z
		const yDiff = position.y - previousPosition.y
		
		/*if (xDiff == 0 && zDiff == 0 && yDiff == 0) {
		
			const xNew = Math.round(position.x)
			const yNew = Math.round(position.y)
			const zNew = Math.round(position.z)
		
			dropAtom(xNew, yNew, zNew)
			previousPosition = position
			return
		}*/
		
		const xAbs = Math.abs(xDiff)
		const zAbs = Math.abs(zDiff)
		const yAbs = Math.abs(yDiff)
		
		let largest = Math.max(xAbs, zAbs, yAbs)
		if (largest == 0) largest = 0.00001
		
		const xRatio = xAbs / largest
		const zRatio = zAbs / largest
		const yRatio = yAbs / largest
		
		const xWay = Math.sign(xDiff)
		const zWay = Math.sign(zDiff)
		const yWay = Math.sign(yDiff)
		
		const xInc = xWay * xRatio
		const zInc = zWay * zRatio
		const yInc = yWay * yRatio
		
		for (const i of largest) {
			
			const xNew = Math.round(position.x - xInc * i)
			const zNew = Math.round(position.z - zInc * i)
			const yNew = Math.round(position.y - yInc * i)
			
			if (Math.random() < 1) dropAtom(xNew, yNew, zNew)
			if (!((DROPPER_POUR == "default" && UI.selectedElement.pour) || DROPPER_POUR == "pour")) continue
			for (let i = -MAX_DROPPER; i <= MAX_DROPPER; i++) {
				for (let j = -MAX_DROPPER; j <= MAX_DROPPER; j++) {
					if (i == 0 && j == 0) continue
					dropAtom(xNew + i, yNew, zNew + j)
				}
			}
			/*if (Math.random() < SPREAD_CHANCE) dropAtom(xNew + 1, yNew, zNew)
			if (Math.random() < SPREAD_CHANCE) dropAtom(xNew - 1, yNew, zNew)
			if (Math.random() < SPREAD_CHANCE) dropAtom(xNew, yNew, zNew + 1)
			if (Math.random() < SPREAD_CHANCE) dropAtom(xNew, yNew, zNew - 1)
			
			if (Math.random() < SPREAD_CHANCE) dropAtom(xNew + 1, yNew, zNew + 1)
			if (Math.random() < SPREAD_CHANCE) dropAtom(xNew + 1, yNew, zNew - 1)
			if (Math.random() < SPREAD_CHANCE) dropAtom(xNew - 1, yNew, zNew + 1)
			if (Math.random() < SPREAD_CHANCE) dropAtom(xNew - 1, yNew, zNew - 1)*/
			//if (Math.random() < SPREAD_CHANCE) dropAtom(xNew, yNew + 1, zNew)
			//if (Math.random() < SPREAD_CHANCE) dropAtom(xNew, yNew - 1, zNew)
		}
		
		previousPosition = position
	}
	
	//=========//
	// Private //
	//=========//
	// This function is the messy result of adding one line of code every two weeks without much thought
	let dropperShadowReady = [false].repeated(9)
	const dropAtom = (x, y, z, yOffset = 0, justShow = false, shadowNumber = 0, yOverride = Math.floor(DROPPER_HEIGHT)) => {
		if (!UI) return
		const atomType = UI.selectedElement
		const dropStart = MAX_Y - yOverride
		let alteredY = dropStart + yOffset
		let alteredZ = z
		if (D2_MODE) alteredY = y
		if (D2_MODE) alteredZ = 0
		if (D1_MODE) alteredY = 0
		const space = WORLD.selectSpace(world, x, alteredY, alteredZ)
		if (space.atom.element == Void) {
			if (justShow) dropperShadow[shadowNumber].visible = false
			return
		}
		let override = atomType.override
		if (override === undefined) override = DROPPER_OVERRIDE
		if ((!D2_MODE && !D1_MODE && !override) && space.atom.element != Empty) {
			if (atomType != space.atom.element) return dropAtom(x, y, z, yOffset + 1, justShow, shadowNumber)
		}
		if (!justShow) {
			if (atomType === space.atom.element) return
			if (DROPPER_ARGS_NEEDS_EVAL) {
				DROPPER_ARGS = JS("[" + DROPPER_ARGS_SOURCE + "]")
				DROPPER_ARGS_NEEDS_EVAL = false
			}
			const atom = new atomType(...DROPPER_ARGS)
			SPACE.setAtom(space, atom, atomType)
		}
		else {
			if (!dropperShadowReady[shadowNumber]) {
				scene.add(dropperShadow[shadowNumber])
				dropperShadowReady[shadowNumber] = true
			}
			
			dropperShadow[shadowNumber].visible = true
			dropperShadow[shadowNumber].position.set(x * ATOM_SIZE, alteredY * ATOM_SIZE, alteredZ * ATOM_SIZE)
			dropperShadow[shadowNumber].material.emissive.set(atomType.emissive)
			dropperShadow[shadowNumber].material.color.set(atomType.colour)
			dropperShadow[shadowNumber].material.opacity = 0.35
		}
	}
	
}