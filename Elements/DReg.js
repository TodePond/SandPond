TodeSPLAT `


element DReg {

	colour "brown"
	emissive "brown"
	opacity 0.3
	
	input . (space) => space
	
	output _ (space) => setSpaceAtom(space, undefined)
	output R (space) => setSpaceAtom(space, new Atom(Res))
	output D (space) => setSpaceAtom(space, new Atom(DReg))
	output @ (space, self) => setSpaceAtom(space, self)
	
	input @ () => Math.random() < 0.01
	rule { @. => R@ }
	
	input @ () => Math.random() < 0.001
	rule { @. => D@ }
	
	input @ () => true
	rule { @. => _@ }
	
}




`