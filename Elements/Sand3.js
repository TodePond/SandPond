SpaceTode` 

element Static3 category "Sand3"

element Sand3 any(xz.rotations) {
	colour "#ffcc00"
	emissive "#ffa34d"
	category "Sand3"
	
	@ => _
	_    @
	
	@_ => _@
	 _     .
	
	symbol W Water3
	@ => W
	W    @
	
	@W => W@
	 W     .
}

element Water3 {
	colour "lightblue"
	emissive "blue"
	opacity 0.35
	category "Sand3"
	
	// FOOD COLOURING
	//================
	data dyed false
	given D (element, selfElement, atom) => element === selfElement && atom.dyed
	keep d (self) => self.dyed = true
	any(xyz.rotations) action @D => d.
	given c (self) => self.dyed
	keep c (space, self) => {
		self.colour = {r: 128, b: 128, g: 255}
		self.emissive = {r: 0, b: 0, g: 255}
		SPACE.update(space)
	}
	action c => c
	//================
	
	@ => _
	_    @
	
	@ => .
	x    .
	
	any(xz.rotations) @_ => _@
}

element FoodColouring3 any(xz.rotations) {
	colour "lightgreen"
	emissive "green"
	opacity 0.35
	category "Sand3"
	@ => _
	_    @
	
	@ => .
	x    .
	
	symbol W Water3
	keep w (atom) => atom.dyed = true
	@ => _
	W    w
	
	@_ => _@
}

`