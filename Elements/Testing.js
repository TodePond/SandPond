
const STATE = {
	SOLID: Symbol("Solid"),
	LIQUID: Symbol("Liquid"),
	GAS: Symbol("Gas"),
	EFFECT: Symbol("Effect"),
	GOO: Symbol("Goo"),
}

SpaceTode`

element _RainbowRabbit {
	colour "white"
	emissive "grey"
	category "Testing"
	data id
	arg hue
	
	element Part {
		colour "white"
		emissive "grey"
		arg id
		
		given R (element, atom, self) => element === _RainbowRabbit && atom.id === self.id
		@R => ..
		R@ => ..
		
		@  => .
		 R     .
		
		 @ =>  .
		R     .
		
		@ => _
	}
	
	// Init ID
	given i (self) => {
		return self.id === undefined
	}
	keep i (self) => {
		self.id = Math.random()
		if (self.hue === undefined) self.hue = Math.floor(Math.random() * 300)
		const colour = new THREE.Color("hsl(" + self.hue + ", 100%, 40%)")
		self.colour = {
			r: Math.floor(colour.r * 255),
			g: Math.floor(colour.g * 255),
			b: Math.floor(colour.b * 255),
		}
		self.emissive = self.colour
	}
	i => i
	
	// Grow body
	change P (self, atom) => {
		const part = new _RainbowRabbit.Part(self.id)
		part.colour = self.colour
		part.emissive = self.emissive
		return part
	}
	@_ => .P
	_@ => P.
	
	_  => P
	 @     .
	
	 _ =>  P
	@     .
	
	// Die because can't grow
	given n (element, atom, self) => element !== _RainbowRabbit.Part || atom.id !== self.id
	n  => .
	 @     _
	 _     .
	
	 n =>  .
	@     _
	_     .
	
	@n => _.
	_     .
	
	n@ => ._
	 _     .
	
	// Fall down
	given P (element, atom, self) => element === _RainbowRabbit.Part && atom.id === self.id
	P P    _ _
	P@P => P_P
	___    P@P
	
	// Move
	pov(right) {
	
		given H (self, atom, element) => {
			if (element !== _RainbowRabbit) return false
			if ((self.hue < atom.hue)) {
				self.tempOtherHue = atom.hue
				return true
			}
		}
		
		change H (self) => new _RainbowRabbit(self.tempOtherHue)
	
		@H => H@
		@.H => H.@
		//maybe(1/2) @_ => _@
	}
	
	given R (element) => element === _RainbowRabbit
	@    _
	R => .
	
	any(x) {
		P_P_    _P_P
		P@P_ => _P@P
	}
}

element Plank {
	
	colour "#753d0c"
	emissive "#753d0c"
	category "Sandbox"
	data bday undefined
	
	behave {
		
		let currentBday = performance.now()
		
		on.mousedown(e => {
			if (e.buttons !== 1) return
			if (UI.selectedElement === Plank) {
				currentBday = performance.now()
			}
		})
		
		const behave = (origin, selfElement, time, self = origin.atom) => {
			if (self.bday === undefined) self.bday = currentBday
			if (Mouse.down && self.bday === currentBday) return
			const sites = origin.sites
			const space0_1 = sites[17]
			const element0_1 = space0_1.element
			if (element0_1 === Empty) {
				for (const siteNum of siteNums) {
					const spaceAbove = sites[siteNum.d9]
					const elementAbove = spaceAbove.element
					if (elementAbove !== selfElement) continue
					const atomAbove = spaceAbove.atom
					if (atomAbove.bday === self.bday) return
				}
				SPACE.setAtom(space0_1, self, selfElement)
				SPACE.setAtom(origin, new Empty(), Empty)
			}
		}
		
		const siteNums = [
			EVENTWINDOW.getSiteNumber(0, 1, 0),
			EVENTWINDOW.getSiteNumber(1, 1, 0),
			EVENTWINDOW.getSiteNumber(-1, 1, 0),
			EVENTWINDOW.getSiteNumber(0, 1, 1),
			EVENTWINDOW.getSiteNumber(0, 1, -1),
		]
		
		return behave
	}
}

element Clay {
	colour "brown"
	category "Sandbox"
	data stuck false
	data stuckTime -Infinity
	prop state STATE.SOLID
	data sticky true
	behave {
		
		const FALL_TIME = 15
		
		const behave = (origin, element, time, self = origin.atom) => {
			//print9(time)
			/*let timeDiff = Math.round((time - self.stuckTime) * 255 / FALL_TIME)
			if (timeDiff > 255) timeDiff = 255
			self.colour.r = timeDiff
			self.colour.b = 255 - timeDiff
			self.colour.g = 255 - timeDiff
			SPACE.updateAppearance(origin, world)*/
			
			const sites = origin.sites
			
			const spaceBelow = sites[17]
			const elementBelow = spaceBelow.element
			for (let i = 0; i < 6; i++) {
				const site = sites[symms[i]]
				const siteElement = site.element
				if (element === Clay) {
					if (siteElement === Water) {
						SPACE.setAtom(site, new Empty(), Empty)
						SPACE.setAtom(origin, new Sludge(), Sludge)
						return
					}
					if (siteElement === Fire || siteElement == Lava) {
						SPACE.setAtom(site, new Empty(), Empty)
						const stone = new Stone()
						stone.sticky = true
						SPACE.setAtom(origin, stone, Stone)
						stone.stuck = true
						return
					}
				}
				if (site.atom.sticky) {
					if (self.stuck) {
						site.atom.stuck = true
						if (site.atom.stuckTime < self.stuckTime) site.atom.stuckTime = self.stuckTime
					}
					else if (site.atom.stuck) {
						self.stuck = true
						if (self.stuckTime < site.atom.stuckTime) self.stuckTime = site.atom.stuckTime
					}
				}
				
				const site2 = sites[symms2[i]]
				const site2Element = site2.element
				if (site2.atom.sticky) {
					if (self.stuck) {
						site2.atom.stuck = true
						if (site2.atom.stuckTime < self.stuckTime) site2.atom.stuckTime = self.stuckTime
					}
					else if (site2.atom.stuck) {
						self.stuck = true
						if (self.stuckTime < site2.atom.stuckTime) self.stuckTime = site2.atom.stuckTime
					}
					
					if (site2.atom.stuck && (time - site2.atom.stuckTime < FALL_TIME) /*&& self.stuck*/ /* /*&& (time - self.stuckTime < FALL_TIME)*/) {
						
						if (siteElement === Empty) {
							const stone = new element()
							stone.stuck = true
							stone.stuckTime = Math.max(self.stuckTime, site2.atom.stuckTime)
							SPACE.setAtom(site, stone, element)
							//self.stuckTime++
						}
					}
				}
			}
			
			for (let i = 0; i < symms3.length; i++) {
				const site = sites[symms3[i]]
				const siteElement = site.element
				if (site.atom.sticky) {
					if (self.stuck) {
						site.atom.stuck = true
						if (site.atom.stuckTime < self.stuckTime) site.atom.stuckTime = self.stuckTime
					}
					else if (site.atom.stuck) {
						self.stuck = true
						if (self.stuckTime < site.atom.stuckTime) self.stuckTime = site.atom.stuckTime
					}
				}
			}
			
			const couldFall = elementBelow !== Void && (elementBelow.state !== STATE.SOLID)
			if (!spaceBelow.atom.sticky && !couldFall) {
				self.stuck = true
				self.stuckTime = time
			}
			const recentStuck = (time - self.stuckTime) < FALL_TIME
			if (!(self.stuck && recentStuck) && couldFall) {
				SPACE.setAtom(origin, spaceBelow.atom, spaceBelow.element)
				SPACE.setAtom(spaceBelow, self, self.element)
				self.stuck = false
				return
			}
		}
		
		const symms = [
			EVENTWINDOW.getSiteNumber(1, 0, 0),
			EVENTWINDOW.getSiteNumber(-1, 0, 0),
			EVENTWINDOW.getSiteNumber(0, 1, 0),
			EVENTWINDOW.getSiteNumber(0, -1, 0),
			EVENTWINDOW.getSiteNumber(0, 0, 1),
			EVENTWINDOW.getSiteNumber(0, 0, -1),
		]
		
		const symms2 = [
			EVENTWINDOW.getSiteNumber(2, 0, 0),
			EVENTWINDOW.getSiteNumber(-2, 0, 0),
			EVENTWINDOW.getSiteNumber(0, 2, 0),
			EVENTWINDOW.getSiteNumber(0, -2, 0),
			EVENTWINDOW.getSiteNumber(0, 0, 2),
			EVENTWINDOW.getSiteNumber(0, 0, -2),
		]
		
		const symms3 = [
			EVENTWINDOW.getSiteNumber(1, 1, 0),
			EVENTWINDOW.getSiteNumber(1, -1, 0),
			EVENTWINDOW.getSiteNumber(-1, 1, 0),
			EVENTWINDOW.getSiteNumber(-1, -1, 0),
			EVENTWINDOW.getSiteNumber(0, 1, 1),
			EVENTWINDOW.getSiteNumber(0, 1, -1),
			EVENTWINDOW.getSiteNumber(0, -1, 1),
			EVENTWINDOW.getSiteNumber(0, -1, -1),
			EVENTWINDOW.getSiteNumber(1, 0, 1),
			EVENTWINDOW.getSiteNumber(1, 0, -1),
			EVENTWINDOW.getSiteNumber(-1, 0, -1),
			EVENTWINDOW.getSiteNumber(-1, 0, 1),
		]
		
		return behave
	}
}


element Sludge {
	colour "#d9623b"
	category "Sandbox"
	prop state STATE.GOO
	behave {
		const behave = (origin, element, time, self = origin.atom) => {
			const sites = origin.sites
			const spaceBelow = sites[17]
			if (spaceBelow.atom.element == Void) return
			if (spaceBelow.atom.element == Empty || spaceBelow.element == Water  || spaceBelow.element == Steam) {
				SPACE.setAtom(origin, spaceBelow.atom, spaceBelow.element)
				SPACE.setAtom(spaceBelow, self, self.element)
				return
			}
			if (Math.random() < 0.9) return
			const rando = Math.trunc(Math.random() * 4)
			const slideSite = sites[symms[rando]]
			if (slideSite.atom.element == Empty) {
				SPACE.setAtom(origin, slideSite.atom, Empty)
				SPACE.setAtom(slideSite, self, self.element)
			}
		}
		
		const symms = [
			EVENTWINDOW.getSiteNumber(1, 0, 0),
			EVENTWINDOW.getSiteNumber(-1, 0, 0),
			EVENTWINDOW.getSiteNumber(0, 0, 1),
			EVENTWINDOW.getSiteNumber(0, 0, -1),
		]
		
		return behave
	}
}

`
