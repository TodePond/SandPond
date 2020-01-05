TodeSplat`

element Lightning {
	colour "yellow"
	emissive "orange"
	category "sandbox"
	
	precise true
	pour false
	
	input l ({space, args}) => {
		if (space && space.atom && space.atom.element == Lightning) args.success = false
		return true
	}
	
	input L extends # ({space}) => space.atom.element == Lightning
	input n ({space}) => !space || (space && space.atom && space.atom.element != Lightning)
	
	output F ({space}) => SPACE.setAtom(space, ATOM.make(LightningFlash))
	
	output S ({space}) => SPACE.setAtom(space, ATOM.make(Spark))
	action xz 0.3 { @_ => @S }
	
	rule {
		@ => @
		_    @
	}
	rule {
		@ => F
		n    n
	}
	
	
}

element LightningFlash {
	colour "lightblue"
	emissive "lightblue"
	hidden true
	
	input L extends # ({space}) => space.atom.element == Lightning
	input n extends # ({space}) => space.atom.element != Lightning
	
	output B ({space}) => SPACE.setAtom(space, ATOM.make(LightningBang))
	
	output S ({space}) => SPACE.setAtom(space, ATOM.make(BlueSpark))
	action xz 0.5 { @_ => @S }
	
	rule {
		L => @
		@    @
	}
	
	rule {
		_ => _
		@    B
	}
	
}

element LightningBang {
	colour "white"
	emissive "white"
	hidden true
	
	input F extends # ({space}) => space.atom.element == LightningFlash
	
	rule {
		@ => _
		F    @
	}
	
	rule {
		@ => _
	}
	
}

`