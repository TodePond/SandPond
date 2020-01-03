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
	default true
	
	// Die
	rule 0.002 { @ => _ }
	
	// Gravity
	ruleset SandDemo
	
	// Eat
	given P (element) => element == PlantDemo
	rule xyz { @P => @_ }
	
	// Reproduce
	rule xyz 0.05 { @P => @@ }
	
	// Move
	rule xz 0.5 { @_ => _@ }
}



`