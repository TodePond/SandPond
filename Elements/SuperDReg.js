TodeSplat`

element SuperDReg {

	colour "brown"
	emissive "brown"
	opacity 0.3
	category "t2tile"
	
	output R ({space}) => SPACE.setAtom(space, ATOM.make(Res))
	output D ({space}) => SPACE.setAtom(space, ATOM.make(DReg))
	
	rule xyz 0.005 { @_ => R@ }
	rule xyz 0.001 { @_ => D@ }
	rule xyz { @. => _@ }

}

`
