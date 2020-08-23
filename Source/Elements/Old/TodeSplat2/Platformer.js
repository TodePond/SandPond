TodeSplat`

element Platformer {

	colour "red"
	emissive "darkred"
	precise true
	pour false
	category "player"
		
	input r () => Keyboard.ArrowRight
	input l () => Keyboard.ArrowLeft
	input f () => Keyboard.ArrowUp
	input b () => Keyboard.ArrowDown
	
	rule {
		@ => _
		_    @
	}
	
	rule { @_ => rr => _@ }
	rule { _@ => ll => @_ }
	
	rule side { @_ => bb => _@ }
	rule side { _@ => ff => @_ }
	
	rule {
		 _ =>  r =>  @
		@#    rr    _#
	}
	
	rule {
		_  => l  => @
		#@    ll    #_
	}
	
	rule side {
		 _ =>  b =>  @
		@#    bb    _#
	}
	
	rule side {
		_  => f  => @
		#@    ff    #_
	}
	
}


`