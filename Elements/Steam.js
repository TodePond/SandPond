TodeSplat`

element Steam {

	colour "lightgrey"
	emissive "darkgrey"
	
	floor true
	
	output W ({space}) => setSpaceAtom(space, makeAtom(Water))
	
	rule 0.0002 { @ => W }
	
	rule {
		_ => @
		@    _
	}
	
	rule xz { @_ => _@ }
	
}

`