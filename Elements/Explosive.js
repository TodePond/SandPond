TodeSplat` 

element Spark {

	colour "lightyellow"
	emissive "orange"
	category "Explosive"
	
	given s (element) => element == Spark
	keep s
	
	rule 0.2 { @ => _}
	rule xyz { @s => _s }
	rule xyz 0.4 { @_ => @@ }
	
	
}

element Explosion {

	colour "lightyellow"
	emissive "orange"
	category "Explosive"
	default true
	
	data timer 20
	
	given t (self) => self.timer--
	given d (self) => self.timer <= 0
	change E (self) => new Explosion({timer: self.timer})
	
	action { @t => .. }
	rule { @d => _. }
	
	rule xyz { @. => @E }
	
}

`
