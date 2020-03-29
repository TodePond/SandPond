
/*TodeSplat`

element Res {
	opacity 0.5
	@_ => _@
}

`*/

/*
TodeSplat`


	
element Sand {
	category "Sandbox"
	category "Powder"
	colour "#FC0"
}

element Water {
	category "Sandbox"
	category "Liquid"
	colour "lightblue"
	emissive "blue"
	opacity 0.5
}

	
	
	
`
*/





TodeSplat`


origin @
given @ (self, atom) => self == atom
change @ (self) => self

change _ () => undefined
given _ (space) => space

element Sand {

	colour "#FC0"
	
	@ => _
	_    @
	
}

element Snow {

	@ => _

	mimic(Sand)
}

element Forkbomb @_ => @@

element Foo {

}

element Water {
	colour { return "lightblue" }
	emissive "blue"
	opacity 0.5
	
	
}

element Slime {
	colour {
		const colour = "green"
		return colour
	}
	opacity 0.65
}

element Lava colour {
	return "red"
}

element Fire colour [
	"darkorange",
	"lol",
][0]

element Wall prop state "solid"

element DReg { colour "brown" }

element Res {
	opacity 0.5
	
	@_ => _@
}

`
