TodeSplat` 

element Sand {
	default true
	colour "#ffcc00"
	emissive "#ffa34d"
	category "Sandbox"
	
	given D (space, element) => (space && !element) || element == Water
	select D (atom) => atom
	check D () => Math.random() < 0.5
	change D (selected) => selected
	
	given T (space, element) => (space && !element) || element == Water
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

element Water {
	
	colour "lightblue"
	emissive "blue"
	opacity 0.5
	
	category "Sandbox"
	
	given H (element) => element == Fire || element == Lava
	keep H
	
	change S () => ATOM.make(Steam)
	
	rule xyz { @H => SH }
	
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

element Fire {
	colour "orange"
	emissive "red"
	category "Sandbox"
	
	floor true
	
	rule 0.3 { @ => _ }
	rule {
		_ => @
		@    _
	}
	
	rule {
		x => x
		@    _
	}
	
}

element Lava {
	colour "red"
	emissive "darkred"
	category "Sandbox"
	
	state "liquid"
	
	change F () => ATOM.make(Fire)
	
	action {
		_ => F
		@    @
	}
	
	ruleset Gloop
	
}

element Snow {
	colour "white"
	emissive "grey"
	
	category "Sandbox"
	
	given H (element) => element == Lava || element == Fire
	keep H
	change W () => ATOM.make(Water)
	
	rule 0.0005 { @ => W }
	rule xyz { @H => WH }
	
	ruleset Powder
	
}

element Steam {
	colour "lightgrey"
	emissive "darkgrey"
	category "Sandbox"
	opacity 0.3
	floor true
	
	change W () => ATOM.make(Water)
	
	rule 0.0002 { @ => W }
	
	rule {
		_ => @
		@    _
	}
	
	rule xz { @_ => _@ }
	
}

`
