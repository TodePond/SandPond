SpaceTode`



origin @
given @ (self, atom) => self === atom
given @ (element) => element !== Void
change @ (self) => self

change _ () => new Empty()
given _ (element) => element === Empty

given # (atom) => atom

keep .

element Sand  {
	colour "#FC0"
	emissive "#ffa34d"
	category "Sandbox"
	
	@ => _
	_    @
	
	behave {
		const behave = (self, origin) => {
			const sites = origin.sites
			const spaceBelow = sites[17]
			const elementBelow = spaceBelow.element
			if (elementBelow == Empty) {
				const atomBelow = spaceBelow.atom
				SPACE.setAtom(origin, atomBelow, elementBelow)
				SPACE.setAtom(spaceBelow, self, Sand)
				atomBelow.track = !currentTrack
				return
			}
			
			const rando = Math.trunc(Math.random() * 4)
			const slideSite = sites[symms[rando]]
			const slideAtom = slideSite.atom
			const slideElement = slideAtom.element
			if (slideElement == Empty || slideElement == Steam || slideElement == Water) {
				SPACE.setAtom(origin, slideAtom, slideElement)
				SPACE.setAtom(slideSite, self, Sand)
			}
		}
		
		const symms = [
			EVENTWINDOW.getSiteNumber(1, -1, 0),
			EVENTWINDOW.getSiteNumber(-1, -1, 0),
			EVENTWINDOW.getSiteNumber(0, -1, 1),
			EVENTWINDOW.getSiteNumber(0, -1, -1),
		]
		
		return behave
	}
	
}

element Forkbomb {
	colour "grey"
	emissive "black"
	category "T2Tile"
	behave {
		const behave = (self, origin) => {
			const rando = Math.floor(Math.random() * 6)
			const symm = symms[rando]
			const sites = origin.sites
			const site = sites[symm]
			if (site.element === Empty) {
				SPACE.setAtom(site, new Forkbomb(), Forkbomb)
			}
		}
		
		const symms = [
			13,
			11,
			7,
			17,
			32,
			37,
		]
		
		return behave
	}
}

element Water {
	colour "lightblue"
	emissive "blue"
	opacity 0.35
	category "Sandbox"
	behave {
		
		const behave = (self, origin) => {
			const sites = origin.sites
			const spaceBelow = sites[17]
			const elementBelow = spaceBelow.atom.element
			if (elementBelow == Void) return
			if (elementBelow == Empty || elementBelow == Steam) {
				SPACE.setAtom(origin, spaceBelow.atom, elementBelow)
				SPACE.setAtom(spaceBelow, self, Water)
				return
			}
			if (elementBelow == Fire) {
				SPACE.setAtom(spaceBelow, new Empty(), Empty)
				SPACE.setAtom(origin, new Steam(), Steam)
			}
			const rando = Math.trunc(Math.random() * 4)
			const slideSite = sites[symms[rando]]
			const slideElement = slideSite.atom.element
			if (slideElement == Empty) {
				SPACE.setAtom(origin, slideSite.atom, Empty)
				SPACE.setAtom(slideSite, self, Water)
			}
			else if (slideElement == Fire) {
				SPACE.setAtom(origin, new Steam(), Steam)
				SPACE.setAtom(slideSite, new Empty(), Empty)
			}
			else if (slideElement == Lava) {
				SPACE.setAtom(origin, new Steam(), Steam)
				SPACE.setAtom(slideSite, new Stone(), Stone)
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

element Slime {
	colour "lightgreen"
	emissive "green"
	opacity 0.65
	category "Sandbox"
	behave {
		const behave = (self, origin) => {
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


element Steam {
	colour "lightgrey"
	emissive "darkgrey"
	category "Sandbox"
	opacity 0.3
	behave {
		const behave = (self, origin) => {
			const sites = origin.sites
			const spaceAbove = sites[7]
			if (spaceAbove.atom.element == Empty) {
				SPACE.setAtom(origin, spaceAbove.atom, Empty)
				SPACE.setAtom(spaceAbove, self, Steam)
				return
			}
			const rando = Math.trunc(Math.random() * 4)
			const slideSite = sites[symms[rando]]
			if (slideSite.atom.element == Empty) {
				SPACE.setAtom(origin, slideSite.atom, Empty)
				SPACE.setAtom(slideSite, self, Steam)
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

element Lava {
	colour {
		return "red"
	}
	emissive "darkred"
	opacity 0.65
	category "Sandbox"
	behave {
		
		const behave = (self, origin) => {
			const sites = origin.sites
			const siteAbove = sites[siteNumAbove]
			if (siteAbove.element == Empty) {
				SPACE.setAtom(siteAbove, new Fire(), Fire)
			}
			const spaceBelow = sites[17]
			const belowElement = spaceBelow.atom.element
			if (belowElement == Void) return
			if (belowElement == Empty || belowElement == Steam) {
				SPACE.setAtom(origin, spaceBelow.atom, spaceBelow.element)
				SPACE.setAtom(spaceBelow, self, self.element)
				return
			}
			else if (belowElement == Water) {
				SPACE.setAtom(origin, new Stone(), Stone)
				SPACE.setAtom(spaceBelow, new Steam(), Steam)
			}
			if (Math.random() < 0.9) return
			const rando = Math.trunc(Math.random() * 4)
			const slideSite = sites[symms[rando]]
			const slideElement = slideSite.atom.element
			if (slideElement == Empty) {
				SPACE.setAtom(origin, slideSite.atom, Empty)
				SPACE.setAtom(slideSite, self, self.element)
			}
			else if (slideElement == Water) {
				SPACE.setAtom(origin, new Stone(), Stone)
				SPACE.setAtom(slideSite, new Steam(), Steam)
			}
		}
		
		const symms = [
			EVENTWINDOW.getSiteNumber(1, 0, 0),
			EVENTWINDOW.getSiteNumber(-1, 0, 0),
			EVENTWINDOW.getSiteNumber(0, 0, 1),
			EVENTWINDOW.getSiteNumber(0, 0, -1),
		]
		
		const siteNumAbove = EVENTWINDOW.getSiteNumber(0, 1, 0)
		
		return behave
		
	}
}

element Fire {
	colour [
		"darkorange",
		"lol",
	][0]
	emissive "red"
	opacity 0.35
	category "Sandbox"
	behave {
		const behave = (self, origin) => {
			const sites = origin.sites
			const spaceAbove = sites[7]
			const elementAbove = spaceAbove.atom.element
			if (elementAbove == Empty) {
				SPACE.setAtom(origin, spaceAbove.atom, Empty)
				if (Math.random() < 0.8) SPACE.setAtom(spaceAbove, self, Fire)
				return
			}
			else if (elementAbove == Water) {
				SPACE.setAtom(spaceAbove, new Steam(), Steam)
				SPACE.setAtom(origin, new Empty(), Empty)
			}
			if (elementAbove != Fire) SPACE.setAtom(origin, new Empty(), Empty)
		}
		
		return behave
		
	}
	
}

element StickyStone {
	prop state "solid"
	category "Sandbox"
	behave {
		
		const behave = (self, origin) => {
			const sites = origin.sites
			const spaceBelow = sites[17]
			const elementBelow = spaceBelow.element
			const selfStuck = self.stuck
			for (let i = 0; i < 6; i++) {
				const site = sites[symms[i]]
				if (site.element == StickyStone) {
					if (selfStuck === true) site.atom.stuck = true
					if (site.atom.stuck === true) self.stuck = true
				}
				
				const site2 = sites[symms2[i]]
				if (site2.element == StickyStone) {
					if (selfStuck === true) site2.atom.stuck = true
					if (site2.atom.stuck === true) {
						const stone = new StickyStone()
						stone.stuck = true
						SPACE.setAtom(site, stone, StickyStone)
						self.stuck = true
					}
				}
			}
			
			for (let i = 0; i < symms3.length; i++) {
				const site = sites[symms3[i]]
				if (site.element == StickyStone) {
					if (selfStuck === true) site.atom.stuck = true
					if (site.atom.stuck === true) self.stuck = true
				}
			}
			
			if (self.stuck) return
			
			if (elementBelow == Empty || elementBelow == Water || elementBelow == Steam) {
				SPACE.setAtom(origin, spaceBelow.atom, spaceBelow.element)
				SPACE.setAtom(spaceBelow, self, self.element)
				return
			}
			self.stuck = true
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

element Stone {
	prop state "solid"
	category "Sandbox"
	behave {
		
		const behave = (self, origin) => {
			const sites = origin.sites
			const spaceBelow = sites[17]
			const elementBelow = spaceBelow.element
			if (elementBelow == Empty || elementBelow == Water || elementBelow == Steam) {
				SPACE.setAtom(origin, spaceBelow.atom, spaceBelow.element)
				SPACE.setAtom(spaceBelow, self, self.element)
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
		
		return behave
	}
}

element DReg {
	colour "brown"
	category "T2Tile"
	opacity 0.1
	behave {
		const behave = (self, origin) => {
			const rando = Math.trunc(Math.random() * 6)
			const site = origin.sites[symms[rando]]
			const element = site.element
			if (element == Empty) {
				if (Math.random() < 1/1000) return SPACE.setAtom(site, new DReg(), DReg)
				if (Math.random() < 1/200) return SPACE.setAtom(site, new Res(), Res)
				
				const atom = site.atom
				SPACE.setAtom(origin, atom, Empty)
				SPACE.setAtom(site, self, self.element)
			}
			else if (element == DReg) {
				if (Math.random() < 1/10) return SPACE.setAtom(site, new Empty(), Empty)
			}
			else if (element != Void) {
				if (Math.random() < 1/100) return SPACE.setAtom(site, new Empty(), Empty)
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
		
		return behave
	}
}

element Res any(xyz) {
	opacity 0.1
	category "T2Tile"
	behave {
		const behave = (self, origin) => {
			const rando = Math.trunc(Math.random() * 6)
			const site = origin.sites[symms[rando]]
			const atom = site.atom
			if (atom.element == Empty) {
				SPACE.setAtom(origin, atom, Empty)
				SPACE.setAtom(site, self, Res)
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
		
		return behave
	}
}

`
