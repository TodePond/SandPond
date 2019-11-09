let fireworkColour = 0

TodeSplat`


element Firework {

	colour "grey"
	emissive "black"
	precise true
	pour false
	floor true
	category "sandbox"
		
	data timer 25
		
	output F ({space, self}) => {
		self.timer--
		SPACE.setAtom(space, ATOM.make(Fire))
	}
	output S ({space, self}) => {
		if (space) {
			if (fireworkColour == 0) SPACE.setAtom(space, ATOM.make(Explosion))
			else if (fireworkColour == 1) SPACE.setAtom(space, ATOM.make(RedExplosion))
			else if (fireworkColour == 2) SPACE.setAtom(space, ATOM.make(BlueExplosion))
			fireworkColour++
			if (fireworkColour > 3) fireworkColour = 0
		}
	}
	
	input t ({self}) => self.timer <= 0
		
	rule { @t => S* }
	
	rule {
		_ => @
		@    F
	}
	
}




`