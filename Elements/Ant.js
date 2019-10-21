TodeSplat`


element Ant {

	colour "grey"
	emissive "black"
	precise true
		
	rule {
		@ => _
		_    @
	}
	
	input F ({space}) => space && space.atom && space.atom.type == Food
	
	rule xyz 0.02 { @F => @@ }
	rule xyz { @F => _@ }
	
	rule xz { @_ => _@ }
	rule xz {
		 _ =>  @
		@#    _#
	}
		
	
}




`