TodeSplat`


element Sand {

	colour "#ffcc00"
	emissive "#ffa34d"
	category "Sandbox"
	
	given @ () => true
	given _ ({space}) => space && !space.atom
	
	change @ ({self}) => self
	change _ () => undefined
	
	rule {
		@ => _
		_    @
	}
	
	
}




`