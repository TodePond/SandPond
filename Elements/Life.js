TodeSplat`

element Food {

	colour "brown"
	emissive "brown"
	category "Life"
	isFood true
	state "solid"
	
	ruleset Powder
	
}

element Ant {

	colour "grey"
	emissive "black"
	precise true
	pour false
	category "Life"
	state "solid"
	
	given F (element) => element && element.isFood
	
	rule 0.0005 { @ => _ }
	
	ruleset Solid
	
	rule xyz 0.02 { @F => @@ }
	rule xyz { @F => _@ }
	
	rule xz {
		 _ =>  @
		@.    _.
	}
	
}

element MountainMaker {
	
	colour "lightblue"
	emissive "red"
	category "Life"
	state "effect"
	
	change S () => new Sand()
	
	rule 0.4 {
		@ => S
	}
	
	rule xyz {
		@._ => ..@
	}
	
}

element SandLeaver {
	
	colour "brown"
	emissive "brown"
	category "Life"
	state "solid"
		
	change F () => new Sand()
	rule xyz 0.45 { @_ => @F }
	
	rule {
		@ => _
		_    @
	}
	
	rule xz {
		 _ =>  @
		@     _
	}
	
}

element FoodLeaver {
	
	colour "yellow"
	emissive "orange"
	category "Life"
	state "solid"
		
	change F () => new Food()
	rule xyz 0.45 { @_ => @F }
	
	rule {
		@ => _
		_    @
	}
	
	rule xz {
		 _ =>  @
		@     _
	}
	
}
element Cycler {

	colour "grey"
	emissive "black"
	category "Life"
	state "solid"
	
	rule {
		 x =>  x
		_@    @_
	}
	
	rule {
		_     @
		@x => _x
	}
	
	rule {
		@_ => _@
		x     x
	}
	
	rule {
		@ => _
		_    @
	}
	
}

element Plant {
	colour "green"
	category "Life"
	state "solid"
	
	// Gravity
	ruleset Powder
	
	// Grow
	rule xz 0.05 { @_ => @@ }
	
}

element Herbivore {
	colour "blue"
	emissive "darkblue"
	category "Life"
	state "solid"
	
	// Die
	rule 0.002 { @ => _ }
	
	// Gravity
	ruleset Powder
	
	// Reproduce
	given P (element) => element == Plant || (element && element.isFood)
	rule xyz 0.05 { @P => @@ }
	
	// Eat
	rule xyz { @P => @_ }
	
	// Move
	rule xz 0.5 { @_ => _@ }
}

`