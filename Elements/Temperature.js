
const COLD = 0
const COOL = 1
const ROOM = 2
const WARM = 3
const HOT = 4

SpaceTode`

element Temperature {
	
	//============//
	// Init Cache //
	//============//
	given i (selfElement) => selfElement.statesCache === undefined
	keep i (selfElement) => {
		const cache = {...(selfElement.states? selfElement.states() : {})}
		const chancesCache = {}
		for (const tempKey in cache) {
			const temp = cache[tempKey]
			if (temp.is(Array)) {
				cache[tempKey] = temp[0]
				chancesCache[tempKey] = temp[1]
			}
		}
		selfElement.statesChancesCache = chancesCache
		selfElement.statesCache = cache
	}
	i => i
	
	//==============//
	// Change State //
	//==============//
	select s (element) => element
	keep s (space, selfElement, selected) => {
		const selfTargets = selfElement.statesCache
		if (selfTargets === undefined) return
		
		let otherTemp = selected.temperature
		if (otherTemp === undefined) otherTemp = ROOM
		
		const selfTarget = selfTargets[otherTemp]
		if (selfTarget === undefined) return
		
		const selfChances = selfElement.statesChancesCache
		const selfChance = selfChances[otherTemp]
		if (selfChance !== undefined && Math.random() > selfChance) return
		
		SPACE.setAtom(space, new selfTarget(), selfTarget)
	}
	
	action any(xyz.rotations) @s => s.
	
	given N (self, atom) => self !== atom
	N => .
}

`