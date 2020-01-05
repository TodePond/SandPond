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

`
