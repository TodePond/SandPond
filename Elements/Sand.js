TodeSplat`


element Sand {

	colour "#ffcc00"
	emissive "#ffa34d"
	category "Sandbox"
	
	given @ () => true
	given # ({atom}) => atom
	change @ ({self}) => self
	
	given D ({space, element}) => (space && !element) || element == Water
	select D ({atom}) => atom
	change D ({selected}) => selected
	
	given T ({element}) => !element || element == Water
	
	rule {
		@ => D
		D    @
	}
	
	rule xz {
		@T => DT
		#D    #@
	}
	
	
}

element Water {
	
	colour "lightblue"
	emissive "blue"
	opacity 0.5
	
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
		@_ => __
		#_    #@
	}
	
	rule xz {
		@_ => _@
		#     #
	}
	
}

element Forkbomb {

	colour "grey"
	emissive "black"
	category "T2Tile"
	
	given @ () => true
	given _ ({space}) => space && !space.atom
	
	change @ ({self}) => self
	
	rule xyz { @_ => @@ }
	
	
}




`