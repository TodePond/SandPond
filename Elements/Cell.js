TodeSplat`

element Cell {

	colour "#c0c"
	category "t2tile"
	precise true
	pour false
	
	output C ({space}) => SPACE.setAtom(space, ATOM.make(Cytoplasm))
	output I ({space}) => SPACE.setAtom(space, ATOM.make(InnerMembrane))
	output O ({space}) => SPACE.setAtom(space, ATOM.make(OuterMembrane))
	
	rule XY {
		  _      I
		  _      I
		@ _ => C I
	}
	
}

element Cytoplasm {
	colour "#2d3"
	hidden true
	
	input I extends # ({space}) => space.atom.element == InnerMembrane
	input O extends # ({space}) => space.atom.element == OuterMembrane
	
	output I ({space}) => SPACE.setAtom(space, ATOM.make(InnerMembrane))
	
	rule xy { @_ => _@ }
	
}

element InnerMembrane {
	colour "#6789ab"
	hidden true
	
	input C extends # ({space}) => space.atom.element == Cytoplasm
	input I extends # ({space}) => space.atom.element == InnerMembrane
	input O extends # ({space}) => space.atom.element == OuterMembrane
	
	output I ({space}) => SPACE.setAtom(space, ATOM.make(InnerMembrane))
	output T ({space}) => SPACE.setAtom(space, ATOM.make(CellTrail))
	output O ({space}) => SPACE.setAtom(space, ATOM.make(OuterMembrane))
	
	input i ({space, args}) => {
		if (!args.threshold) {
			args.score = 0
			args.threshold = 4
		}
		if (space && space.atom && space.atom.element == InnerMembrane) args.score++
		return true
	}
	
	/*rule XY {
		@i => ^^ => _i
	}*/
	
	
	
	/*rule xy {
	    _I    _I
		_I    _I
		@_ => _@
		_I    _I
		_I    _I
	}
	
	rule xy {
		I     I
		I     I
		@_ => _@
		I     I
		I     I
	}*/
	
	
	
}

element CellTrail {
	colour "blue"
	hidden true

	
}

element OuterMembrane {
	colour "#456789"
	hidden true

	
}

`
