TodeSPLAT`


element Res {

	colour "slategrey"
	emissive "grey"
	opacity 0.3
	
	input @ (space, args) => args.self = space.atom
	input _ (space) => space && space.atom == undefined
	
	output _ (space) => setSpaceAtom(space, undefined)
	output @ (space, {self}) => setSpaceAtom(space, self)
	
	rule { @_ => _@ }
	
}




`