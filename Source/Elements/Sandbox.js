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

	category "Direction"
	colour "rgb(70, 128, 255)"

	maybe(0.5) @ => R
	@ => L

	element Right {
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
		colour "rgb(0, 90, 255)"
		
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

	category "Jump"
	symbol R WaterJump.Right
	symbol L WaterJump.Left
	colour "rgb(70, 128, 255)"

	maybe(0.5) @ => R
	@ => L

	element Right {
		default true
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
		colour "rgb(0, 90, 255)"
		
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

element WaterJumpSlow {

	category "Slow"
	colour "rgb(70, 128, 255)"
	default true
	symbol R WaterJumpSlow.Right
	symbol L WaterJumpSlow.Left

	origin t
	given t (self) => self.timer-- < 0

	maybe(1/2) @ => R
	@ => L

	element Right {
		data timer 10
		colour "rgb(0, 70, 255)"
		
		@ => _
		_    @

		@  => _
		 _     @

		 t =>  _
		_     L

		@__ => __@
		
		@R_ => _.@
		@L_ => _.@

		@_ => _@

		t => L

	}
	
	element Left {
		data timer 10
		colour "rgb(0, 100, 255)"
		
		@ => _
		_    @

		 @ =>  _
		_     @

		t  => _
		 _     R

		__@ => @__

		_L@ => @._
		_R@ => @._

		_@ => @_

		t => R
	}
}

element WaterTransfer {

	category "Transfer"
	colour "rgb(70, 128, 255)"
	default true
	symbol R WaterTransfer.Right
	symbol L WaterTransfer.Left

	origin t
	check t (self) => self.timer-- < 0

	keep t (atom) => atom.timer--
	change s (self) => {
		self.timer--
		return self
	}

	maybe(1/2) @ => R
	@ => L

	element Right {
		data timer 60
		colour "rgb(0, 70, 255)"
		
		@ => _
		_    @

		@  => _
		 _     @

		 t =>  _
		_     L

		@__ => __@
		
		@R_ => _.@
		@L_ => _ts

		@_ => _@

		action @L => tt

		action {
			@  => t
			 L     t
		}
		
		action {
			@ => t
			L    t
		}

		t => L

	}
	
	element Left {
		data timer 60
		colour "rgb(0, 100, 255)"
		
		@ => _
		_    @

		 @ =>  _
		_     @

		t  => _
		 _     R

		__@ => @__

		_L@ => @._
		_R@ => st_

		_@ => @_

		action R@ => tt

		action {
			 @ =>  t
			R     t
		}

		action {
			@ => t
			R    t
		}

		t => R
	}
}

element WaterDoubleTransfer {

	
	category "Double"
	colour "rgb(70, 128, 255)"
	default true
	symbol R WaterDoubleTransfer.Right
	symbol L WaterDoubleTransfer.Left

	prop max 50

	origin t
	check t (self) => self.timer-- < 0

	keep t (atom) => atom.timer--
	change s (self) => {
		self.timer--
		return self
	}

	keep T (atom) => {
		atom.timer++
		if (atom.timer > WaterDoubleTransfer.max) atom.timer = WaterDoubleTransfer.max
	}
	change S (self) => {
		self.timer++
		if (self.timer > WaterDoubleTransfer.max) self.timer = WaterDoubleTransfer.max
		return self
	}

	maybe(1/2) @ => R
	@ => L

	element Right {
		data timer 50
		colour "rgb(0, 70, 255)"
		
		
		action @L => tt
		action @R => T.

		action {
			@  => t
			 L     t
		}

		action {
			 @ =>  s
			_     .
		}
		
		action {
			@ => .
			L    t
		}
		
		action {
			@ => .
			R    T
		}

		@ => _
		_    @

		@  => _
		 _     @

		 t =>  _
		_     L

		@__ => __@
		
		@R_ => _TS
		@L_ => _ts

		@_ => _@


		t => L

	}
	
	element Left {
		data timer 50
		colour "rgb(0, 100, 255)"
		
		action R@ => tt
		action L@ => .T

		action {
			 @ =>  t
			R     t
		}
		
		action {
			@  => s
			 _     .
		}

		action {
			@ => .
			R    t
		}
		
		action {
			@ => .
			L    T
		}

		@ => _
		_    @

		 @ =>  _
		_     @

		t  => _
		 _     R

		__@ => @__

		_L@ => ST_
		_R@ => st_

		_@ => @_

		t => R
	}
}


element WaterCompress {

	category "Compress"
	symbol R WaterCompress.Right
	symbol L WaterCompress.Left
	given N (element) => element === WaterCompress.Right || element === WaterCompress.Left
	change N () => Math.random() < 0.5? new WaterCompress.Right : new WaterCompress.Left
	symbol D WaterCompress.Dense

	colour "rgb(70, 128, 255)"

	maybe(1/2) @ => R
	@ => L

	element Right {
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
	colour "rgb(0, 70, 255)"

	symbol D WaterLine.LineDown
	symbol U WaterLine.LineUp
	symbol S WaterLine.Splash
	symbol B WaterLine.Body

	given L (element) => element === WaterLine.LineUp || element === WaterLine.LineDown
	given n (element) => element !== WaterLine.LineUp && element !== WaterLine.LineDown
	given l (element) => element === WaterLine.LineUp || element === WaterLine.LineDown || element === Empty
	
	element LineDown {

		category "Line"
		colour "rgb(255, 255, 255)"

		LlL => .@.
		 @      _
		 
		 @      _
		LlL => .@.

		for(x) {		 
			 @L =>  _.
			Ll     .@

			  n      .
			 @n =>  _.
			Ll     .@
		}

		for(x) {
			
			@U => U.
		
			 U     .
			@  => U

			 n     .
			@n => U.
			 n     .

		}
	}

	element LineUp {
		colour "rgb(70, 128, 255)"

		LlL => .@.
		 @      _
		 
		 @      _
		LlL => .@.

		for(x) {
			Ll     .@
			 @L =>  _.

			Ll     .@
			 @n =>  _.
			  n      .
		}

		for(x) {
			@D => D.

			@  => D
			 D     .

			 n     .
			@n => D.
			 n     .
		}
	}

	element Splash {
		colour "rgb(70, 128, 255)"
	}

	element Body {
		colour "rgb(0, 70, 255)"
	}

}

`