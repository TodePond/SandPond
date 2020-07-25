// Food Flags
const PLANT = Flag(0)
const MEAT = Flag(1)
const WATER = Flag(2) 
const BUG = Flag(3)

SpaceTode`

element Carrot {
	colour "rgb(200, 80, 0)"
	category "Life"
	prop state SOLID
	prop temperature ROOM
	prop food PLANT
	
	change i () => new Carrot.Leaf(Math.random(), false)
	@ => i
	
	given L (self, element, atom) => element === Carrot.Leaf && atom.id === self.id
	change L (self) => new Carrot.Leaf(self.id)
	
	given P (self, element, atom) => element === Carrot.Part && atom.id === self.id
	change P (self) => new Carrot.Part(self.id)
	
	given 1 (element) => element.state > SOLID
	select 1 (atom) => atom
	change 1 (selected) => selected
	
	given 2 (element) => element.state > SOLID
	select 2 (atom) => atom
	change 2 (selected) => selected
	
	given 3 (element) => element.state > SOLID
	select 3 (atom) => atom
	change 3 (selected) => selected
	
	given n (element) => element.state === undefined || element.state <= SOLID
		
	element Leaf  {
		colour "green"
		arg id
		arg grown true
		prop state SOLID
		prop temperature ROOM
		prop food PLANT
		
		any(xz.rotations) {
			origin g
			given g (self) => !self.grown
			keep g (self) => self.grown = true
			g => g
			_    P
			_    P
			
			g => _
		
			P    1
			P => P
			@    P
			1    @
		
			P      2
			P   => 1
			@12    @PP
			n      .
		
			@PP => 123
			123    @PP
			
			@PP => 1P2
			 1n     P.
			 2      @
			
			PP@ => 1@2
			 1n     P.
			 2      P
			
			@PP => P12
			1 n    P .
			2      @
			
			PP@ => @12
			1 n    P .
			2      P
		}
		
		all(xyz.directions) @PP => ...
		mimic(Powder)
		
	}
	
	element Part {
		colour "rgb(200, 80, 0)"
		arg id
		prop state SOLID
		prop temperature ROOM
		prop food PLANT
		
		any(xz.rotations) {
			L    1
			@ => L
			P    @
			1    P
		
			L      1
			@   => 2
			P12    P@L
		
			L      1
			P   => 2
			@12    @PL
			n      .
		 
			L@P => 123
			123    L@P
			
			LP@ => 123
			123    LP@
		}
		
		all(xyz.directions) {
			P@L => ...
			@PL => ...
		}
		mimic(Powder)
	}
}

element Ant {
	colour "grey"
	emissive "black"
	category "Life"
	prop state SOLID
	prop temperature WARM
	prop food Flag.and(BUG, MEAT)
	
	given M (element) => element.state > LIQUID
	select M (atom) => atom
	change M (selected) => selected
	
	given S (element, selfElement) => element.state <= SOLID && element !== selfElement
	any(xyz.rotations2) {
		@M => M@
		 S     .
		 
		 S     .
		@M => M@
	}
	
	all(xyz.directions) {
		@S => ..
	}
	
	@ => M
	M    @
	
}

element Rabbit {
	colour "white"
	emissive "grey"
	category "Life"
	prop state SOLID
	prop temperature WARM
	prop food MEAT
	
	data id
	
	element Part {
		colour "white"
		emissive "grey"
		arg id
		prop state SOLID
		prop temperature WARM
		prop food MEAT
		
		given R (element, atom, self) => element === Rabbit && atom.id === self.id
		@R => ..
		R@ => ..
		
		@  => .
		 R     .
		
		 @ =>  .
		R     .
		
		@ => _
	}
	
	// Init ID
	given i (self) => self.id === undefined
	keep i (self) => self.id = Math.random()
	i => i
	
	// Grow body
	change P (self, atom) => {
		const part = new Rabbit.Part(self.id)
		part.colour = self.colour
		part.emissive = self.emissive
		return part
	}
	@_ => .P
	_@ => P.
	
	_  => P
	 @     .
	
	 _ =>  P
	@     .
	
	// Die because can't grow
	given n (element, atom, self) => element !== Rabbit.Part || atom.id !== self.id
	n  => .
	 @     _
	 _     .
	
	 n =>  .
	@     _
	_     .
	
	@n => _.
	_     .
	
	n@ => ._
	 _     .
	
	// Fall down
	given P (element, atom, self) => element === Rabbit.Part && atom.id === self.id
	P P    _ _
	P@P => P_P
	___    P@P
	
	any(xyz.directions) {
	
		// Eat
		given C (element) => element === Carrot.Leaf || element === Carrot.Part
		keep C (atom) => atom.eaten = true
		@.C => ..C
		@C => .C
		
		// Breed
		given R (element, atom, self) => (element === Rabbit || element === Rabbit.Part) && self.id !== atom.id
		change B () => new Rabbit()
		maybe(1/15) {
			@_R => .B.
			@R_ => ..B
			_@R => B..
			_@.R => B...
		}
	}
	
	// Move
	maybe(1/2) pov(right) any(z) {
		@_ => _@
	}
	
	any(x) {
		P_P_    _P_P
		P@P_ => _P@P
	}
	
}

/*element Food {

	colour "brown"
	emissive "brown"
	category "Life"
	isFood true
	state "solid"
	
	ruleset Powder
	
}

element FloatyFood {

	colour "brown"
	emissive "brown"
	category "Life"
	isFood true
	
	state "solid"
	
	rule xyz { @_ => _@ }
	
}

element Fly {

	colour "royalblue"
	emissive "darkblue"
	precise true
	pour false
	category "Life"
	state "solid"

	given F (element) => element && element.isFood
	rule 0.0005 { @ => _ }
	rule xyz 0.05 { @F => @@ }
	rule xyz { @F => @_ }
	rule xyz { @_ => _@ }
	
}

element Ant {

	colour "grey"
	emissive "black"
	precise true
	pour false
	category "Life"
	state "solid"
	
	given F (element) => element && element.isFood
	
	rule 0.0005 { @ => _ }
	
	ruleset Solid
	
	rule xyz 0.05 { @F => @@ }
	rule xyz { @F => _@ }
	
	rule xz {
		 _ =>  @
		@.    _.
	}
	
}

element MountainMaker {
	
	colour "lightblue"
	emissive "red"
	category "Life"
	state "effect"
	
	change S () => new Sand()
	
	rule 0.4 {
		@ => S
	}
	
	rule xyz {
		@._ => ..@
	}
	
}

element SandLeaver {
	
	colour "brown"
	emissive "brown"
	category "Life"
	state "solid"
	precise true
	pour false
		
	change F () => new Sand()
	rule xyz 0.45 { @_ => @F }
	
	rule {
		@ => _
		_    @
	}
	
	rule xz {
		 _ =>  @
		@     _
	}
	
}

element FoodLeaver {
	
	colour "yellow"
	emissive "orange"
	category "Life"
	state "solid"
	precise true
	pour false
		
	change F () => new Food()
	rule xyz 0.45 { @_ => @F }
	
	rule {
		@ => _
		_    @
	}
	
	rule xz {
		 _ =>  @
		@     _
	}
	
}
element Cycler {

	colour "grey"
	emissive "black"
	category "Life"
	state "solid"
	
	rule {
		 x =>  x
		_@    @_
	}
	
	rule {
		_     @
		@x => _x
	}
	
	rule {
		@_ => _@
		x     x
	}
	
	rule {
		@ => _
		_    @
	}
	
}

element Plant {
	colour "green"
	category "Life"
	state "solid"
	
	// Burn
	given H (element) => element && element.ignites
	keep H
	change F () => new BurningPlant()
	rule xyz { @H => FH }
	
	// Gravity
	ruleset Powder
	
	// Grow
	rule xz 0.05 { @_ => @@ }
	
}

element BurningPlant {
	colour "green"
	category "Life"
	state "solid"
	hidden true
	ignites true
	
	rule 0.03 { @ => _ }
	
	change F () => new Fire()
	rule {
		_ => F
		@    @
	}
	ruleset Plant
	
}

element Herbivore {
	colour "blue"
	emissive "darkblue"
	category "Life"
	state "solid"
	precise true
	pour false
	
	// Die
	rule 0.002 { @ => _ }
	
	// Gravity
	ruleset Powder
	
	// Reproduce
	given P (element) => element == Plant || (element && element.isFood)
	rule xyz 0.05 { @P => @@ }
	
	// Eat
	rule xyz { @P => @_ }
	
	// Move
	rule xz 0.5 { @_ => _@ }
}

element Fish {
	colour "rgb(255, 100, 0)"
	category "Life"
	precise true
	pour false
	state "solid"
	
	given W (element) => element == Water
	select W (atom) => atom
	change W (selected) => selected
	rule xyz { @W => W@ }
	
	rule {
		@ => .
		W    .
	}
	ruleset Solid
	
	rule 0.05 xz {
		 _ =>  @
		 
		@     _
	}
	
}

element Giraffe {
	colour "rgb(128, 128, 0)"
	emissive "rgb(255, 128, 0)"
	state "solid"
	precise true
	pour false
	category "Life"
	
	data level 0
	
	given d (self) => self.level > 0
	given d (atom, element, self) => element != Giraffe || !atom || atom.level != self.level - 1
	rule {
		@ => _
		d    .
	}
	
	ruleset Solid
	
	given e (space, atom) => space && !atom
	given e (self) => self.level < 10
	change G (self) => new Giraffe({level: self.level + 1})
	action {
		e => G
		@    .
	}
	rule xz 0.05 { @_ => _@ }
	
	
}

element StretchyGiraffe {
	colour "rgb(128, 128, 0)"
	emissive "rgb(255, 128, 0)"
	state "solid"
	precise true
	pour false
	category "Life"
	
	data level 0
	
	given d (self) => self.level == 0
	given d (element) => !element || element.state != "solid"
	given d (space) => space
	select d (atom) => atom
	change d (selected) => selected
	rule {
		@ => d
		d    @
	}
	
	given e (space, atom) => space && !atom
	given e (self) => self.level < 7
	change G (self) => new StretchyGiraffe({level: self.level + 1})
	action {
		e => G
		@    .
	}
	
	given G (element) => element == StretchyGiraffe
	change T (self) => new GiraffeTrail({level: self.level + 1})
	rule xz {
		G_    .T
		@d => d@
	}
	
	given T (element, atom, self) => element && element == GiraffeTrail && atom.level == self.level
	rule xz {
		G_    .T
		@T => _@
	}
	
	rule xz {
		_     .
		@T => _@
	}
	
}

element GiraffeTrail {
	colour "grey"
	emissive "black"
	hidden true
}*/

`