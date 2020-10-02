
SpaceTode` 



element Explosion any(xyz.directions) {
	colour "darkorange"
	emissive "red"
	opacity 0.3
	category "Explosive"
	prop temperature HOT
	prop state EFFECT
	arg timer 20
	arg explosionColour "orange"
	
	given i (self) => self.init !== true
	keep c (self, space) => {
		if (self.explosionColour === "blue") {
			self.colour = {r:0, g:0, b:255}
			self.emissive = {r:0, g:0, b:128}
			SPACE.updateAppearance(space)
		}
		else if (self.explosionColour === "red") {
			self.colour = {r:255, g:0, b:0}
			self.emissive = {r:128, g:0, b:0}
			SPACE.updateAppearance(space)
		}
		else if (self.explosionColour === "green") {
			self.colour = {r:0, g:255, b:0}
			self.emissive = {r:0, g:128, b:0}
			SPACE.updateAppearance(space)
		}
		else if (self.explosionColour === "yellow") {
			self.colour = {r:255, g:200, b:0}
			self.emissive = {r:128, g:100, b:0}
			SPACE.updateAppearance(space)
		}
		self.init = true
	}
	action i => c
	
	keep t (self) => self.timer--
	action @ => t
	
	given t (self) => self.timer <= 0
	t => _
	
	change E (self, selfElement) => {
		const e = new selfElement(self.timer, self.explosionColour)
		e.colour = self.colour
		e.emissive = self.emissive
		return e
	}
	@. => .E
	
}

element GunPowder {
	category "Explosive"
	colour "grey"
	emissive "brown"
	prop state SOLID
	prop temperature ROOM
	prop states () => ({
		[HOT]: Explosion,
	})
	
	mimic(Temperature)
	mimic(Powder)
	
}

element Firework {
	colour "grey"
	emissive "black"
	category "Explosive"
	prop state SOLID
	prop temperature WARM
	arg fuel 25
	
	change E () => {
		const rando = Math.floor(Math.random() * 5)
		if (rando < 1) return new Explosion(20, "orange")
		if (rando < 2) return new Explosion(20, "blue")
		if (rando < 3) return new Explosion(20, "red")
		if (rando < 4) return new Explosion(20, "yellow")
		if (rando < 5) return new Explosion(20, "green")
	}
	
	given t (self) => self.fuel <= 0
	t => E
	
	change F (self) => {
		self.fuel--
		return new Fire()
	}
	
	_ => @
	@    F
	
	@ => E
}

// TODO: implement direction and make it an arg
// needs quite a lot of work - need firstclass directions in the SpaceTode language, similar to symmetries
element Meteor {
	colour "#781a00"
	emissive "black"
	category "Explosive"
	prop state SOLID
	prop temperature WARM
	data stuck false
	prop states () => ({
		[COLD]: Rock,
		[CHILLY]: Rock,
		[COOL]: [Rock, 0.4],
	})
	
	mimic(Temperature)
	
	change F () => new Fire()
	action {
		 _ => F
		@    .
	}
	
	given F (element) => element === Fire
	 @  => _
	F     @ 
	
	given E (element) => element === Explosion
	 @  => _
	E     .
	
	given D (element) => element.state > SOLID
	select D (atom) => atom
	change D (selected) => selected
	 @  => D
	D     @
	
	given M (element, selfElement, atom) => element === selfElement || atom.stuck === false
	 @ => .
	M    .
	
	change E () => new Explosion(35)
	@ => E
	
	mimic(Sticky)
}

`
