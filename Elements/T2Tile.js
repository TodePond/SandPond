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

`