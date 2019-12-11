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

element SandLeaver {
	
	colour "brown"
	emissive "brown"
		
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

`