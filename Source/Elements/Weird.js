SpaceTode`

element Glooper {
	
	colour "rgb(10, 120, 200)"
	category "Weird"
	
	symbol g Gloopoe
	
	maybe(0.2) {
		@ => _
		_    @
	}	
	
	for(xyz.directions) {
		@_$ => _@.
	}
	
	for(xyz.directions) {
		__@_ => .._@
	}
	
	maybe(0.001) @ => g
	
	
	
}
	
element Gloopoe {
	
	colour "rgb(150, 10, 80)"
	category "Weird"
	
	symbol g Glooper
	
	maybe(0.2) {
		_ => @
		@    _
	}	
	
	for(xyz.directions) {
		@_$ => _@.
	}
	
	for(xyz.directions) {
		__@_ => .._@
	}
	maybe(0.001) @ => g
	
}


`

