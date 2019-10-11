TodeSplat`


element DReg {

	colour "brown"
	emissive "brown"
	opacity 0.3
	
	input @ (space, args) => args.self = space.atom
	input . (space) => space
	
	output _ (space) => setSpaceAtom(space, undefined)
	output R (space) => setSpaceAtom(space, makeAtom(Res))
	output D (space) => setSpaceAtom(space, makeAtom(DReg))
	output @ (space, {self}) => setSpaceAtom(space, self)
	
	rule xyz 0.01 { @. => R@ }
	rule xyz 0.001 { @. => D@ }
	rule xyz { @. => _@ }
	
}




`