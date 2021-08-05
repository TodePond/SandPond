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

element SwapLine {
	colour "brown"
	category "T2Tile"
	
	symbol L SwapLine
	symbol D SwapLine.Done
	
	for(y) {
		_ => L
		@    .
		
		x => .
		@    D
		
		D => .
		@    D
	}
	
	given O (element) => element !== SwapLine
	for(y) {
		O => .
		@    D
	}
	
	element Done {
		colour "grey"
		emissive "black"
		
		
		for(y) {
			D     .
			 @ =>  .
			
			L     .
			 @ =>  .
			
			L    .
			@ => .
		}
		
		@D => _@
		@L => _@
		@x => _.
		@? => ?@
	}
	
}

element ThickSwapLine {
	colour "brown"
	category "T2Tile"
	
	symbol L ThickSwapLine
	symbol F ThickSwapLine.Front
	symbol B ThickSwapLine.Back
	
	given l (element) => element !== ThickSwapLine
	given f (element) => element !== ThickSwapLine.Front
	given b (element) => element !== ThickSwapLine.Back
	
	given N (element) => element === ThickSwapLine || element === ThickSwapLine.Front || element === ThickSwapLine.Back
	given n (element) => element !== ThickSwapLine && element !== ThickSwapLine.Front && element !== ThickSwapLine.Back
	
	 ln     ..
	@_n => .F.
	 ln     ..
	
	for(y) {
		 nnnn    ....
		  __n =>  $F.
		  @F      ..
	}
	
	
	for(y) {
	
		xxf => ...
		@Ff    B..
		  f      .
		
		BFf => ...
		@Ff    B..
		  f      .
		
		N       .
		 nnf =>  ...
		 @Ff     B..
		   f       .
	}
	

	element Back {
		colour "green"
		emissive "lightgreen"
		
		@f => _.
		
		for(y) {
			 @ =>  _
			F     .
		}
		
	}
	
	element Front {
		colour "grey"
		emissive "black"
		
		for(y) {
			L => .
			@    _
		}
		
		n@ => ._
		
		B@x => __.
		
		@B => _.
		
		for(y) {
			 B =>  .
			@     _
		}
		
		for(y) {
		
			BF  => ..
			  @      .
			
			LF    ..
			 @ =>  .
		}
		
		   n       .
		B@_n => _B@.
		   n       .
		
		
	}
	
}

element SwapWall {
	colour "brown"
	category "T2Tile"
	arg timer 0
	
	given W (element) => element === SwapWall
	change W (self) => new SwapWall(self.timer)
	change w (self) => new SwapWall(self.timer + 1)
	
	given D (element) => element === SwapWall.Done
	change D (self) => new SwapWall.Done(self.timer)
	
	given E (element) => element === SwapWall.Egg
	change E (self) => new SwapWall.Egg(self.timer)
	
	for(yz.directions) {
		_ => w
		@    .
	}
	
	for(yz.directions) {
		x => .
		@    E
		
		E => .
		@    E
		
		D => .
		@    E
	}
	
	given O (element) => element !== SwapWall
	for(yz.directions) {
		O => .
		@    D
	}
	
	element Egg {
		colour "lightgreen"
		emissive "green"
		arg timer 0
		
		given t (self) => self.timer-- > 0
		t => .
		
		for(yz.directions) {
			W    .
			@ => .
		}
		
		@ => D
	}
	
	element Done {
		colour "grey"
		emissive "black"
		arg timer 0
		
		for(yz) {
			D     .
			 @ =>  .
			
			W     .
			 @ =>  .
			
			E     .
			 @ =>  .
			
			W    .
			@ => .
			
			E    .
			@ => .
		}
		
		@D => _@
		@W => _@
		@x => _.
		@? => ?@
	}
	
}

