SpaceTode`

element Wall {

}

element WaterMinimal {
	category "Minimal"
	default true
	colour "rgb(0, 70, 255)"

	@ => _
	_    @

	any(x) {
		@_ => _@
	}

}

element WaterFor {
	category "For"
	default true
	colour "rgb(0, 70, 255)"

	@ => _
	_    @

	for(x) {
		@_ => _@
	}

}

element WaterSlide {
	category "Slide"
	default true
	colour "rgb(0, 70, 255)"

	@ => _
	_    @

	for(x) {

		@  => _
		 _     @

	}

	for(x) @_ => _@

}

element WaterDirection {

	symbol R WaterDirection.Right
	symbol L WaterDirection.Left

	element Right {
		default true
		category "Direction"
		colour "rgb(0, 70, 255)"
		
		@ => _
		_    @

		@  => _
		 _     @

		 @ =>  _
		_     L

		@_ => _@

		@ => L

	}
	
	element Left {
		colour "rgb(0, 70, 255)"
		category "Direction"
		
		@ => _
		_    @

		 @ =>  _
		_     @

		@  => _
		 _     R

		_@ => @_

		@ => R
	}
}

element WaterJump {

	symbol R WaterJump.Right
	symbol L WaterJump.Left

	element Right {
		default true
		category "Direction"
		colour "rgb(0, 70, 255)"
		
		@ => _
		_    @

		@  => _
		 _     @

		 @ =>  _
		_     L

		@__ => __@
		
		@R_ => _.@
		@L_ => _.@

		@_ => _@

		@ => L

	}
	
	element Left {
		colour "rgb(0, 70, 255)"
		category "Direction"
		
		@ => _
		_    @

		 @ =>  _
		_     @

		@  => _
		 _     R

		__@ => @__

		_L@ => @._
		_R@ => @._

		_@ => @_

		@ => R
	}
}

element WaterCompress {

	symbol R WaterCompress.Right
	symbol L WaterCompress.Left
	given N (element) => element === WaterCompress.Right || element === WaterCompress.Left
	change N () => Math.random() < 0.5? new WaterCompress.Right : new WaterCompress.Left
	symbol D WaterCompress.Dense

	element Right {
		default true
		category "Direction"
		colour "rgb(70, 128, 255)"
		
		@ => _
		_    @

		@  => _
		 _     @

		 @ =>  _
		_     L

		@__ => __@
		
		@N_ => _.@
		@D_ => _.@

		@_ => _@

		_@ => L_

		@ => _
		N    D
		
		@N => _D

		@  => _
		 N     D
	}
	
	element Left {
		colour "rgb(70, 128, 255)"
		category "Direction"
		
		@ => _
		_    @

		 @ =>  _
		_     @

		@  => _
		 _     R

		__@ => @__

		_N@ => @._
		_D@ => @._

		_@ => @_

		@_ => _R
		
		@ => _
		N    D

		N@ => D_

		 @ =>  _
		N     D

	}

	element Dense {
		colour "rgb(0, 70, 255)"

		@ => _
		_    N
		_    N

		for(x) {
			@  => _
			__    NN
		}

		@ => N
		_    N

		@ => N
		N    @

		for(x) {
			@  => N
			 _     N
		}

		for(x) @__ => _NN
		for(x) @_ => NN
		for(x) @N_ => N.N

		for(x) {
			 _ =>  N
			@     N
		}

	}
}

element WaterLine {
	default true
	category "Line"

	colour "rgb(0, 70, 255)"

	symbol S WaterLine.Surface
	symbol B WaterLine

	
	_ => S
	@    .

	for(x) {

		S     .
		 S =>  .
		 @     .
		 _     B

		S     .
		 S =>  .
		 @     .
	}

	S => _
	@    S
	_    @

	B => .
	@    S
	_    @

	S => _
	@    S
	S    @

	@ => _
	S    @

	element Surface {
		colour "rgb(70, 128, 255)"

	}
}

`