TodeSplat`


element Ant {

	colour "grey"
	emissive "black"
	precise true
		
	rule {
		@ => _
		_    @
	}
	
	rule xyz { @_ => _@ }
	rule xz {
		 _ =>  @
		@#    _#
	}
		
	
}




`