element SwapWallUp {
	colour "brown"
	category "T2Tile"
	arg timer 0
	
	given W (element) => element === SwapWallUp
	change W (self) => new SwapWallUp(self.timer)
	change w (self) => new SwapWallUp(self.timer + 1)
	
	given D (element) => element === SwapWallUp.Done
	change D (self) => new SwapWallUp.Done(self.timer)
	
	given E (element) => element === SwapWallUp.Egg
	change E (self) => new SwapWallUp.Egg(self.timer)
	
	pov(top) {
	
		for(xz.directions) {
			_ => w
			@    .
		}
		
		for(xz.directions) {
			x => .
			@    E
			
			E => .
			@    E
			
			D => .
			@    E
		}
		
		given O (element) => element !== SwapWallUp
		for(xz.directions) {
			O => .
			@    D
		}
	}
		
	element Egg pov(top) {
		colour "lightgreen"
		emissive "green"
		arg timer 0
		
		given t (self) => self.timer-- > 0
		t => .
		
		for(xz.directions) {
			W    .
			@ => .
		}
		
		@ => D
	}
	
	element Done {
		colour "grey"
		emissive "black"
		arg timer 0
		
		for(xz) {
			 @ =>  .
			D     .
			
			 @ =>  .
			W     .
			
			E     .
			 @ =>  .
			
			W@ => ..
			
			E@ => ..
		}
		
		D    @
		@ => _
		
		W    @
		@ => _
		
		x    .
		@ => _
		
		?    @
		@ => ?
	}
	
}

element Gravifloor {
	colour "brown"
	//category "T2Tile"
	//default true
	
	symbol G Gravifloor.Grower
	symbol B Gravifloor.Builder
	symbol W Gravifloor.Worker
	symbol b Gravifloor.Bullet
	
	@ => _
	_    @
	
	@ => _
	$    @
	
	@ => _
	G    .
	
	@ => _
	B    B
	
	@ => G
	*    .
	
	@ => _
	
	element Grower {
		colour "brown"
		for(xz.directions) @_ => @$
		@ => B
	}
	
	element Builder {
		colour "brown"
		arg timer 1.0
		keep t (atom, space) => {
			if (atom.timer > 0) {
				atom.timer -= 0.05
				if (atom.timer < 0) atom.timer = 0
				atom.opacity = Math.floor(255 * atom.timer)
				SPACE.update(space)
			}
		}
		action @ => t
		
		given t (self) => self.timer <= 0
		t => W
	}
	
	element Worker {
		visible false
		
		maybe(0.001) {
			_ => b
			@    .
		}
		
	}
	
	element Bullet {
		colour "brown"
		
		arg timer 1.0
		keep t (atom, origin) => {
			if (atom.timer > 0) {
				atom.timer -= 0.025
				if (atom.timer < 0) atom.timer = 0
				atom.opacity = Math.floor(255 * atom.timer)
				SPACE.update(atom)
			}
		}
		action @ => t
		
		* => .
		@    _
		
		_ => @
		@    _
		
		
	}
}

