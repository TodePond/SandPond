TodeSPLAT`


element Sand {

	colour "#ffcc00"
	emissive "#ffa34d"
	
	state "solid"
	
	input @ (space, args) => args.self = space.atom
	input _ (space) => space && space.atom == undefined
	input # (space) => space && space.atom != undefined
	input W (space, args) => {
		if (!space) return false
		if (!space.atom) return false
		if (space.atom.type.state != "liquid") return false
		args.liquid = space.atom
		return true
	}
	
	output _ (space) => setSpaceAtom(space, undefined)
	output @ (space, {self}) => setSpaceAtom(space, self)
	output W (space, {liquid}) => setSpaceAtom(space, liquid)
	
	rule y {
		
		@ => _
		_    @
		
	}
	
	rule y {
	
		@  => W
		W     @
	
	}
	
	rule y {
	
		@  => _
		#_    #@
	
	}
	
}




`