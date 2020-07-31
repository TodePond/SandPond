// Smell Flags
const LOVE = Flag(1)
const STINK = Flag(2)

SpaceTode`

element Sniffer {
	given P (element, Self) => Flag.has(element.smell, Self.pheromone)
	select P (atom) => atom.target
	keep P (self, selected) => {
		if (selected === undefined) return
		self.target = [...selected]
		self.interest = 1.0
	}
	action for(xz.directions) @P => P.
	
	given I (self) => self.interest > 0
	keep I (self) => self.interest -= 0.1
	action I => I
}

element Smell {
	prop state GAS
	prop temperature ROOM
	opacity 0.3
	
	given i (self) => self.target === undefined
	keep i (self) => {
		self.target = [0, 0, 0]
		if (self.strength === undefined) self.strength = 0.01
	}
	i => i
	
	maybe(0.01) @ => _
	
	given F (element, Self) => element.state >= GAS && element !== Self
	select F (atom) => atom
	change F (selected, self) => {
		self.target[1] -= 1
		return selected
	}
	@ => F
	F    @
	
	change M (self, x, y, z) => {
		self.target[0] += x
		self.target[1] += y
		self.target[2] += z
		return self
	}
	
	given D (element, Self) => element.state >= GAS && element !== Self
	select D (atom) => atom
	change D (selected) => selected
	for(xyz.directions) @D => DM
	
}

element Pheromone {
	category "Life"
	prop state GAS
	prop temperature ROOM
	prop smell LOVE
	colour "pink"
	emissive "rgb(255, 64, 128)"
	opacity 0.3
	mimic(Smell)	
}

`
