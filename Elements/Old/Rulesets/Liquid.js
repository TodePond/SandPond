TodeSplat`

element Liquid {
	
	state "liquid"
	
	rule {
		@ => _
		_    @
	}
	
	rule xz {
		@_ => __
		#_    #@
	}
	
	rule xz {
		@_    _@
		#  => #
	}
	
}

`