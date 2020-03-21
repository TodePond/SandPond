TodeSplat`

element SandDemo {

	colour "#ffcc00"
	emissive "#ffa34d"
	category "Tutorial"
	
	given D (space) => space
	given D (element) => element == WaterDemo || element == SlimeDemo || element == undefined
	select D (atom) => atom
	
	change D (selected) => selected
	
	rule {
		@ => D
		D    @
	}
	
	rule xz {
		@  => D
		#D    #@
	}
	
}

element WaterDemo {

	colour "lightblue"
	emissive "blue"
	opacity 0.5
	category "Tutorial"
	
	rule {
		@ => _
		_    @
	}
	
	rule xz {
		@_ => _@
		#     #
	}
	
}

element SlimeDemo {

	colour "lightgreen"
	emissive "green"
	opacity 0.7
	category "Tutorial"
	
	rule {
		@ => _
		_    @
	}
	
	rule xz 0.1 {
		@_ => _@
		#     #
	}
	
}

element SnowDemo {
	
	colour "white"
	emissive "grey"
	category "Tutorial"
	
	change W () => new WaterDemo()
	rule 0.0001 { @ => W }
	ruleset SandDemo
	
}

element PlantDemo {
	colour "green"
	category "Tutorial"
	
	// Gravity
	ruleset SandDemo
	
	// Grow
	rule xz 0.05 { @_ => @@ }
	
}

element HerbivoreDemo {
	colour "blue"
	emissive "darkblue"
	category "Tutorial"
	
	// Die
	rule 0.002 { @ => _ }
	
	// Gravity
	ruleset SandDemo
	
	// Reproduce
	given P (element) => element == PlantDemo
	rule xyz 0.05 { @P => @@ }
	
	// Eat
	rule xyz { @P => @_ }
	
	// Move
	rule xz 0.5 { @_ => _@ }
}

element LavaDemo {
	colour "red"
	emissive "darkred"
	category "Tutorial"
	opacity 0.7
	
	change F () => new FireDemo()
	action {
		_ => F
		@    @
	}
	
	ruleset SlimeDemo
}

element FireDemo {
	colour "orange"
	emissive "red"
	category "Tutorial"
	opacity 0.5
	floor true
	
	rule 0.3 { @ => _ }
	
	rule {
		_ => @
		@    _
	}
	
	rule { @ => _ }
	
}

element EggDemo {
	colour "pink"
	emissive "grey"
	category "Tutorial"
	precise true
	pour false
	
	data timer 100
	
	// Countdown
	keep t (self) => self.timer--
	action { @ => t }
	
	// Hatch
	given h (self) => self.timer < 0
	change H () => new HerbivoreDemo()
	rule { h => H }
	
	// Fall
	rule {
		@ => _
		_    @
	}
}

element WindySandDemo {
	colour SandDemo.colour
	emissive SandDemo.emissive
	category "Tutorial"
	
	rule 0.3 { _@ => @_ }
	rule 0.2 {
		_  => @
		#@    #_
	}
	
	ruleset SandDemo
}



element Wood {
	colour "#946351"
	emissive "#5E3F34"
	floor true
	
	given F (element) => element == Fire
	change F () => new Fire()
	
	for(xz) rule { @F => FF }
	
}

element SymmetrySimple {
	
	colour "#FC0"
	emissive "#ffa34d"
	
	default true
	rule {
		@_ => _@
	}
	
}

element SymmetryComplex {
	
	colour "grey"
	
	
	rule x {
		@ => _
		_    @
	}
	
	rule xyz {
		@  => _
		#_    #@
	}
	
}





















`