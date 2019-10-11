TodeSplat`


element Cloud {

	colour "lightgrey"
	emissive "grey"
	
	input @ (space, args) => args.self = space.atom
	input . (space) => space
	input _ (space) => space && space.atom == undefined
	
	output _ (space) => setSpaceAtom(space, undefined)
	output W (space) => setSpaceAtom(space, makeAtom(Water))
	output @ (space, {self}) => setSpaceAtom(space, self)
	
	rule 0.1 { 
		@ => @
		_    W
	}
	
	rule xz 0.02 { @_ => _@ }
	rule 0.005 { @ => W }
	
}




`