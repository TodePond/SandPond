TodeSplat`

element Snow {

	colour "white"
	emissive "grey"
	
	category "sandbox"
	state "solid"
		
	input h extends # ({space}) => space.atom.element == Lava || space.atom.element == Fire
	output W ({space}) => SPACE.setAtom(space, ATOM.make(Water))
	
	rule 0.0005 { @ => W }
	rule xyz { @h => Wh }
	
	ruleset Powder
	
}




`