SpaceTode` 

element Static9b category "Sand9b"

element Sand9b {
	colour "#ffcc00"
	emissive "#ffa34d"
	category "Sand9b"
}

element Graviton9b any(xyz.rotations) {
	colour "brown"
	opacity 0.1
	category "Sand9b"
	visible false
	
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
				if (element === Sand9b) {
					const sandSites = space.sites
					const spaceBelow = sandSites[BELOW]
					const elementBelow = spaceBelow.element
					if (elementBelow === Empty /*|| elementBelow === Graviton9b*/) {
						SPACE.setAtom(space, new elementBelow(), elementBelow)
						SPACE.setAtom(spaceBelow, new Sand9b(), Sand9b)
						continue
					}
					
					const siteNumberSlide = SLIDES[Math.floor(Math.random() * 4)]
					const spaceSlide = sandSites[siteNumberSlide]
					const elementSlide = spaceSlide.element
					if (elementSlide === Empty /*|| elementSlide === Graviton9b*/) {
						SPACE.setAtom(space, new elementSlide(), elementSlide)
						SPACE.setAtom(spaceSlide, new Sand9b(), Sand9b)
						continue
					}
				}
			}
		}
	}
	
	symbol G Graviton9b
	symbol S Sand9b
	maybe(1/4) @_ => G@
	@G => _@
	@S => S@
	@_ => _@
}

`