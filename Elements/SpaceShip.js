TodeSplat`


element SpaceShip {

	colour "pink"
	emissive "purple"
	precise true
	pour false
	category "life"
	
	input r () => Keyboard.ArrowRight
	input l () => Keyboard.ArrowLeft
	input f () => Keyboard.ArrowUp
	input b () => Keyboard.ArrowDown
	input d () => Keyboard.t
	
	output S ({space}) => SPACE.setAtom(space, ATOM.make(Sand))
	
	action {
		@ => @ => @
		d    _    S
	}
	
	rule { @r => @_ => _@ }
	rule { l@ => _@ => @_ }
	
	rule top {
		b => _ => @
		@    @    _
	}
	
	rule top {
		@ => @ => _
		f    _    @
	}
	
}




`