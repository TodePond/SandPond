TodeSplat`

element Liquid {
	
	state "liquid"
	
	rule {
		@ => _
		_    @
	}
	
	rule xz {
		@  => _
		#_    #@
	}
	
	rule xz {
		@_    _@
		#  => #
	}
	
}

`