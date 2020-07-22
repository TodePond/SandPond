SpaceTode`

element Clear {
	colour "brown"
	category "Clear"
	pour false
	
	symbol C Clear
	symbol D Clear.Done
	symbol B Clear.Bomb
	
	// Other element
	given O (element) => element !== Void && element !== Clear && element !== Clear.Done
	
	all(xyz.rotations) @O => .C
	any(xyz.rotations) {
		@x => D.
		@D => D.
	}
	
	element Done {
		colour "blue"
		emissive "darkblue"
		all(xyz.rotations) @C => ..
		@ => _
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
	pour false
	
	symbol C Clear2D
	symbol D Clear2D.Done
	symbol B Clear2D.Bomb
	
	// Other element
	given O (element) => element !== Void && element !== Clear2D && element !== Clear2D.Done
	
	all(xy.rotations) @O => .C
	any(xy.rotations) {
		@x => D.
		@D => D.
	}
	
	element Done {
		colour "blue"
		emissive "darkblue"
		all(xy.rotations) @C => ..
		@ => _
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