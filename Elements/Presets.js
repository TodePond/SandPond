TodeSplat`

element Powder {
	
	colour "grey"
	category "Presets"
	hidden true
	
	state "solid"
	
	given D (space, element) => space && (!element || element.state == "liquid" || element.state == "gloop" || element.state == "gas" || element.state == "effect")
	select D (atom) => atom
	change D (selected) => selected
	
	given T (space, element) => space && (!element || element.state == "liquid" || element.state == "gloop" || element.state == "gas" || element.state == "effect")
	select T (atom) => atom
	change T (selected) => selected
	
	rule {
		@ => D
		D    @
	}
	
	rule xz {
		@T => TD
		#D    #@
	}
	
}

element Solid {
	colour "grey"
	category "Presets"
	hidden true
	
	state "solid"
	
	given D (space, element) => space && (!element || element.state == "liquid" || element.state == "gloop" || element.state == "gas" || element.state == "effect")
	select D (atom) => atom
	change D (selected) => selected
	
	rule {
		@ => D
		D    @
	}
}

element Liquid {
	
	colour "grey"
	category "Presets"
	hidden true
	
	state "liquid"
	
	given D (space, element) => space && (!element || element.state == "gas" || element.state == "effect")
	select D (atom) => atom
	change D (selected) => selected
	
	given T (space, element) => space && (!element || element.state == "gas" || element.state == "effect")
	select T (atom) => atom
	change T (selected) => selected
	
	rule {
		@ => D
		D    @
	}
	
	rule xz {
		@T => TD
		#D    #@
	}
	
	rule xz {
		@D    D@
		#  => #
	}
	
}

element Gloop {
	
	colour "grey"
	category "Presets"
	hidden true
	
	state "gloop"
	
	given D (space, element) => space && (!element || element.state == "liquid" || element.state == "gas" || element.state == "effect")
	select D (atom) => atom
	change D (selected) => selected
	
	given T (space, element) => space && (!element || element.state == "liquid" || element.state == "gas" || element.state == "effect")
	select T (atom) => atom
	change T (selected) => selected
	
	rule {
		@ => D
		D    @
	}
	
	rule xz 0.1 {
		@T => TD
		#D    #@
	}
	
	rule xz 0.05 {
		@D    D@
		#  => #
	}
	
}

`