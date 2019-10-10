TodeSPLAT`


element DReg {

	colour "brown"
	emissive "brown"
	opacity 0.3
	
	input . (space) => space
	
	output _ (space) => setSpaceAtom(space, undefined)
	output R (space) => setSpaceAtom(space, makeAtom(Res))
	output D (space) => setSpaceAtom(space, makeAtom(DReg))
	output @ (space, {self}) => setSpaceAtom(space, self)
	
	input @ (space, args) => {
		args.self = space.atom
		return Math.random() < 0.01
	}
	rule xyz { @. => R@ }
	
	input @ (space, args) => {
		args.self = space.atom
		return Math.random() < 0.001
	}
	rule xyz { @. => D@ }
	
	input @ (space, args) => {
		args.self = space.atom
		return true
	}
	rule xyz { @. => _@ }
	
}




`