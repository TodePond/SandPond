TodeSPLAT`


element Sand {

	colour "#ffcc00"
	emissive "#ffa34d"
	
	state "solid"
	
	input @ (space, args) => {
		args.self = space.atom
		return true
	}
	input _ (space) => space && space.atom == undefined
	input # (space) => space && space.atom != undefined
	input l (space, args) => {
		if (!space || !space.atom || space.atom.type.state != "liquid") return false
		args.liquid = space.atom
		return true
	}
	
	output _ (space) => setSpaceAtom(space, undefined)
	output @ (space, {self}) => setSpaceAtom(space, self)
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