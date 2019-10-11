TodeSplat`


element Water {

	colour "lightblue"
	emissive "blue"
	
	state "liquid"

	input @ (space, args) => args.self = space.atom
	input _ (space) => space && space.atom == undefined
	input # (space) => space && space.atom != undefined
	
	output _ (space) => setSpaceAtom(space, undefined)
	output @ (space, {self}) => setSpaceAtom(space, self)
	
	rule {
		@ => _
		_    @
	}
	
	rule xz {
		@_    _@
		#  => #
	}
	
}




`