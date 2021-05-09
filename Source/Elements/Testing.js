SpaceTode`

element Crystal {
	
	colour "lightblue"
	emissive "blue"

	maybe(1/100) any(xz.directions) {
		.....    $...$
		..@.. => ..$..
		.....    $...$
	}
		
	

}

element Brancher {

	@ => _
	_    @

	symbol G Brancher.Grower
	symbol S Sand

	@ => G
	*    .

	@ => _

	element Grower {

		colour "rgb(70, 255, 128)"
		colour "rgb(35, 200, 100)"

		G => .
		@    .

		all(xz.directions) {
			 G =>  .
			@     .
		}

		maybe(0.3) any(xz.directions) {
			_@_ => $.$
		}
		
		/*maybe(0.3) any(xz.directions) {
			_ _ => $ $
			 @      .
		}*/

		/*any(xz.directions) {
			 _ =>  $
			@     .
		}*/

		maybe(1/20) {
			_ => $
			@    .
		}

	}

}

element Labyrinth {
	
	data countBuffer 0

	// Reset buffer
	keep r (self) => self.countBuffer = 0
	action @ => r

	// Count neighbours
	given c (element, Self, self) => {
		if (element === Self) self.countBuffer++
		return true
	}

	action {
		ccc    ...
		c@c => ...
		ccc    ...
	}

	pov(right) action {
		ccc    ...
		c@c => ...
		ccc    ...
	}

	pov(top) action {
		ccc    ...
		c@c => ...
		ccc    ...
	}

	// Die
	given d (self) => self.countBuffer > 4
	d => _
	
	// Grow
	origin g
	given g (self) => self.countBuffer === 2
	for(xyz.directions) g_ => .$

}

element SparkLife {
	colour "rgb(255, 255, 70)"
	data countBuffer 0
	
	// Reset buffer
	keep r (self) => self.countBuffer = 0
	action @ => r

	// Count neighbours
	given c (element, Self, self) => {
		if (element === Self) self.countBuffer++
		return false
	}

	all(xyz.others) @c => ..

	// Die
	given d (self) => self.countBuffer >= 5 || self.countBuffer <= 2
	d => _
	
	// Grow
	origin g
	given g (self) => self.countBuffer >= 0 && self.countBuffer <= Infinity
	for(xyz.directions) g_ => .$

}

element GameOfLife {
	//category "Video"
	colour "brown"

	// Globals
	symbol D GameOfLife.Dead
	symbol A GameOfLife.Alive

	// Setup: Fill up the universe
	all(xyz.directions) @_ => @$
	
	// Then become a dead space
	@ => D

	element Dead {
		opacity 0
		//visible false
		colour "black"
		data tally 0
		//category "Video"

		// Reset tally
		keep r (self) => self.tally = 0
		action @ => r

		// Count alive neighbours
		given a (self, element) => {
			if (element === GameOfLife.Alive) {
				self.tally++
			}
			return false
		}
		action {
			aaa    ...
			a@a => ...
			aaa    ...
		}

		// Live!
		given l (self) => self.tally === 3
		l => A
	}

	element Alive {
		//category "Video"
		prop override true
		data tally 0
		colour "grey"

		// Reset tally
		keep r (self) => self.tally = 0
		action @ => r

		// Count alive neighbours
		given a (self, element) => {
			if (element === GameOfLife.Alive) {
				self.tally++
			}
			return false
		}
		action {
			aaa    ...
			a@a => ...
			aaa    ...
		}

		// Survive
		given s (self) => self.tally >= 2 && self.tally <= 3
		s => .

		// Die
		@ => D

	}

}


element SpreadWater {
	//category "Video"
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
	//category "Video"
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