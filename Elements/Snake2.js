input ? ({success}) => success

element Snake {

	colour "green"
	emissive "darkgreen"
	precise true
	
	property score 0
	
	//========//
	// INPUTS //
	//========//
	// Is there a trail that is following me?
	input f ({space, self, args}) => {
		if (space && space.atom && space.atom.type == SnakeTrail) {
			const trail = space.atom
			if (trail.score == self.score) args.success = true
		}
		return true
	}
	
	// Is there a trail that I can follow?
	input t ({space, self, args}) => {
		if (space && space.atom && space.atom.type == SnakeTrail) {
			const trail = space.atom
			if (trail.score == self.score + 1) {
				args.success = true
				args.trail = trail
				args.trailSpace = space
			}
		}
		return true
	}
	
	
	// Am I leader compared to this space?
	input l ({space, self}) => {
		if (space && space.atom && space.atom.type == Snake || space.atom.type == SnakeTrail) {
			const snake = space.atom
			if (snake.score == self.score + 1) return false
		}
		return true
	}
	
	// Is it a res?
	input R ({space}) => space && space.atom && space.atom.type == Res
	
	//=========//
	// OUTPUTS //
	//=========//
	// Create new trail
	output T ({space, self}) => {
		const trail = makeAtom(SnakeTrail, {score: self.score})
		Space.setAtom(space, trail)
	}
	
	// Place me in the place where the trail was
	output s ({space, self, trailSpace}) => {
		if (space == trailSpace) {
			Space.setAtom(space, self)
		}
	}
	
	// Make a new leader
	output L (space, {self}) => {
		const leader = makeAtom(Snake, {score: self.score + 1})
		Space.setAtom(space, leader)
	}
	
	//=======//
	// RULES //
	//=======//
	// Wait for snakes to catch up
	rule XYZ { @f => ?? => .. }
	
	// Move up trail
	rule XYZ { @t => ?? => Ts }
	
	// Lead the snake
	rule XYZ { @l => {
		rule xyz { @R => @L }
		rule xyz { @_ => T@ }
	}}
	
	
}

element SnakeTrail {
	
	colour "blue"
	emissive "darkblue"
	
	// Is there a following trail/snake?
	input f ({space, self}) => {
		if (space && space.atom) {
			if (space.atom.type == Snake || space.atom.type == SnakeTrail) {
				const follower = space.atom
				if (follower.score == self.score - 1) args.success = true
			}
		}
		return true
	}
	
	rule XYZ { @f => ?? => .. }
	rule { @ => _ }
	
}