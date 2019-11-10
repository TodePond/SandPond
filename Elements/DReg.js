TodeSplat`

element DReg {

	colour "brown"
	emissive "brown"
	opacity 0.3
	category "t2tile"
	
	input D ({space}) => space && space.atom && space.atom.element == DReg
	input n ({space}) => space && space.atom && space.atom.element != DReg
	
	output R ({space}) => SPACE.setAtom(space, ATOM.make(Res))
	output D ({space}) => SPACE.setAtom(space, ATOM.make(DReg))
	
	rule xyz 0.001 { @_ => @D }
	rule xyz 0.005 { @_ => @R }
	rule xyz 0.1 { @D => @_ }
	rule xyz 0.01 { @n => @_ }
	action xyz { @_ => _@ }
	
	// Aspirational Code
	/*
	
	input D extends # ({space}) => space.atom.element == DReg
	input n extends # ({space}) => space.atom.element != DReg
	
	output R ({space}) => SPACE.setAtom(space, ATOM.make(Res))
	output D ({space}) => SPACE.setAtom(space, ATOM.make(DReg))
	
	rule xyz { @_ => {
		rule xyz 0.001 { => @D }
		rule xyz 0.005 { => @R }
	}}
	
	rule xyz { @# => {
		rule xyz 0.1 { *D => @_ }
		rule xyz 0.01 { *n => @_ }
	}}
	
	action xyz { @_ => _@ }
	
	*/
	
}

`
