TodeSplat`

element Water {

	colour "lightblue"
	emissive "blue"
	category "sandbox"
	opacity 0.4
	state "liquid"
	
	input h ({space}) => {
		if (!space || !space.atom) return false
		if (space.atom.element == Lava || space.atom.element == Fire) return true
		return false
	}
	output S ({space}) => SPACE.setAtom(space, ATOM.make(Steam))
	
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