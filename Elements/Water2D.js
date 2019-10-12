TodeSplat`

element Water2D {

	colour "lightblue"
	emissive "blue"
	
	floor true
	state "liquid"
	
	rule top {
		@ => _
		_    @
	}
	
	rule x top {
		@  => _
		#_    #@
	}
	
	rule x top {
		@_ => _@
		#     #
	}
	
}

`