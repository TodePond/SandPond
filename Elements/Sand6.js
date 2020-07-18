SpaceTode` 

element Static6 {
	category "Sand6"
	prop resistance 1.0
}

element Sand6 any(xz.rotations) {
	colour "#ffcc00"
	emissive "#ffa34d"
	category "Sand6"
	prop resistance 1.0
	
	given D (element) => element !== Void && element.resistance === undefined || element.resistance < Math.random()
	select D (atom) => atom
	change D (selected) => selected
	
	given F (element) => element !== Void && element.resistance === undefined || element.resistance < 1.0
	
	@ => D
	D    @
	
	@D => D@
	 F     .
}

element Water6 for(xz.rotations) {
	colour "lightblue"
	emissive "blue"
	opacity 0.35
	category "Sand6"
	prop resistance 0.8
	
	@ => _
	_    @
	
	@ => .
	x    .
	
	@_ => _@
}

element Slime6 {
	colour "lightgreen"
	emissive "green"
	opacity 0.35
	category "Sand6"
	prop resistance 0.95
	
	mimic(Sand6)
	
	@ => _
	_    @
	
	@ => .
	x    .
	
	maybe(0.001) for(xz.rotations) @_ => _@
}

`
