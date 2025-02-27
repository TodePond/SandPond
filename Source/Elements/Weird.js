SpaceTode`

element RainbowSand {
	category "Weird"
	
	data ready false
	given i (self) => !self.ready
	keep i (space, self, time) => {
		const colour = new THREE.Color("hsl(" + time + ", 100%, 50%)")
		self.colour.r = colour.r * 255
		self.colour.g = colour.g * 255
		self.colour.b = colour.b * 255
		self.emissive.r = colour.r * 255
		self.emissive.g = colour.g * 255
		self.emissive.b = colour.b * 255
		self.ready = true
		SPACE.update(space)
	}
	action i => i
	
	any(xz.directions) {
		@ => _
		_    @
		
		@  => _
		 _     @
	}
}

element RainglowSand {
	category "Weird"
	
	prop colours {
		const arr = []
		for (let i = 0; i < 360; i++) {
			const colour = new THREE.Color("hsl(" + i + ", 100%, 50%)")
			const cs = [colour.r, colour.g, colour.b].map(c => Math.floor(c * 255))
			arr.push(cs)
			
		}
		return arr
	}
	data ready false
	data offset 0
	keep i (space, self, time, Self) => {
		if (!self.ready) {
			self.offset = time
			self.ready = true
		}
		const [r, g, b] = Self.colours[(time + self.offset) % 360]
		self.colour.r = r
		self.colour.g = g
		self.colour.b = b
		self.emissive.r = r
		self.emissive.g = g
		self.emissive.b = b
		SPACE.update(space)
	}
	action @ => i
	
	any(xz.directions) {
		@ => _
		_    @
		
		@  => _
		 _     @
		
		@ => @
	}
}

element Glooper {

	colour "rgb(110, 120, 200)"
	category "Weird"
	
	arg direction "down"
	arg directionTime 0
	
	keep c (self) => {
		if (self.direction == "down") {
			self.colour.r = 110
			self.colour.g = 120
			self.colour.b = 200
		}
		else {
			self.colour.r = 110
			self.colour.g = 200
			self.colour.b = 1
		}
	}
	action @ => c
		
	keep u (self, time) => {
		self.direction = "up"
		self.directionTime = time
	}
	action {
		@ => u
		x    .
	}
	
	keep d (self, time) => {
		self.direction = "down"
		self.directionTime = time
	}
	action {
		x    .
		@ => d
	}
	
	given D (Self, element, self, atom) => {
		return Self === element && self.directionTime < atom.directionTime
	}
	keep D (self, atom) => {
		self.direction = atom.direction
		self.directionTime = atom.directionTime
	}
	for(xyz.directions) {
		@D => .D
	}
	
	for(xyz.directions) {
		@_$ => _@.
	}
	
	for(xyz.rotations) {
		@  => _
		_$    @.
	}
	
	action @ => <
	for(xyz.directions) {
		action @$ => >.
	}
	< => _
	
	given d (self, element) => element === Empty && self.direction == "down"
	// set to 0.2 to make it move down
	maybe(0.2) {
		@ => _
		d    @
	}
	
	given u (self, element) => element === Empty && self.direction == "up"
	// set to 0.2 to make it move up
	maybe(0.2) {
		u => @
		@    _
	}
	
	any(xz.directions) {
		@  => _
		$d    .@
		
		$u    .@
		@  => _
	}
	
}

element AntiGlooper {
	
	colour "rgb(200, 120, 110)"
	category "Weird"
	
	arg direction "down"
	arg directionTime 0
	
	symbol G Glooper
	symbol E Eater
	
	for(xyz.directions) {
		@G => EE
	}
	
	mimic(Glooper)
	
}

element GloopGridder {
	
	colour "rgb(50, 150, 50)"
	category "Weird"
	
	arg timer 300
	symbol S Glooper
	
	given t (self) => self.timer-- <= 0
	t => S
	
	change G (self, Self) => new Self(self.timer)
	
	any(xyz.directions) {
		maybe(0.1) @_ => @G
		@$ => _@
		@_ => _@
	}
	
}

element UpSignal {
	
	symbol G Glooper
	keep u (atom, time) => {
		atom.direction = "up"
		atom.directionTime = time
	}
	//category "T2Tile"
	
	@ => _
	_    @
	
	@ => _
	G    u
	
	@ => _
}


element DownSignal {
	
	symbol G Glooper
	keep d (atom, time) => {
		atom.direction = "down"
		atom.directionTime = time
	}
	//category "T2Tile"
	
	@ => _
	_    @
	
	
	@ => _
	G    d
	
	@ => _
}



`;
