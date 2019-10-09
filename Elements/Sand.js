TodeSPLAT `


element Sand {

	colour "#ffcc00"
	emissive "#ffa34d"
	
	state "solid"
	
	input _ (space) => space && space.atom == undefined
	input # (space) => space && space.atom != undefined
	input W (space) => {
		return space && space.atom && space.atom.type == Water
	}
	
	output _ (space) => setSpaceAtom(space, undefined)
	output @ (space, self) => setSpaceAtom(space, self)
	output W (space) => setSpaceAtom(space, new Atom(Water))
	
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