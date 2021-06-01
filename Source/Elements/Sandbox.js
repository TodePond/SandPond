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

	default true

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
		colour "rgb(224, 224, 224)"
		
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
	colour "rgb(224, 224, 224)"
	category "Line"
	default true

	symbol S WaterLine.Surface

	symbol X WaterLine.Rain
	symbol T WaterLine.WaveTip
	symbol W WaterLine.WaveWake

	given N (element) => element !== WaterLine.Surface && element !== WaterLine.WaveTip && element !== WaterLine.WaveWake

	@ => S

	given n (element) => element === Void || element === Empty || element === WaterLine.Rain || element === Wall


	element Surface {
		colour "rgb(70, 128, 255)"

		n     .
		n@ => .T
		n     .
		
		pov(back) {
			n     .
			n@ => .T
			n     .
		}

	}
	given s (element) => element === WaterLine.WaveWake || element === WaterLine.Surface

	given e (element) => element === Empty || element === WaterLine.Rain

	element WaveTip {
		colour "rgb(224, 224, 224)"
		


		// Move right
		{
			origin r
			given r (self) => self.direction > 0
			
			origin l
			given l (self) => self.direction < 0
			

			given t (element) => element === WaterLine.WaveTip
			select t (atom) => atom
			change t (selected) => selected

			rt => t@
			 
			 t =>  @
			r     t
			
			r     t
			 t =>  @

			re     W@
			 s  =>  X
			  N      .

			  N      .
			 s  =>  _
			re     W@

			rs     W@
			 s  =>  X
			  N      .

			  N      .
			 s  =>  _
			rs     W@

			rs => W@
			
			 s =>  @
			r     W

			r     W
			 s =>  @
			
			
			r => W
			s    @
			
			s    @
			r => W

			pov(back) {
				
				lt => t@
			 
				 t =>  @
				l     t
				
				l     t
				 t =>  @

				le     W@
				 s  =>  X
				  N      .

				  N      .
				 s  =>  _
				le     W@
				

				ls     W@
				 s  =>  X
				  N      .

				  N      .
				 s  =>  _
				ls     W@

				ls => W@
				
				 s =>  @
				l     W

				l     W
				 s =>  @
				
				l => W
				s    @
				
				s    @
				l => W
			}
		}
		{
			data direction 0
			
			origin d
			check d (self) => self.direction === 0

			
			origin D
			given D (self) => self.direction !== 0

			given L (element, self) => {
				if (element !== WaterLine.Surface && element !== WaterLine.WaveTip && element !== WaterLine.WaveWake) {
					return true
				}
			}
			given R (element, self) => {
				if (element !== WaterLine.Surface && element !== WaterLine.WaveTip && element !== WaterLine.WaveWake) {
					return true
				}
			}
			keep L (self) => self.direction = -1
			keep R (self) => self.direction = 1

			given f (element, self) => {
				if (element !== WaterLine.Surface && element !== WaterLine.WaveTip && element !== WaterLine.WaveWake) {
					return element === Empty || element === WaterLine.Rain
				}
			}
			

			R     .
			RD => .W
			f     @

			pov(back) {
				L     .
				LD => .S
				f     @
			}
			
			R     .
			RD => .S
			R     .

			pov(back) {
				L     .
				LD => .W
				L     .
			}

			action {
				R     .
				Rd => .R
				R     .
			}
			
			pov(back) action {
				L     .
				Ld => .L
				L     .
			}

			d => W
		}


	}

	element WaveWake {
		colour "rgb(0, 100, 255)"
		
		NNN   ...
		 s =>  _
		 @     .
		 
		 @     .
		 s =>  X
		NNN   ...

		@ => .
		_    X

		maybe(0.02) @ => S

	}

	element Rain {
		colour "rgb(0, 70, 255)"
		@ => .
		_    X

		@ => .
		s    X

		@ => .
		T    X

		X => .
		@    .

		s => .
		@    .

		T => .
		@    .

		_ => S
		@    .


		@ => _

	}

	element RainAlt {
		default true
		colour "rgb(0, 70, 255)"
		@ => _
		_    X

		@ => _
		s    X

		@ => _
		T    X

		/*X => .
		@    .

		s => .
		@    .

		T => .
		@    .*/

		_ => S
		@    .

		any(x) @_ => _@

	}



}

