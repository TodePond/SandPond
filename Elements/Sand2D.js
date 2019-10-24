TodeSplat`

element Sand2D {

	colour "#ffcc00"
	emissive "#ffa34d"
	
	floor true
	state "solid"
	hidden true
	
	input l ({space, args}) => {
		if (!space) return false
		if (!space.atom) return true
		if (space.atom.type.state != "liquid") return false
		return args.swap = space.atom
	}
	
	output l ({space, swap}) => Space.setAtom(space, swap)
	
	rule top {
		@ => l
		l    @
	}
	
	rule x top {
		@  => l
		#l    #@
	}
	
}

`