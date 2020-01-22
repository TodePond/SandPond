TodeSplat` 

element Sand {
	colour "#ffcc00"
	emissive "#ffa34d"
	category "Simple"
	default true
	
	rule {
		@ => _
		_    @
	}
	
	
	for(x) rule {
		@  => _
		#_    #@
	}
	
}

/*

>> 0
18
16
55
54

>> 1
16
18
55
54

>> 9
16
55
54
18

>> 13
55
54
18
16

>> 17
54
55
18
16

>> 23
54
18
16
55


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

print(Sand.code)


