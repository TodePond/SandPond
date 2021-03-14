SpaceTode`


element SpreadWater {
	category "Video"
	data direction 0
	colour "lightblue"
	emissive "blue"
	opacity 0.25
	
	prop state LIQUID
	prop temperature COOL
	@ => _
	_    @
	
	given D (self, transformationNumber, element) => element === Empty && self.direction === transformationNumber
	all(xz.directions) {
		@D => _@
	}
	
	keep N (self) => self.direction = Math.floor(Math.random() * 4)
	@ => N
}

element MomentumSand {
	category "Video"
	emissive "#ffa34d"
	colour "#fc0"
	data movement 0
	
	keep g (self) => {
		self.movement += 0.05
		if (self.movement > 1) self.movement = 1
	}
	action {
		@ => g
		_    .
	}
	
	given F (element, self) => {
		if (element !== Empty && element !== SpreadWater) return false
		return self.movement > 2/3
	}
	select F (atom) => atom
	change F (selected) => selected
	
	given f (element, self) => {
		if (element !== Empty && element !== SpreadWater) return false
		return self.movement > 1/3
	}
	select f (atom) => atom
	change f (selected) => selected
	@ => _
	_    F
	F    @
	
	@ => f
	f    @
	
	
	given s (element, self) => {
		if (element !== Empty && element !== SpreadWater) return false
		return self.movement > 0.5
	}
	select s (atom) => atom
	change s (selected) => selected
	
	change m (self) => {
		self.movement -= 0.1
		return self
	}
	any(xz.directions) {
		@  => s
		 s     m
	}
	
}

`