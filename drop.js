//======//
// Drop //
//======//
const Dropper = {}
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
	Dropper.tryDrop = (position) => {
	
		if (!started && !Mouse.down) return
		started = true
		
		const previousDown = down
		down = Mouse.down
		
		if (!UI.selectedElement.pour) {
			if (!position) return
			if (down && !previousDown) {
				dropAtom(Math.round(position.x), Math.round(position.y), Math.round(position.z))
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
		const atomType = UI.selectedElement
		if (atomType.floor || D1_MODE) alteredY = 0
		if (D2_MODE) alteredY = y
		if (D2_MODE) alteredZ = 0
		const space = Universe.selectSpace(universe, x, alteredY, alteredZ)
		if (!space) return
		if (space.atom) return
		const atom = makeAtom(atomType)
		Space.setAtom(space, atom)
		return atom
	}
	
}