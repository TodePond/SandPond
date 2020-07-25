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

`
