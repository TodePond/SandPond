SpaceTode`

element Glass {
	colour "#3e403f"
	emissive "#3e403f"
	opacity 0.1
	prop state SOLID
	prop temperature ROOM
	prop stickiness 1.0
	data stuck false
	category "Sandbox"
	mimic(Sticky)
	mimic(Solid)
	
	symbol G new Glass
	
	@ => @
	_    G
	G    G
}

element Charcoal {
	colour "#2e362d"
	emissive "#2e362d"
	category "Sandbox"
	prop state SOLID
	prop temperature ROOM
	prop states () => ({
		[HOT]: [FlamingCharcoal, 0.12],
	})
	
	mimic(Temperature)
	mimic(Solid)
}

element FlamingCharcoal {
	colour "#2e362d"
	emissive "2e362d"
	category "Sandbox"
	prop state SOLID
	prop temperature HOT
	prop states () => ({
		[ROOM]: [Ash, 0.003],
		[COOL]: [Ash, 0.005],
		[COLD]: [Ash, 0.01],
	})
	
	mimic(Temperature)
	
	change F () => new Fire()
	action {
		_ => F
		@    .
	}
	
	mimic(Solid)	
}

element Ash {
	colour "black"
	emissive "black"
	category "Sandbox"
	prop state SOLID
	prop temperature WARM
	
	mimic(Temperature)
	mimic(Powder)
}

`
