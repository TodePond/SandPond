SpaceTode` 

element Static8 category "Sand8"

element Sand8 {
	colour "#ffcc00"
	emissive "#ffa34d"
	category "Sand8"
	
	behave {
	
		const BELOW = EVENTWINDOW.getSiteNumber(0, -1, 0)
		const SLIDES = [
			EVENTWINDOW.getSiteNumber(1, -1, 0),
			EVENTWINDOW.getSiteNumber(-1, -1, 0),
			EVENTWINDOW.getSiteNumber(0, -1, 1),
			EVENTWINDOW.getSiteNumber(0, -1, -1),
		]
		
		return (origin, selfElement, time, self = origin.atom) => {
			const sites = origin.sites
			const spaceBelow = sites[BELOW]
			const elementBelow = spaceBelow.element
			if (elementBelow === Empty || elementBelow === Water8) {
				SPACE.setAtom(origin, spaceBelow.atom, elementBelow)
				SPACE.setAtom(spaceBelow, self, selfElement)
				return
			}
			
			const siteNumberSlide = SLIDES[Math.floor(Math.random() * 4)]
			const spaceSlide = sites[siteNumberSlide]
			const elementSlide = spaceSlide.element
			if (elementSlide === Empty || elementSlide === Water8) {
				SPACE.setAtom(origin, spaceSlide.atom, elementSlide)
				SPACE.setAtom(spaceSlide, self, selfElement)
				return
			}
		}
		
	}
}

element Water8 {
	colour "lightblue"
	emissive "blue"
	opacity 0.35
	category "Sand8"
	
	behave {
	
		const BELOW = EVENTWINDOW.getSiteNumber(0, -1, 0)
		const SLIDES = [
			EVENTWINDOW.getSiteNumber(1, 0, 0),
			EVENTWINDOW.getSiteNumber(-1, 0, 0),
			EVENTWINDOW.getSiteNumber(0, 0, 1),
			EVENTWINDOW.getSiteNumber(0, 0, -1),
		]
		
		return (origin, selfElement, time, self = origin.atom) => {
			const sites = origin.sites
			const spaceBelow = sites[BELOW]
			const elementBelow = spaceBelow.element
			if (elementBelow === Empty) {
				SPACE.setAtom(origin, spaceBelow.atom, elementBelow)
				SPACE.setAtom(spaceBelow, self)
				return
			}
			
			if (elementBelow === Void) return
			
			const siteNumberSlide = SLIDES[Math.floor(Math.random() * 4)]
			const spaceSlide = sites[siteNumberSlide]
			const elementSlide = spaceSlide.element
			if (elementSlide === Empty) {
				SPACE.setAtom(origin, spaceSlide.atom, elementSlide)
				SPACE.setAtom(spaceSlide, self)
				return
			}
		}
		
	}
}

`