
const VOID = 0
const SOLID = 1
const LIQUID = 2
const GAS = 3
const EFFECT = 4

Empty.state = GAS
Void.state = VOID

SpaceTode`

element Solid {
	prop state SOLID
	//category "Rulesets"
	
	given D (element) => element.state > SOLID
	select D (atom) => atom
	change D (selected) => selected
	@ => D
	D    @
}

element Powder  {
	prop state SOLID
	//category "Rulesets"
	
	given D (element) => element.state > SOLID
	select D (atom) => atom
	change D (selected) => selected
	@ => D
	D    @
	
	given S (element) => element.state > SOLID && element.state !== EFFECT
	select S (atom) => atom
	change S (selected) => selected
	given F (element) => element.state > SOLID
	any(xz.rotations) {
		@S => S@
		 F     .
	}
}

element Liquid {
	prop state LIQUID
	//category "Rulesets"
	
	given D (element) => element.state > LIQUID
	select D (atom) => atom
	change D (selected) => selected
	@ => D
	D    @
	
	@ => .
	x    .
	
	given S (element) => element.state > SOLID && element.state !== EFFECT
	select S (atom) => atom
	change S (selected) => selected
	for(xz.rotations) @S => S@
}

element Goo {
	prop state SOLID
	//category "Rulesets"
	
	given D (element) => element.state > SOLID
	select D (atom) => atom
	change D (selected) => selected
	
	given F (element) => element.state > SOLID
	
	@ => D
	D    @
	
	@ => .
	x    .
	
	any(xz.rotations) {
		
		maybe(1/20) {
			@D => D@
			 F     .
		}
	
		maybe(1/30) @D => D@
	}
}

element Gas {
	prop state GAS
	//category "Rulesets"
	
	given D (element) => element.state >= GAS && element.state !== EFFECT
	select D (atom) => atom
	change D (selected) => selected
	any(xyz.directions) @D => D@
}

element Sticky {
	prop state SOLID
	//category "Rulesets"
	
	// Init atom properties
	given i (self) => self.stickyInit === undefined
	keep i (self, time, Self) => {
		self.stickyInit = true
		self.stuckTime = -Infinity
		self.stuck = false
		if (Self.stickiness === undefined) Self.stickiness = 1.0
		if (Self.stickinessNormalised === undefined) Self.stickinessNormalised = Math.floor(Self.stickiness * 30)
	}
	action i => i
	
	// Debug colour
	/*keep c (self, time, origin, Self) => {
		let timeDiff = Math.round((time - self.stuckTime) * 255 / Self.stickinessNormalised)
		if (timeDiff > 255) timeDiff = 255
		self.colour.r = timeDiff
		self.colour.b = 255 - timeDiff
		self.colour.g = 255 - timeDiff
		SPACE.updateAppearance(origin)
	}
	action @ => c*/
	
	// Contact with ground
	given n (element, selfElement, atom) => element !== selfElement && element.state <= SOLID && atom.stuck !== false
	keep t (self, time) => self.stuckTime = time
	action {
		@ => t
		n    .
	}
	
	// Spread + Receive signal
	given s (selfElement, element, self, atom) => element === selfElement && self.stuckTime > atom.stuckTime
	keep s (self, atom) => atom.stuckTime = self.stuckTime
	given r (selfElement, element, self, atom) => element === selfElement && self.stuckTime < atom.stuckTime
	keep r (self, atom) => self.stuckTime = atom.stuckTime
	all(xyz.directions) {
		action @s => .s
		action @r => .r
	}
	
	all(xyz.shifts) {
		action {
			 s =>  s
			@     .
		}
		action {
			 r =>  r
			@     .
		}
	}
	
	// Stuck!
	given S (self, time, Self) => {
		const stuck = time - self.stuckTime < Self.stickinessNormalised
		self.stuck = stuck
		return stuck
	}
	S => .
	
	/*given D (element) => element.state > SOLID
	select D (atom) => atom
	change D (selected) => selected
	// Fall
	@ => D
	D    @*/
	
}

`