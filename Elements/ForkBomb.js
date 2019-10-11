TodeSplat`


element ForkBomb {

	colour "grey"
	emissive "black"
	
	input _ (space) => space && space.atom == undefined
	output @ (space) => setSpaceAtom(space, makeAtom(ForkBomb))
	
	rule xyz { @_ => .@ }
	
}




`