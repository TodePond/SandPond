const globalSymbols = {}

{
	
	function TodeSplat([source]) {
	
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		//result = {code} = EAT.string("hello")(source)
		//result = {code} = EAT.gap(code)
		//result = {code} = EAT.many(EAT.emptyLine)(code)
		//result = {code} = EAT.list(EAT.character("L"), EAT.character("B"), EAT.character("W"))(code)
		//result = EAT.whitespace(source)
		//result = EAT.regexp(/hello/)(code)
		
		result = {code} = EAT.whitespace(code)
		result = {code} = EAT.expression(code)
		
		print(result)
		
	}
	
	EAT.expression = (source) => {
		
		// TODO: journey to start of expression
		
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.string("element")(code)
		if (success) return EAT.element(code)
		
		return {success: false, code: source, snippet: undefined}
		
	}
	
	EAT.element = (source) => {
		
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.gap(code)
		if (!success) throw new Error(`[TodeSplat] Expected gap after 'element' keyword but got '${code[0]}'`)
		
		result = {code, success} = EAT.name(code)
		if (!success) throw new Error(`[TodeSplat] Expected element name but got '${code[0]}'`)
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.string("{")(code)
		if (!success) throw new Error(`[TodeSplat] Expected '{' but got '${code[0]}'`)
		
		return {success: true, snippet: source.slice(0, source.length - result.code.length), code: result.code}
	}
	
	

}