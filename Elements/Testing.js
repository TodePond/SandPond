SpaceTode`

element Red {
	colour "brown"
	
	symbol R Red
	symbol B Blue
	
	all(xy.directions) {
		@_ => @R    // Super Forkbomb
	}
	
	any(xy.directions) {
		@x => B.    // Turn blue when I touch the edge
		@B => B.    // Turn blue when I touch blue
	}
}

element Blue  {
	colour "blue"
	
	symbol R Red
	
	all(xy.directions) {
		@R => ..    // Do nothing if I touch red
	}
	
	@ => _    // Else, disappear
}

/*element _Lava {
	default true
	pour false
	
	symbol F Fire
	
	@ => _
	_    @
	
	action @_ => .F
	
}*/

`

