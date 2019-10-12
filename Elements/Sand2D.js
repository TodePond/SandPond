TodeSplat`

element Sand2D {

	colour "#ffcc00"
	emissive "#ffa34d"
	
	floor true
	state "solid"
	
	input l (space, args) => {
		if (!space) return false
		if (!space.atom) return true
		if (space.atom.type.state != "liquid") return false
		return args.swap = space.atom
	}
	
	output l (space, {swap}) => setSpaceAtom(space, swap)
	
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