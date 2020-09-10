SpaceTode`

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
	
	given d (self, element) => element === Empty && self.direction == "down"
	maybe(0.2) {
		@ => _
		d    @
	}
	
	given u (self, element) => element === Empty && self.direction == "up"
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
	
	symbol G Glooper
	symbol E Eater
	
	for(xyz.directions) {
		@G => EE
	}
	
	mimic(Glooper)
	
}

element Gridder {
	
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
	category "Weird"
	
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
	category "Weird"
	
	@ => _
	_    @
	
	
	@ => _
	G    d
	
	@ => _
}



`

