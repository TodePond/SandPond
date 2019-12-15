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
		@_ => CC
	}
	
}

element Flubber {
	colour "#2d3"
	colour "green"
	//default true
	
	input F extends # ({space}) => space.atom.element == Flubber
	input N extends . ({space}) => !space.atom || space.atom.element != Flubber
	
	rule xy {
		 N       N
		N@_F => N_@F
		 N       N
	}
	
	rule xy {
		N@_F => N_@F
		 NF      NF
	}
	
	rule xy {
		 N       N
		N@_F => N_@F
		  F       F
	}
	
	rule xy {
		  F       F
		N@_F => N_@F
		  F       F
	}
	
	rule xy {
		 N      N
		N@_ => N_@
		  F      F
	}
	
	rule xy {
		  F      F
		N@_ => N_@
		  F      F
	}
	
	rule xy {
		NF    NF
		@_ => _@
		 F     F
	}
	
	rule xy {
		 N      N
		N@  => N_
		 F_     F@
	}
	
}

element Cytoplasm {

	colour "#2d3"
	colour "green"
	//hidden true
	
	input 4 ({space, args}) => {
		if (!args.threshold) {
			args.score = 0
			args.threshold = 4
		}
		if (space && !space.atom) args.score++
		return true
	}
	
	input 3 ({space, args}) => {
		if (!args.threshold) {
			args.score = 0
			args.threshold = 3
		}
		if (space && !space.atom) args.score++
		return true
	}
	
	input 2 ({space, args}) => {
		if (!args.threshold) {
			args.score = 0
			args.threshold = 2
		}
		if (space && !space.atom) args.score++
		return true
	}
	
	input 1 ({space, args}) => {
		if (!args.threshold) {
			args.score = 0
			args.threshold = 1
		}
		if (space && !space.atom) args.score++
		return true
	}
	
	input 1 ({space, args}) => {
		if (!args.threshold) {
			args.score = 0
			args.threshold = 0
		}
		if (space && !space.atom) args.score++
		return true
	}
	
	output c ({space}) => {
		if (space && !space.atom) {
			SPACE.setAtom(space, ATOM.make(Cytoplasm))
		}
	}
	
	rule XY 0.3 {
		@4 => == => _c
	}
	
	rule XY 1 {
		@4 => == => _.
	}
	
	rule XY 0.03 {
		@3 => == => _c
	}
	
	rule XY 0.01 {
		@3 => == => _.
	}
	
	rule XY 0.01 {
		@2 => == => @c
	}
	
	rule XY 0.01 {
		@2 => == => _.
	}
	
	rule XY 0.01 {
		@1 => == => @c
	}
	
	rule XY 0.03 {
		@1 => == => _.
	}
	
	rule XY 0.02 {
		@0 => == => _.
	}
	
}


`
