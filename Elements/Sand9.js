SpaceTode` 

element Static9 category "Sand9"

element Sand9 {
	colour "#ffcc00"
	emissive "#ffa34d"
	category "Sand9"
}

element Graviton9 any(xyz.rotations) {
	colour "brown"
	opacity 0.1
	category "Sand9"
	
	behave {
		
		const BELOW = EVENTWINDOW.getSiteNumber(0, -1, 0)
		const SLIDES = [
			EVENTWINDOW.getSiteNumber(1, -1, 0),
			EVENTWINDOW.getSiteNumber(-1, -1, 0),
			EVENTWINDOW.getSiteNumber(0, -1, 1),
			EVENTWINDOW.getSiteNumber(0, -1, -1),
		]
		
		return (origin, selfElement, time, self) => {
			const sites = origin.sites
			for (const space of sites) {
				const element = space.element
				if (element === Sand9) {
					const sandSites = space.sites
					const spaceBelow = sandSites[BELOW]
					const elementBelow = spaceBelow.element
					if (elementBelow === Empty /*|| elementBelow === Graviton9*/) {
						SPACE.setAtom(space, new elementBelow(), elementBelow)
						SPACE.setAtom(spaceBelow, new Sand9(), Sand9)
						continue
					}
					
					const siteNumberSlide = SLIDES[Math.floor(Math.random() * 4)]
					const spaceSlide = sandSites[siteNumberSlide]
					const elementSlide = spaceSlide.element
					if (elementSlide === Empty /*|| elementSlide === Graviton9*/) {
						SPACE.setAtom(space, new elementSlide(), elementSlide)
						SPACE.setAtom(spaceSlide, new Sand9(), Sand9)
						continue
					}
				}
			}
		}
	}
	
	symbol G Graviton9
	symbol S Sand9
	maybe(1/4) @_ => G@
	@G => _@
	@S => S@
	@_ => _@
}

`