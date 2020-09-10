SpaceTode`

element Glooper {
	default true
	colour "rgb(110, 120, 200)"
	category "Weird"
	
	
	for(xyz.directions) {
		@_$ => _@.
	}
	
	for(xyz.rotations) {
		@  => _
		_$    @.
	}
	
	maybe(0.2) {
		@ => _
		_    @
	}
	
	any(xz.directions) {
		@  => _
		$_    .@
	}
		
	
	
}


`

