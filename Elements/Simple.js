TodeSplat` 

element Sand {
	colour "#ffcc00"
	emissive "#ffa34d"
	category "Simple"
	default true
	
	//for(xz) rule { @_ => _@ }
	
	rule {
		@ => _
		_    @
	}
	
	
	for(xz) rule {
		@  => _
		#_    #@
	}
	
}

/*element Static {
	colour "black"
	category "Simple"
}

element ForkBomb {
	colour "grey"
	emissive "black"
	category "Simple"
	
	rule xyz { @_ => @@ }
	
}

element SuperForkBomb {
	colour "crimson"
	emissive "black"
	category "Simple"
	
	for(xyz) rule { @_ => @@ }
	
}

element UberForkBomb {
	colour "cyan"
	emissive "black"
	category "Simple"
	
	for(xyz) action { @_ => @@ }
	
}

element MasterForkBomb {
	colour "purple"
	emissive "black"
	category "Simple"
	
	for(xyz) action {
		@_ => .@
	}
	
	for(xyz) action {
		@ _ => . @
	}
	
	for(xyz) action {
		@  => .
		 _     @
	}
	
	for(xyz) action {
		@   => .
		  _      @
	}
	
	for(xyz) action {
		@   => .
		          
		  _      @
	}
}*/

`

//print(Sand.code)


