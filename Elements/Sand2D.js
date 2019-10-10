TodeSPLAT`


element Sand2D {

	colour "darkorange"
	emissive "chocolate"
	
	floor true
	
	input @ (space, args) => args.self = space.atom
	input _ (space) => space && !space.atom
	input # (space) => space && space.atom
	input l (space, args) => {
		if (!space || !space.atom || space.atom.type.state != "liquid") return false
		args.liquid = space.atom
		return true
	}
	
	output _ (space) => setSpaceAtom(space, undefined)
	output @ (space, {self}) => setSpaceAtom(space, self)
	
	rule top {
		@ => _
		_    @
	}
	
	rule x top {
		@  => _
		#_    #@
	}
	
}




`