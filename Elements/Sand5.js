const SOLID5 = Symbol("Solid")
const LIQUID5 = Symbol("Solid")
const GAS5 = Symbol("Solid")

SpaceTode` 

element Static5 {
	category "Sand5"
	prop state SOLID5
}

element Sand5 any(xz.rotations) {
	colour "#ffcc00"
	emissive "#ffa34d"
	category "Sand5"
	prop state SOLID5
	
	given D (element) => element !== Void && element.state !== SOLID5
	select D (atom) => atom
	change D (selected) => selected
	
	given F (element) => element !== Void && element.state !== SOLID5
	
	@ => D
	D    @
	
	@D => D@
	 F     .
}

element Water5 for(xz.rotations) {
	colour "lightblue"
	emissive "blue"
	opacity 0.35
	category "Sand5"
	prop state LIQUID5
	
	@ => _
	_    @
	
	@ => .
	x    .
	
	@_ => _@
}

element Lemonade5 for(xz.rotations) {
	colour "white"
	emissive "grey"
	opacity 0.40
	category "Sand5"
	prop state LIQUID5
	
	@ => _
	_    @
	
	@ => .
	x    .
	
	@_ => _@
}

`