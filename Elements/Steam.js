TodeSplat`

element Steam {

	colour "lightgrey"
	emissive "darkgrey"
	category "sandbox"
	floor true
	
	output W ({space}) => Space.setAtom(space, Atom.make(Water))
	
	rule 0.0002 { @ => W }
	
	rule {
		_ => @
		@    _
	}
	
	rule xz { @_ => _@ }
	
}

`