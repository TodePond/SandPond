
const SOLID = 0
const LIQUID = 1
const GAS = 2
const EFFECT = 3

const STICKY_FALL_TIME = 30

SpaceTode`

element Solid {
	prop state SOLID
	category "Rulesets"
	
	given D (element) => element !== Void && element.state !== SOLID
	select D (atom) => atom
	change D (selected) => selected
	@ => D
	D    @
}

element Powder  {
	prop state SOLID
	category "Rulesets"
	
	given D (element) => element !== Void && element.state !== SOLID
	select D (atom) => atom
	change D (selected) => selected
	@ => D
	D    @
	
	given F (element) => element !== Void && element.state !== SOLID
	any(xz.rotations) {
		@D => D@
		 F     .
	}
}

element Liquid {
	prop state LIQUID
	category "Rulesets"
	
	given D (element) => element !== Void && (element.state > LIQUID || element.state === undefined)
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
	
	given D (element) => element !== Void && element.state !== SOLID
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
	
	given D (element) => element !== Void && (element.state === EFFECT || element.state === undefined)
	select D (atom) => atom
	change D (selected) => selected
	any(xyz.rotations) @D => D@
}

element Sticky {
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
	given n (element, selfElement) => element !== selfElement && element !== Empty
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
		//action @_s => .$s
		//action @ s => . s
		action @r => .r
		//action @_r => @$r
		//action @ r => @ r
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
	
	// Fall
	@ => _
	_    @
	
}

`