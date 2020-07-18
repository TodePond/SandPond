SpaceTode` 

element Static1 {
	category "Sand1"
}

element Sand1 any(xz.rotations) {
	colour "#ffcc00"
	emissive "#ffa34d"
	category "Sand1"
	default true
	
	@ => _
	_    @
	
	@  => _
	 _     @
}

element Water1 any(xz.rotations) {
	colour "lightblue"
	emissive "blue"
	opacity 0.35
	category "Sand1"
	@ => _
	_    @
	
	@ => .
	x    .
	
	@_ => _@
}

element Sand2 any(xz.rotations) {
	colour "#ffcc00"
	emissive "#ffa34d"
	category "Sand2"
	
	@ => _
	_    @
	
	@_ => _@
	 _     .
}

element Water2 any(xz.rotations) {
	colour "lightblue"
	emissive "blue"
	opacity 0.35
	category "Sand2"
	@ => _
	_    @
	
	@ => .
	x    .
	
	@_ => _@
}

element Sand3 any(xz.rotations) {
	colour "#ffcc00"
	emissive "#ffa34d"
	category "Sand3"
	
	@ => _
	_    @
	
	@_ => _@
	 _     .
	
	symbol W Water3
	@ => W
	W    @
	
	@W => W@
	 W     .
}

element Water3 {
	colour "lightblue"
	emissive "blue"
	opacity 0.35
	category "Sand3"
	
	
	data dyed false
	given D (element, selfElement, atom) => element === selfElement && atom.dyed
	keep d (self) => self.dyed = true
	any(xyz.rotations) action @D => d.
	
	given c (self) => self.dyed
	keep c (space, self) => {
		self.colour = {r: 128, b: 128, g: 255}
		self.emissive = {r: 0, b: 0, g: 255}
		SPACE.update(space)
	}
	action c => c
	
	@ => _
	_    @
	
	@ => .
	x    .
	
	any(xz.rotations) @_ => _@
}

element FoodColouring3 any(xz.rotations) {
	colour "green"
	emissive "green"
	opacity 0.35
	category "Sand3"
	@ => _
	_    @
	
	@ => .
	x    .
	
	symbol W Water3
	keep w (atom) => atom.dyed = true
	@ => _
	W    w
	
	@_ => _@
}

element Sand4 any(xz.rotations) {
	colour "#ffcc00"
	emissive "#ffa34d"
	category "Sand4"
	
	given D (element) => element === Water4 || element === Empty
	select D (atom) => atom
	change D (selected) => selected
	
	given F (element) => element === Water4 || element === Empty
	
	@ => D
	D    @
	
	@D => D@
	 F     .
}

element Water4 {
	colour "lightblue"
	emissive "blue"
	opacity 0.35
	category "Sand4"
	
	data dyed false
	given D (element, selfElement, atom) => element === selfElement && atom.dyed
	keep d (self) => self.dyed = true
	any(xyz.rotations) action @D => d.
	
	given c (self) => self.dyed
	keep c (space, self) => {
		self.colour = {r: 128, b: 128, g: 255}
		self.emissive = {r: 0, b: 0, g: 255}
		SPACE.update(space)
	}
	action c => c
	
	@ => _
	_    @
	
	@ => .
	x    .
	
	any(xz.rotations) @_ => _@
}

element Lemonade4 {
	colour "white"
	emissive "grey"
	opacity 0.35
	category "Sand4"
	
	@ => _
	_    @
	
	@ => .
	x    .
	
	any(xz.rotations) @_ => _@
}

element FoodColouring4 any(xz.rotations) {
	colour "green"
	emissive "green"
	opacity 0.35
	category "Sand4"
	@ => _
	_    @
	
	@ => .
	x    .
	
	symbol W Water4
	keep w (atom) => atom.dyed = true
	@ => _
	W    w
	
	@_ => _@
}
`

const SOLID5 = Symbol("Solid")
const LIQUID5 = Symbol("Solid")
const GAS5 = Symbol("Solid")
SpaceTode`

element Sand5 any(xz.rotations) {
	colour "#ffcc00"
	emissive "#ffa34d"
	category "Sand5"
	prop state SOLID5
	
	given D (element) => element !== Void && element.state !== SOLID5
	select D (atom) => atom
	change D (selected) => selected
	
	given F (element) => element !== Void && element.state !== SOLID5
	
	@ => D
	D    @
	
	@D => D@
	 F     .
}

element Water5 any(xz.rotations) {
	colour "lightblue"
	emissive "blue"
	opacity 0.35
	category "Sand5"
	prop state LIQUID5
	
	@ => _
	_    @
	
	@ => .
	x    .
	
	@_ => _@
}

element Lemonade5 any(xz.rotations) {
	colour "white"
	emissive "grey"
	opacity 0.35
	category "Sand5"
	prop state LIQUID5
	
	@ => _
	_    @
	
	@ => .
	x    .
	
	@_ => _@
}

element Sand6 any(xz.rotations) {
	colour "#ffcc00"
	emissive "#ffa34d"
	category "Sand6"
	prop resistance 1.0
	
	given D (element) => element !== Void && element.resistance === undefined || element.resistance < Math.random()
	select D (atom) => atom
	change D (selected) => selected
	
	given F (element) => element !== Void && element.resistance === undefined || element.resistance < 1.0
	
	@ => D
	D    @
	
	@D => D@
	 F     .
}

element Water6 any(xz.rotations) {
	colour "lightblue"
	emissive "blue"
	opacity 0.35
	category "Sand6"
	prop resistance 0.8
	
	@ => _
	_    @
	
	@ => .
	x    .
	
	@_ => _@
}

element Sand7 any(xz.rotations) {
	colour "#ffcc00"
	emissive "#ffa34d"
	category "Sand7"
	
	given D (element) => element === Empty || element === Water7
	select D (atom) => atom
	change D (selected) => selected
	
	given F (element) => element === Empty || element === Water7
	
	@ => _
	D    @
	_    D

	@  => _
	D_    @D

	@_ => _D
	D     @

	@ => D
	D    @

	@D_ => _@D
	 F      .

	@D => D@
	 F     .

	 _     D
	@D => _@
	 F     .
}

element Water7 any(xz.rotations) {
	colour "lightblue"
	emissive "blue"
	opacity 0.35
	category "Sand7"
	
	@ => _
	_    @
	
	@ => .
	x    .
	
	@_ => _@
}

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
				SPACE.setAtom(spaceBelow, self)
				return
			}
			
			const siteNumberSlide = SLIDES[Math.floor(Math.random() * 4)]
			const spaceSlide = sites[siteNumberSlide]
			const elementSlide = spaceSlide.element
			if (elementSlide === Empty || elementSlide === Water8) {
				SPACE.setAtom(origin, spaceSlide.atom, elementSlide)
				SPACE.setAtom(spaceSlide, self)
				return
			}
		}
		
	}
}

element Water8 any(xz.rotations) {
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