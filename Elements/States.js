
const SOLID = 0
const GOO = 1
const LIQUID = 2
const GAS = 3
const EFFECT = 4

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
	
	for(xz.rotations) @D => D@
}

element Goo {
	prop state GOO
	category "Rulesets"
	
	given D (element) => element !== Void && (element.state > GOO || element.state === undefined)
	select D (atom) => atom
	change D (selected) => selected
	@ => D
	D    @
		
	@ => .
	x    .
	
	maybe(1/150) for(xz.rotations) @D => D@
}

element Gas {
	prop state GAS
	category "Rulesets"
	
	given D (element) => element !== Void && (element.state === EFFECT || element.state === undefined)
	select D (atom) => atom
	change D (selected) => selected
	for(xyz.rotations) @D => D@
}

`