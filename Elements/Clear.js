TodeSplat`

element Clear {

	colour "brown"
	emissive "brown"
	precise true
	category "clear"
	
	input t ({space, args}) => {
		if (space && space.atom && space.atom.element == ClearDone) {
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
	
	input D ({space}) => space && space.atom && space.atom.element == ClearDone
	output D ({space}) => SPACE.setAtom(space, ATOM.make(ClearDone))
	output c ({space}) => { if (space) SPACE.setAtom(space, ATOM.make(Clear)) }
	
	rule XYZ { @t => ?? => D. }
	rule XY { @e => ?? => D. }
	rule XYZ { @- => .c }
	
}

element ClearDone {

	colour "blue"
	emissive "blue"
	hidden true
	
	input c ({space, args}) => {
		if (space && space.atom && space.atom.element == Clear) {
			args.success = false
		}
		return true
	}
	
	output B ({space}) => SPACE.setAtom(space, ATOM.make(ClearBomb))
	
	rule XYZ { @c => !! => B. }
	
}

element ClearBomb {
	colour "black"
	emissive "black"
	hidden true
	
	output e ({space}) => {
		if (space) SPACE.setAtom(space, undefined)
	}
	
	rule XYZ { @- => ee }
}

`