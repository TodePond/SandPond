





TodeSplat`



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
	
	@_ => @@
}

element Water {
	colour "lightblue"
	emissive "blue"
	opacity 0.5
}

element Slime {
	colour "lightgreen"
	emissive "green"
	opacity 0.65
}

element Lava {
	colour {
		return "red"
	}
	action {
		_ => _
		@    @
	}
	mimic(Slime)
}

element Fire {
	colour [
		"darkorange",
		"lol",
	][0]
	emissive "red"
	
	opacity 0.3
	
	maybe(0.5) @_ => _@
	
}

element Wall prop state "solid"

element DReg {
	colour "brown"
	mimic(Res)
}

element Res any(xyz) {
	opacity 0.5
	prop lol "losl"
	@_ => _@
}

element SuperForkbomb for(xyz) @_ => @@

`
