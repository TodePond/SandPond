//======//
// Drop //
//======//
{

	const SPREAD_CHANCE = 0.5

	let previousPosition

	function dropAtomsMaybe(world, scene, position) {
	
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
			
			if (Math.random() < 1) dropAtom(world, xNew, yNew, zNew)
			if (Math.random() < SPREAD_CHANCE) dropAtom(world, xNew + 1, yNew, zNew)
			if (Math.random() < SPREAD_CHANCE) dropAtom(world, xNew - 1, yNew, zNew)
			if (Math.random() < SPREAD_CHANCE) dropAtom(world, xNew, yNew, zNew + 1)
			if (Math.random() < SPREAD_CHANCE) dropAtom(world, xNew, yNew, zNew - 1)
			if (Math.random() < SPREAD_CHANCE) dropAtom(world, xNew, yNew + 1, zNew)
			if (Math.random() < SPREAD_CHANCE) dropAtom(world, xNew, yNew - 1, zNew)
		}
		
		previousPosition = position
	}
	
	function dropAtom(world, x, y, z) {
		const alteredY = Math.min(y + MAX_Y - 5, MAX_Y - 5)
		const space = world.$Space(x, alteredY, z)
		if (!space) return
		if (space.atom) return
		const atom = new Atom($AtomType(selectedAtom))
		setSpaceAtom(world, space, atom)
		return atom
	}
	
}