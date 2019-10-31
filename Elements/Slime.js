TodeSplat`

element Slime {

	colour "green"
	emissive "green"
	category "sandbox"
	
	state "liquid"
	
	input w ({space, args}) => {
		if (!space) return false
		if (!space.atom) return true
		if (space.atom.type != Water) return false
		return args.swap = space.atom
	}
	
	output w ({space, swap}) => Space.setAtom(space, swap)
	
	rule {
		@ => w
		w    @
	}
	
	rule xz 0.1 {
		@  => w
		#w    #@
	}
	
	rule xz 0.05 {
		@w    w@
		#  => #
	}
	
}

`