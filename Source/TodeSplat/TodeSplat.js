{

	//========//
	// Export //
	//========//
	function TodeSplat([source]) {
	
		resetIndentInfo()
	
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		const globalArgs = {data: {}, children: {}}
		result = {success, code} = EAT.todeSplatMultiInner(code, globalArgs)
		
		for (const name in globalArgs.children) {
			const element = globalArgs.children[name]
			ELEMENT.globalElements[name] = element
			window[name] = element
		}
		
	}
	
	//===========//
	// Constants //
	//===========//
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
	
	EAT.BLOCK_INLINE = Symbol("BlockInline")
	EAT.BLOCK_SINGLE = Symbol("BlockSingle")
	EAT.BLOCK_MULTI = Symbol("BlockMulti")
	
	//=========//
	// Globals //
	//=========//
	const globalSymbols = {}
	
	let indentBase = undefined
	let indentUnit = undefined
	let indentDepth = undefined
	
	const resetIndentInfo = () => {
		indentBase = undefined
		indentUnit = undefined
		indentDepth = 0
	}
	
	//=======//
	// Tools //
	//=======//
	const getMargin = (depth) => {
		const margin = indentBase + [indentUnit].repeat(depth).join("")
		return margin
	}
	
	//=======//
	// Block //
	//=======//
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
		if (!success) return EAT.blockSingle(inner)(source, ...args)
		else return EAT.blockMulti(inner)(source, ...args)
		
	}
	
	EAT.blockMulti = (inner) => (source, ...args) => {
	
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.string("{")(code)
		if (!success) return {success: false, code: source, snippet: undefined}
		
		result = {code, success} = inner(EAT.BLOCK_MULTI)(code, ...args)
		if (!success) return {success: false, code: source, snippet: undefined}
		const resultProperties = result
		
		result = {code, success} = EAT.string("}")(code)
		if (!success) return {success: false, code: source, snippet: undefined}
		
		return {...resultProperties, ...result}
	}
	
	EAT.blockSingle = (inner) => (source, ...args) => {
		
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.string("{")(code)
		if (!success) return {success: false, code: source, snippet: undefined}
		
		result = {code} = EAT.gap(code)
		result = {code, success} = inner(EAT.BLOCK_SINGLE)(code, ...args)
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
		result = {code, success} = inner(EAT.BLOCK_INLINE)(code, ...args)
		return result
		
	}
	
	//===========//
	// TodeSplat //
	//===========//
	EAT.todeSplat = (type) => (source, args) => {
		
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		if (type == EAT.BLOCK_INLINE) {
			return EAT.maybe(EAT.todeSplatLine)(code, args)
		}
		
		else if (type == EAT.BLOCK_SINGLE) {
			
			// fix inline javascript
			let lineResult = {snippet} = EAT.line(code)
			let edoc = snippet.split("").reverse().join("")
			lineResult = {code: edoc} = EAT.gap(edoc)
			lineResult = {code: edoc} = EAT.string("}")(edoc)
			code = edoc.split("").reverse().join("")
			const lineCode = code
			const nextCode = source.slice(lineCode.length)
			
			result = {code, success} = EAT.maybe(EAT.todeSplatLine)(code, args)
			return {success, snippet: lineCode, code: nextCode}
		}
		
		else if (type == EAT.BLOCK_MULTI) {
			return result = EAT.or (
				EAT.nonindent,
				EAT.todeSplatMulti,
			)(code, args)
		}
		
	}
	
	EAT.todeSplatMulti = (source, args) => {
	
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		// Maybe not indent tho
		result = {code, success} = EAT.indent(code)
		if (!success) return {success: false, code: source, snippet: undefined}
		
		result = {code, success} = EAT.todeSplatMultiInner(code, args)
		if (!success) return {success: false, code: source, snippet: undefined}
	
		result = {code, success} = EAT.unindent(code)
		if (!success) return {success: false, code: source, snippet: undefined}
		
		return result
		
	}
	
	EAT.todeSplatMultiInner = (source, args) => {
	
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.todeSplatLine(code, args)
		
		result = {code} = EAT.many (
			EAT.list (
				EAT.nonindent,
				EAT.todeSplatLine,
			)
		)(code, args)
		
		return {success, code, snippet: result.snippet}
	}
	
	EAT.todeSplatLine = (source, args) => {
	
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {success} = EAT.string("element")(code)
		if (success) return EAT.element(code, args)
		
		result = {code, success} = EAT.customProperty(code, args)
		if (success) return result
		
		result = {code, success} = EAT.data(code, args)
		if (success) return result
		
		result = {code, success} = EAT.property(code, args)
		if (!success) return {success: false, code: source, snippet: undefined}
		
		return result
	}
	
	//============//
	// Expression //
	//============//
	EAT.element = (source, parentArgs) => {
		
		const args = {data: {}, children: {}, categories: []}
		
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
		
		result = {code, success} = EAT.block(EAT.todeSplat)(code, args)
		if (!success) throw new Error(`[TodeSplat] Expected element block but got something else`)
		
		snippet = source.slice(0, source.length - result.code.length)
		args.source = snippet
		
		const element = ELEMENT.make(args)
		parentArgs.children[args.name] = element
		
		return {success: true, snippet, code: result.code}
	}
	
	EAT.property = (source, args) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success, snippet} = EAT.propertyName(code)
		const propertyName = snippet
		if (!success) return {success: false, code: source, snippet: undefined}
		const name = result.snippet
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.javascript(code)
		if (!success) return {success: false, code: source, snippet: undefined}
		
		if (propertyName == "category") args.categories.push(result.value)
		else args[name] = result.value
		
		return result
	}
	
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
	
	//============//
	// Javascript //
	//============//
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
	
	EAT.javascriptInner = (type) => (source) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		if (type == EAT.BLOCK_INLINE) {
			return EAT.or (
				EAT.javascriptNakedMulti,
				EAT.javascriptNakedSingle,
			)(code)
			
		}
		
		if (type == EAT.BLOCK_SINGLE) {
			result = {code, snippet, success} = EAT.many(EAT.regex(/[^}](?!\n)/))(code)
			if (!success) return {success: false, code: source, snippet: undefined}
			result.value = new Function(snippet)()
			return result
		}
		
		if (type == EAT.BLOCK_MULTI) {
			indentDepth++
			result = {code, snippet, success} = EAT.list (
				EAT.maybe(EAT.many(EAT.javascriptBraceLine)),
			)(code)
			let endResult = {code, success} = EAT.unindent(code)
			if (!success) return endResult
			result.value = new Function(snippet)()
			return {...result, code}
		}
		
		return result
	}
	
	EAT.javascriptBraceLine = (source) => {
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
	
	//========//
	// Indent //
	//========//
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
		
		// NO BASE INDENT
		if (indentBase == undefined) throw new Error(`[TodeSplat] The base indent level should have been discovered by now - something has gone wrong`)
		
		// GET INDENT UNIT
		else if (indentUnit == undefined) {
			result = {code, snippet} = EAT.maybe(EAT.margin)(code)
			if (snippet.slice(0, indentBase.length) != indentBase) return {success: false, snippet: undefined, code: source}
			const unit = snippet.slice(indentBase.length)
			if (unit.length == 0) return {success: false, snippet: undefined, code: source}
			indentUnit = unit
			if (indentBase.length > 0 && indentBase[0] != indentUnit[0]) return {success: false, snippet: undefined, code: source}
			return result
		}
		
		// CHECK INDENT
		const expectedMargin = getMargin(indentDepth)
		result = {code, snippet} = EAT.string(expectedMargin)(code)
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
		
		//result = {code, snippet} = EAT.maybe(EAT.margin)(code)
		
		if (indentBase == undefined) throw new Error(`[TodeSplat] The base indent level should have been discovered by now - something has gone wrong`)
		if (indentUnit == undefined) throw new Error(`[TodeSplat] The indent unit should have been discovered by now - something has gone wrong`)
		
		// CHECK INDENT
		const expectedMargin = getMargin(indentDepth)
		result = {code, snippet} = EAT.string(expectedMargin.d)(code.d)
		return result
		
		
	}
	
	

}