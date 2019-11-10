TodeSplat`


element Ant {

	colour "grey"
	emissive "black"
	precise true
	pour false
	category "life"
	
	input F ({space}) => space && space.atom && space.atom.element == Food
	output F ({space}) => SPACE.setAtom(space, ATOM.make(Food))
	
	//rule 0.001 { @ => F }
	ruleset Faller
	rule xyz 0.02 { @F => @@ }
	rule xyz { @F => _@ }
	
	rule xz {
		 _ =>  @
		@.    _.
	}
	
}




`