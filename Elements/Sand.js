TodeSplat`


element Sand {

	colour "#ffcc00"
	emissive "#ffa34d"
	category "Sandbox"
	
	given @ () => true
	given # ({space}) => space && space.atom
	given _ ({space}) => space && !space.atom
	
	change @ ({self}) => self
	change _ () => undefined
	
	rule {
		@ => _
		_    @
	}
	
	rule xz {
		@  => _
		#_    #@
	}
	
	
}

element Forkbomb {
	default true
	colour "grey"
	emissive "black"
	category "T2Tile"
	
	given @ () => true
	given _ ({space}) => space && !space.atom
	
	change @ ({self}) => self
	
	rule xyz { @_ => @@ }
	
	
}




`