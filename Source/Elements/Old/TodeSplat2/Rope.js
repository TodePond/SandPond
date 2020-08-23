TodeSplat`

element Rope {

	colour "brown"
	precise true
	category "sandbox"
	pour false
	
	data remaining 50
	
	input r ({self}) => {
		if (!self.id) self.id = Math.random()
		return self.remaining > 0
	}
	input f ({self}) => self.remaining <= 0
	
	output P ({space, self}) => {
		self.remaining--
		const atom = ATOM.make(RopePart)
		atom.id = self.id
		SPACE.setAtom(space, atom)
	}
	
	rule { @f => _* }
	rule { @_ => P@ }
	rule { @x => Px }
}

element RopePart {
	colour "#3D1600"
	hidden true
	
	input P extends # ({space, self}) => space.atom.element == RopePart && space.atom.id == self.id

	input N ({space, self}) => {
		if (!space) return true
		if (!space.atom) return true
		if (space.atom.element == RopePart) {
			if (self.id != space.atom.id) return true
		}
	}
	
	input h ({space, args}) => {
		if (space && space.atom && (space.atom.element == Fire || space.atom.element == Lava)) args.success = true
		return true
	}
	
	output F ({space}) => {
		SPACE.setAtom(space, ATOM.make(Fire))
	}
	
	rule XYZ {
		 h =>  ? =>  .
		@h    ??    F.
	}
	
	rule {
		NNN    NNN
		 @  =>  _
		 _      @
	}
	
	rule x {
		PNN => PNN
		_@N    @_N
		  N      N
	}
	
	rule x {
		_@  => @_
		_PP    _PP
	}
	
	rule x {
		PP_ => PP_
		 @_     _@
	}
	
	rule x {
		 P  =>  P
		P@P    P_P
		_      @
	}
	
	/*rule x {
		@  => @
		PP    P_
		 _     P
	}*/
	
	/*rule {
		 NN     NN
		 @N =>  _N
		_PN    @PN
	}*/
	
	/*rule {
		P    P
		@ => T
		_    @
	}*/
	
}

element RopeTrail {
	hidden true
	colour "black"
	
}

element Plank {
	colour "brown"
	
	precise true
	category "sandbox"
	pour false
		
	output p ({space, id}) => {
		if (!space) return
		const atom = ATOM.make(BrickPart, {id})
		SPACE.setAtom(space, atom)
	}
	
	input i ({args, id}) => {
		if (!id) {
			args.id = Math.random()
		}
		else args.id = id
		return true
	}
	
	rule XZ top {
		@i* => ppp
		***    ppp
	}
	
}

element BrickPart {
	colour "saddlebrown"
	hidden true
	
	data id -1
	
	input p ({space, args, self}) => {
		if (space && space.atom && space.atom.element == BrickPart) {
			if (space.atom.id == self.id) args.success = true
		}
		return true
	}
	
	input n ({space, self}) => {
		if (!space) return true
		if (!space.atom) return true
		if (space.atom.element == BrickPart) {
			if (self.id != space.atom.id) return true
		}
	}
	
	rule XZ {
		n n    n n
		 @  =>  _
		 _      @
	}
	
}

element Stretch {
	colour "blue"
	hidden true
}

`