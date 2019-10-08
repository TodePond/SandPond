TodeSPLAT `


element Sand {

	colour #ffcc00
	emissive #ffa34d
	
	state solid
	
	input @ () => true
	input _ (space) => space && space.atom == undefined
	output _ (space) => setSpaceAtom(space, undefined)
	output @ (space, self) => setSpaceAtom(space, self)
	
	rule y {
		
		@ => _
		_    @
		
	}
	
}




`