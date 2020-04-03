TodeSplat`

element Wire {
	category "Electronics"
	colour "grey"
	emissive "black"
	//default true
	//pour false
	precise true
	floor true
	state "solid"
	
	ruleset Solid
	
	given W (element) => element == Wire
	rule {
		@ => _
		.    .
	}
	
	change W () => new Wire()
	rule top xz {
		@_ => @.
		_W    W.
	}
	
	given E (element) => element && element.electric && !element.wireIgnore
	change H () => new PulseHead()
	for(xz) rule { @E => H. }
	
	rule {
		E => .
		@    H
	}
	
}

element Shock {
	colour "yellow"
	emissive "orange"
	state "effect"
	electric true
	//category "Electronics"
	pour false
	floor true
	precise false
	
	rule { @ => _ }
}

element PulseHead {
	colour "lightblue"
	emissive "lightblue"
	state "solid"
	electric true
	wireIgnore true
	
	given u (self) => self.id == undefined
	keep i (self) => self.id = Math.random()
	action { u => i }
	
	given W (element) => element == Wire
	change T (self) => new PulseTrail({id: self.id})
	change H (self) => self
	for(xz) rule { @W => TH }
	
	given D (element) => element && element.isDevice
	for(xz) rule { @D => T. }
	
	given t (element, atom, self) => element == PulseTrail && atom.id != self.id
	//for(xz) rule { @t => .. }
	
	change S () => new NonWireSpark()
	//for(xz) rule { @_ => TS }
	
	rule { @ => T }
}

element PulseTrail {
	colour "grey"
	emissive "black"
	state "solid"
	
	electric true
	wireIgnore true
	
	given H (element, atom, self) => element == PulseHead && atom.id == self.id
	change W () => new Wire()
	for(xz) rule { @H => .. }
	
	rule { @ => W }
}

element Cut {
	opacity 0
	category "Electronics"
	
	floor true
	precise true
	//pour false
	
	rule {
		@ => _
		.    @
	}
	
	rule {
		@ => _
		x    .
	}
	
}

element Bulb {
	category "Electronics"
	colour "lightgrey"
	emissive "grey"
	
	pour false
	precise true
	floor true
	state "solid"
	isDevice true
	
	data power 10
	
	given L (element) => element == LightOn || element == LightOff
	change L (self) => {
		if (self.power > 0) {
			self.power--
			return new LightOn()
		} else {
			return new LightOff()
		}
	}
	
	given E (element) => element && element.electric
	keep P (self) => self.power = 20
	
	for(xz) action { @E => P. }
	action {
		E    .
		. => .
		@    P
	}
	
	action {
		@ => P
		E    .
	}
	
	rule {
		L    _
		@ => L
		_    @
	}
	
	rule {
		@ => L
		_    @
	}
	
	rule {
		_ => L
		@    @
	}
	
	rule {
		L => L
		@    @
	}
	
}

element LightOff {
	colour "#7dc1e3"
	emissive "#47597a"
	opacity 0.5
}

element LightOn {
	colour "yellow"
	opacity 0.8
	
}

element Battery {
	colour "brown"
	electric true
	state "solid"
	floor true
	precise true
	category "Electronics"
	pour false
}

`