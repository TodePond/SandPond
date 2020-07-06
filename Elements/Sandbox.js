SpaceTode` 

element Sand {
	colour "#ffcc00"
	emissive "#ffa34d"
	category "Sandbox"
	prop state SOLID
	
	mimic(Temperature)
	mimic(Powder)
}

element Water {
	colour "lightblue"
	emissive "blue"
	opacity 0.35
	category "Sandbox"
	prop state LIQUID
	prop temperature COOL
	prop states () => ({
		[HOT]: Steam,
		[COLD]: [Snow, 0.1],
	})
	
	mimic(Temperature)
	mimic(Liquid)
}

element Fire {
	colour "darkorange"
	emissive "red"
	category "Sandbox"
	opacity 0.25
	prop state EFFECT
	prop temperature HOT
	prop states () => ({
		[COOL]: Empty,
		[COLD]: Empty,
	})
	
	mimic(Temperature)
	maybe(0.2) @ => _
	
	given D (element, selfElement) => element !== Void && element !== selfElement && (element.state === EFFECT || element.state === undefined)
	select D (atom) => atom
	change D (selected) => selected
	_ => @
	@    _
	
	given n (element, selfElement) => element !== selfElement
	n    .
	@ => _
	
}

element Slime {
	colour "lightgreen"
	emissive "green"
	category "Sandbox"
	opacity 0.65
	prop state SOLID
	prop temperature WARM
	prop states () => ({
		[HOT]: Acid,
	})
	
	mimic(Temperature)
	mimic(Goo)
}

element Lava {
	colour "red"
	emissive "darkred"
	category "Sandbox"
	opacity 0.5
	prop state SOLID
	prop temperature HOT
	prop states () => ({
		[COOL]: [Rock, 0.05],
		[COLD]: [Rock, 0.1],
	})
	
	mimic(Temperature)
	
	change F () => new Fire()
	action {
		_ => F
		@    .
	}
	
	mimic(Goo)
	
}

element Rock {
	colour "grey"
	emissive "black"
	prop state SOLID
	category "Sandbox"
	mimic(Temperature)
	mimic(Solid)
}

element Steam {
	colour "lightgrey"
	emissive "darkgrey"
	category "Sandbox"
	opacity 0.2
	prop state GAS
	prop temperature WARM
	prop states () => ({
		[WARM]: [Empty, 0.04],
		[COOL]: [Water, 0.1],
		[COLD]: Water,
	})
	
	mimic(Temperature)
	
	given D (element) => element !== Void && (element.state === EFFECT || element.state === undefined)
	select D (atom) => atom
	change D (selected) => selected
	D => @
	@    D
	
	mimic(Gas)
}

element Snow {
	colour "white"
	emissive "grey"
	category "Sandbox"
	prop state SOLID
	prop temperature COLD
	prop states () => ({
		[HOT]: Water,
		[WARM]: [Water, 0.2],
		[COOL]: [Water, 0.1],
		[COLD]: [Water, 0.00001]
	})
	
	mimic(Temperature)
	mimic(Powder)
}

element Acid {
	colour "lightgreen"
	emissive "green"
	opacity 0.35
	category "Sandbox"
	prop state LIQUID
	prop states () => ({
		[COLD]: Slime,
	})
	
	mimic(Temperature)
	
	symbol S Steam
	given n (element, selfElement) => (element.state === undefined || element.state < GAS) && element !== Void && element !== Empty && element !== selfElement && element !== Slime
	n => S
	@    _
	
	@ => S
	n    _
	
	@ => _
	_    @
	
	any(xz.rotations) {
		@n => _S
		
		@ => .
		x    .
		
		@_ => _@
	}	
}

element Explosion any(xyz.rotations) {
	colour "darkorange"
	emissive "red"
	opacity 0.3
	category "Sandbox"
	arg timer 20
	
	keep t (self) => self.timer--
	action @ => t
	
	given t (self) => self.timer <= 0
	t => _
	
	change E (self, selfElement) => new selfElement(self.timer)
	@. => .E
	
}

element Cloud any(xz.rotations) {
	
	category "Sandbox"
	arg rain Water
	arg chance 1/100
	arg birthday
	opacity 0.35
	
	given i (self) => self.birthday === undefined
	keep i (self, time) => self.birthday = time
	i => i
	
	given r (element, self) => element === Empty && (Math.random() < self.chance)
	change R (self) => new self.rain()
	@ => .
	r    R
	
	_ => @
	@    _
	
	change W (selfElement, self) => new selfElement(self.rain, self.chance, self.birthday)
	maybe(1/5) @_ => W@
	
	given W (element, selfElement, atom, self) => element === selfElement && self.birthday >= atom.birthday
	@W => _@
	@_ => _@
	
}

element Meteor {
	colour "#781a00"
	emissive "black"
	category "Sandbox"
	
	change F () => new Fire()
	action {
		 _ => F
		@    .
	}
	
	given F (element) => element === Fire
	 @  => _
	F     @ 
	
	given E (element) => element === Explosion
	 @  => _
	E     .
	
	 @  => _
	_     @
	
	given M (element, selfElement) => element === selfElement
	 @ => .
	M    .
	
	change E () => new Explosion(35)
	@ => E
}

/*
element WallSeed {
	colour "rgb(128, 128, 128)"
	emissive "rgb(2, 128, 200)"
	category "Sandbox"
	state "solid"
	
	data fuel 10
	
	ruleset Solid
	
	given W (element) => element == Solid || element == WallSeed
	given W (self) => self.fuel == 10
	rule {
		@ => _
		W    .
	}
	
	change W () => new Solid()
	change S (self) => {
		self.fuel--
		if (self.fuel > 0) return self
	}

	rule {
		_ => S
		@    W
	}
	
}

element Platform {
	colour "rgb(128, 128, 128)"
	emissive "rgb(2, 128, 200)"
	category "Sandbox"
	state "solid"
	data fuel 100
	//default true
	precise true
	pour false
	
	given f (self) => self.fuel <= 0
	rule { f => _ }
	
	change S () => new Static()
	change P (self) => new Platform({fuel: (self.fuel-1)/2})
	rule { _@_ => PSP}
	
	change B (self) => new Platform({fuel: self.fuel-1})
	rule x { @_ => SB }
	
	//rule { #@# => ._. }
	
	rule x { @x => _. }
}

element Ball {
	colour "grey"
	emissive "black"
	state "solid"
	category "Sandbox"
	
	data fallSpeed 0
	
	keep f (self) => {
		self.fallSpeed += 0.015
		if (self.fallSpeed > 2) self.fallSpeed = 2
	}
	action {
		@ => f
		_    .
	}
	
	given s (atom) => atom
	select s (atom) => atom
	keep s (self, selected) => {
		self.fallSpeed += 0.015
		if (selected.fallSpeed != undefined) {
			if (selected.fallSpeed < self.fallSpeed) {
				selected.fallSpeed = self.fallSpeed
			}
		}
		if (self.fallSpeed < 0) self.fallSpeed = 0
	}
	action {
		@ => s
		s    .
	}
	
	keep c (self) => self.fallSpeed = 0
	action {
		@ => c
		x    .
	}
	
	given q (space, atom) => space && !atom
	given q (self) => Math.random() < self.fallSpeed / 2
	rule {
		@ => _
		_    _
		q    @
	}
	
	given e (space, atom) => space && !atom
	given e (self) => Math.random() < self.fallSpeed
	rule {
		@ => _
		e    @
	}
	
}*/

`
