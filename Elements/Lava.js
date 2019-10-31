TodeSplat`

element Lava {

	colour "red"
	emissive "darkred"
	category "sandbox"
	
	state "liquid"
	
	input w ({space, args}) => {
		if (!space) return false
		if (!space.atom) return false
		if (space.atom.type != Water) return false
		return args.swap = space.atom
	}
	
	output w ({space, swap}) => Space.setAtom(space, swap)
	output F ({space}) => Space.setAtom(space, makeAtom(Fire))
	
	rule {
		@ => F
		_    @
	}
	
	rule {
		@ => w
		w    @
	}
	
	rule xz 0.1 {
		@  => F
		#_    #@
	}
	
	rule xz 0.05 {
		@_    F@
		#  => #
	}
	
	rule xz 0.1 {
		@  => w
		#w    #@
	}
	
	rule xz 0.05 {
		@w    w@
		#  => #
	}
	
	rule 0.3 {
		_ => F
		@    @
	}
	
}

`