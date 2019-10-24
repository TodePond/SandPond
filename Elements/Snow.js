TodeSplat`


element Snow {

	colour "white"
	emissive "grey"
	
	state "solid"
	
	input l ({space, args}) => {
		if (!space) return false
		if (!space.atom) return true
		if (space.atom.type.state != "liquid") return false
		return args.swap = space.atom
	}
	
	input h ({space}) => {
		if (!space || !space.atom) return false
		if (space.atom.type == Lava || space.atom.type == Fire) return true
		return false
	}
	
	output l ({space, swap}) => Space.setAtom(space, swap)
	output W ({space}) => Space.setAtom(space, makeAtom(Water))
	
	rule 0.0005 { @ => W }
	rule xyz { @h => Wh }
	
	rule {
		@ => l
		l    @
	}
	
	rule xz {
		@  => l
		#l    #@
	}
	
}




`