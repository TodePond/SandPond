SpaceTode`

element Red {
	colour "brown"
	
	symbol R Red
	symbol B Blue
	
	any(xy.directions) {
		@_ => @R    // Forkbomb
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

`

