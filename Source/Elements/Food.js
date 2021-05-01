// Food Flags
const PLANT = Flag(1)
const MEAT = Flag(2)
const WATER = Flag(3) 
const BUG = Flag(4)
const DAIRY = Flag(5)

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

element Plant {
	colour "green"
	emissive "green"
	category "Sandbox"
	prop state SOLID
	prop temperature ROOM
	prop food PLANT
	mimic(Powder)
	
	maybe(1/50) {
	
		any(xyz.directions) {
			@ => @
			_    $
		}
	}
	
}

element Cheese {
	colour "#fcc203"
	emissive "#fc4e03"
	category "Life"
	prop state SOLID
	prop temperature ROOM
	prop food DAIRY
	prop stickiness 0.5
	prop states () => ({
		[WARM]: Fondue,
		[HOT]: Fondue,
	})
	
	// Make holes
	given i (self) => self.init !== true
	keep i (self, origin) => {
		if (Math.random() < 0.3) return SPACE.setAtom(origin, new Empty(), Empty)
		self.init = true
	}
	action i => i
	
	symbol S Cheese.Smell
	
	data age 0
	data smelly false
	given E (self, element) => {
		if (self.smelly) return element === Empty
		self.age++
		if (self.age < 20) return false
		self.smelly = true
		return false
	}
	maybe(0.2) any(xyz.directions) action @E => @S
	
	mimic(Temperature)
	mimic(Sticky)	
	mimic(Solid)
	
	element Smell {
		colour "#fcc203"
		emissive "#fc4e03"
		opacity 0.1
		prop state GAS
		prop temperature ROOM
		prop smell STINK
		mimic(Smell)
	}
}

element Fondue {
	colour "#fcc203"
	emissive "#fc4e03"
	category "Life"
	opacity 0.3
	prop state SOLID
	prop temperature BODY
	prop food DAIRY
	prop states () => ({
		[COLD]: Cheese,
		[CHILLY]: Cheese,
		[COOL]: Cheese,
	})
	
	symbol S Fondue.Smell
	maybe(0.003) any(xyz.directions) action @_ => @S
	mimic(Temperature)
	mimic(Goo)
	
	element Smell {
		colour "#fcc203"
		emissive "#fc4e03"
		opacity 0.1
		prop state GAS
		prop temperature ROOM
		prop smell STINK
		mimic(Smell)
	}
}

`
