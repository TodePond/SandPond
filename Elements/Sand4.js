SpaceTode` 

element Static4 category "Sand4"

element Sand4 any(xz.rotations) {
	colour "#ffcc00"
	emissive "#ffa34d"
	category "Sand4"
	
	given D (element) => element === Water4 || element === Empty
	select D (atom) => atom
	change D (selected) => selected
	
	given F (element) => element === Water4 || element === Empty
	
	@ => D
	D    @
	
	@D => D@
	 F     .
}

element Water4 {
	colour "lightblue"
	emissive "blue"
	opacity 0.35
	category "Sand4"
	
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
	
	for(xz.rotations) @_ => _@
}

element FoodColouring4 for(xz.rotations) {
	colour "green"
	emissive "green"
	opacity 0.35
	category "Sand4"
	@ => _
	_    @
	
	@ => .
	x    .
	
	symbol W Water4
	keep w (atom) => atom.dyed = true
	@ => _
	W    w
	
	@_ => _@
}

element Lemonade4 for(xz.rotations) {
	colour "white"
	emissive "grey"
	opacity 0.40
	category "Sand4"
	
	@ => _
	_    @
	
	@ => .
	x    .
	
	@_ => _@
}

`