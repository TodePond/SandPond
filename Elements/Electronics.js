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
	conductor true
	
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
	
	given E (atom, element) => atom && element != PulseHead && element != PulseTrail && (element.electric /*|| atom.electric*/)
	change H (self) => new PulseHead({parent: self})
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
	
	given u (self) => self.id == undefined
	keep i (self) => self.id = Math.random()
	action { u => i }
	
	given W (element, self, atom) => {
		if (element == Wire || element == Switch) {
			self.prevParent = self.parent
			self.parent = atom
			return true
		}
	}
	change T (self) => new PulseTrail({id: self.id, parent: self.prevParent})
	change H (self) => self
	for(xz) rule { @W => TH }
	
	given D (element, self, atom) => {
		if (element && element.conductor) {
			self.parent = atom
			return true
		}
	}
	for(xz) rule { @D => T. }
	
	change t (self) => new PulseTrail({id: self.id, parent: self.parent})
	rule { @ => t }
}

element PulseTrail {
	colour "grey"
	emissive "black"
	state "solid"
	
	electric true
	
	given H (element, atom, self) => element == PulseHead && atom.id == self.id
	change W (self) => self.parent
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
	conductor true
	
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

element Switch {
	colour "green"
	state "solid"
	floor true
	precise true
	category "Electronics"
	pour false
	conductor true
	
	given S () => !switchOn
	change S () => new SwitchOff()
	rule { S => S }
}

element SwitchOff {
	colour "lightblue"
	emissive "blue"
	state "solid"
	floor true
	precise true
	pour false
	
	given S () => switchOn
	change S () => new Switch()
	rule { S => S }
}

element ZappyAnt {
	colour "grey"
	emissive "black"
	state "solid"
	precise true
	pour false
	category "Life"
	default true
	
	given B (element) => element == ZappyAntBum
	change B () => new ZappyAntBum()
	
	rule {
		@ => B
		_    @
	}
	
	rule xz { @_ => B@ }
	rule xz { @B => .. }
	
	rule xz {
		 _ =>  @
		@     B
	}
	
}

element ZappyAntBum {
	colour "yellow"
	state "solid"
	
	change S () => new Spark()
	rule { @ => S }
	
}

`

let switchOn = true
on.keydown(e => {
	if (e.key == " ") {
		switchOn = !switchOn
	}
})


