TodeSplat`

element Cloud {

	colour "lightgrey"
	emissive "grey"
	category "sandbox"
	
	output W ({space}) => SPACE.setAtom(space, ATOM.make(Water))
	
	rule 0.1 { 
		@ => @
		_    W
	}

	rule xz 0.02 { @_ => _@ }
	action 0.005 { @ => W }
	
}

`