element WaterVolume {
	default true
	colour "rgb(224, 224, 224)"
	category "Line"
	default true

	symbol S WaterVolume.Surface
	symbol w Wall
	symbol X WaterVolume.Rain
	symbol T WaterVolume.WaveTip
	symbol W WaterVolume.WaveWake

	given N (element) => element !== WaterVolume.Surface && element !== WaterVolume.WaveTip && element !== WaterVolume.WaveWake

	@ => X

	given n (element) => element === Void || element === Empty || element === WaterVolume.Rain || element === Wall

	element Surface {
		colour "rgb(70, 128, 255)"

		pov(back) {
			n     .
			n@ => .T
			n     .
		}

		n     .
		n@ => .T
		n     .
		
		w    .
		@ => _
		
		*    .
		@ => _

		@ => .
		S    .

		@ => .
		X    .
		
		@ => .
		T    .
		
		@ => .
		W    .

		@ => _

	}
	
	given s (element) => element === WaterVolume.WaveWake || element === WaterVolume.Surface

	given e (element) => element === Empty || element === WaterVolume.Rain
	select e (atom) => atom
	change e (selected) => selected

	element WaveTip {
		colour "rgb(224, 224, 224)"
		


		// Move right
		{
			origin r
			given r (self) => self.direction > 0
			
			origin l
			given l (self) => self.direction < 0
			

			given t (element) => element === WaterVolume.WaveTip
			select t (atom) => atom
			change t (selected) => {
				if (Math.random() < 0.01) return new WaterVolume.WaveWake()
				return selected
			}

			rt => t@
			 
			 t =>  @
			r     t
			
			r     t
			 t =>  @

			re     W@
			 s  =>  X
			  N      .

			  N      .
			 s  =>  _
			re     W@

			rs     W@
			 s  =>  X
			  N      .

			  N      .
			 s  =>  _
			rs     W@

			rs => W@
			
			 s =>  @
			r     W

			r     W
			 s =>  @
			
			
			r => W
			s    @
			
			s    @
			r => W

			pov(back) {
				
				lt => t@
			 
				 t =>  @
				l     t
			
				l     t
				 t =>  @

				le     W@
				 s  =>  X
				  N      .

				  N      .
				 s  =>  _
				le     W@

				ls     W@
				 s  =>  X
				  N      .

				  N      .
				 s  =>  _
				ls     W@

				ls => W@
			
				 s =>  @
				l     W

				l     W
				 s =>  @
			
			
				l => W
				s    @
			
				s    @
				l => W
			}
		}
		{
			data direction 0
			
			origin d
			check d (self) => self.direction === 0

			
			origin D
			given D (self) => self.direction !== 0

			given L (element, self) => {
				if (element !== WaterVolume.Surface && element !== WaterVolume.WaveTip && element !== WaterVolume.WaveWake) {
					return true
				}
			}
			given R (element, self) => {
				if (element !== WaterVolume.Surface && element !== WaterVolume.WaveTip && element !== WaterVolume.WaveWake) {
					return true
				}
			}
			keep L (self) => self.direction = -1
			keep R (self) => self.direction = 1

			given f (element, self) => {
				if (element !== WaterVolume.Surface && element !== WaterVolume.WaveTip && element !== WaterVolume.WaveWake) {
					return element === WaterVolume.Rain
				}
			}
			

			pov(back) {
				L     .
				LD => .W
				f     @
			}

			R     .
			RD => .W
			f     @
			
			pov(back) {
				L     .
				LD => .W
				L     .
			}

			R     .
			RD => .W
			R     .

			pov(back) action {
				L     .
				Ld => .L
				L     .
			}

			action {
				R     .
				Rd => .R
				R     .
			}

			d => W
		}


	}

	element WaveWake {
		colour "rgb(0, 100, 255)"
		
		NNN   ...
		 s =>  _
		 @     .
		 
		 @     .
		 s =>  _
		NNN   ...

		NNN   ...
		 @ =>  _
		 _     X

		maybe(0.04) @ => S

		w    .
		@ => _
		
		*    .
		@ => _
		
		@ => .
		S    .

		@ => .
		X    .
		
		@ => .
		T    .
		
		@ => .
		W    .

		@ =>  _

	}

	element Rain {
		colour "rgb(0, 70, 255)"
		@ => _
		_    X

		@ => S
		s    X

		@ => T
		T    X

		_ => S
		@    .

		any(x) @_ => _@

	}



}




`