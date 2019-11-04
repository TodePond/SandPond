TodeSplat`

element Snake {

	colour "green"
	emissive "darkgreen"
	precise true
	pour false
	category "life"
	
	data score 0

	//===========//
	// FUNCTIONS //
	//===========//
	// Is it the next trail?
	input t ({space, args, self, tests}) => {
		if (tests.length == 0) tests[0] = ({isTrail}) => isTrail
		
		if (!space || !space.atom) return true
		if (space.atom.type != SnakeTrail) return true
		
		const trail = space.atom
		if (trail.score == self.score + 1) {
			args.isTrail = true
			args.trail = space.atom
			args.trailSpace = space
		}
		return true
	}
	
	// Place the trail that I ate
	output t ({space, self, trail}) => {
		SPACE.setAtom(space, trail)
		trail.score = self.score
	}
	
	// Place me in the place the trail was
	output o ({space, self, trailSpace}) => {
		if (space != trailSpace) return
		SPACE.setAtom(space, self)
	}
	
	// Create new trail
	output T ({space, self}) => {
		const trail = ATOM.make(SnakeTrail, {score: self.score})
		SPACE.setAtom(space, trail)
	}
	
	// Am I waiting for my trail to be caught up on?
	input * ({space, args, self, tests}) => {
		if (tests.length == 0) tests[0] = ({isWaiting}) => isWaiting
		
		if (!space || !space.atom) return true
		if (space.atom.type != SnakeTrail) return true
		const trail = space.atom
		
		if (trail.score == self.score) {
			args.isWaiting = true
		}
		
		return true
	}
	
	// Are there higher scoring snakes around me?
	input ^ ({space, self, tests, args}) => {
	
		if (tests.length == 0) tests[0] = ({isObeying}) => isObeying
		
		if (!space || !space.atom) return true
		if (space.atom.type != Snake && space.atom.type != SnakeTrail) return true
		
		if (space.atom.score == self.score + 1) {
			args.isObeying = true
		}
		return true
	}
	
	// Is it Res?
	input R ({space}) => {
		if (!space || !space.atom) return false
		return space.atom.type.isFood
	}
	
	// Make a new leader
	output l ({space, self}) => {
		const leader = ATOM.make(Snake, {score: self.score + 1})
		self.leader = false
		SPACE.setAtom(space, leader)
	}
	
	//=======//
	// RULES //
	//=======//
	// Wait for snakes to catch up
	rule XYZ { @* => .. }
	
	// Move up trail
	rule XYZ { @t => to }
	
	// If there is a higher score snake/trail nearby, do nothing
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
	
	// Can I die?
	input * ({space, self}) => {
		if (!space || !space.atom) return true
		if (space.atom.type != Snake && space.atom.type != SnakeTrail) return true
		if (space.atom.score != self.score - 1) return true
		return false
	}
	rule XYZ { @* => _. }
	
}

`