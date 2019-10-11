TodeSplat`

element DReg {

	colour "brown"
	emissive "brown"
	opacity 0.3
	
	output R (space) => setSpaceAtom(space, makeAtom(Res))
	output D (space) => setSpaceAtom(space, makeAtom(DReg))
	
	rule xyz 0.01 { @. => R@ }
	rule xyz 0.001 { @. => D@ }
	rule xyz { @. => _@ }
	
}

`