element RainbowRabbit {
	colour "white"
	emissive "grey"
	//category "Rainbow"
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

element Pulse {
	//category "T2Tile"
	//default true
	colour "brown"
	
	symbol H Pulse.Head
	symbol T Pulse.Tail
	
	___    HHH
	_@_ => HTH
	___    HHH
	
	@ => _
	
	element Head {
		colour "brown"
		
		any(xy.directions) {
			H     .
			@_ => T@
			H     .
		}
	}
	
	element Tail {
		colour "grey"
		emissive "black"
		
		given n (element) => element !== Pulse.Head && element !== Pulse.Tail && element !== Pulse
		
		all(xy.directions) {
			@n => _.
		}
	}
}

element Gravifull {
	//category "T2Tile"
	colour "pink"
	emissive "red"
	//default true
	
	symbol W Gravifull.Worker
	symbol B Gravifull.Builder
	
	// The "No Cheating" Method
	for(xyz.directions) @_ => .$
	@ => B
	
	// The "Cheating" Method
	/*behave () => {
		for (const space of spaces) {
			SPACE.set(space, new Gravifull.Worker(), Gravifull.Worker) 
		}
	}*/
	
	element Builder {
		colour "pink"
		emissive "red"
		arg timer 1.0
		
		keep t (atom, space) => {
			if (atom.timer > 0) {
				atom.timer -= 0.5
				if (atom.timer < 0) atom.timer = 0
				atom.opacity = Math.floor(255 * atom.timer)
				SPACE.update(space)
			}
		}
		action @ => t
		//action any(xyz.directions) @$ => tt
		
		given t (self) => self.timer <= 0
		t => W
	}
	
	element Worker {
		visible false
		
		behave (sites, origin, Self) => {
			//print(sites)
			for (const site of sites) {
				const element = site.element
				if (element === Sandee) {
					const sandSites = site.sites
					const spaceBelow = sandSites[17]
					const elBelow = spaceBelow.element
					if (elBelow === Gravifull.Worker || elBelow === Wateree) {
						const atomBelow = spaceBelow.atom
						SPACE.set(spaceBelow, site.atom, Sandee)
						SPACE.set(site, atomBelow, elBelow)
					}
					else {
						const rando = Math.floor(Math.random() * 4)
						const slidesn = [18, 16, 55, 54][rando]
						const spaceSlide = sandSites[slidesn]
						const elSlide = spaceSlide.element
						if (elSlide === Gravifull.Worker || elSlide === Wateree) {
							const atomSlide = spaceSlide.atom
							SPACE.set(spaceSlide, site.atom, Sandee)
							SPACE.set(site, atomSlide, elSlide)
						}
					}
				}
				else if (element === Wateree) {
					const sandSites = site.sites
					const spaceBelow = sandSites[17]
					const elBelow = spaceBelow.element
					if (elBelow === Void) continue
					if (elBelow === Gravifull.Worker) {
						const atomBelow = spaceBelow.atom
						SPACE.set(spaceBelow, site.atom, Wateree)
						SPACE.set(site, atomBelow, Gravifull.Worker)
					}
					else {
						const rando = Math.floor(Math.random() * 4)
						const slidesn = [13, 11, 32, 37][rando]
						const spaceSlide = sandSites[slidesn]
						const elSlide = spaceSlide.element
						if (elSlide === Gravifull.Worker) {
							const atomSlide = spaceSlide.atom
							SPACE.set(spaceSlide, site.atom, Wateree)
							SPACE.set(site, atomSlide, Gravifull.Worker)
						}
					}
				}
			}
		}
	}
	
}

element Sandee {
	colour "#ffcc00"
	emissive "#ffa34d"
	//category "T2Tile"
	prop state SOLID
	prop temperature ROOM
	
	mimic(Gravifull.Worker)
}

element Wateree {
	colour "lightblue"
	emissive "blue"
	opacity 0.35
	//category "T2Tile"
	prop state LIQUID
	prop temperature COOL
	
	mimic(Gravifull.Worker)
}

element Huegene {
	colour "white"
	arg hue
	data coloured false
	opacity 0.05
	category "T2Tile"

	// Cache hue RGB values
	given i () => !hueStepsInit
	keep i () => initHueStuff()
	action i => i

	// Pick the default hue if I haven't got one
	given h (self) => self.hue === undefined
	keep h (self) => self.hue = Math.round(HUE_DEFAULT)
	action h => h

	// Colour myself in with the correct RGB values
	given c (self) => !self.coloured
	keep c (origin, self) => {
		const offset = self.hue*3
		self.colour.r = HUE_RGBS[offset]
		self.colour.g = HUE_RGBS[offset+1]
		self.colour.b = HUE_RGBS[offset+2]
		self.emissive.r = self.colour.r
		self.emissive.g = self.colour.g
		self.emissive.b = self.colour.b
		SPACE.update(origin)
		self.coloured = false
	}
	action c => c

	// Mutate
	change + (self) => new Huegene(hueWrap(self.hue + 1))
	change - (self) => new Huegene(hueWrap(self.hue - 1))
	any(xyz.rotations) {
		maybe(0.5) @_ => .+
		@_ => .-
	}

}
`

let hueStepsInit = false
let HUE_STEPS = 50
let HUE_DEFAULT = Math.round(3 * HUE_STEPS / 4)
let HUE_RGBS = new Uint8Array(HUE_STEPS * 3)
const initHueStuff = () => {
	for (let i = 0; i < HUE_STEPS; i++) {
		const colour = new THREE.Color()
		colour.setHSL(i / HUE_STEPS, 0.9, 0.4)
		HUE_RGBS[i*3] = Math.floor(colour.r * 255)
		HUE_RGBS[i*3 + 1] = Math.floor(colour.g * 255)
		HUE_RGBS[i*3 + 2] = Math.floor(colour.b * 255)
	}
	hueStepsInit = true
}

const hueWrap = (n) => {
	if (n >= HUE_STEPS) return hueWrap(n - HUE_STEPS)
	if (n < 0) return hueWrap(n + HUE_STEPS)
	return n
}



//DROPPER_OVERRIDE = true