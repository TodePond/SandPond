TodeSplat`

element WeatherBoy {
	colour "blue"
	emissive "darkblue"
	
	state "effect"
	
	isWeatherBoy true
	chance 0.01
	
	// init
	given i (self) => !self.initialised
	change I (self) => {
		self.birthday = new Date().getTime()
		self.initialised = true
		return self
	}
	rule { @i => I. }
	
	given d (space, atom) => space && !atom
	given d (self) => Math.random() < self.element.chance
	change D (self) => self.element.drop? new self.element.drop() : undefined
	rule {
		@ => @
		d    D
	}
	
	rule {
		_ => @
		@    _
	}
	
	given W (atom) => atom && atom.initialised
	given W (element) => element && element.isWeatherBoy
	given W (self, atom) => atom && self.birthday >= atom.birthday
	change W (self) => {
		const atom = new self.element()
		atom.birthday = self.birthday
		atom.initialised = true
		return atom
	}
	rule xz 0.2 { @_ => W@ }
	rule xz { @W => _@ }
	rule xz { @_ => _@ }
}

element LightningStorm {
	colour "yellow"
	emissive "darkblue"
	opacity 0.0
	category "Weather"
	state "effect"
	
	isWeatherBoy true
	chance 0.0001
	drop Lightning
	
	ruleset WeatherBoy
}

element Rainy {
	colour "lightblue"
	emissive "darkblue"
	opacity 0.0
	category "Weather"
	state "effect"
	
	isWeatherBoy true
	chance 0.01
	drop Water
	
	ruleset WeatherBoy
}

element Sandstorm {
	colour "#ffcc00"
	emissive "darkblue"
	opacity 0.0
	category "Weather"
	state "effect"
	
	isWeatherBoy true
	chance 0.01
	drop Sand
	
	ruleset WeatherBoy
}

element Snowstorm {
	colour "white"
	emissive "darkblue"
	opacity 0.0
	category "Weather"
	state "effect"
	
	isWeatherBoy true
	chance 0.01
	drop Snow
	
	ruleset WeatherBoy
}

element Sunny {
	colour "orange"
	emissive "darkblue"
	category "Weather"
	opacity 0.0
	state "effect"
	
	isWeatherBoy true
	chance 0.01
	drop undefined
	
	ruleset WeatherBoy
}

element Gunpowdery {
	colour "grey"
	emissive "darkblue"
	category "Weather"
	opacity 0.0
	state "effect"
	
	isWeatherBoy true
	chance 0.01
	drop GunPowder
	
	ruleset WeatherBoy
}

element Lavary {
	colour "darkred"
	emissive "darkblue"
	category "Weather"
	opacity 0.0
	state "effect"
	
	isWeatherBoy true
	chance 0.005
	drop Lava
	
	ruleset WeatherBoy
}

`