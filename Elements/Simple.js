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
	
	
	for(xz) rule {
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

element MasterForkBombOld {
	colour "purple"
	emissive "black"
	category "Simple"
	hidden true
	
	select 1 (space, atom) => space && !atom
	keep 1 (selected, self, space) => {
		if (selected) SPACE.setAtom(space, self)
	}
	
	select 2 (space, atom) => space && !atom
	keep 2 (selected, self, space) => {
		if (selected) SPACE.setAtom(space, self)
	}
	
	select 3 (space, atom) => space && !atom
	keep 3 (selected, self, space) => {
		if (selected) SPACE.setAtom(space, self)
	}
	
	select 4 (space, atom) => space && !atom
	keep 4 (selected, self, space) => {
		if (selected) SPACE.setAtom(space, self)
	}
	
	select 5 (space, atom) => space && !atom
	keep 5 (selected, self, space) => {
		if (selected) SPACE.setAtom(space, self)
	}
	
	for(xyz) action {
		  5      5
		 34     34
		@12 => .12
	}
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
}

`

print(MasterForkBomb2.code)

