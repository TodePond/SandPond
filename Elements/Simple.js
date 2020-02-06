TodeSplat` 

element Sand {
	colour "#ffcc00"
	emissive "#ffa34d"
	category "Simple"
	
	//for(x) rule { @_ => _@ }
	
	rule {
		@ => _
		_    @
	}
	
	
	for(xz) rule {
		@  => _
		#_    #@
	}
	
}

/*

18, 16, 55, 54
18, 16, 54, 55
16, 18, 55, 54
16, 18, 54, 55
55, 54, 18, 16
54, 55, 18, 16
55, 54, 16, 18
54, 55, 16, 18
YES!

*/

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


