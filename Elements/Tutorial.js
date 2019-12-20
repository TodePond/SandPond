TodeSplat`

element GreenSand {

	colour "green"
	category "Tutorial"

	given W (element) => element == PinkWater
	change W () => new PinkWater()
	
	rule {
		@ => W
		W    @
	}
	
	rule xz {
		@  => W
		#W    #@
	}
	
	rule {
		@ => _
		_    @
	}
	
	rule xz {
		@  => _
		#_    #@
	}
	
}

element PinkWater {

	colour "pink"
	emissive "purple"
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

element RedSlime {

	colour "red"
	emissive "darkred"
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

element BlueSnow {
	
	colour "lightblue"
	emissive "blue"
	category "Tutorial"
	default true
	
	change W () => new PinkWater()
	rule 0.0001 { @ => W }
	ruleset GreenSand
	
}

`