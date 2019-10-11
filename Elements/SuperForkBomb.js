TodeSPLAT`


element SuperForkBomb {

	colour "grey"
	emissive "black"
	
	input _ (space) => space && space.atom == undefined
	input . (space) => space
	output @ (space) => setSpaceAtom(space, makeAtom(SuperForkBomb))
	output _ (space) => setSpaceAtom(space, undefined)
	
	rule xyz { .@ => @. }
	
}




`