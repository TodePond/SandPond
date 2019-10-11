TodeSplat`

element Sand2D {

	colour "darkorange"
	emissive "chocolate"
	
	floor true
	
	rule top {
		@ => _
		_    @
	}
	
	rule x top {
		@  => _
		#_    #@
	}
	
}

`