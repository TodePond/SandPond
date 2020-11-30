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


`