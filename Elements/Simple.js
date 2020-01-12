TodeSplat` 

element Sand {
	colour "#ffcc00"
	emissive "#ffa34d"
	category "Simple"
	default true
	
	/*rule {
		@ => _
		_    @
	}*/
	
	for(x) rule { @_ => _@ }
	
	/*for(x) rule {
		@  => _
		#_    #@
	}*/
	
}

/*element ForkBomb {
	colour "grey"
	emissive "black"
	category "Simple"
	
	rule xyz { @_ => @@ }
	
}

element SuperForkBomb {
	colour "crimson"
	emissive "black"
	category "Simple"
	
	//for(xyz) rule { @_ => @@ }
	
}

element UberForkBomb {
	colour "cyan"
	emissive "black"
	category "Simple"
	
	//for(xyz) action { @_ => @@ }
	
}*/

`

print(Sand.code)

