
const VOID = 0
const SOLID = 1
const LIQUID = 2
const GAS = 3
const EFFECT = 4

const STICKY_FALL_TIME = 30

Empty.state = GAS
Void.state = VOID

SpaceTode`

element Solid {
	prop state SOLID
	category "Rulesets"
	
	given D (element) => element.state > SOLID
	select D (atom) => atom
	change D (selected) => selected
	@ => D
	D    @
}

element Powder  {
	prop state SOLID
	category "Rulesets"
	
	given D (element) => element.state > SOLID
	select D (atom) => atom
	change D (selected) => selected
	@ => D
	D    @
	
	given F (element) => element.state > SOLID
	any(xz.rotations) {
		@D => D@
		 F     .
	}
}

element Liquid {
	prop state LIQUID
	category "Rulesets"
	
	given D (element) => element.state > LIQUID
	select D (atom) => atom
	change D (selected) => selected
	@ => D
	D    @
	
	@ => .
	x    .
	
	for(xz.rotations) @D => D@
}

element Goo {
	prop state SOLID
	category "Rulesets"
	
	given D (element) => element.state > LIQUID
	select D (atom) => atom
	change D (selected) => selected
	
	@ => D
	D    @
		
	@ => .
	x    .
		
	maybe(1/40) any(xz.rotations) @D => D@
}

element Gas {
	prop state GAS
	category "Rulesets"
	
	given D (element) => element.state >= GAS
	select D (atom) => atom
	change D (selected) => selected
	any(xyz.rotations) @D => D@
}

element Sticky {
	prop state SOLID
	category "Rulesets"
	
	// Init atom properties
	given i (self) => self.stickyInit === undefined
	keep i (self, time) => {
		self.stickyInit = true
		self.stuckTime = -Infinity
	}
	action i => i
	
	// Debug colour
	/*keep c (self, time, origin) => {
		let timeDiff = Math.round((time - self.stuckTime) * 255 / STICKY_FALL_TIME)
		if (timeDiff > 255) timeDiff = 255
		self.colour.r = timeDiff
		self.colour.b = 255 - timeDiff
		self.colour.g = 255 - timeDiff
		SPACE.updateAppearance(origin)
	}
	action @ => c*/
	
	// Contact with ground
	keep t (self, time) => self.stuckTime = time
	given n (element, selfElement) => element !== selfElement && element.state <= SOLID
	action {
		@ => t
		n    .
	}
	
	// Spread + Receive signal
	given s (selfElement, element, self, atom) => element === selfElement && self.stuckTime > atom.stuckTime
	keep s (self, atom) => atom.stuckTime = self.stuckTime
	given r (selfElement, element, self, atom) => element === selfElement && self.stuckTime < atom.stuckTime
	keep r (self, atom) => self.stuckTime = atom.stuckTime
	change $ (selfElement) => new selfElement()
	all(xyz.rotations) {
		action @s => .s
		action @r => .r
	}
	
	all(xyz.flips) {
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
	given S (self, time) => time - self.stuckTime < STICKY_FALL_TIME
	S => .
	
	given D (element) => element.state > SOLID
	select D (atom) => atom
	change D (selected) => selected
	// Fall
	@ => D
	D    @
	
}

`