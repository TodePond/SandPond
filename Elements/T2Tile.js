TodeSplat`

element ForkBomb {

	colour "grey"
	emissive "black"
	category "T2Tile"
	
	rule xyz { @_ => @@ }
	
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
	
	change R () => new Res()
	change D () => new DReg()
	
	rule xyz 0.001 { @_ => D@ }
	rule xyz 0.005 { @_ => R@ }
	rule xyz 0.1 { @D => _@ }
	rule xyz 0.01 { @n => _@ }
	rule xyz { @_ => _@ }
	
}

element Data {

	category "T2Tile"
	colour "grey"
	emissive "black"
	
	data initialised false
	data number undefined
	
	given u (self) => !self.initialised
	keep i (self) => {
		self.number = Math.floor(Math.random() * 100)
		self.initialised = true
		self.shaderEmissive.b = self.number * 2.55
		self.shaderEmissive.g = 255 - self.number * 2.55
	}
	action { u => i }
	rule xyz { @_ => _@ }
	
}

element Input {
	
	category "T2Tile"
	colour "rgb(0, 0, 255)"
	emissive "rgb(0, 0, 128)"
	data portalPower 0
	data edgePower 0
	
	given I (element) => element == Input
	change I () => new Input()
	change D (self) => new Data()
	change o (self) => {
		self.shaderOpacity = self.shaderOpacity - 5
		if (self.shaderOpacity < 0) self.shaderOpacity = 0
		return self
	}
	
	keep p (self) => {
		self.portalPower--
		if (self.portalPower < 0) self.portalPower = 0
		if (self.shaderOpacity > self.edgePower * 3 + self.portalPower * 3) return self
		self.shaderOpacity = self.edgePower * 3 + self.portalPower * 3
		return self
	}
	
	change P (self) => {
		self.portalPower = 20
		if (self.shaderOpacity > self.edgePower * 3 + self.portalPower * 3) return self
		self.shaderOpacity = self.edgePower * 3 + self.portalPower * 3
		return self
	}
	
	//action { @ => p }
	
	rule { @_ => _@ }
	rule { @I => _. }
	rule { @. => _. }
	
	action { @ => o }
	action side yz { @_ => @I }
	action 0.0001 { _@ => D@ }
	
	change e (self) => {
		self.edgePower = 20
		if (self.shaderOpacity > self.edgePower * 3 + self.portalPower * 3) return self
		self.shaderOpacity = self.edgePower * 3 + self.portalPower * 3
		return self
	}
	rule xz side {
		@x => e.
		x     .
	}
	rule xy side {
		@x => e.
		x     .
	}
	rule xz side {
		x     .
		@x => e.
	}
	rule xy side {
		x@ => .e
		 x     .
	}
	
	given E (element) => element == Input
	select E (atom) => atom
	change E (self, selected) => {
		self.edgePower = selected.edgePower - 1
		self.portalPower = selected.portalPower - 1
		if (selected.portalPower > 0) {}
		if (self.edgePower < 0.75) self.edgePower = 0.75
		if (self.portalPower < 0) self.portalPower = 0
		
		if (self.shaderOpacity > self.edgePower * 3 + self.portalPower * 3) return self
		self.shaderOpacity = self.edgePower * 3 + self.portalPower * 3
		return self
	}
	rule xyz { @E => E. }
	
	/*change v (self) => {
		if (self.edgePower != undefined && self.edgePower > 0) {
			//self.shaderOpacity = self.edgePower * 1
			self.edgePower--
		}
		return self
	}
	rule { @ => v }*/
	
	
}

`