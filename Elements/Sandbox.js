TodeSplat`

element Sand {

	colour "#ffcc00"
	emissive "#ffa34d"
	category "Sandbox"
	
	given D (space) => space
	given D (element) => element == Water || element == undefined
	select D (atom) => atom
	
	change D (selected) => selected
	
	rule {
		@ => D
		D    @
	}
	
	rule xz {
		@  => D
		#D    #@
	}
	
}

element Water {
	colour "lightblue"
	emissive "blue"
	opacity 0.5
	category "Sandbox"
	
	rule {
		@ => _
		_    @
	}
	
	rule xz {
		@_ => _@
		#     #
	}
}

`