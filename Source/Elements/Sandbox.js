SpaceTode` 

element Sand {
	colour "#ffcc00"
	emissive "#ffa34d"
	category "Sandbox"
	prop state SOLID
	prop temperature ROOM
	prop states () => ({
		[HOT]: Glass,
	})

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
		[COLD]: [Ice, 0.05],
		[CHILLY]: [Snow, 0.05],
		[WARM]: [Steam, 0.4],
		[HOT]: Steam,
	})
	
	mimic(Temperature)
	mimic(Liquid)
}

element Ice {
	colour "lightblue"
	emissive "#87c5c7"
	category "Sandbox"
	opacity 0.4
	prop state SOLID
	prop temperature COLD
	prop states () => ({
		[COOL]: [Water, 0.0001],
		[ROOM]: [Water, 0.0001],
		[BODY]: [Water, 0.01],
		[WARM]: Water,
		[HOT]: Water,
	})
	
	mimic(Temperature)
	mimic(Sticky)
	mimic(Powder)
}

element Snow {
	colour "white"
	emissive "grey"
	category "Sandbox"
	prop state SOLID
	prop temperature CHILLY
	prop states () => ({
		[COOL]: [Water, 0.04],
		[ROOM]: [Water, 0.00005],
		[BODY]: [Water, 0.01],
		[WARM]: Water,
		[HOT]: Water,
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
		[COLD]: Water,
		[CHILLY]: Water,
		[COOL]: [Water, 0.1],
		[ROOM]: [Empty, 0.1],
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
	prop temperature ROOM
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
	prop stickiness 1.0
	data stuck false
	category "Sandbox"
	mimic(Sticky)
	mimic(Solid)
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
		[CHILLY]: Empty,
		[COOL]: Empty,
		[ROOM]: [Empty, 0.3],
		[BODY]: [Empty, 0.1],
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

element Magma {
	colour "orange"
	emissive "brown"
	category "Sandbox"
	prop state SOLID
	prop temperature HOT
	prop states () => ({
		[COLD]: Rock,
		[CHILLY]: Rock,
		[COOL]: Rock,
		[ROOM]: [Rock, 0.075],
		[BODY]: [Rock, 0.065],
		[WARM]: [Rock, 0.05],
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

element Laser {
	colour "red"
	opacity 0.2
	prop state EFFECT
	prop temperature HOT
	category "Sandbox"
	
	symbol L Laser
	symbol G 
	given n (element, selfElement) => (element.state === undefined || element.state < GAS) && element !== Glass
	@ => _
	n    @
	n    L
	
	@ => _
	n    @
	
	@ => _
	_    @
	
	@ => _
	G    .
	.    L

	@ => _
}

element Slime {
	colour "lightgreen"
	emissive "green"
	category "Sandbox"
	opacity 0.65
	prop state SOLID
	prop temperature BODY
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
		[CHILLY]: Slime,
	})
	
	mimic(Temperature)
	
	symbol S Steam
	given n (element, selfElement) => (element.state === undefined || element.state < GAS) && element !== Void && element !== Empty && element !== selfElement && element !== Slime && element !== Glass
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

element Static {
	prop state SOLID
	prop temperature ROOM
	category "Structure"
}

element Wall {
	colour "rgb(128, 128, 128)"
	emissive "rgb(2, 128, 200)"
	category "Structure"
	prop state SOLID
	prop temperature ROOM
	arg fuel 10
	
	mimic(Solid)
	
	given W (element, selfElement) => element === selfElement
	@ => _
	W    .
	
	symbol S Stone
	@ => _
	S    .
	
	given B (element) => element === Wall.Builder
	change B (self, element) => new Wall.Builder(self.fuel)
	@ => _
	B    .
	
	@ => B
	
	@ => _
	
	element Builder {
		colour "pink"
		emissive "red"
		prop state SOLID
		prop temperature ROOM
		arg fuel 10
		
		change G (self) => {
			self.fuel--
			if (self.fuel < 0) return new Empty()
			return self
		}
		_ => G
		@    S
		
		x => .
		@    _
	}
	
}

element Cardboard {
	colour "brown"
	//default true
	category "Structure"
	prop state SOLID
	prop temperature ROOM
	arg id
	arg ready false
	
	given S (element) => element.state > SOLID
	select S (atom) => atom
	change S (selected) => selected
	
	given i (self) => self.id === undefined
	keep i (self) => self.id = Cardboard.id
	action i => i
	
	given R (self) => !self.ready && !Mouse.down
	keep R (self) => self.ready = true
	action R => R
	
	
	given r (self) => !self.ready
	r => .
	
	for(xz.rotations) {
		$     .
		 @ =>  .
	}
	
	any(xz.rotations) {
		@ => S
		S    @
	}
}

element Glass {
	opacity 0.1
	prop state SOLID
	prop temperature ROOM
	prop stickiness 1.0
	data stuck false
	category "Sandbox"
	mimic(Sticky)
	mimic(Solid)
	
	symbol G new Glass
	
	@ => @
	_    G
	G    G
	
}

element Charcoal {
	colour "#2e362d"
	emissive "#2e362d"
	category "Sandbox"
	prop state SOLID
	prop temperature ROOM
	prop states () => ({
		[HOT]: [FlamingCharcoal, 0.12],
	})
	
	mimic(Temperature)
	mimic(Solid)
}

element FlamingCharcoal {
	colour "#2e362d"
	emissive "#2e362d"
	category "Sandbox"
	prop state SOLID
	prop temperature HOT
	prop states () => ({
		[ROOM]: [Ash, 0.003],
		[COOL]: [Ash, 0.005],
		[COLD]: [Ash, 0.01],
	})
	
	mimic(Temperature)
	
	change F () => new Fire()
	action {
		_ => F
		@    .
	}
	
	mimic(Solid)	
}

element Ash {
	colour "black"
	emissive "black"
	category "Sandbox"
	prop state SOLID
	prop temperature WARM
	
	mimic(Temperature)
	mimic(Powder)
}

`

on.mousedown(e => {
	if (UI.selectedElement === Cardboard) {
		if (e.buttons !== 1) return
		Cardboard.id = Math.random()
	}
})
