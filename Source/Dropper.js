//======//
// Drop //
//======//
const DROPPER = {}
{

	//===========//
	// Constants //
	//===========//
	const SPREAD_CHANCE = 0.5
	
	//=========//
	// Globals //
	//=========//
	let previousPosition
	let down
	let started = false
	
	//========//
	// Public //
	//========//
	DROPPER.tryDrop = (position) => {
	
		if (!started && !Mouse.down) return
		if (UI.clicking) return
		started = true
		
		if (position == undefined) return
		position.x /= ATOM_SIZE
		position.y /= ATOM_SIZE
		position.z /= ATOM_SIZE
		
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
				if (Math.random() < SPREAD_CHANCE) dropAtom(x, y + 1, z)
				if (Math.random() < SPREAD_CHANCE) dropAtom(x, y - 1, z)
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
			if (Math.random() < SPREAD_CHANCE) dropAtom(xNew, yNew + 1, zNew)
			if (Math.random() < SPREAD_CHANCE) dropAtom(xNew, yNew - 1, zNew)
		}
		
		previousPosition = position
	}
	
	//=========//
	// Private //
	//=========//
	const dropAtom = (x, y, z) => {
		let alteredY = Math.min(y + MAX_Y - 5, MAX_Y - 5)
		let alteredZ = z
		if (!UI) return
		const atomType = UI.selectedElement
		if (atomType.floor || D1_MODE) alteredY = 0
		if (D2_MODE) alteredY = y
		if (D2_MODE) alteredZ = 0
		const world = UNIVERSE.selectWorld(universe, x, alteredY, alteredZ)
		const space = WORLD.selectSpace(world, x, alteredY, alteredZ)
		if (!space) return
		//if (space.atom) return
		const atom = new atomType()
		SPACE.setAtom(space, atom)
		return atom
	}
	
}