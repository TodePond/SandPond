const globalSymbols = {}

{

	
	function TodeSplat([source]) {
	
		resetIndentInfo()
	
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
		
		result = {code} = EAT.expression(code)
		
		print(result)
		
	}
	
	let indentBase = undefined
	let indentUnit = undefined
	let indentDepth = undefined
	
	const resetIndentInfo = () => {
		indentBase = undefined
		indentUnit = undefined
		indentDepth = 0
	}
	
	const getMargin = (depth) => {
		const margin = indentBase + [indentUnit].repeat(depth).join("")
		return margin
	}
	
	EAT.expression = (source) => {
		
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.nonindent(code)
		if (!success) throw new Error(`[TodeSplat] Expected no change to indent level but found a change`)
		
		result = {code, success} = EAT.string("element")(code)
		if (success) return EAT.element(code)
		
		return {success: false, code: source, snippet: undefined}
		
	}
	
	EAT.element = (source) => {
		
		const args = {}
		
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.gap(code)
		if (!success) throw new Error(`[TodeSplat] Expected gap after 'element' keyword but got '${code[0]}'`)
		
		result = {code, success, snippet} = EAT.name(code)
		if (!success) throw new Error(`[TodeSplat] Expected element name but got '${code[0]}'`)
		args.name = snippet
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.string("{")(code)
		if (!success) throw new Error(`[TodeSplat] Expected '{' but got '${code[0]}'`)
		
		//result = {code} = EAT.elementInner(code)
		
		result = {code, success} = EAT.nonindent(code)
		if (!success) result = {code} = EAT.gap(code)
		
		result = {code, success} = EAT.string("}")(code)
		if (!success) throw new Error(`[TodeSplat] Expected '}' but got '${code[0]}'`)
		
		args.source = source.slice(0, source.length - result.code.length)
		const element = ELEMENT.make(args)
		window[element.name] = element
		
		return {success: true, snippet: args.source, code: result.code}
	}
	
	EAT.elementInner = (source) => {
		
	}
	
	// Stay on the same indent level
	EAT.nonindent = (source) => {
		
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success, snippet} = EAT.emptyLines(code)
		if (!success) return {success: false, snippet: undefined, code: source}
		
		result = {code, snippet} = EAT.maybe(EAT.margin)(code)
		
		if (indentBase == undefined) {
			indentBase = snippet
		}
		if (indentBase && indentUnit && getMargin(indentDepth) != snippet) {
			return {success: false, snippet: undefined, code: source}
		}
		if (indentBase && indentDepth == 0 && indentBase != snippet) {
			return {success: false, snippet: undefined, code: source}
		}
		
		return result
	}
	
	// Go one indent level deeper
	EAT.indent = (source) => {
		
		indentDepth++
		
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code} = EAT.emptyLines(code)
		result = {code, snippet} = EAT.maybe(EAT.margin)(code)
		
		if (indentBase == undefined) throw new Error(`[TodeSplat] The base indent level should have been discovered by now - something has gone wrong`)
		if (indentUnit == undefined) {
			if (snippet.slice(0, indentBase.length) != indentBase) return {success: false, snippet: undefined, code: source}
			indentUnit = snippet.slice(indentBase.length)
			if (indentBase.length > 0 && indentBase[0] != indentUnit[0]) return {success: false, snippet: undefined, code: source}
		}
		
		if (indentBase && indentUnit && getMargin(indentDepth) != snippet) {
			return {success: false, snippet: undefined, code: source}
		}
		
	}
	
	// Go one indent level higher
	EAT.unindent = (source) => {
		
	}
	
	

}