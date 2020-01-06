TodeSplat` 

element Sand {
	default true
	colour "#ffcc00"
	emissive "#ffa34d"
	category "Simple"
	
	rule {
		@ => _
		_    @
	}
	
	for(x) rule {
		@  => _
		#_    #@
	}
	
}

`

