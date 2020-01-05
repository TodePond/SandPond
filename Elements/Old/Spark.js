TodeSplat`

element Spark {

	colour "lightyellow"
	emissive "orange"
	category "sandbox"
	
	input s ({space, self, args}) => {
		if (space && space.atom && space.atom.element == self.element) args.success = true
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
	
}

element RedExplosion {

	colour "red"
	emissive "darkred"
	
	data timer 1000
	
	ruleset Explosion
	
}

element BlueExplosion {

	colour "blue"
	emissive "darkblue"
	
	data timer 1000
	
	ruleset Explosion
	
}

element BlueSpark {

	colour "lightblue"
	emissive "lightblue"
	
	ruleset Spark
	
}

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