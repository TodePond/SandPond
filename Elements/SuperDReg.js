TodeSplat`

element SuperDReg {

	colour "brown"
	emissive "brown"
	opacity 0.3
	
	output R ({space}) => setSpaceAtom(space, makeAtom(Res))
	output D ({space}) => setSpaceAtom(space, makeAtom(DReg))
	
	rule xyz 0.005 { @_ => R@ }
	rule xyz 0.001 { @_ => D@ }
	rule xyz { @. => _@ }

}

`
