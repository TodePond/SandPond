SpaceTode`

element Forkbomb any(xyz.directions) {
	colour "grey"
	emissive "black"
	category "T2Tile"
	keep F (space) => SPACE.setAtom(space, new Forkbomb(), Forkbomb)
	
	@_ => .F
}

element Res any(xyz.directions) {
	category "T2Tile"
	colour "slategrey"
	emissive "grey"
	opacity 0.2
	@_ => _@
}

element DReg any(xyz.directions) {

	colour "brown"
	emissive "brown"
	opacity 0.2
	category "T2Tile"
	
	symbol D DReg
	symbol R Res
	given n (element) => element !== DReg && element !== Void
	
	maybe(1/1000) @_ => D@
	maybe(1/200) @_ => R@
	maybe(1/10) @D => _@
	maybe(1/100) @n => _@
	@_ => _@
	
}

element RainbowRabbit {
	colour "white"
	emissive "grey"
	category "T2Tile"
	data id
	arg hue
	
	element Part {
		colour "white"
		emissive "grey"
		arg id
		
		given R (element, atom, self) => element === RainbowRabbit && atom.id === self.id
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
		const part = new RainbowRabbit.Part(self.id)
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
	given n (element, atom, self) => element !== RainbowRabbit.Part || atom.id !== self.id
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
	given P (element, atom, self) => element === RainbowRabbit.Part && atom.id === self.id
	P P    _ _
	P@P => P_P
	___    P@P
	
	// Move
	pov(right) {
	
		given H (self, atom, element) => {
			if (element !== RainbowRabbit) return false
			if ((self.hue < atom.hue)) {
				self.tempOtherHue = atom.hue
				return true
			}
		}
		
		change H (self) => new RainbowRabbit(self.tempOtherHue)
	
		@H => H@
		@.H => H.@
		maybe(1/2) any(z) @_ => _@
	}
	
	given R (element) => element === RainbowRabbit
	@    _
	R => .
	
	any(x) {
		P_P_    _P_P
		P@P_ => _P@P
	}
}

`