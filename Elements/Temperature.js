
const COLD = 0
const COOL = 1
const ROOM = 2
const WARM = 3
const HOT = 4

SpaceTode`

element Temperature {
	category "Rulesets"
	
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
		/*if (cache[selfElement.temperature] !== undefined) {
			selfElement.stateSelfCache = cache[selfElement.temperature]
			selfElement.stateSelfChanceCache = chancesCache[selfElement.temperature]
		}*/
	}
	i => i
	
/*	//======//
	// Self //
	//======//
	origin s
	given s (selfElement) => {
		const cache = selfElement.stateSelfCache
		if (cache === undefined) return false
		const chance = selfElement.stateSelfChanceCache
		if (chance !== undefined && Math.random() > chance) return false
		return true
	}
	change s (selfElement) => new selfElement.stateSelfCache()
	s => s*/
	
	//=======//
	// Other //
	//=======//
	// change self
	
	/*select c (element) => element
	keep c (selected, space, selfElement) => {
	
	
		const cache = selfElement.statesCache
		let temp = selected.temperature
		if (temp === undefined) temp = ROOM
		if (cache[temp] === undefined) return false
		const chance = element.statesChancesCache[temp]
		if (chance !== undefined && Math.random() > chance) return false
		return true
	
		const cache = selfElement.statesCache
		let temp = selected.temperature
		if (temp === undefined) temp = ROOM
		const newElement = cache[temp]
		if (newElement === undefined) return
		const chance = selfElement.statesChancesCache[temp]
		if (chance !== undefined && Math.random() > chance) return
		SPACE.setAtom(space, new newElement(), newElement)
	}
	
	// change other
	keep h
	//change h (element, selfElement) => new (element.statesCache[selfElement.temperature])()
	*/
	
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
}

`