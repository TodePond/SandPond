TodeSplat`

element Snake {

	colour "green"
	emissive "darkgreen"
	precise true
	
	property score 0
	property leader true
	
	//===========//
	// FUNCTIONS //
	//===========//
	// Is it the next trail?
	input t (space, args) => {
		const self = args.self
		if (!space || !space.atom) return
		if (space.atom.type != SnakeTrail) return
		const trail = space.atom
		if (trail.score == self.score + 1) {
			args.trail = trail
			args.trailSpace = space
			return true
		}
	}
	
	// Place the trail that I ate
	output t (space, {self, trail}) => {
		setSpaceAtom(space, trail)
		trail.score = self.score
	}
	
	// Place me in the place the trail was
	output o (space, {self, trailSpace}) => {
		if (space != trailSpace) return
		setSpaceAtom(space, self)
	}
	
	// Create new trail
	output T (space, {self}) => {
		const trail = makeAtom(SnakeTrail, {score: self.score})
		setSpaceAtom(space, trail)
	}
	
	// Am I isolated from my next snake?
	input * (space, {self}) => {
		if (self.score <= 0) return false
		if (!space || !space.atom) return true
		if (space.atom.type != Snake) return true
		return space.atom.score != self.score - 1
	}
	
	// Are there higher scoring snakes around me?
	input ^ (space, {self}) => {
		if (!space || !space.atom) return
		if (space.atom.type != Snake && space.atom.type != SnakeTrail) return
		if (space.atom.score > self.score) return true
	}
	
	// Is it Res?
	input R (space) => {
		if (!space || !space.atom) return false
		return space.atom.type == Res
	}
	
	// Make a new leader
	output l (space, {self}) => {
		const leader = makeAtom(Snake, {score: self.score + 1})
		setSpaceAtom(space, leader)
	}
	
	//=======//
	// RULES //
	//=======//
	// Wait for snakes to catch up
	rule XYZ { @* => .. }
	
	// Move up trail
	rule XYZ { @t => to }
	
	// If not the highest score, do nothing
	rule XYZ { @^ => .. }
	
	// Otherwise, assume I am the leader:		
	// Eat Res
	rule xyz { @R => @l }
	
	// Move into empty space
	rule xyz { @_ => T@ }
	
}

element SnakeTrail {
	
	colour "blue"
	emissive "darkblue"
	hidden true
	
	input ? (space, {self}) => self.score <= 0
	rule { @? => _. }
	
}

`