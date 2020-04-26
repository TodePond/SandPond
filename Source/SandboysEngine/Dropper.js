//======//
// Drop //
//======//
const DROPPER = {}
let UIstarted = false
let DROPPER_LOCATION = "default"
let DROPPER_SHADOW = true

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
		//side: THREE.DoubleSide,
	})
	const dropperShadowGeometry = new THREE.BoxBufferGeometry(1 * ATOM_SIZE * ATOM_SCALE, 1 * ATOM_SIZE * ATOM_SCALE, 1 * ATOM_SIZE * ATOM_SCALE)
	const dropperShadow = new THREE.Mesh(dropperShadowGeometry, dropperShadowMaterial)
	
	const wideDropperShadowGeometry = new THREE.BoxBufferGeometry(3 * ATOM_SIZE * ATOM_SCALE, 1 * ATOM_SIZE * ATOM_SCALE, 3 * ATOM_SIZE * ATOM_SCALE)
	const wideDropperShadow = new THREE.Mesh(wideDropperShadowGeometry, dropperShadowMaterial)
	
	//========//
	// Public //
	//========//
	DROPPER.tryDrop = (position) => {
	
		if (!UIstarted && !Mouse.down) return
		if (UI.clicking) return
		
		if (position == undefined) {
			previousPosition = undefined
			dropperShadow.visible = false
			wideDropperShadow.visible = false
			return
		}
		
		position.x /= ATOM_SIZE
		position.y /= ATOM_SIZE
		position.z /= ATOM_SIZE
		
		if (DROPPER_SHADOW) {
			const x = Math.round(position.x)
			const y = Math.round(position.y)
			const z = Math.round(position.z)
			
			dropAtom(x, y, z, 0, true, UI.selectedElement.precise)
		}
		
		const previousDown = down
		down = Mouse.down
		
		if (!UI.selectedElement.pour) {
			if (!position) return
			if (down && !previousDown) {
				const x = Math.round(position.x)
				const y = Math.round(position.y)
				const z = Math.round(position.z)
				dropAtom(x, y, z)
				if (UI.selectedElement.precise) return
				if (Math.random() < SPREAD_CHANCE) dropAtom(x + 1, y, z)
				if (Math.random() < SPREAD_CHANCE) dropAtom(x - 1, y, z)
				if (Math.random() < SPREAD_CHANCE) dropAtom(x, y, z + 1)
				if (Math.random() < SPREAD_CHANCE) dropAtom(x, y, z - 1)
				
				if (Math.random() < SPREAD_CHANCE) dropAtom(x + 1, y, z + 1)
				if (Math.random() < SPREAD_CHANCE) dropAtom(x + 1, y, z - 1)
				if (Math.random() < SPREAD_CHANCE) dropAtom(x - 1, y, z + 1)
				if (Math.random() < SPREAD_CHANCE) dropAtom(x - 1, y, z - 1)
				//if (Math.random() < SPREAD_CHANCE) dropAtom(x, y + 1, z)
				//if (Math.random() < SPREAD_CHANCE) dropAtom(x, y - 1, z)
			}
			return 
		}
		
		if (!Mouse.down || !position) {
			previousPosition = undefined
			return
		}
		
		if (position.y < 0) position.y = 0
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
			if (UI.selectedElement.precise) continue
			if (Math.random() < SPREAD_CHANCE) dropAtom(xNew + 1, yNew, zNew)
			if (Math.random() < SPREAD_CHANCE) dropAtom(xNew - 1, yNew, zNew)
			if (Math.random() < SPREAD_CHANCE) dropAtom(xNew, yNew, zNew + 1)
			if (Math.random() < SPREAD_CHANCE) dropAtom(xNew, yNew, zNew - 1)
			
			if (Math.random() < SPREAD_CHANCE) dropAtom(xNew + 1, yNew, zNew + 1)
			if (Math.random() < SPREAD_CHANCE) dropAtom(xNew + 1, yNew, zNew - 1)
			if (Math.random() < SPREAD_CHANCE) dropAtom(xNew - 1, yNew, zNew + 1)
			if (Math.random() < SPREAD_CHANCE) dropAtom(xNew - 1, yNew, zNew - 1)
			//if (Math.random() < SPREAD_CHANCE) dropAtom(xNew, yNew + 1, zNew)
			//if (Math.random() < SPREAD_CHANCE) dropAtom(xNew, yNew - 1, zNew)
		}
		
		previousPosition = position
	}
	
	//=========//
	// Private //
	//=========//
	// This function is the messy result of adding one line of code every two weeks without much thought
	let dropperShadowReady = false
	let wideDropperShadowReady = false
	const dropAtom = (x, y, z, yOffset = 0, justShow = false, preciseShow = false) => {
		let alteredY = Math.min(y + MAX_Y - 5, MAX_Y - 5)
		let alteredZ = z
		if (!UI) return
		const atomType = UI.selectedElement
		
		if (DROPPER_LOCATION == "default" && atomType.floor) alteredY = 0 + yOffset
		if (DROPPER_LOCATION == "floor") alteredY = 0 + yOffset
		if (DROPPER_LOCATION == "air") y
		
		if (D2_MODE) alteredY = y
		if (D1_MODE) alteredY = 0
		if (D2_MODE) alteredZ = 0
		const space = WORLD.selectSpace(world, x, alteredY, alteredZ)
		if (!space) return
		if ((!D2_MODE && !D1_MODE) && space.atom.element != Empty) {
			if (atomType.floor && atomType != space.atom.element) return dropAtom(x, y, z, yOffset + 1, justShow)
		}
		if (!justShow) {
			const atom = new atomType()
			SPACE.setAtom(space, atom, atomType)
		}
		else if (preciseShow) {
			if (!dropperShadowReady) scene.add(dropperShadow)
			wideDropperShadow.visible = false
			dropperShadow.visible = true
			dropperShadow.position.set(x * ATOM_SIZE, alteredY * ATOM_SIZE, alteredZ * ATOM_SIZE)
			dropperShadow.material.emissive.set(atomType.emissive)
			dropperShadow.material.color.set(atomType.colour)
			dropperShadow.material.opacity = 0.35
		}
		else if (!preciseShow) {
			if (!wideDropperShadowReady) scene.add(wideDropperShadow)
			dropperShadow.visible = false
			wideDropperShadow.visible = true
			wideDropperShadow.position.set(x * ATOM_SIZE, (alteredY) * ATOM_SIZE, alteredZ * ATOM_SIZE)
			wideDropperShadow.material.emissive.set(atomType.emissive)
			wideDropperShadow.material.color.set(atomType.colour)
			wideDropperShadow.material.opacity = 0.35
		}
	}
	
}