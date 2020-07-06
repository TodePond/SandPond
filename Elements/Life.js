SpaceTode`

element Carrot {
	colour "rgb(200, 80, 0)"
	category "Life"
	
	// Init
	change i () => new Carrot.Leaf(Math.random())
	@ => i
	
	element Leaf {
		colour "green"
		arg id
		data eaten false
		
		given e (self) => self.eaten
		e => _
		
		// Grow
		change P (self, atom) => new Carrot.Part(self.id)
		_@ => P.
		_ @ => P .
		
		// Die
		given n (element, atom, self) => element !== Carrot.Part || atom.id !== self.id
		n@ => ._
		n @ => . _
		
		given P (self, atom, element) => element === Carrot.Part && atom.id === self.id
		PP@ => ___
		___    PP@
	}
	
	element Part {
		colour "rgb(200, 80, 0)"
		arg id
		data eaten false
		
		given L (self, atom, element) => element === Carrot.Leaf && atom.id === self.id
		keep l (self, atom) => atom.eaten = self.eaten
		@L => .l
		@ L => . l
		
		@ => _
		
	}
}

element Rabbit {
	colour "white"
	emissive "grey"
	category "Life"
	data id
	
	element Part {
		colour "white"
		emissive "grey"
		arg id
		
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
	
	any(xyz.rotations) {
	
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

element RainbowRabbit {
	colour "white"
	emissive "grey"
	category "Life"
	data id
	arg hue
	
	element Part {
		colour "white"
		emissive "grey"
		arg id
		
		given R (element, atom, self) => element === RainbowRabbit && atom.id === self.id
		@R => ..
		R@ => ..
		
		@  => .
		 R     .
		
		 @ =>  .
		R     .
		
		@ => _
	}
	
	// Init ID
	given i (self) => {
		return self.id === undefined
	}
	keep i (self) => {
		self.id = Math.random()
		if (self.hue === undefined) self.hue = Math.floor(Math.random() * 300)
		const colour = new THREE.Color("hsl(" + self.hue + ", 100%, 40%)")
		self.colour = {
			r: Math.floor(colour.r * 255),
			g: Math.floor(colour.g * 255),
			b: Math.floor(colour.b * 255),
		}
		self.emissive = self.colour
	}
	i => i
	
	// Grow body
	change P (self, atom) => {
		const part = new RainbowRabbit.Part(self.id)
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
	given n (element, atom, self) => element !== RainbowRabbit.Part || atom.id !== self.id
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
	given P (element, atom, self) => element === RainbowRabbit.Part && atom.id === self.id
	P P    _ _
	P@P => P_P
	___    P@P
	
	// Move
	pov(right) {
	
		given H (self, atom, element) => {
			if (element !== RainbowRabbit) return false
			if ((self.hue < atom.hue)) {
				self.tempOtherHue = atom.hue
				return true
			}
		}
		
		change H (self) => new RainbowRabbit(self.tempOtherHue)
	
		@H => H@
		@.H => H.@
		maybe(1/2) any(z) @_ => _@
	}
	
	given R (element) => element === RainbowRabbit
	@    _
	R => .
	
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