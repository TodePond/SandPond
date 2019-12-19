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

`