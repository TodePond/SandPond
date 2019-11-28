TodeSplat`

element Lava {

	colour "red"
	emissive "darkred"
	category "sandbox"
	
	state "liquid"
	
	output F ({space}) => SPACE.setAtom(space, ATOM.make(Fire))
	
	action {
		_ => F
		@    @
	}
	
	ruleset Gloop
	
}

`