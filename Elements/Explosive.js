TodeSplat` 

element Spark {

	colour "lightyellow"
	emissive "orange"
	category "Explosive"
	state "effect"
	given s (element, self) => element == self.element
	keep s
	
	rule 0.2 { @ => _}
	rule xyz { @s => _s }
	rule xyz 0.4 { @_ => @@ }
	
	
}

element BlueSpark {

	colour "lightblue"
	emissive "lightblue"
	category "Explosive"
	state "effect"
	ruleset Spark
	
}

element Explosion {

	colour "lightyellow"
	emissive "orange"
	category "Explosive"
	state "effect"
	data timer 20
	
	given t (self) => self.timer--
	given d (self) => self.timer <= 0
	change E (self) => new self.element({timer: self.timer})
	
	action { @t => .. }
	rule { @d => _. }
	
	rule xyz { @. => @E }
	
}

element RedExplosion {

	colour "red"
	emissive "darkred"
	category "Explosive"
	state "effect"
	data timer 20
	
	ruleset Explosion
	
}

element BlueExplosion {

	colour "blue"
	emissive "darkblue"
	category "Explosive"
	state "effect"
	data timer 20
	
	ruleset Explosion
	
}

element GunPowder {
	
	colour "grey"
	emissive "brown"
	category "Explosive"
	state "solid"
	
	given H (element) => element == Fire || element == Lava || element == Explosion
	change E (self) => new Explosion()
	
	rule xyz { @H => EE }
	ruleset Powder
	
}

element Lightning {
	colour "yellow"
	emissive "orange"
	category "Explosive"
	default true
	state "effect"
	precise true
	pour false
	
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
	
	given F (element) => element == LightningFlash
	
	rule {
		@ => _
		F    @
	}
	
	rule {
		@ => _
	}
	
}

`
