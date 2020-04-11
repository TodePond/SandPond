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
	default true
	
	given I (element) => element == Input
	change I () => new Input()
	change D () => new Data()
	
	rule { @_ => _@ }
	rule { @I => _. }
	rule { @. => _. }
	
	action side yz { @_ => @I }
	action 0.001 { _@ => D@ }
	
	
}

`