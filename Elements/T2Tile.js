SpaceTode`

element Forkbomb any(xyz.rotations) {
	colour "grey"
	emissive "black"
	category "T2Tile"
	keep F (space) => SPACE.setAtom(space, new Forkbomb(), Forkbomb)
	
	@_ => .F
}

element Res any(xyz.rotations) {
	category "T2Tile"
	colour "slategrey"
	emissive "grey"
	opacity 0.2
	@_ => _@
}

element DReg any(xyz.rotations) {

	colour "brown"
	emissive "brown"
	opacity 0.2
	category "T2Tile"
	
	symbol D DReg
	symbol R Res
	given n (element) => element !== DReg && element !== Void
	
	maybe(1/1000) @_ => D@
	maybe(1/200) @_ => R@
	maybe(1/10) @D => _@
	maybe(1/100) @n => _@
	@_ => _@
	
}

`