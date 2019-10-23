TodeSplat`


element Ant {

	colour "grey"
	emissive "black"
	precise true
	
	input F ({space}) => space && space.atom && space.atom.type == Food
	output F ({space}) => setSpaceAtom(space, makeAtom(Food))
	
	
	rule 0.001 { @ => F }
	
	rule {
		@ => _
		_    @
	}
	
	rule xyz 0.02 { @F => @@ }
	rule xyz { @F => _@ }
	
	rule xz {
		 _ =>  @
		@.    _.
	}
	
}




`