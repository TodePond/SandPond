TodeSplat`

element Powder {

	state "solid"
	
	input l extends . ({space, args}) => {
		if (!space.atom) return true
		if (space.atom.element.state != "liquid") return false
		return args.swap = space.atom
	}
	
	output l ({space, swap}) => SPACE.setAtom(space, swap)
	
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