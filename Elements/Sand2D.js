TodeSplat`

element Sand2D {

	colour "#ffcc00"
	emissive "#ffa34d"
	
	floor true
	state "solid"
	hidden true
	
	input l extends . ({space, args}) => {
		if (!space.atom) return true
		if (space.atom.element.state != "liquid") return false
		return args.swap = space.atom
	}
	
	output l ({space, swap}) => SPACE.setAtom(space, swap)
	
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