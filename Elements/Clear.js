TodeSplat`

element Clear {

	colour "brown"
	emissive "brown"
	precise true
	category "clear"
	
	input t ({space, args}) => {
		if (space && space.atom && space.atom.type == ClearDone) {
			args.success = true
		}
		return true
	}
	
	input e ({space, args}) => {
		if (!space) {
			args.success = true
		}
		return true
	}
	
	input D ({space}) => space && space.atom && space.atom.type == ClearDone
	output D ({space}) => Space.setAtom(space, makeAtom(ClearDone))
	output c ({space}) => { if (space) Space.setAtom(space, makeAtom(Clear)) }
	
	rule XYZ { @t => ?? => D. }
	rule XY { @e => ?? => D. }
	rule XYZ { @- => .c }
	
}

element ClearDone {

	colour "blue"
	emissive "blue"
	hidden true
	
	input c ({space, args}) => {
		if (space && space.atom && space.atom.type == Clear) {
			args.failure = true
		}
		return true
	}
	
	output B ({space}) => Space.setAtom(space, makeAtom(ClearBomb))
	
	rule XYZ { @c => !! => B. }
	
}

element ClearBomb {
	colour "black"
	emissive "black"
	hidden true
	
	output e ({space}) => {
		if (space) Space.setAtom(space, undefined)
	}
	
	rule XYZ { @- => ee }
}

`