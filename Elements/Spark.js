TodeSplat`

element Spark {

	colour "lightyellow"
	emissive "orange"
	category "sandbox"
	
	input s ({space, args}) => {
		if (space && space.atom && space.atom.type == Spark) args.success = true
		return true
	}
	
	rule 0.2 { @ => _}
	rule XYZ 0.5 { @s => ?? => _s }
	rule xyz { @_ => @@ }
	
	
}

element Explosion {

	colour "lightyellow"
	emissive "orange"
	
	data timer 1000
	
	output t ({self}) => self.timer--
	input d ({self}) => self.timer <= 0
	
	output e ({space, self}) => {
		if (space) SPACE.setAtom(space, self)
	}
	
	
	action { @ => t }
	rule { @d => _. }
	
	rule xyz { @* => @e }
	rule xyz { @* => @e }
	rule xyz { @* => @e }
	rule xyz { @* => @e }
	
	
}

element RedExplosion {

	colour "red"
	emissive "darkred"
	
	data timer 1000
	
	output t ({self}) => self.timer--
	input d ({self}) => self.timer <= 0
	
	output e ({space, self}) => {
		if (space) SPACE.setAtom(space, self)
	}
	
	
	action { @ => t }
	rule { @d => _. }
	
	rule xyz { @* => @e }
	rule xyz { @* => @e }
	rule xyz { @* => @e }
	rule xyz { @* => @e }
	
	
}

element BlueExplosion {

	colour "blue"
	emissive "darkblue"
	
	data timer 1000
	
	output t ({self}) => self.timer--
	input d ({self}) => self.timer <= 0
	
	output e ({space, self}) => {
		if (space) SPACE.setAtom(space, self)
	}
	
	
	action { @ => t }
	rule { @d => _. }
	
	rule xyz { @* => @e }
	rule xyz { @* => @e }
	rule xyz { @* => @e }
	rule xyz { @* => @e }
	
	
}

element BlueSpark {

	colour "lightblue"
	emissive "lightblue"
	
	input s ({space, args}) => {
		if (space && space.atom && space.atom.type == BlueSpark) args.success = true
		return true
	}
	rule 0.2 { @ => _}
	rule XYZ 0.5 { @s => ?? => _s }
	rule xyz { @_ => @@ }
	
	
}

element Lightning {
	colour "yellow"
	emissive "orange"
	category "sandbox"
	
	precise true
	pour false
	
	input l ({space, args}) => {
		if (space && space.atom && space.atom.type == Lightning) args.success = false
		return true
	}
	
	input L ({space}) => space && space.atom && space.atom.type == Lightning
	input n ({space}) => !space || !space.atom || (space && space.atom && space.atom.type != Lightning)
	
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
	
	input L ({space}) => space && space.atom && space.atom.type == Lightning
	input n ({space}) => space && space.atom && space.atom.type != Lightning
	
	
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
	
	input F ({space}) => space && space.atom && space.atom.type == LightningFlash
	
	rule {
		@ => _
		F    @
	}
	
	rule {
		@ => _
	}
	
}

`