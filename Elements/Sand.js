TodeSplat`

given . true
keep .

given @ true
change @ (self) => self

given # (atom) => atom
keep #

given _ (space, atom) => space && !atom
change _ () => undefined

given x (space) => !space
keep x

element Sand {
	default true

	colour "#ffcc00"
	emissive "#ffa34d"
	category "Sandbox"
	
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

element Forkbomb {

	colour "grey"
	emissive "black"
	category "T2Tile"
	
	rule xyz { @_ => .@ }
	
}

element Res {

	colour "slategrey"
	emissive "grey"
	opacity 0.3
	category "T2Tile"
	isFood true
	
	rule xyz { @_ => _@ }
	
}


element DReg {

	colour "brown"
	emissive "brown"
	opacity 0.3
	category "T2Tile"
	
	given D (element) => element == DReg
	given n (atom, element) => atom && element != DReg
	
	change R () => ATOM.make(Res)
	change D () => ATOM.make(DReg)
	
	rule xyz 0.001 { @_ => @D }
	rule xyz 0.005 { @_ => @R }
	rule xyz 0.1 { @D => @_ }
	rule xyz 0.01 { @n => @_ }
	action xyz { @_ => _@ }
	
}

element Powder {
	
	colour "grey"
	category "Presets"
	
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

element Food {

	colour "brown"
	emissive "brown"
	category "Life"
	isFood true
	state "solid"
	
	ruleset Powder
	
}

element Gloop {
	
	colour "grey"
	category "Presets"
	
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