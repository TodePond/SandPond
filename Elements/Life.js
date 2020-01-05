TodeSplat`

element Food {

	colour "brown"
	emissive "brown"
	category "Life"
	isFood true
	state "solid"
	
	rule {
		@ => _
		_    @
	}
	
	rule xz {
		@_ => __
		#_    #@
	}
	
}

element MountainMaker {
	
	colour "lightblue"
	emissive "red"
	category "Life"
	
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
	
	// Gravity
	ruleset Powder
	
	// Grow
	rule xz 0.05 { @_ => @@ }
	
}

element Herbivore {
	colour "blue"
	emissive "darkblue"
	category "Life"
	
	// Die
	rule 0.002 { @ => _ }
	
	// Gravity
	ruleset Powder
	
	// Reproduce
	given P (element) => element == Plant
	rule xyz 0.05 { @P => @@ }
	
	// Eat
	rule xyz { @P => @_ }
	
	// Move
	rule xz 0.5 { @_ => _@ }
}

`