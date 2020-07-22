SpaceTode`

element Clear2D {
	colour "brown"
	category "Clear"
	
	symbol C Clear2D
	symbol D Clear2D.Done
	symbol B Clear2D.Bomb
	
	given O (element) => element !== Void && element !== Clear2D && element !== Clear2D.Done
	
	
	all(xy) {
		@O => .C
	}
	
	any(xy) {
		@x => D.
		@D => D.
	}
	
	element Done {
		colour "blue"
		all(xy) @C => ..
		@ => _
	}
	
}

element Clear3D {
	colour "brown"
	category "Clear"
	
	symbol C Clear3D
	symbol D Clear3D.Done
	symbol B Clear3D.Bomb
	
	given O (element) => element !== Void && element !== Clear3D && element !== Clear3D.Done
	
	
	all(xyz.rotations) {
		@O => .C
	}
	
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

`