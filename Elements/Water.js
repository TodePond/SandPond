TodeSplat`

element Water {

	colour "lightblue"
	emissive "blue"
	
	state "liquid"
	
	input h ({space}) => {
		if (!space || !space.atom) return false
		if (space.atom.type == Lava || space.atom.type == Fire) return true
		return false
	}
	output S ({space}) => Space.setAtom(space, makeAtom(Steam))
	
	rule xyz { @h => Sh }
	
	rule {
		@ => _
		_    @
	}
	
	rule xz {
		@  => _
		#_    #@
	}
	
	rule xz {
		@_    _@
		#  => #
	}
	
}

`