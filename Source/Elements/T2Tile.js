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

element Pulse {
	category "T2Tile"
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
  
`