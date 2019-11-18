TodeSplat`

element TallSand {

	colour "pink"
	emissive "purple"
	//precise true
	//pour false
	category "sandbox"
	
	input e extends _ ({args}) => args.id = Math.random()
	
	output p ({space, id}) => {
		const atom = ATOM.make(FloaterBondoPart)
		atom.id = id
		atom.subid = Math.random()
		SPACE.setAtom(space, atom)
	}
	
	rule xyz { @e => pp }
	
}

element FloaterBondoPart {
	colour "pink"
	emissive "purple"
	hidden true
	
	input F extends # ({space}) => space.atom.element == FloaterBondoPart
	input B extends F ({space, self, args}) => {
		if (space.atom.id == self.id) {
			args.buddy = space.atom
			return true
		}
	}
	
	input T extends # ({space, self}) => {
		return space.atom.element == FloaterBondoTrail && space.atom.id == self.id && space.atom.subid != self.subid
	}
	
	input t ({space, args, self}) => {
		if (space && space.atom && space.atom.element == FloaterBondoTrail && space.atom.id == self.id && space.atom.subid != self.subid) {
			args.success = true
			args.trailSpace = space
		}
		return true
	}
	
	output s ({space, trailSpace, self}) => {
		if (space == trailSpace) {
			SPACE.setAtom(trailSpace, self)
		}
	}
	
	output T ({space, self}) => {
		const atom = ATOM.make(FloaterBondoTrail)
		atom.id = self.id
		atom.subid = self.subid
		SPACE.setAtom(space, atom)
	}
	
	output B ({space, buddy}) => SPACE.setAtom(space, buddy)
	
	rule XZ {
		@t => ?? => Ts
	}
	
	rule {
		@    ?    T
		t => ? => s
	}
	
	rule xz {
		B@    BT
		 _ =>  @
	}
	
	rule {
		B    B
		@ => T
		_    @
	}
	
	rule xz {
		B     B
		@_ => T@
		#_    #_
	}
	
}

element FloaterBondoTrail {
	colour "lightblue"
	emissive "blue"
	hidden true
	
	input t ({space, args, self}) => {
		if (space && space.atom && space.atom.element == FloaterBondoPart && space.atom.id == self.id && space.atom.subid == self.subid) {
			args.success = true
		}
		return true
	}
	
	
	rule XYZ {
		@B => !! => _.
	}
	
}



`