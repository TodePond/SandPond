SpaceTode` 

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

/*
// TODO: move these to Structures.js
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

`
