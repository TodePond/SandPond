TodeSplat`


element Sand {

	colour "#ffcc00"
	emissive "#ffa34d"
	
	state "solid"
	
	input l (space, args) => {
		if (!space || !space.atom || space.atom.type.state != "liquid") return false
		return args.liquid = space.atom
	}
	
	output l (space, {liquid}) => setSpaceAtom(space, liquid)
	
	rule {
		@ => _
		_    @
	}
	
	rule {
		@  => l
		l     @
	}
	
	rule xz {
		@  => _
		#_    #@
	}
	
}




`