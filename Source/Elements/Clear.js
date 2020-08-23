SpaceTode`

element Eater {
	colour "brown"
	category "Clear"
	arg energy 10
	
	change D (self) => new Eater.Done(self.energy)
	change B (self) => new Eater.Bomb(self.energy)
	change E (self) => new Eater(self.energy)
	change Y (self) => new Eater(self.energy + 1)
	change N (self) => new Eater()
	
	given O (element) => element !== Empty && element !== Void && element !== Eater && element !== Eater.Done && element !== Eater.Bomb
	
	given e (self) => self.energy-- < 0
	e => D
	
	for(xyz.directions) {
		@O => YY
	}
	
	any(xyz.directions) {
		@_ => EE
	}
	
	element Done {
		colour "grey"
		emissive "black"
		arg energy 0
		@ => B
	}
	
	element Bomb {
		colour "lightgreen"
		emissive "green"
		arg energy 0
		all(xyz.others) {
			action @O => .N
		}
		
		@ => _
	}
}

element Clear {
	colour "brown"
	category "Clear"
	arg timer 0
	
	given C (element) => element === Clear
	change C (self) => new Clear(self.timer)
	change c (self) => {
		//self.timer++
		return new Clear(self.timer + 0.1)
	}
	
	given B (element) => element === Clear.Bomb
	change B (self) => new Clear.Bomb(self.timer)
	change b (atom) => new Clear.Bomb(atom.timer)
	
	keep T (self, atom) => self.timer = atom.timer + 20
	
	given D (element) => element === Clear.Done
	change D (self) => new Clear.Done(self.timer)
	
	// Other element
	given O (element) => element !== Void && element !== Clear && element !== Clear.Done && element !== Clear.Bomb
	
	all(xyz.directions) {
		//@B => .T
		@O => .c
	}
	any(xyz.directions) {
		@x => D.
		@D => D.
	}
	
	element Done {
		colour "grey"
		emissive "black"
		arg timer 0
		all(xyz.directions) @C => ..
		@ => B
	}
	
	element Bomb {
		colour "lightgreen"
		emissive "green"
		arg timer 0
		all(xyz.directions) action @C => @B
		all(xyz.others) {
			action @O => ._
		}
		
		given t (self) => self.timer-- < 0
		t => _
	}
	
}

element Clear2D {
	colour "brown"
	category "Clear"
	arg timer 0
	
	given C (element) => element === Clear2D
	change C (self) => new Clear2D(self.timer)
	change c (self) => {
		//self.timer++
		return new Clear2D(self.timer + 0.2)
	}
	
	given B (element) => element === Clear2D.Bomb
	change B (self) => new Clear2D.Bomb(self.timer)
	change b (atom) => new Clear2D.Bomb(atom.timer)
	
	keep T (self, atom) => self.timer = atom.timer + 20
	
	given D (element) => element === Clear2D.Done
	change D (self) => new Clear2D.Done(self.timer)
	
	// Other element
	given O (element) => element !== Void && element !== Clear2D && element !== Clear2D.Done && element !== Clear2D.Bomb
	
	all(xy.rotations) {
		//@B => .T
		@O => .c
	}
	any(xy.rotations) {
		@x => D.
		@D => D.
	}
	
	element Done {
		colour "grey"
		emissive "black"
		arg timer 0
		all(xyz.directions) @C => ..
		@ => B
	}
	
	element Bomb {
		colour "lightgreen"
		emissive "green"
		arg timer 0
		all(xy.rotations) action @C => @B
		all(xy.others) {
			action @O => ._
		}
		
		given t (self) => self.timer-- < 0
		t => _
	}
	
}

element Wipe {
	colour "brown"
	category "Clear"
	arg timer 4
	
	given W (element) => element === Wipe
	change W (self) => new Wipe(self.timer)
	
	given E (element) => element === Wipe.Edge
	change E (self) => new Wipe.Edge(self.timer)
	change e (self) => new Wipe.Edge(self.timer + 0.1)
	
	given D (element) => element === Wipe.Done
	change D (self) => new Wipe.Done(self.timer)
	
	given B (element) => element === Wipe.Bomb
	change B (self) => new Wipe.Bomb(self.timer)
	
	// Other element
	given O (element) => element !== Void && element !== Wipe && element !== Wipe.Done && element !== Wipe.Edge && element !== Wipe.Bomb 
	
	@O => @W
	@x => E.
	
	element Edge {
		arg timer 0
		colour "brown"
		
		all(yz.rotations) {
			O => e
			@    .
		}
		
		all(yz.rotations) {
			x => .
			@    D
		}
		
		all(yz.rotations) {
			@ => D
			D    .
		}
	}
	
	element Done {
		colour "grey"
		emissive "black"
		arg timer 0
		
		all(yz.rotations) {
			@  => .
			E     .
		
			@  => .
			 E     .
		
			@  => .
			 D     .
		}
		
		.@ => @B
		
		x@ => .B
		
	}
	
	element Bomb {
		colour "lightgreen"
		emissive "green"
		arg timer 0
		
		all(xyz.directions) action @E => @B
		all(xyz.others) {
			action @O => ._
		}
		
		given t (self) => self.timer-- < 0
		t => _
	}
}

element Wipe2D {
	colour "brown"
	category "Clear"
	//default true
	
	symbol W Wipe2D
	symbol E Wipe2D.Edge
	symbol D Wipe2D.Done
	symbol B Wipe2D.Bomb
	
	// Other element
	given O (element) => element !== Void && element !== Wipe2D && element !== Wipe2D.Done && element !== Wipe2D.Edge && element !== Wipe2D.Bomb 
	
	@O => @W
	@x => E.
	
	element Edge {
		colour "brown"
		
		all(y) {
			O => E
			@    .
		}
		
		all(y) {
			x => .
			@    D
		}
		
		all(y) {
			@ => D
			D    .
		}
	}
	
	element Done {
		colour "grey"
		emissive "black"
		
		all(y) {
			@  => .
			E     .
		
			@  => .
			 E     .
		
			@  => .
			 D     .
		}
		
		.@ => @B
		
		x@ => .B
		
	}
	
	element Bomb {
		colour "lightgreen"
		emissive "green"
		arg timer 4
		
		all(xy.others) {
			action @O => ._
		}
		
		given t (self) => self.timer-- < 0
		t => _
	}
}

`