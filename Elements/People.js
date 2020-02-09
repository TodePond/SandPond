TodeSplat`

element LukeWilson {
	
	colour "red"
	emissive "darkred"
	category "People"
	default true
	precise true
	pour false
	
	state "solid"
	data id -1
	
	given i (self) => self.id == -1
	keep i (self) => self.id = Math.random()
	action { i => i}
	
	// Hatch when fallen
	change B (self) => new LukeBody({id: self.id})
	change L (self) => new LukeLeg({id: self.id})
	change H (self) => new LukeHair({id: self.id})
	change A (self) => new LukeArm({id: self.id})
	change F (self) => new LukeFace({id: self.id})
	
	
	given H (element, atom, self) => atom && element == LukeHair && atom.id == self.id
	given F (element, atom, self) => atom && element == LukeFace && atom.id == self.id
	given A (element, atom, self) => atom && element == LukeArm && atom.id == self.id
	given L (element, atom, self) => atom && element == LukeLeg && atom.id == self.id
	given B (element, atom, self) => atom && element == LukeBody && atom.id == self.id
	action {
		 ___      HHH
		 ___  =>  HFH
		__@__    AB@BA
		 _ _      L L
	}
	
	// Unsquish :)
	action {
		 HHH      ...
		 HFH      ...
		AB@B_ => ....A
		 L L      . .
	}
	
	given l (element, atom, self) => atom && (element != LukeLeg || atom.id != self.id)
	rule {
		 HHH      HHH
		_HFH_    AB@BA
		AB@B  => _L_L
		 L l      _ .
	}
	
	rule {
		 ___      HHH
		 HHH  =>  .F.
		AB@BA    .....
		 L L      . .
	}
	
	// Fall
	rule {
		 HHH      ___
		 HFH      HHH
		AB@BA => _HFH_
		_L_L_    AB@BA
		 _ _      L L
	}
	
	// Walk Right
	rule {
		 HHH_     _HHH
		 HFH_     _HFH
		AB@BA => _AB@B
		 L_L_     _L_L
	}
	
	// Walk Right up slope
	rule {
		 HHH_     _HHH
		 HFH_     _HFH
		AB@BA => _AB@B
		 L_L      _L_.
	}
	
	
	
}

element LukeArm {
	colour "#F2BB4F"
	hidden true
	state "solid"
}

element LukeFace {
	colour "#F2BB4F"
	hidden true
	state "solid"
}

element LukeHair {
	colour "#562c2c"
	hidden true
	state "solid"
}

element LukeLeg {
	colour "grey"
	emissive "black"
	hidden true
	state "solid"
	
	/*given H (element) => element == LukeHair
	given B (element) => element == LukeBody
	change B () => new LukeBody()
	rule {
		H    .
		B    .
		@ => B
		_    @
	}*/
}

element LukeBody {
	colour "red"
	emissive "darkred"
	hidden true
	state "solid"
	
	given B (element) => element == LukeBody
	change B () => new LukeBody()
	change H () => new LukeHair()
	
	/*action { @_B => .B. }
	action { B_@ => .B. }*/

}



`