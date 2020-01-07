TodeSplat` 

element Sand {
	colour "#ffcc00"
	emissive "#ffa34d"
	category "Simple"
	
	rule {
		@ => _
		_    @
	}
	
	for(xz) rule {
		@  => _
		#_    #@
	}
	
}

element ForkBomb {
	colour "grey"
	emissive "black"
	category "Simple"
	
	rule xyz { @_ => @@ }
	
}

element SuperForkBomb {
	colour "crimson"
	emissive "black"
	category "Simple"
	
	for(xyz) rule { @_ => @@ }
	
}

`

