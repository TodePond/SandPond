TodeSplat`


element FatFly {

	colour "royalblue"
	emissive "darkblue"
	precise true
	pour false
	category "life"
	
	input e ({space, args}) => {
		if (space && !space.atom) args.success = true
		return true
	}
	
	input L ({space, args}) => {
		if (!space || !space.atom) return false
		if (space.atom.type == FatFlyLimb) return true
	}
	
	output L ({space, args}) => {
		SPACE.setAtom(space, ATOM.make(FatFlyLimb))
	}
	
	output l ({space}) => {
		if (space && !space.atom) {
			SPACE.setAtom(space, ATOM.make(FatFlyLimb))
		}
	}
	
	// Grow (or regrow) limbs
	rule XYZ {
		@e => ?? => @l
		 e     ?     l
	}
	
	rule xyz { @L_ => L@_ }
	
}

element FatFlyLimb {
	hidden true
	colour "royalblue"
	emissive "darkblue"
	
	input f ({space, args}) => {
		if (!space || !space.atom) return true
		if (space.atom.type == FatFly) args.success = true
		return true
	}
	
	rule XYZ {
		@f => ?? => ..
		 f     ?     .
	}
	
	rule { @ => _ }
	
}




`