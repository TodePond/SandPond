TodeSplat`

element Fire {

	colour "orange"
	emissive "red"
	category "sandbox"
	
	floor true
	
	rule 0.3 { @ => _ }
	rule {
		_ => @
		@    _
	}
	
	rule {
		x => x
		@    _
	}
	
}

`