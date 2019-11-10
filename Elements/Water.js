TodeSplat`

element Water {

	colour "lightblue"
	emissive "blue"
	category "sandbox"
	opacity 0.4
	state "liquid"
	
	output S ({space}) => SPACE.setAtom(space, ATOM.make(Steam))
	input h ({space}) => {
		if (!space || !space.atom) return false
		if (space.atom.element == Lava || space.atom.element == Fire) return true
		return false
	}
	
	rule xyz { @h => Sh }
	
	ruleset Liquid
	
}

`