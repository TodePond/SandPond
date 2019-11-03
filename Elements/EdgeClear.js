TodeSplat`

element EdgeClear {

	colour "brown"
	emissive "brown"
	precise true
	family "EdgeClear"
	category "clear"
	
	output E ({space}) => SPACE.setAtom(space, ATOM.make(EdgeClearEdge))
	input N ({space}) => {
		if (!space) return false
		if (!space.atom) return true
		if (space.atom.type.family != "EdgeClear") return true
	}
	
	rule { @NN => @@@ }
	rule { @N => @@ }
	rule { @x => Ex }
}

element EdgeClearEdge {
	colour "blue"
	emissive "darkblue"
	hidden true
	family "EdgeClear"
	
	input E ({space}) => {
		if (!space) return true
		if (space.atom && space.atom.type.family == "EdgeClear") return true
	}
	
	output B ({space}) => SPACE.setAtom(space, ATOM.make(EdgeClearBomb))
	
	rule Y {
		@ => B
		E    .
	}
	
	rule Y {
		@ => @
		.    @
	}
	
}

element EdgeClearBomb {
	colour "grey"
	emissive "black"
	hidden true
	family "EdgeClear"
	
	input N ({space}) => {
		if (!space) return false
		if (!space.atom) return true
		if (space.atom.type == EdgeClear) return true
		if (space.atom.type.family != "EdgeClear") return true
	}
	
	input B ({space}) => space && space.atom && space.atom.type == EdgeClearBomb
	input D ({space}) => space && space.atom && space.atom.type == EdgeClearDone
	output D ({space}) => SPACE.setAtom(space, ATOM.make(EdgeClearDone))
	
	
	rule { NN@ => @@@ }
	rule { N@ => @@ }
	
	rule xy { D@ => DD }
	rule XY { B@ => BD }
	
	
}

element EdgeClearDone {
	colour "lightgreen"
	emissive "green"
	hidden true
	family "EdgeClear"
	
	input b ({space, args}) => {
		if (!space) return true
		if (!space.atom) return true
		if (space.atom.type == EdgeClearBomb) args.success = false
		return true
	}
	
	rule XY { b@ => !! => b_ }
}
`