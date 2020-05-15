SpaceTode`



origin @
given @ (self, atom) => self == atom
change @ (self) => self

change _ () => undefined
given _ (space) => space

given # (atom) => atom

keep .

element Sand any(xz) {
	colour "#FC0"
	emissive "#ffa34d"
	category "Sandbox"
	
	@ => _
	_    @
	
	@_ => _.
	#_    .@
	
}

element Tracker any(xyz) {
	colour "grey"
	emissive "black"
	precise true

	@_ => @@
}

element Trailer any(xyz) {
	colour "grey"
	emissive "black"
	precise true

	@_ => @@
}

element Trail any(xyz) {
	colour "grey"
	emissive "black"
	precise true
	hidden true

	@_ => @@
}

element Forkbomb any(xyz) {
	colour "grey"
	emissive "black"
	
	category "T2Tile"
	@_ => @@
}

element Water {
	colour "lightblue"
	emissive "blue"
	opacity 0.35
	category "Sandbox"
}

element Slime any(xz) {
	colour "lightgreen"
	emissive "green"
	opacity 0.65
	category "Sandbox"
}


element Steam {
	colour "lightgrey"
	emissive "darkgrey"
	category "Sandbox"
	opacity 0.3
	
	change W () => new Water()
	
}

element Lava {
	colour {
		return "red"
	}
	emissive "darkred"
	opacity 0.65
	action {
		_ => _
		@    @
	}
	mimic(Slime)
	category "Sandbox"
}

element Fire {
	colour [
		"darkorange",
		"lol",
	][0]
	emissive "red"
	
	opacity 0.35
	
	maybe(0.5) @_ => _@
	category "Sandbox"
	
}

element StickyStone {
	prop state "solid"
	category "Sandbox"
}

element Stone {
	prop state "solid"
	category "Sandbox"
}

element DReg {
	colour "brown"
	mimic(Res)
	category "T2Tile"
	opacity 0.1
}

element Res any(xyz) {
	opacity 0.1
	prop lol "losl"
	@_ => _@
	category "T2Tile"
}

element SuperForkbomb for(xyz) @_ => @@

`
