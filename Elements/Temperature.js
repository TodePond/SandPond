
const COLD = 0
const COOL = 1
const TEPID = 2
const WARM = 3
const HOT = 4

SpaceTode`

element Temperature {
	category "Rulesets"
	prop temperature HOT
	
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
	action i => i
	
	given c (element, selfElement) => {
		const cache = element.statesCache
		if (cache === undefined) return false
		const temp = selfElement.temperature
		if (cache[temp] === undefined) return false
		const chance = element.statesChancesCache[temp]
		if (chance !== undefined && Math.random() > chance) return false
		return true
	}
	select c (element) => element
	keep c (selected, space, selfElement) => {
		const cache = selfElement.statesCache
		const temp = selected.temperature
		const newElement = cache[temp]
		if (newElement === undefined) return
		const chance = selfElement.statesChancesCache[temp]
		if (chance !== undefined && Math.random() > chance) return
		SPACE.setAtom(space, new newElement(), newElement)
	}
	
	change h (element, selfElement) => new (element.statesCache[selfElement.temperature])()
	
	any(xyz.rotations) @c => ch
}

`