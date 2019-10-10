TodeSPLAT`


element ForkBomb {

	colour "grey"
	emissive "black"
	
	input _ (space) => space && space.atom == undefined
	output @ (space) => setSpaceAtom(space, new Atom(ForkBomb))
	
	rule xyz { @_ => .@ }
	
}




`