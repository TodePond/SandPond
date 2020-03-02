const globalSymbols = {}

{

	
	function TodeSplat([source]) {
	
		resetIndentInfo()
	
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {success, code} = EAT.many(EAT.expression)(code)
		
		
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
		if (!success) return {success: false, code: source, snippet: undefined}
				
		result = {success} = EAT.string("element")(code)
		if (success) return EAT.element(code)
		
		return {success: false, code: source, snippet: undefined}
		
	}
	
	EAT.element = (source) => {
				
		const args = {data: []}
		
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.string("element")(code)
		if (!success) throw new Error(`[TodeSplat] Expected 'element' keyword at start of element but got '${code[0]}'`)
		
		result = {code, success} = EAT.gap(code)
		if (!success) throw new Error(`[TodeSplat] Expected gap after 'element' keyword but got '${code[0]}'`)
		
		result = {code, success, snippet} = EAT.name(code)
		if (!success) throw new Error(`[TodeSplat] Expected element name but got '${code[0]}'`)
		args.name = snippet
		
		result = {code, success} = EAT.block(EAT.elementInner)(code, args)
		if (!success) throw new Error(`[TodeSplat] Expected element block but got something else`)
		
		snippet = source.slice(0, source.length - result.code.length)
		args.source = snippet
		
		window[args.name] = ELEMENT.make(args)
		
		return {success: true, snippet, code: result.code}
	}
	
	EAT.block = (inner) => (source, ...args) => {
		
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code} = EAT.gap(code)
		result = {success} = EAT.string("{")(code)
		if (success) return EAT.blockBrace(inner)(code, ...args)
		else return EAT.blockInline(inner)(code, ...args)
		
	}
	
	EAT.blockBrace = (inner) => (source, ...args) => {
	
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.string("{")(code)
		if (!success) return {success: false, code: source, snippet: undefined}
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.newline(code)
		if (!success) return EAT.blockBraceInline(inner)(source, ...args)
		else return EAT.blockBraceMulti(inner)(source, ...args)
		
	}
	
	EAT.blockBraceMulti = (inner) => (source, ...args) => {
	
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.string("{")(code)
		if (!success) return {success: false, code: source, snippet: undefined}
		
		result = {code, success} = inner(false, false)(code, ...args)
		if (!success) return {success: false, code: source, snippet: undefined}
		const resultProperties = result
		
		result = {code, success} = EAT.string("}")(code)
		if (!success) return {success: false, code: source, snippet: undefined}
		
		return {...resultProperties, ...result}
	}
	
	EAT.blockBraceInline = (inner) => (source, ...args) => {
		
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.string("{")(code)
		if (!success) return {success: false, code: source, snippet: undefined}
		
		result = {code} = EAT.gap(code)
		result = {code, success} = inner(true, false)(code, ...args)
		if (!success) return {success: false, snippet: undefined, code: source} 
		const resultProperties = result
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.string("}")(code)
		return {...resultProperties, ...result}
	}
	
	EAT.blockInline = (inner) => (source, ...args) => {
		
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code} = EAT.gap(code)
		result = {code, success} = inner(true, true)(code, ...args)
		return result
		
	}
	
	EAT.elementInner = (inline = false) => (source, args) => {
		
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		if (inline) {
			result = {code, success} = EAT.maybe(EAT.elementInnerLine)(code, args)
		}
		
		if (!inline) {
			return EAT.or (
				EAT.nonindent,
				EAT.elementInnerMulti,
			)(code, args)
		}
		
		return result
		
	}
	
	EAT.elementInnerMulti = (source, args) => {
	
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.indent(code)
		if (!success) return {success: false, code: source, snippet: undefined}
	
		result = {code, success} = EAT.maybe(EAT.elementInnerLine)(code, args)
		
		if (success) result = {code} = EAT.many (
			EAT.list (
				EAT.nonindent,
				EAT.elementInnerLine,
			)
		)(code, args)
	
		result = {code, success} = EAT.unindent(code)
		if (!success) return {success: false, code: source, snippet: undefined}
		
		return result
		
	}
	
	EAT.elementInnerLine = (source, args) => {
	
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.customProperty(code, args)
		if (success) return result
		
		result = {code, success} = EAT.data(code, args)
		if (success) return result
		
		result = {code, success} = EAT.property(code, args)
		if (!success) return {success: false, code: source, snippet: undefined}
		
		return result
	}
	
	EAT.property = (source, args) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success, snippet} = EAT.propertyName(code)
		if (!success) return {success: false, code: source, snippet: undefined}
		const name = result.snippet
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.javascript(code)
		if (!success) return {success: false, code: source, snippet: undefined}
		
		args[name] = result.value
		
		return result
	}
	
	const PROPERTY_NAMES = [
		"colour",
		"emissive",
		"opacity",
		"precise",
		"floor",
		"hidden",
		"category",
		"pour",
		"default",
	]
	
	EAT.data = (source, args) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.string("data")(code)
		if (!success) return {success: false, code: source, snippet: undefined}
		
		result = {code, success} = EAT.gap(code)
		if (!success) return {success: false, code: source, snippet: undefined}
		
		result = {code, success, snippet} = EAT.name(code)
		if (!success) return {success: false, code: source, snippet: undefined}
		const name = result.snippet
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.javascript(code)
		if (!success) return {success: false, code: source, snippet: undefined}
		
		args.data[name] = result.value
		
		return result
		
	}
	
	EAT.customProperty = (source, args) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.string("prop")(code)
		if (!success) return {success: false, code: source, snippet: undefined}
		
		result = {code, success} = EAT.gap(code)
		if (!success) return {success: false, code: source, snippet: undefined}
		
		result = {code, success, snippet} = EAT.name(code)
		if (!success) return {success: false, code: source, snippet: undefined}
		const name = result.snippet
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.javascript(code)
		if (!success) return {success: false, code: source, snippet: undefined}
		
		args[name] = result.value
		
		return result
		
	}
	
	EAT.javascript = (source) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.block(EAT.javascriptInner)(code)
		if (!success) return {success: false, code: source, snippet: undefined}
		
		return result
	}
	
	EAT.javascriptNakedSingle = (source) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, snippet, success} = EAT.line(code)
		if (!success) return {success: false, code: source, snippet: undefined}
		
		result.value = new Function("return " + snippet)()
		return result
	}
	
	EAT.javascriptNakedMulti = (source) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		let js = ""
		result = {code, snippet, success} = EAT.line(code)
		if (!success) return {success: false, code: source, snippet: undefined}
		js += snippet
		
		result = {success} = EAT.indent(code)
		indentDepth--
		if (!success) {
			return {success: false, code: source, snippet: undefined}
		}
		
		result = {code, success, snippet} = EAT.many(EAT.javascriptNakedMultiLine)(code)
		js += snippet
		
		result = {code, success, snippet} = EAT.nonindent(code)
		if (!success) return {success: false, snippet: undefined, code: source}
		js += "\n"
		
		result = {code, success, snippet} = EAT.line(code)
		if (!success) return {success: false, snippet: undefined, code: source}
		js += snippet
		
		result.value = new Function("return " + js)()
		
		return result
	}
	
	EAT.javascriptNakedMultiLine = (source) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {success} = EAT.nonindent(code)
		if (success) return {success: false, snippet: undefined, code: source}
		
		result = {code, success} = EAT.newline(code)
		if (!success) return {success: false, snippet: undefined, code: source}
		
		result = {code, success} = EAT.line(code)
		if (!success) return {success: false, snippet: undefined, code: source}
		
		return {...result, snippet: "\n" + result.snippet}
	}
	
	EAT.javascriptInner = (inline, naked) => (source) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		if (inline && naked) {
			return EAT.or (
				EAT.javascriptNakedMulti,
				EAT.javascriptNakedSingle,
			)(code)
			
		}
		
		if (inline && !naked) {
			result = {code, snippet, success} = EAT.many(EAT.regex(/[^}](?!\n)/))(code)
			if (!success) return {success: false, code: source, snippet: undefined}
			result.value = new Function(snippet)()
			return result
		}
		
		if (!inline && !naked) {
			indentDepth++
			result = {code, snippet, success} = EAT.list (
				EAT.maybe(EAT.many(EAT.javascriptLine)),
			)(code)
			result.value = new Function(snippet)()
			code = EAT.unindent(code).code
			return {...result, code}
		}
		
		return result
	}
	
	EAT.javascriptLine = (source) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.newline(code)
		result = {code, success} = EAT.maybe(EAT.margin)(code)
		if (!success) return {success: false, snippet: undefined, code: source}
		
		const margin = getMargin(indentDepth)
		if (result.snippet.slice(0, margin.length) != margin) return {success: false, snippet: undefined, code: source}
		
		result = {snippet} = EAT.line(code)
		result.snippet = "\n" + snippet
		
		return result

	}
	
	EAT.propertyName = (source) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success, snippet} = EAT.name(code)
		if (!success) return {success: false, code: source, snippet: undefined}
		if (!PROPERTY_NAMES.includes(snippet)) return {success: false, code: source, snippet: undefined}
		
		return result
		
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
		if (indentBase != undefined && indentUnit != undefined && getMargin(indentDepth) != snippet) {
			return {success: false, snippet: undefined, code: source}
		}
		if (indentDepth == 0 && indentBase != snippet) {
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
		
		result = {code, success, snippet} = EAT.emptyLines(code)
		if (!success) return {success: false, snippet: undefined, code: source}
		result = {code, snippet} = EAT.maybe(EAT.margin)(code)
		
		if (indentBase == undefined) throw new Error(`[TodeSplat] The base indent level should have been discovered by now - something has gone wrong`)
		if (indentUnit == undefined) {
			if (snippet.slice(0, indentBase.length) != indentBase) return {success: false, snippet: undefined, code: source}
			indentUnit = snippet.slice(indentBase.length)
			if (indentBase.length > 0 && indentBase[0] != indentUnit[0]) return {success: false, snippet: undefined, code: source}
		}
		
		if (indentBase != undefined && indentUnit != undefined && getMargin(indentDepth) != snippet) {
			return {success: false, snippet: undefined, code: source}
		}
		
		return result
		
	}
	
	// Go one indent level back
	EAT.unindent = (source) => {
	
		indentDepth--
		if (indentDepth < 0) throw new Error(`[TodeSplat] Can't reduce indent level below zero. This shouldn't happen.`)
		
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success, snippet} = EAT.emptyLines(code)
		if (!success) return {success: false, snippet: undefined, code: source}
		
		result = {code, snippet} = EAT.maybe(EAT.margin)(code)
		
		if (indentBase == undefined) throw new Error(`[TodeSplat] The base indent level should have been discovered by now - something has gone wrong`)
		if (indentUnit == undefined) throw new Error(`[TodeSplat] The indent unit should have been discovered by now - something has gone wrong`)
		if (indentBase != undefined && indentUnit != undefined && getMargin(indentDepth) != snippet) {
			return {success: false, snippet: undefined, code: source}
		}
		
		return result
		
	}
	
	

}