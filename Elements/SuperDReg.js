TodeSplat`

element SuperDReg {

	colour "brown"
	emissive "brown"
	opacity 0.3
	category "t2tile"
	
	output R ({space}) => Space.setAtom(space, Atom.make(Res))
	output D ({space}) => Space.setAtom(space, Atom.make(DReg))
	
	rule xyz 0.005 { @_ => R@ }
	rule xyz 0.001 { @_ => D@ }
	rule xyz { @. => _@ }

}

`
