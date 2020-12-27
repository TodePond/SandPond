SpaceTode` 

element Explosion any(xyz.directions) {
	category "Clear"
	arg timer 50
	
	keep t (self) => self.timer--
	action @ => t
	
	given t (self) => self.timer < 0
	t => _
	
	change e (self, Self) => new Self(self.timer)
	@. => .e
	
}

element Sand1 any(xz.directions) {
	colour "#FC0"
	emissive "#ffa34d"
	category "Gravity1"
	default true
	@ => _
	_    @
	
	@  => _
	 _     @
}

element Sand2 {
	colour "#FC0"
	emissive "#ffa34d"
	category "Gravity2"
}

element Graviton2 {
	colour "brown"
	arg energy 0
	arg initOpacity 0
	opacity 0.0
	category "Gravity2"
	
	{
		data init false
		given i (self) => !self.init
		keep i (self) => {
			self.opacity = self.initOpacity
			self.init = true
		}
		action i => i
	}
	
	//========//
	// ENERGY //
	//========//
	{
		
		// Update Opacity
		keep o (self, origin) => {
		
			if (self.energy < -50) self.energy = -50
			if (self.energy > 255) {
				self.energy -= Math.min(255, self.energy - 255)
				if (self.energy > 1000) self.energy = 1000
			}
			
			const energy = Math.max(0, self.energy - 45)
			
			const de = Math.min(Math.abs(energy - self.opacity), 2)
			const sign = (energy - self.opacity) > 0? 1 : -1
			self.opacity += Math.floor(de) * sign
			
			if (self.opacity < 0) self.opacity = 0
			if (self.opacity > 255) self.opacity = 255
			
			SPACE.update(origin)
		}
		action @ => o
		
	}
	
	//=========//
	// GRAVITY //
	//=========//
	behave(self, sites) => {
		const ss = sites.shuffled
		for (const s of ss) {
			const se = s.element
			if (se === Sand2) {
				const sss = s.sites
				const below = sss[17]
				const belowElement = below.element
				if (belowElement === Empty || belowElement === Graviton2) {
					const sa = s.atom
					SPACE.set(s, below.atom, belowElement)
					SPACE.set(below, sa, se)
					self.energy += 500
					continue
				}
				
				const rando = Math.floor(Math.random() * 4)
				const ssn = [18, 16, 55, 54][rando]
				const slide = sss[ssn]
				const slideElement = slide.element
				if (slideElement === Empty || slideElement === Graviton2) {
					const sa = s.atom
					SPACE.set(s, slide.atom, slideElement)
					SPACE.set(slide, sa, se)
					self.energy += 500
					continue
				}
				
			}
		}
	}
	
	//========//
	// SPREAD //
	//========//
	any(xyz.directions) {
	
		change E (self) => {
			self.energy += 50
			return self
		}
	
		change e (self) => {
			self.energy -= 255
			return self
		}
	
		change m (self) => {
			//self.energy -= 8
			return self
		}
		
		change n (self, Self) => new Self(self.energy, self.opacity)
		
		maybe(1/1) @$ => _e
		maybe(1/10) @_ => nE
		@_ => _m
		
	}
}


element Sand3 {
	colour "#FC0"
	emissive "#ffa34d"
	category "Gravity3"
}

element GravityField3 {
	colour "brown"
	arg energy 0
	arg initOpacity 0
	opacity 0.0
	category "Gravity3"
	
	{
		data init false
		given i (self) => !self.init
		keep i (self) => {
			self.opacity = self.initOpacity
			self.init = true
		}
		action i => i
	}
	
	//========//
	// ENERGY //
	//========//
	{
		
		// Update Opacity
		keep o (self, origin) => {
		
			if (self.energy < -50) self.energy = -50
			if (self.energy > 255) {
				self.energy -= Math.min(255, self.energy - 255)
				if (self.energy > 1000) self.energy = 1000
			}
			
			const energy = Math.max(0, self.energy - 45)
			
			const de = Math.min(Math.abs(energy - self.opacity), 2)
			const sign = (energy - self.opacity) > 0? 1 : -1
			self.opacity += Math.floor(de) * sign
			
			if (self.opacity < 0) self.opacity = 0
			if (self.opacity > 255) self.opacity = 255
			
			SPACE.update(origin)
		}
		action @ => o
		
	}
	
	//=========//
	// GRAVITY //
	//=========//
	behave(self, sites) => {
		const ss = sites.shuffled
		for (const s of ss) {
			const se = s.element
			if (se === Sand3) {
				const sss = s.sites
				const below = sss[17]
				const belowElement = below.element
				if (belowElement === Empty || belowElement === GravityField3) {
					const sa = s.atom
					SPACE.set(s, below.atom, belowElement)
					SPACE.set(below, sa, se)
					self.energy += 500
					continue
				}
				
				const rando = Math.floor(Math.random() * 4)
				const ssn = [18, 16, 55, 54][rando]
				const slide = sss[ssn]
				const slideElement = slide.element
				if (slideElement === Empty || slideElement === GravityField3) {
					const sa = s.atom
					SPACE.set(s, slide.atom, slideElement)
					SPACE.set(slide, sa, se)
					self.energy += 500
					continue
				}
				
			}
		}
	}
	
	//========//
	// SPREAD //
	//========//
	any(xyz.directions) {
	
		change E (self) => {
			self.energy += 50
			return self
		}
	
		change e (self) => {
			self.energy -= 255
			return self
		}
	
		keep d (self) => {
			self.energy -= 100
		}
		
		change n (self, Self) => new Self(self.energy, self.opacity)
		
		@_ => nE
		@ => d
		
	}
}




element Sand4 {
	colour "#FC0"
	emissive "#ffa34d"
	category "Gravity4"
}

element GravityFloor4 {
	colour "brown"
	arg energy 0
	arg initOpacity 0
	opacity 0.0
	category "Gravity4"
	//default true
	{
		data init false
		given i (self) => !self.init
		keep i (self) => {
			self.opacity = self.initOpacity
			self.init = true
		}
		action i => i
	}
	
	//========//
	// ENERGY //
	//========//
	{
		// Update Opacity
		keep o (self, origin) => {
		
			if (self.energy < -50) self.energy = -50
			if (self.energy > 255) {
				self.energy -= Math.min(255, self.energy - 255)
				if (self.energy > 1000) self.energy = 1000
			}
			
			const energy = Math.max(0, self.energy - 45)
			
			const de = Math.min(Math.abs(energy - self.opacity), 2)
			const sign = (energy - self.opacity) > 0? 1 : -1
			self.opacity += Math.floor(de) * sign
			
			if (self.opacity < 0) self.opacity = 0
			if (self.opacity > 255) self.opacity = 255
			
			SPACE.update(origin)
		}
		action @ => o
		
	}
	
	//=========//
	// GRAVITY //
	//=========//
	{
		keep E (self) => {
			self.energy += 200
		}
	
		change R (self) => new GravityRay4(self.energy, self.opacity)
		maybe(0.4) action {
			_ => R
			@    E
		}
	}
	
	//========//
	// SPREAD //
	//========//
	@ => _
	_    @
	
	any(xz.directions) {
	
		change E (self) => {
			self.energy += 200
			return self
		}
	
		change e (self) => {
			self.energy -= 255
			return self
		}
	
		keep d (self) => {
			self.energy -= 100
		}
		
		change n (self, Self) => new Self(self.energy, self.opacity)
		
		@_ => nE
		*     .
		
		@ => d
		*    .
		
	}
	
	@ => _
}

element GravityRay4 {
	colour "brown"
	arg energy 0
	arg initOpacity 0
	data desiredOpacity 0
	opacity 0.0
	category "Gravity4"
	{
		data init false
		given i (self) => !self.init
		keep i (self) => {
			self.desiredOpacity = self.initOpacity
			self.init = true
		}
		action i => i
	}
	
	action {
		//=========//
		// GRAVITY //
		//=========//
		{
			data full false
			change E (self) => {
				if (!self.full) self.energy += 100
				return self
			}
			
			origin f
			given f (self) => self.full
			
			given n (element) => element !== GravityFloor4
			
			symbol S Sand4
			any(xz.rotations) {
				S     _
				f_ => .S
				n     .
			}
			
			S => E
			@    S
			n    .
			
			change F (self, origin) => {
				self.full = true
				return self
			}
			S => F
			@    _
		}
		
		//======//
		// MOVE //
		//======//
		{
			
			change f (self, origin) => {
				self.energy -= 20
				if (self.full) {
					self.full = false
					return new Sand4()
				}
				else return new Empty()
			}
			
			_ => @
			@    f
			
			* => .
			@    _
		}
	}
	
	//========//
	// ENERGY //
	//========//
	{
		// Update Opacity
		keep o (self, origin) => {
		
			if (self.energy < -50) self.energy = -50
			if (self.energy > 255) {
				self.energy -= Math.min(255, self.energy - 255)
				if (self.energy > 1000) self.energy = 1000
			}
			
			const energy = Math.max(0, self.energy - 45)
			
			const de = Math.min(Math.abs(energy - self.desiredOpacity), 2)
			const sign = (energy - self.desiredOpacity) > 0? 1 : -1
			self.desiredOpacity += Math.floor(de) * sign
			
			if (self.desiredOpacity < 0) self.desiredOpacity = 0
			if (self.desiredOpacity > 255) self.desiredOpacity = 255
			
			if (self.full) {
				self.opacity = 255
				self.colour = Sand4.shaderColour
				self.emissive = Sand4.shaderEmissive
			} else {
				self.opacity = self.desiredOpacity
				self.colour = GravityRay4.shaderColour
				self.emissive = GravityRay4.shaderEmissive
			}
			
			SPACE.update(origin)
		}
		action @ => o
		
		origin n
		given n (self, atom) => self !== atom
		keep u (space) => SPACE.update(space)
		action {
			. => u
			n    .
		}
	}
}





element Sand5 {
	colour "#FC0"
	emissive "#ffa34d"
	category "Gravity5"
}

element GravityFloor5 {
	colour "brown"
	arg energy 0
	arg initOpacity 0
	opacity 0.0
	category "Gravity5"
	default true
	{
		data init false
		given i (self) => !self.init
		keep i (self) => {
			self.opacity = self.initOpacity
			self.init = true
		}
		action i => i
	}
	
	//========//
	// ENERGY //
	//========//
	{
		// Update Opacity
		keep o (self, origin) => {
		
			if (self.energy < -50) self.energy = -50
			if (self.energy > 255) {
				self.energy -= Math.min(255, self.energy - 255)
				if (self.energy > 1000) self.energy = 1000
			}
			
			const energy = Math.max(0, self.energy - 45)
			
			const de = Math.min(Math.abs(energy - self.opacity), 2)
			const sign = (energy - self.opacity) > 0? 1 : -1
			self.opacity += Math.floor(de) * sign
			
			if (self.opacity < 0) self.opacity = 0
			if (self.opacity > 255) self.opacity = 255
			
			SPACE.update(origin)
		}
		action @ => o
		
	}
	
	//=========//
	// GRAVITY //
	//=========//
	action {
		keep E (self) => {
			self.energy += 200
		}
	
		
		given v (element) => element !== Void && element !== Empty && element !== Sand5
		
		all(xz.directions) {
			v.    ..
			 . =>  .
			 @     .
		}
		
		given E (element) => element === Void || element === Empty
		change R (self) => new GravityWall5(self.energy, self.opacity)
		given f (element) => element === Sand5 || element === Empty
		maybe(0.2) {
			 f     .
			 _ =>  R
			 @     E
			 *     .
		}
	}
	
	//========//
	// SPREAD //
	//========//
	@ => _
	_    @
	
	any(xz.directions) {
	
		change E (self) => {
			self.energy += 200
			return self
		}
	
		change e (self) => {
			self.energy -= 255
			return self
		}
	
		keep d (self) => {
			self.energy -= 100
		}
		
		change n (self, Self) => new Self(self.energy, self.opacity)
		
		@_ => nE
		*     .
		
		@ => d
		*    .
		
	}
	
	@ => _
}

element GravityWall5 {
	colour "brown"
	arg energy 0
	arg initOpacity 0
	data desiredOpacity 0
	opacity 0.0
	category "Gravity5"
	{
		data init false
		given i (self) => !self.init
		keep i (self) => {
			self.desiredOpacity = self.initOpacity
			self.init = true
			self.opacity = 255
		}
		action i => i
	}
	
	//========//
	// ENERGY //
	//========//
	{
		// Update Opacity
		keep o (self, origin) => {
		
			if (self.energy < -50) self.energy = -50
			if (self.energy > 255) {
				self.energy -= Math.min(255, self.energy - 255)
				if (self.energy > 1000) self.energy = 1000
			}
			
			const energy = Math.max(0, self.energy - 45)
			
			const de = Math.min(Math.abs(energy - self.desiredOpacity), 2)
			const sign = (energy - self.desiredOpacity) > 0? 1 : -1
			self.desiredOpacity += Math.floor(de) * sign
			
			if (self.desiredOpacity < 0) self.desiredOpacity = 0
			if (self.desiredOpacity > 255) self.desiredOpacity = 255
			
			if (self.full) {
				self.opacity = 255
				self.colour = Sand5.shaderColour
				self.emissive = Sand5.shaderEmissive
			} else {
				self.opacity = self.desiredOpacity
				self.colour = GravityWall5.shaderColour
				self.emissive = GravityWall5.shaderEmissive
			}
			//self.opacity = 128
			SPACE.update(origin)
		}
		action @ => o
	}
	
	{
		
		//======//
		// MOVE //
		//======//
		action {
		
			all(xz.rotations) {
				 @ =>  .
				$     .
				
				
				 $ =>  .
				.     .
				@     .
			}
			
			$ => .
			.    .
			@    .
			
			given v (element, Self) => element === Void || element === Self
			symbol s GravityFloor5
			
			check l (self) => self.continue === false
			origin l
			
			check r (self) => self.continue === true
			origin r
			action @ => <
			action {
				v@ => .>
				
				v     .
				 @ =>  >
			}
			l => .
			s    .
			
			action {
				@v => <.
				
				 v     .
				@  => <
			}
			r => .
			s    .
			
			pov(right) {
				action {
					v@ => .>
					
					v     .
					 @ =>  >
				}
				l => .
				s    .
				
				action {
					@v => <.
					
					 v     .
					@  => <
				}
				r => .
				s    .
			}
			
			origin f
			given f (self) => self.full
			
			origin e
			given e (self) => !self.full
			
			symbol S Sand5
			given n (element) => element !== GravityFloor5
			any(xz.rotations) {
				S  => _
				f_    .S
				n     .
			}
			
			change E (self) => {
				if (!self.full) self.energy += 255
				return self
			}
			
			S => E
			@    S
			n    .
			

			change F (self, origin) => {
				self.energy += 500
				self.full = true
				return self
			}
			S => F
			e    _
			
			change f (self, origin) => {
				self.energy -= 20
				if (self.full) {
					self.full = false
					return new Sand5()
				}
				else return new Empty()
			}
			_ => @
			@    f
			
			$ => .
			@    f
			
			* => .
			@    f
			
		}
	}
	
}

`