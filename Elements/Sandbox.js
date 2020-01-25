TodeSplat` 

element Sand {
	default true
	colour "#ffcc00"
	emissive "#ffa34d"
	category "Sandbox"
	
	ruleset Powder
	
}

element Water {
	
	colour "lightblue"
	emissive "blue"
	opacity 0.5
	category "Sandbox"
	state "liquid"
	
	given H (element) => element && element.isHot
	keep H
	
	change S () => new Steam()
	
	rule xyz { @H => SH }
	ruleset Liquid
	
}

element Fire {
	colour "orange"
	emissive "red"
	category "Sandbox"
	floor true
	ignites true
	isHot true
	
	state "effect"
	
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

/*element Flame {
	colour "orange"
	emissive "red"
	category "Sandbox"
	floor true
	ignites true
	isHot true
	precise true
	
	state "effect"
	
	rule 0.03 { @ => _ }
	
	change F () => new Fire()
	rule {
		_ => F
		@    @
	}
	rule xyz { @_ => @F  }
	
}*/

element Lava {
	colour "red"
	emissive "darkred"
	category "Sandbox"
	opacity 0.7
	ignites true
	isHot true
	
	state "gloop"
	
	change F () => new Fire()
	
	action 0.25 {
		_ => F
		@    @
	}
	
	ruleset Gloop
	
}

element Slime {
	colour "lightgreen"
	emissive "green"
	category "Sandbox"
	opacity 0.7
	state "gloop"
	ruleset Gloop
}

element Snow {
	colour "white"
	emissive "grey"
	
	category "Sandbox"
	state "solid"
	
	given H (element) => element && element.isHot
	keep H
	change W () => new Water()
	
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
	state "gas"
	
	change W () => new Water()
	
	rule 0.0002 { @ => W }
	
	rule {
		_ => @
		@    _
	}
	
	rule xz { @_ => _@ }
	
}

element WallSeed {
	colour "rgb(128, 128, 128)"
	emissive "rgb(2, 128, 200)"
	category "Sandbox"
	state "solid"
	
	data fuel 10
	
	ruleset Solid
	
	given W (element) => element == Solid || element == WallSeed
	given W (self) => self.fuel == 10
	rule {
		@ => _
		W    .
	}
	
	change W () => new Solid()
	change S (self) => {
		self.fuel--
		if (self.fuel > 0) return self
	}

	rule {
		_ => S
		@    W
	}
	
}

`
