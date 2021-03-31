SpaceTode`

element Fish {
	prop state SOLID
	prop temperature BODY
	prop food MEAT
	prop diet PLANT
	data stuck false
	colour "rgb(255, 100, 0)"
	arg id
	category "Life"

	{
		given i (self) => self.id === undefined
		keep i (self) => self.id = Math.random()
		action i => i
	}

	{
		change T (self) => new Fish.Tail(self.id)
		@ => T
		_    @

		any(xyz.rotations) {
			
			change t (self, Self) => new Self.Tail(self.id, true)
			symbol W Water
			@W => t@

			given s (element, self, atom) => element === Fish.Tail && atom.id === self.id
			select s (atom) => atom
			change s (selected) => selected
			@s => s@

			s     _
			@_ => .s

		}
	}

	element Tail {
		colour "rgb(255, 100, 0)"
		arg id
		arg holdsWater false

		given H (element, self, atom) => element === Fish && self.id === atom.id
		all(xyz.directions) @H => ..

		change w (self) => self.holdsWater? new Water() : new Empty()
		@ => w
	}
}

element Smeller {
	prop state SOLID
	prop temperature BODY
	data target undefined
	data interest 0
	
	given i (self) => self.target === undefined
	keep i (self) => {
		self.target = [0, 0, 0]
	}
	i => i
	
	
	given D (element) => element.state > SOLID
	select D (atom) => atom
	change D (selected) => selected
	@ => D
	D    @
	
	given P (element) => element === Pheromone
	select P (atom) => atom.target
	keep P (self, selected) => {
		if (selected === undefined) return
		self.target = [...selected]
		self.interest = 1.0
	}	
	action for(xz.directions) @P => P.
	
	given I (self) => self.interest > 0
	keep I (self) => self.interest -= 0.01
	action I => I
	
	given M (element, x, z, self) => {
		if (self.interest <= 0) return false
		if (element.state <= SOLID) return false
		if (x > 0 && self.target[0] < 0) return true
		if (x < 0 && self.target[0] > 0) return true
		if (z > 0 && self.target[2] < 0) return true
		if (z < 0 && self.target[2] > 0) return true
		return false
	}
	select M (atom, x, z) => [atom, x, z]
	change M (selected) => {
		const [atom, x, z] = selected
		if (atom.target !== undefined) {
			atom.target[0] -= x
			atom.target[2] -= z
		}
		return atom
	}
	change m (x, z, self) => {
		self.target[0] += x
		self.target[2] += z
		return self
	}
	for(xz.directions) {
		@M => Mm
		
		 M =>  m
		@     M
	}
	
	maybe(0.15) any(xz.directions) @D => D@
	
}

element Mouse {
	category "Life"
	colour "white"
	emissive "grey"
	prop state SOLID
	prop temperature BODY
	prop food MEAT
	prop diet PLANT | DAIRY
	prop pheromone LOVE | STINK
	data stuck false
	data target undefined
	data interest 0.0
	arg energy 0.85
	arg id
	
	given T (self, element, atom, Self) => element === Self.Tail && atom.id == self.id
	change T (self, Self) => new Self.Tail(self.id)
	
	change M (self, Self) => new Self(self.id)
	
	//======//
	// Init //
	//======//
	given i (self) => self.id === undefined
	change i (self) => {
		self.id = Math.random()
		self.target = [0, 0, 0]
		return self
	}
	i => i
	
	//=======//
	// Scent //
	//=======//
	origin p
	given p (self) => self.energy > 0.9
	change p (self) => new Pheromone(0.94, self)
	given ~ (element) => element === Empty || false
	
	//=======//
	// Breed //
	//=======//	
	given B (element, atom, self, Self) => (element === Self || element === Self.Tail) && (atom.id !== self.id) && self.energy > 0.9
	keep B (atom) => atom.energy -= 0.0
	change b (self, Self) => {
		self.energy -= 0.6
		return new Self(0.6)
	}
	given , (element) => element === Empty || element.state === GAS
	for(xyz.directions) {
		action p~ => .p
		@B, => BBb
		@,B => BbB
	}
	
	//=====//
	// Eat //
	//=====//
	given F (Self, element) =>  Flag.has(element.food, Self.diet)
	change e (self) => {
		self.energy += 0.05
		if (self.energy > 1) self.energy = 1
		return new Empty()
	}
	
	for(xyz.directions) {
		T@F => eT@
	}
	
	for(xyz.rotations) {
		 F =>  @
		T@    eT
	}
	
	//=======//
	// Sniff //
	//=======//
	mimic(Sniffer)
	
	//======//
	// Fall //
	//======//
	given D (element) => element.state > SOLID
	select D (atom) => atom
	change D (selected) => selected	
	
	given d (element) => element.state > SOLID
	select d (atom) => atom
	change d (selected) => selected	
	T => D
	@    T
	D    @
	
	@ => T
	T    @
	
	for(xz.directions) {
		@T => Dd
		Dd    @T
		
		 @T =>  Dd
		Dd     @T
	}
	
	for(xz.directions) {
		T  => D
		@D    .T
	}
	
	//==============//
	// Follow Smell //
	//==============//
	given s (self) => Math.random() > self.energy + 0.1
	given f (element, x, z, self) => {
		if (self.interest <= 0) return false
		if (element.state <= SOLID) return false
		if (x > 0 && self.target[0] < 0) return true
		if (x < 0 && self.target[0] > 0) return true
		if (z > 0 && self.target[2] < 0) return true
		if (z < 0 && self.target[2] > 0) return true
		return false
	}
	select f (atom, x, z) => [atom, x, z]
	change f (selected, self) => {
		const [atom, x, z] = selected
		if (atom.target !== undefined) {
			atom.target[0] -= x
			atom.target[2] -= z
		}
		return atom
	}
	
	change F (self, x, z) => {
		self.target[0] += x
		self.target[2] += z
		return self
	}
	
	//======//
	// Move //
	//======//
	given h (self) => self.energy > 0.9
	maybe(0.75) h => .
	
	given m (element) => element.state > SOLID
	select m (atom) => atom
	change m (selected, self) => {
		self.energy -= 0.0005
		if (self.energy < 0) self.energy = 0
		return selected
	}
	
	for(xz.directions) {
		T@f => fTF
		
		 df =>  TF
		T@     df
	}
	
	for(xz) pov(top) {
		f     F
		T@ => .f
	}
	
	action {
		
		s => .
	
		for(xz.directions) {
			T@m => mT@
			
			 dm =>  T@
			T@     dm
		}
		
		for(xz) pov(top) {
			m     @
			T@ => .m
		}
	}
	
	! => .
	
	//===========//
	// Grow Tail //
	//===========//
	given g (element, self) => element === Empty && self.energy > 0.5
	change g (self, Self) => {
		self.energy -= 0.5
		return new Self.Tail(self.id)
	}
	for(xyz.directions) @T => ..
	any(xyz.directions) @g => .g
	
	//==================//
	// Act Without Tail //
	//==================//
	@ => D
	D    @
	
	action {
		s => .
		for(xz.directions) @m => m@
	}
	
	// TODO: more behaviours here? eg: smell following
	
	! => .
	
	element Tail {
		prop state SOLID
		prop temperature BODY
		prop food MEAT
		prop diet PLANT | DAIRY
		data stuck false
		colour "pink"
		emissive "rgb(255, 64, 128)"
		arg id
		
		given ^ (element, atom, self) => element === SpaceTode.global.elements.Mouse
		for(xyz.directions) @^ => ..
		mimic(Powder)
	}
}

element _Rabbit {
	category "Life"
	colour "white"
	emissive "grey"
	prop state SOLID
	prop temperature BODY
	prop food MEAT
	prop diet PLANT
	prop pheromone LOVE
	data stuck false
	data target undefined
	data interest 0.0
	data energy 0.6
	
	//================//
	// Global Symbols //
	//================//
	// Rabbit
	given R (element, atom, self) => element === _Rabbit && atom.id === self.id
	change R (self) => new _Rabbit(self.id)
	
	// Rabbit Ears
	given E (element, atom, self) => element === _Rabbit.Ear && atom.id === self.id
	change E (self) => new _Rabbit.Ear(self.id)
	
	// Stretch
	given r (element, atom, self) => element === _Rabbit.Stretch && atom.id === self.id
	change r (self) => new _Rabbit.Stretch(self.id)
	
	// Stretch Ears
	given e (element, atom, self) => element === _Rabbit.Stretch.Ear && atom.id === self.id
	change e (self) => new _Rabbit.Stretch.Ear(self.id)
	
	//======//
	// Init //
	//======//
	{
		arg id
		given i (self) => self.id === undefined
		change i (self) => {
			self.id = Math.random()
			self.target = [0, 0, 0]
			return self
		}
		i => i
	}
	
	//===========//
	// Grow Ears //
	//===========//
	{
		data grown false
		origin g
		given g (self) => !self.grown
		keep g (self) => self.grown = true
		for(xz.swaps) {
			_ _    E E
			_g_ => EgE
		}
	}
	
	//======//
	// Land //
	//======//
	{
		
		given L (element) => element.state <= SOLID
		keep l (self) => {
			self.jumpRemaining = 5
			self.jumpDirection = undefined
		}
		
		maybe(1/25) {
			action {
				@ => l
				L    .
			}
			
			for(xz.directions) action {
				E@ => .l
				L     .
			}
			
			for(xz.directions) action {
				@E => l.
				 L     .
			}
		}
	}
	
	//======//
	// Move //
	//======//
	{
		// If I'm currently stretching, catch up with (or wait for) the stretch
		given g (element, atom, self) => element === _Rabbit.Stretch && atom.id === self.id && atom.grown
		for(xz.rotations) {
			 g =>  @
			@     _
			
			 r     .
			@  => >
		}
	}
	
	action @ => <
	action {
		
		// Check I have all my body parts (:
		all(xz.rotations) action {
			E E    . .
			E@E => .>.
		}
		< => >
		
		// Start a new stretch
		given n (element, self, transformationNumber) => {
			if (self.jumpDirection === undefined) {
				self.jumpDirection = transformationNumber
			}
			else if (transformationNumber == self.jumpDirection) {
			
			}
			else return false
			self.jumpRemaining--
			if (element === Empty && self.jumpRemaining >= 0) {
				return true
			}
			return false
		}
		change n (self, transformationNumber) => {
			let t = transformationNumber + 1
			if (t > 3) t -= 4
			//self.jumpRemaining--
			//self.jumpRemaining = 5
			return new _Rabbit.Stretch(self.id, t)
		}
		for(xz.rotations) {
			 n     n
			@  => <
		}
	}
	< => .
	
	//======//
	// Fall //
	//======//
	data jumpRemaining 0
	data jumpDirection
	{
		given 1 (element) => element.state > SOLID
		select 1 (atom) => atom
		change 1 (selected) => selected
		
		given 2 (element) => element.state > SOLID
		select 2 (atom) => atom
		change 2 (selected) => selected
		
		given 3 (element) => element.state > SOLID
		select 3 (atom) => atom
		change 3 (selected) => selected
	
		origin f
		given f (self) => self.jumpRemaining <= 0
	
		for(xz.rotations) {
			E E => 1 3
			EfE    E2E
			123    E@E
		}
	}
	
	//=========//
	// Injured //
	//=========//
	{
		given m (element, atom, self) => (element === _Rabbit.Stretch.Ear || element === _Rabbit.Ear) && atom.id === self.id
		for(xz.rotations) {
			m m    . .
			m@m => ...
			
			 r     .
			@  => .
			
			@e => ..
		}
		
		// Fall
		given I (element) => element.state > SOLID
		select I (atom) => atom
		change I (selected) => selected
		@ => I
		I    @
		
		// Move
		any(xz.rotations) {
			@I => I@
		}
	}
	
	//==============//
	// Sub-Elements //
	//==============//
	element Ear {
		category "Life"
		colour "white"
		emissive "grey"
		prop state SOLID
		prop temperature BODY
		data stuck false
		arg id
		arg part
		
		// Catch up with my stretch
		given g (element, atom, self) => element === _Rabbit.Stretch.Ear && atom.id === self.id
		for(xz.rotations) {
			 g     @
			@  => _
		}
	}
	
	element Stretch {
		colour "white"
		emissive "grey"
		//colour "pink"
		//emissive "purple"
		//opacity 0.5
		prop state SOLID
		prop temperature BODY
		prop food MEAT
		data stuck false
		arg id
		arg transformationNumber

		{
			data grown false
			origin g
			given g (self, transformationNumber) => !self.grown && self.transformationNumber === transformationNumber
			keep g (self) => self.grown = true
			for(xz.rotations) {
				_ _    e e
				_g_ => ege
			}
			
			origin G
			given G (self) => self.grown
			given m (element, atom, self) => (element === _Rabbit.Stretch.Ear || element === _Rabbit.Ear) && atom.id === self.id
			for(xz.rotations) {
				m m    . .
				mGm => ...
			}
			
			@ => _
		}
		
		element Ear {
			colour "white"
			emissive "grey"
			//colour "pink"
			//emissive "purple"
			//opacity 0.5
			prop state SOLID
			prop temperature BODY
			data stuck false
			arg id
			arg part
			
		}
		
	}
	
}

element Ant {
	colour "grey"
	emissive "black"
	category "Life"
	prop state SOLID
	prop temperature BODY
	prop food Flag.and(BUG, MEAT)
	
	given M (element) => element.state > LIQUID && element.state !== EFFECT
	select M (atom) => atom
	change M (selected) => selected
	given m (element) => element.state > LIQUID && element.state !== EFFECT
	
	given S (element, selfElement) => element.state <= SOLID && element !== selfElement
	any(xyz.rotations) {
		@M => M@
		 S     .
		
		mM => .@
		@S    M.
	}
	
	all(xyz.directions) {
		@S => ..
	}
	
	given A (element, selfElement) => element === selfElement
	any(xz.rotations) {
		@M => M@ 
		A     .
	}
	
	given F (element) => element.state > LIQUID
	select F (atom) => atom
	change F (selected) => selected
	@ => F
	F    @
	
}

element Rabbit {
	colour "white"
	emissive "grey"
	category "Life"
	prop state SOLID
	prop temperature BODY
	prop food MEAT
	
	data id
	
	element Part {
		colour "white"
		emissive "grey"
		arg id
		prop state SOLID
		prop temperature BODY
		prop food MEAT
		
		given R (element, atom, self) => element === Rabbit && atom.id === self.id
		@R => ..
		R@ => ..
		
		@  => .
		 R     .
		
		 @ =>  .
		R     .
		
		@ => _
	}
	
	// Init ID
	given i (self) => self.id === undefined
	keep i (self) => self.id = Math.random()
	i => i
	
	// Grow body
	change P (self, atom) => {
		const part = new Rabbit.Part(self.id)
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
	given n (element, atom, self) => element !== Rabbit.Part || atom.id !== self.id
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
	given P (element, atom, self) => element === Rabbit.Part && atom.id === self.id
	P P    _ _
	P@P => P_P
	___    P@P
	
	any(xyz.directions) {
	
		// Eat
		given C (element) => element === Carrot.Leaf || element === Carrot.Part
		keep C (atom) => atom.eaten = true
		@.C => ..C
		@C => .C
		
		// Breed
		given R (element, atom, self) => (element === Rabbit || element === Rabbit.Part) && self.id !== atom.id
		change B () => new Rabbit()
		maybe(1/15) {
			@_R => .B.
			@R_ => ..B
			_@R => B..
			_@.R => B...
		}
	}
	
	// Move
	maybe(1/2) pov(right) any(z) {
		@_ => _@
	}
	
	any(x) {
		P_P_    _P_P
		P@P_ => _P@P
	}
	
}

`