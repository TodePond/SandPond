SpaceTode` 

element Sand {
	colour "#ffcc00"
	emissive "#ffa34d"
	category "Sandbox"
	prop state SOLID
	prop temperature ROOM
	
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
		[ROOM]: [Water, 0.0001],
	})
	
	mimic(Temperature)
	mimic(Powder)
}

element Steam {
	colour "lightgrey"
	emissive "darkgrey"
	category "Sandbox"
	opacity 0.2
	prop state GAS
	prop temperature WARM
	prop states () => ({
		[ROOM]: [Empty, 0.1],
		[COOL]: [Water, 0.1],
		[COLD]: Water,
	})
	
	mimic(Temperature)
	
	given D (element, selfElement) => element !== selfElement && element.state >= GAS
	select D (atom) => atom
	change D (selected) => selected
	D => @
	@    D
	
	mimic(Gas)
}

element Stone {
	category "Sandbox"
	prop state SOLID
	prop states () => ({
		[HOT]: Magma,
	})
	mimic(Temperature)
	mimic(Solid)
}

element Rock {
	colour "grey"
	emissive "black"
	prop state SOLID
	prop temperature ROOM
	category "Sandbox"
	mimic(Sticky)
}

element Fire {
	colour "darkorange"
	emissive "red"
	category "Sandbox"
	opacity 0.25
	prop state EFFECT
	prop temperature HOT
	prop states () => ({
		[COLD]: Empty,
		[COOL]: Empty,
		[ROOM]: [Empty, 0.3],
	})
	
	mimic(Temperature)
	
	given D (element, selfElement) => element !== selfElement && element.state >= GAS
	select D (atom) => atom
	change D (selected) => selected
	D => @
	@    D
	
	given n (element, selfElement) => element !== selfElement
	n    .
	@ => _
	
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

element Magma {
	colour "orange"
	emissive "brown"
	category "Sandbox"
	prop state SOLID
	prop temperature HOT
	prop states () => ({
		[COLD]: Rock,
		[COOL]: Rock,
		[ROOM]: [Rock, 0.075],
		[WARM]: [Rock, 0.05],
	})
	
	mimic(Temperature)
	mimic(Goo)
}

element Meteor {
	colour "#781a00"
	emissive "black"
	category "Sandbox"
	prop state SOLID
	prop temperature WARM
	
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

element Laser {
	colour "red"
	opacity 0.2
	prop state EFFECT
	prop temperature HOT
	category "Sandbox"
	
	symbol L Laser
	@ => _
	.    @
	.    L
	
	@ => _
	.    @
	
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

element Acid {
	colour "lightgreen"
	emissive "green"
	opacity 0.35
	category "Sandbox"
	prop state LIQUID
	prop temperature ROOM
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

element Cloud any(xz.rotations) {
	
	category "Sandbox"
	arg rain Water
	arg chance 1/100
	arg birthday
	opacity 0.35
	prop state GAS
	prop temperature ROOM
	
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

`
