TodeSplat`

element Sand {

	colour "#ffcc00"
	emissive "#ffa34d"
	category "Sandbox"
	
	given W (element) => element == Water
	change W () => new Water()
	
	
	rule {
		@ => _
		_    @
	}
	
	rule xz {
		@  => _
		#_    #@
	}
	
}

`