TodeSplat`

element Cloud {

	colour "lightgrey"
	emissive "grey"
	
	output W (space) => setSpaceAtom(space, makeAtom(Water))
	
	rule 0.1 { 
		@ => @
		_    W
	}

	rule xz 0.02 { @_ => _@ }
	rule 0.005 { @ => W }
	
}

`