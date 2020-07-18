SpaceTode` 

element Static7 category "Sand7"

element Float7 {
	symbol W Water7
	given F (element) => element === Empty || element === Water7
	keep F
	
	maybe(0.5) {
		@W => W@
		 F     F
	}
	
	@ => .
}

element Sand7 any(xz.rotations) {
	colour "#ffcc00"
	emissive "#ffa34d"
	category "Sand7"
	
	symbol W Water7
	symbol S Sand7
	symbol s Static7
	
	// Can fall into
	given F (element) => element === Empty || element === Water7
	keep F
	
	// Can move through
	given M (element) => element === Empty || element === Water7 || element === Sand7
	keep M
	
	// Simple
	@ => _
	_    @
	
	@ => .
	x    .
	
	@_ => _@
	sF    sF
	
	@_ => _@
	SF    SF
	
	@ => _
	W    @
	_    W
	
	// Move to bottom right corner of event window
	@   => _
	W      @
	MM_    MMW
	
	@   => _
	WMM    @MM
	  _      W
	
	@   => _
	WM     @M
	 M_     MW
	
	// Move down and right
	@  => _
	W     @
	M_    MW
	
	// Move right twice
	@  => _
	WM_   @MW
	
	// Move right once
	@  => _
	W_    @W
	
	// Move up once and right twice
	@ _ => _ W
	WMM    @MM
	
	@M_ => _MW
	W      @
	
	// Move up once and right once	
	@_ => _W
	W     @
	
	// Move up twice and right twice
	MM_    MMW
	@   => _
	W      @
	
	 M_     MW
	@M  => _M
	W      @
	
	maybe(0.8) mimic(Float7)
	
	//
	@ => W
	W    @
	
	
}

element Water7 for(xz.rotations) {
	colour "lightblue"
	emissive "blue"
	opacity 0.35
	category "Sand7"
	
	@ => _
	_    @
	
	@ => .
	x    .
	
	@_ => _@
}

`