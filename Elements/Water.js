TodeSplat`

element Water {

	colour "lightblue"
	emissive "blue"
	
	state "liquid"
	
	rule {
		@ => _
		_    @
	}
	
	rule xz {
		@_    _@
		#  => #
	}
	
}

`