
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
	keep i (selfElement) => selfElement.statesCache = selfElement.states? selfElement.states() : {}
	action i => i
	
	given c (element, selfElement) => element.statesCache !== undefined && element.statesCache[selfElement.temperature] !== undefined
	select c (element) => element
	keep c (selected, space, selfElement) => {
		const newElement = selfElement.statesCache[selected.temperature]
		if (newElement === undefined) return
		SPACE.setAtom(space, new newElement(), newElement)
	}
	
	change h (element, selfElement) => new (element.statesCache[selfElement.temperature])()
	
	any(xyz.rotations) @c => ch
}

`