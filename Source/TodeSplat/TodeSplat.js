const globalSymbols = {}

{
	
	function TodeSplat([source]) {
	
		let result = undefined
		let code = source
		
		//result = {code} = EAT.string("hello")(source)
		//result = {code} = EAT.gap(code)
		result = {code} = EAT.many(EAT.emptyLine)(code)
		//result = {code} = EAT.list(EAT.character("L"), EAT.character("B"), EAT.character("W"))(code)
		//result = EAT.whitespace(source)
		
		print(result)
		
	}
	
	EAT.element = (source) => {
		
	}
	

}