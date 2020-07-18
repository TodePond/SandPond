SpaceTode`

element Static2 category "Sand2"

element Sand2 any(xz.rotations) {
	colour "#ffcc00"
	emissive "#ffa34d"
	category "Sand2"
	
	@ => _
	_    @
	
	@_ => _@
	 _     .
}

element Water2 for(xz.rotations) {
	colour "lightblue"
	emissive "blue"
	opacity 0.35
	category "Sand2"
	@ => _
	_    @
	
	@ => .
	x    .
	
	@_ => _@
}

`