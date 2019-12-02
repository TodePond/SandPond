TodeSplat`

element Powder {
	
	colour "grey"
	category "Presets"
	hidden true
	
	given D (space, element) => (space && !element) || element == Water
	select D (atom) => atom
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

element Liquid {
	
	colour "grey"
	category "Presets"
	hidden true
	
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

element Gloop {
	
	colour "grey"
	category "Presets"
	hidden true
	
	given w (space, atom, element) => space && (!atom || element == Water)
	select w (atom) => atom
	change w (selected) => selected
	
	rule {
		@ => w
		w    @
	}
	
	rule xz 0.1 {
		@  => w
		#w    #@
	}
	
	rule xz 0.05 {
		@w    w@
		#  => #
	}
	
}

`