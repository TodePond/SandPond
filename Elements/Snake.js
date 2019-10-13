TodeSplat`

element Snake {

	colour "green"
	emissive "darkgreen"
	precise true
	
	property score 0
	property eggs 14
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
	
	// Give birth to snakes
	output S (space, {self}) => {
		const snake = makeAtom(Snake, {eggs: self.eggs - 1, leader: false})
		setSpaceAtom(space, snake)
		self.score = self.eggs
		self.eggs = 0
	}
	
	// Can I give birth here?
	input e (space, {self}) => {
		if (!space || space.atom) return false
		return self.eggs > 0
	}
	
	// Am I NOT next to my previous snake
	input * (space, {self}) => {
		if (self.score <= 0) return false
		if (!space || !space.atom) return true
		if (space.atom.type != Snake) return true
		return space.atom.score != self.score - 1
	}
	
	// Am I NOT the highest score around
	input ^ (space, {self}) => {
		if (!space || !space.atom) return
		if (space.atom.type != Snake && space.atom.type != SnakeTrail) return
		if (space.atom.score > self.score) return true
	}
	
	//=======//
	// RULES //
	//=======//
	// Give birth if I can
	rule xyz { @e => @S }
	
	// Wait for snakes to catch up
	rule XYZ { @* => .. }
	
	// Move up trail
	rule XYZ { @t => to }
	
	// If not the highest score, do nothing
	rule XYZ { @^ => .. }
	
	// Otherwise, assume I am the leader:	
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