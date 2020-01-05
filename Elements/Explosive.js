TodeSplat` 

element Spark {

	colour "lightyellow"
	emissive "orange"
	category "Explosive"
	
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
	
	ruleset Spark
	
}

element Explosion {

	colour "lightyellow"
	emissive "orange"
	category "Explosive"
	
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
	
	data timer 20
	
	ruleset Explosion
	
}

element BlueExplosion {

	colour "blue"
	emissive "darkblue"
	category "Explosive"
	
	data timer 20
	
	ruleset Explosion
	
}

`
