
const SOLID = 0
const LIQUID = 1
const GAS = 2
const EFFECT = 3

SpaceTode`

element Solid {
	prop state SOLID
	category "Rulesets"
	
	given D (element) => element !== Void && element.state !== SOLID
	select D (atom) => atom
	change D (selected) => selected
	@ => D
	D    @
}

element Powder  {
	prop state SOLID
	category "Rulesets"
	
	given D (element) => element !== Void && element.state !== SOLID
	select D (atom) => atom
	change D (selected) => selected
	@ => D
	D    @
	
	given F (element) => element !== Void && element.state !== SOLID
	any(xz.rotations) {
		@D => D@
		 F     .
	}
}

element Liquid {
	prop state LIQUID
	category "Rulesets"
	
	given D (element) => element !== Void && (element.state > LIQUID || element.state === undefined)
	select D (atom) => atom
	change D (selected) => selected
	@ => D
	D    @
	
	@ => .
	x    .
	
	any(xz.rotations) @D => D@
}

element Goo {
	prop state SOLID
	category "Rulesets"
	
	given D (element) => element !== Void && element.state !== SOLID
	select D (atom) => atom
	change D (selected) => selected
	
	@ => D
	D    @
		
	@ => .
	x    .
		
	maybe(1/40) any(xz.rotations) @D => D@
}

element Gas {
	prop state GAS
	category "Rulesets"
	
	given D (element) => element !== Void && (element.state === EFFECT || element.state === undefined)
	select D (atom) => atom
	change D (selected) => selected
	any(xyz.rotations) @D => D@
}

`