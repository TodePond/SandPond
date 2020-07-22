SpaceTode` 

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

`
