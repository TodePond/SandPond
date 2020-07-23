SpaceTode`

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
	
	all(xyz.rotations) {
		//@B => .T
		@O => .c
	}
	any(xyz.rotations) {
		@x => D.
		@D => D.
	}
	
	element Done {
		colour "grey"
		emissive "black"
		arg timer 0
		all(xyz.rotations) @C => ..
		@ => B
	}
	
	element Bomb {
		colour "lightgreen"
		emissive "green"
		arg timer 0
		all(xyz.rotations) action @C => @B
		all(others) {
			action @O => ._
		}
		
		given t (self) => self.timer-- < 0
		t => _
	}
	
}

element Wipe {
	colour "brown"
	category "Clear"
	
	symbol W Wipe
	symbol E Wipe.Edge
	symbol D Wipe.Done
	
	// Other element
	given O (element) => element !== Void && element !== Wipe && element !== Wipe.Done && element !== Wipe.Edge 
	
	@O => @W
	@x => E.
	
	element Edge {
		colour "brown"
		
		all(yz.rotations) {
			O => E
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
		
		all(yz.rotations) {
			@  => .
			E     .
		
			@  => .
			 E     .
		
			@  => .
			 D     .
		}
		
		.@ => @_
		
		x@ => ._
		
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
		all(xyz.rotations) @C => ..
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

element Wipe2D {
	colour "brown"
	category "Clear"
	
	symbol W Wipe2D
	symbol E Wipe2D.Edge
	symbol D Wipe2D.Done
	
	// Other element
	given O (element) => element !== Void && element !== Wipe2D && element !== Wipe2D.Done && element !== Wipe2D.Edge 
	
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
		
		.@ => @_
		
		x@ => ._
		
	}
}

`