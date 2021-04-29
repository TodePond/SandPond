SpaceTode`

element GameOfLife {
	category "Video"
	colour "brown"

	// Globals
	symbol D GameOfLife.Dead
	symbol A GameOfLife.Dead

	// Setup: Fill up the universe
	all(xyz.directions) @_ => @$
	
	// Then become a dead space
	@ => D

	element Dead {
		opacity 0
		colour "black"
		data tally 0
		category "Video"

		// Reset tally
		keep r (self) => self.tally = 0
		action @ => r

		// Count alive neighbours
		keep a (self) => self.tally++
		action @A => .a
		action A@ => .a
		action {
			 @     a
			A  => .
		}
		action {
			@     a
			 A =>  .
		}
		action {
			A  => .
			 @     a
		}
		action {
			 A =>  .
			@     a
		}

		action {
			A => .
			@    a
		}
		action {
			@    a
			A => .
		}

		// Live!
		given l (self) => self.tally >= 1 && self.tally <= 3
		l => A
	}

	element Alive {
		category "Video"
		prop override true
		data tally 0
		colour "grey"

		// Reset tally
		keep r (self) => self.tally = 0
		action @ => r

		// Count alive neighbours
		keep a (self) => self.tally++
		action @A => .a
		action A@ => .a
		action {
			 @     a
			A  => .
		}
		action {
			@     a
			 A =>  .
		}
		action {
			A  => .
			 @     a
		}
		action {
			 A =>  .
			@     a
		}

		action {
			A => .
			@    a
		}
		action {
			@    a
			A => .
		}

		// Survive
		given s (self) => self.tally >= 3 && self.tally <= 5
		s => .

		// Die
		@ => D

	}



}


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
	
	for(xz.directions) {
		@  => _
		 _     @
	}
	
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
	
	given b (Self, element) => element === Self
	keep b (atom, self) => {
		if (atom.movement < self.movement) {
			atom.movement = self.movement
		}
	}
	action {
		@ => .
		b    b
	}
	
	given s (element, self) => {
		if (element !== Empty && element !== SpreadWater) return false
		return self.movement > 0.3
	}
	select s (atom) => atom
	change s (selected) => selected
	
	change m (self) => {
		self.movement -= 0.2
		if (self.movement < 0) self.movement = 0
		return self
	}
	
	
	any(xz.directions) {
		@  => s
		 s     m
	}
	
}

`