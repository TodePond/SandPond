let fireworkColour = 0

TodeSplat` 

element Spark {

	colour "lightyellow"
	emissive "orange"
	category "Electronics"
	state "effect"
	ignites true
	floor true
	given s (element, self) => element == self.element
	keep s
	electric true
	
	rule 0.2 { @ => _}
	rule xyz { @s => _s }
	rule xyz 0.4 { @_ => @@ }
	
	
}

element NonWireSpark {

	wireIgnore true
	colour "lightyellow"
	emissive "orange"
	state "effect"
	ignites true
	floor true
	electric true
	
	ruleset Spark
	
	
}

element BlueSpark {

	floor true
	colour "lightblue"
	emissive "lightblue"
	state "effect"
	ignites true
	ruleset Spark
	electric true
	
}

element Explosion {

	floor true
	colour "lightyellow"
	emissive "orange"
	category "Explosive"
	state "effect"
	ignites true
	data timer 20
	isHot true
	
	keep t (self, space) => self.timer--
	given d (self) => self.timer <= 0
	change E (self) => new self.element({timer: self.timer})
	
	action { @ => t }
	rule { @d => _. }
	
	rule xyz { @. => @E }
	
}

element RedExplosion {

	floor true
	colour "red"
	emissive "darkred"
	category "Explosive"
	state "effect"
	ignites true
	data timer 20
	isHot true
	
	ruleset Explosion
	
}

element BlueExplosion {

	floor true
	colour "blue"
	emissive "darkblue"
	category "Explosive"
	state "effect"
	ignites true
	data timer 20
	isHot true
	
	ruleset Explosion
	
}

element GunPowder {
	
	colour "grey"
	emissive "brown"
	category "Explosive"
	state "solid"
	
	given H (element) => element && element.ignites
	change E (self) => new Explosion()
	
	rule xyz { @H => EE }
	ruleset Powder
	
}

element Lightning {
	colour "yellow"
	emissive "orange"
	category "Electronics"
	state "effect"
	ignites true
	precise true
	pour false
	electric true
	
	change S () => new Spark()
	action xz 0.3 { @_ => @S }
	
	rule {
		@ => @
		_    @
	}
	
	given N (space, element) => !space || element != Lightning
	keep N
	change F () => new LightningFlash()
	rule {
		@ => F
		N    N
	}
	
}

element LightningFlash {
	colour "lightblue"
	emissive "lightblue"
	hidden true
	state "effect"
	ignites true
	electric true
	
	change S () => new BlueSpark()
	action xz 0.5 { @_ => @S }
	
	change B () => new LightningBang
	rule {
		_ => _
		@    B
	}
}

element LightningBang {
	colour "white"
	emissive "white"
	hidden true
	state "effect"
	ignites true
	electric true
	
	given F (element) => element == LightningFlash
	
	rule {
		@ => _
		F    @
	}
	
	rule {
		@ => _
	}
	
}

element Firework {

	colour "grey"
	emissive "black"
	precise true
	pour false
	floor true
	category "Explosive"
	state "solid"
		
	data timer 25
	
	change E (self) => {
		if (self.timer > 0) return self
		fireworkColour++
		if (fireworkColour >= 3) fireworkColour = 0
		if (fireworkColour == 0) return new Explosion()
		else if (fireworkColour == 1) return new RedExplosion()
		else if (fireworkColour == 2) return new BlueExplosion()
	}
	
	change F (self) => {
		self.timer--
		return new Fire()
	}
	
	rule {
		_ => E
		@    F
	}
	
}

element Rocket {

	colour "grey"
	emissive "black"
	precise true
	pour false
	category "Explosive"
	state "solid"
	
	ruleset Solid
	
	given I (element) => element && element.ignites
	change F () => new Firework()
	rule xyz { @I => F. }
	
}

`
