let snakerDirection = "right"

on.keydown(e => {
	if (snakerDirection == "right") {
		//if (e.key == "ArrowLeft") return snakerDirection = "forward"
		//if (e.key == "ArrowRight") return snakerDirection = "back"
		if (e.key == "ArrowUp") return snakerDirection = "up"
		if (e.key == "ArrowDown") return snakerDirection = "down"
	}
	if (snakerDirection == "left") {
		//if (e.key == "ArrowLeft") return snakerDirection = "back"
		//if (e.key == "ArrowRight") return snakerDirection = "forward"
		if (e.key == "ArrowUp") return snakerDirection = "up"
		if (e.key == "ArrowDown") return snakerDirection = "down"
	}
	/*if (snakerDirection == "forward") {
		if (e.key == "ArrowLeft") return snakerDirection = "left"
		if (e.key == "ArrowRight") return snakerDirection = "right"
		if (e.key == "ArrowUp") return snakerDirection = "up"
		if (e.key == "ArrowDown") return snakerDirection = "down"
	}*/
	/*if (snakerDirection == "back") {
		if (e.key == "ArrowLeft") return snakerDirection = "right"
		if (e.key == "ArrowRight") return snakerDirection = "left"
		if (e.key == "ArrowUp") return snakerDirection = "up"
		if (e.key == "ArrowDown") return snakerDirection = "down"
	}*/
	if (snakerDirection == "up") {
		if (e.key == "ArrowLeft") return snakerDirection = "left"
		if (e.key == "ArrowRight") return snakerDirection = "right"
		//if (e.key == "ArrowUp") return snakerDirection = "back"
		//if (e.key == "ArrowDown") return snakerDirection = "forward"
	}
	if (snakerDirection == "down") {
		if (e.key == "ArrowLeft") return snakerDirection = "left"
		if (e.key == "ArrowRight") return snakerDirection = "right"
		//if (e.key == "ArrowUp") return snakerDirection = "forward"
		//if (e.key == "ArrowDown") return snakerDirection = "back"
	}
})

TodeSplat`

element Snaker {

	colour "green"
	emissive "darkgreen"
	precise true
	pour false
	category "player"
	
	data score 0

	//===========//
	// FUNCTIONS //
	//===========//
	// Is it the next trail?
	input t ({space, args, self, tests}) => {
		if (tests.length == 0) tests[0] = ({isTrail}) => isTrail
		
		if (!space || !space.atom) return true
		if (space.atom.element != PlayerSnakeTrail) return true
		
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
		const trail = ATOM.make(PlayerSnakeTrail, {score: self.score})
		SPACE.setAtom(space, trail)
	}
	
	// Am I waiting for my trail to be caught up on?
	input * ({space, args, self, tests}) => {
		if (tests.length == 0) tests[0] = ({isWaiting}) => isWaiting
		
		if (!space || !space.atom) return true
		if (space.atom.element != PlayerSnakeTrail) return true
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
		if (space.atom.element != Snaker && space.atom.element != PlayerSnakeTrail) return true
		
		if (space.atom.score == self.score + 1) {
			args.isObeying = true
		}
		return true
	}
	
	// Is it Res?
	input F extends # ({space}) => space.atom.element.isFood
	
	// Make a new leader
	output l ({space, self}) => {
		const leader = ATOM.make(Snaker, {score: self.score + 1})
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
	input r () => snakerDirection == "right"
	rule { @F => rr => @l }
	rule { @_ => rr => T@ }
	
	input l () => snakerDirection == "left"
	rule { F@ => ll => l@ }
	rule { _@ => ll => @T }
	
	input f () => snakerDirection == "forward"
	rule side { F@ => ff => l@ }
	rule side { _@ => ff => @T }
	
	input b () => snakerDirection == "back"
	rule side { @F => bb => @l }
	rule side { @_ => bb => T@ }
	
	input u () => snakerDirection == "up"
	rule {
		F => u => l
		@    u    @
	}
	rule {
		_ => u => @
		@    u    T
	}
	
	input d () => snakerDirection == "down"
	rule {
		@ => d => @
		F    d    l
	}
	rule {
		@ => d => T
		_    d    @
	}
	
}

element PlayerSnakeTrail {
	
	colour "blue"
	emissive "darkblue"
	
	// Can I die?
	input * ({space, self}) => {
		if (!space || !space.atom) return true
		if (space.atom.element != Snaker && space.atom.element != PlayerSnakeTrail) return true
		if (space.atom.score != self.score - 1) return true
		return false
	}
	rule XYZ { @* => _. }
	
}

`