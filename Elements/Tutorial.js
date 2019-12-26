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

`