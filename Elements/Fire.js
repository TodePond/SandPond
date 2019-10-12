TodeSplat`

element Fire {

	colour "orange"
	emissive "red"
	
	floor true
	
	rule 0.3 { @ => _ }
	rule {
		_ => @
		@    _
	}
	
}

`