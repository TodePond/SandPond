
{
	//=======//
	// Scope //
	//=======//
	const makeScope = (parent) => ({
		parent,
		elements: {},
		data: {},
		args: {},
		instructions: [],
		symbols: {_: undefined},
		properties: {categories: []},
	})
	
	const absorbScope = (receiver, target) => {
		receiver.args.o= target.args
		receiver.data.o= target.data
		receiver.elements.o= target.elements
		receiver.global = target.global
		receiver.instructions.push(...target.instructions)
		
		const {categories, ...otherProperties} = target.properties
		receiver.instructions.push(...categories)
		receiver.properties.o= otherProperties
		
		for (const symbolName in target.symbols) {
			if (receiver.symbols[symbolName] == undefined) {
				receiver.symbols[symbolName] = {}
			}
			receiver.symbols[symbolName].o= target.symbols[symbolName]
		}
	}
	
	const getSymbol = (name, scope) => {
		if (scope.symbols[name] != undefined) {
			return scope.symbols[name]
		}
		else if (scope.parent != undefined) {
			return getSymbol(name, scope.parent)
		}
	}
	
	const getElement = (name, scope) => {
		if (scope.elements[name] != undefined) {
			return scope.elements[name]
		}
		else if (scope.parent != undefined) {
			return getElement(name, scope.parent)
		}
	}
	
	//========//
	// Indent //
	//========//
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
	
	const getStringMarginLeft = (string) => {
		for (let i = 0; i < string.length; i++) {
			const char = string[i]
			if (char != " ") return i
		}
	}
	
	const getStringMarginRight = (string) => {
		return getStringMarginLeft(string.split("").reverse().join(""))
	}
	
	EAT.oneNonindent = (source, args) => EAT.nonindent(source, {...args, oneOnly: true})
	
	// Stay on the same indent level
	EAT.nonindent = (source, {oneOnly=false} = {}) => {
		
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success, snippet} = EAT.emptyLines(code)
		if (!success) return EAT.fail(code)
		
		const numberOfLines = snippet.split("\n").length - 1
		if (oneOnly == true && numberOfLines > 1) return EAT.fail(code)
		
		// NO BASE INDENT
		if (indentBase == undefined) {
			result = {code, snippet} = EAT.maybe(EAT.margin)(code)
			indentBase = snippet
			result.snippet = "\n"
			return result
		}
		
		// FULL CHECK
		else if (indentBase != undefined && indentUnit != undefined) {
			const expectedMargin = getMargin(indentDepth)
			result = {success, code, snippet} = EAT.string(expectedMargin)(code)
			if (success) {
				result.snippet = "\n"
				return result
			}
		}
		
		// PARTIAL CHECK
		else if (indentBase != undefined) {
			if (indentDepth == 0) {
				result = {success} = EAT.string(indentBase)(code)
				if (success) {
					result.snippet = "\n"
					return result
				}
			}
		}
		
		return EAT.fail(code)
		
	}
	
	// Go one indent level deeper
	EAT.indent = (source) => {
		
		indentDepth++
		
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success, snippet} = EAT.emptyLines(code)
		if (!success) {
			return EAT.fail(code)
		}
		
		// NO BASE INDENT
		if (indentBase == undefined) throw new Error(`[SpaceTode] The base indent level should have been discovered by now - something has gone wrong`)
		
		// GET INDENT UNIT
		else if (indentUnit == undefined) {
			result = {code, snippet} = EAT.maybe(EAT.margin)(code)
			if (snippet.slice(0, indentBase.length) != indentBase) return EAT.fail(code)
			const unit = snippet.slice(indentBase.length)
			if (unit.length == 0) return EAT.fail(code)
			indentUnit = unit
			if (indentBase.length > 0 && indentBase[0] != indentUnit[0]) return EAT.fail(code)
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
		if (indentDepth < 0) throw new Error(`[SpaceTode] Can't reduce indent level below zero. This shouldn't happen.`)
		
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success, snippet} = EAT.emptyLines(code)
		if (!success) return EAT.fail(code)
		
		//result = {code, snippet} = EAT.maybe(EAT.margin)(code)
		
		if (indentBase == undefined) throw new Error(`[SpaceTode] The base indent level should have been discovered by now - something has gone wrong`)
		if (indentUnit == undefined) throw new Error(`[SpaceTode] The indent unit should have been discovered by now - something has gone wrong`)
		
		// CHECK INDENT
		const expectedMargin = getMargin(indentDepth)
		result = {code, snippet} = EAT.string(expectedMargin)(code)
		return result	
		
	}
	
	//=======//
	// Block //
	//=======//
	EAT.BLOCK_INLINE = Symbol("BlockInline")
	EAT.BLOCK_SINGLE = Symbol("BlockSingle")
	EAT.BLOCK_MULTI = Symbol("BlockMulti")
	
	EAT.block = (inner, noInline = false) => (source, ...args) => {
		
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code} = EAT.gap(code)
		result = {success} = EAT.string("{")(code)
		if (success) return EAT.blockBrace(inner)(code, ...args)
		else if (noInline) return EAT.fail(code)
		else return EAT.blockInline(inner)(code, ...args)
		
	}
	
	EAT.blockBrace = (inner) => (source, ...args) => {
		
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.string("{")(code)
		if (!success) return EAT.fail(code)
		
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
		if (!success) return EAT.fail(code)
		
		result = {code, success} = inner(EAT.BLOCK_MULTI)(code, ...args)
		if (!success) return EAT.fail(code)
		const resultProperties = result
		
		result = {code, success} = EAT.string("}")(code)
		if (!success) return EAT.fail(code)
		
		return {...resultProperties, success: true, code: result.code}
	}
	
	EAT.blockSingle = (inner) => (source, ...args) => {
		
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.string("{")(code)
		if (!success) return EAT.fail(code)
		
		result = {code} = EAT.gap(code)
		result = {code, success} = inner(EAT.BLOCK_SINGLE)(code, ...args)
		if (!success) return EAT.fail(code)
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
	// SpaceTode //
	//===========//
	function SpaceTode([source]) {
	
		resetIndentInfo()
	
		let result = undefined
		let success = undefined
		let code = source
		
		result = {code} = EAT.stripComments(code)
		
		// When SpaceTode is written at the top level, it is in its own scope.
		// It is then copied to the global scope.
		const scope = makeScope(SpaceTode.global)
		scope.global = true
		result = {success, code} = EAT.todeSplatMultiInner(code, scope)
		absorbScope(SpaceTode.global, scope)
		
		return scope
		
	}
	
	SpaceTode.global = makeScope()
	
	EAT.todeSplatBlock = (source, scope) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		const blockScope = makeScope(scope)
		result = {code, success} = EAT.block(EAT.todeSplat)(code, blockScope)
		if (!success) return EAT.fail(code)
		
		return {...result, blockScope}
		
	}
	
	EAT.todeSplat = (type) => (source, scope) => {
		
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		if (type == EAT.BLOCK_INLINE) {
			return EAT.maybe(EAT.todeSplatLine)(code, scope)
		}
		
		else if (type == EAT.BLOCK_SINGLE) {
			
			// bandage for inline javascript
			let lineResult = {snippet} = EAT.line(code)
			let edoc = snippet.split("").reverse().join("")
			lineResult = {code: edoc} = EAT.gap(edoc)
			lineResult = {code: edoc} = EAT.string("}")(edoc)
			code = edoc.split("").reverse().join("")
			const lineCode = code
			const nextCode = source.slice(lineCode.length)
			// bandage ends
			
			result = {code, success} = EAT.maybe(EAT.todeSplatLine)(code, scope)
			return {success, snippet: lineCode, code: nextCode}
		}
		
		else if (type == EAT.BLOCK_MULTI) {
		
			// EMPTY
			result = {success} = EAT.list (
				EAT.nonindent,
				EAT.string("}"),
			)(code)
			
			if (success) return EAT.nonindent(code)
			
			// NON-EMPTY
			return EAT.todeSplatMulti(code, scope)
		}
		
	}
	
	EAT.todeSplatMulti = (source, scope) => {
	
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.indent(code)
		if (!success) return EAT.fail(code)
		
		result = {code, success} = EAT.todeSplatMultiInner(code, scope)
		if (!success) return EAT.fail(code)
	
		result = {code, success} = EAT.unindent(code)
		if (!success) return EAT.fail(code)
		
		return result
		
	}
	
	EAT.todeSplatMultiInner = (source, scope) => {
	
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.todeSplatLine(code, scope)
		
		result = {code} = EAT.many (
			EAT.list (
				EAT.nonindent,
				EAT.todeSplatLine,
			)
		)(code, scope)
		
		return {success, code, snippet: result.snippet}
	}
	
	EAT.todeSplatLine = (source, scope, ignoreDiagram=false) => {
	
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		// 'element' keyword
		result = {success} = EAT.string("element")(code)
		if (success) return EAT.element(code, scope)
		
		// 'prop'
		result = {success} = EAT.customProperty(code, scope)
		if (success) return result
		
		// 'data'
		result = {success} = EAT.data(code, scope)
		if (success) return result
		
		result = {success} = EAT.arg(code, scope)
		if (success) return result
		
		result = {success} = EAT.mimic(code, scope)
		if (success) return result
		
		result = {success} = EAT.random(code, scope)
		if (success) return result
		
		result = {success} = EAT.action(code, scope)
		if (success) return result
		
		result = {success} = EAT.any(code, scope)
		if (success) return result
		
		result = {success} = EAT.for(code, scope)
		if (success) return result
		
		result = {success} = EAT.pov(code, scope)
		if (success) return result
		
		// symbol part
		result = {success} = EAT.symbolPart(code, scope)
		if (success) return result
		
		// behave
		result = {success} = EAT.behave(code, scope)
		if (success) return result
		
		// 'colour', 'emissive', 'category', etc
		result = {success} = EAT.property(code, scope)
		if (success) return result
		
		// naked block
		const blockScope = makeScope(scope)
		result = {code, success} = EAT.block(EAT.todeSplat, true)(code, blockScope)
		if (success) {
			scope.instructions.push({type: INSTRUCTION.TYPE.NAKED})
			scope.instructions.push(...blockScope.instructions)
			scope.instructions.push({type: INSTRUCTION.TYPE.BLOCK_END})
			return {...result, blockScope}
		}
		
		// IF ALL ELSE FAILS
		// rule diagram!
		if (!ignoreDiagram) {
			result = {success} = EAT.diagram(code, scope)
			if (success) return result
		}
		
		return EAT.fail(code)
	}
	
	//=========//
	// Comment //
	//=========//
	// Has issues with Regex literals
	EAT.stripComments = (source) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		let codeStripped = ""
		
		let state = "normal"
		let stringEnder = undefined
		
		for (let i = 0; i < code.length; i++) {
			const char = code[i]
			if (state == "normal") {
				if (char == "/") {
					const nextChar = code[i+1]
					if (nextChar == "/") {
						state = "lineComment"
						i++
					}
					else if (nextChar == "*") {
						state = "blockComment"
						i++
					}
					else {
						codeStripped += char
					}
				}
				else if (char == '"') {
					codeStripped += char
					state = "string"
					stringEnder = '"'
				}
				else if (char == "'") {
					codeStripped += char
					state = "string"
					stringEnder = "'"
				}
				else if (char == "`") {
					throw new Error(`[SpaceTode] Template strings are not supported, sorry...`)
				}
				else {
					codeStripped += char
				}
			}
			else if (state == "blockComment") {
				if (char == "*") {
					const nextChar = code[i+1]
					if (nextChar == "/") {
						i++
						state = "normal"
					}
				}
			}
			else if (state == "lineComment") {
				if (char == "\n") {
					codeStripped += char
					state = "normal"
				}
			}
			else if (state == "string") {
				codeStripped += char
				if (char == "\\") {
					state = "stringEscape"
				}
				if (char == stringEnder) {
					state = "normal"
					stringEnder = undefined
				}
			}
			else if (state == "stringEscape") {
				codeStripped += char
				state = "string"
			}
			else {
				throw new Error (`[SpaceTode] Undeclared state while stripping comments: '${state}'`)
			}
		}
	
		return {result: success, code: codeStripped, snippet: source}
	}
	
	//=========//
	// Element //
	//=========//
	EAT.element = (source, parentScope) => {
		
		const scope = makeScope(parentScope)
		
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.string("element")(code)
		if (!success) throw new Error(`[SpaceTode] Expected 'element' keyword at start of element but got '${code[0]}'`)
		
		result = {code, success} = EAT.gap(code)
		if (!success) throw new Error(`[SpaceTode] Expected gap after 'element' keyword but got '${code[0]}'`)
		
		result = {code, success, snippet} = EAT.name(code)
		if (!success) throw new Error(`[SpaceTode] Expected element name but got '${code[0]}'`)
		scope.name = snippet
		
		//scope.instructions.push({type: INSTRUCTION.TYPE.BLOCK_START})
		
		result = {code, success} = EAT.block(EAT.todeSplat)(code, scope)
		if (!success) throw new Error(`[SpaceTode] Expected element block but got something else`)
		
		//scope.instructions.push({type: INSTRUCTION.TYPE.BLOCK_END})
		
		snippet = source.slice(0, source.length - result.code.length)
		scope.properties.source = snippet
		
		const element = ELEMENT.make(scope, scope.properties)
		parentScope.elements[scope.name] = element
		
		if (parentScope.global == true) {
			if (window[scope.name] != undefined) console.warn(`[SpaceTode] Overriding existing value with new element: '${scope.name}'`)
			window[scope.name] = element
		}
		
		return {success: true, snippet, code: result.code}
	}
	
	//========//
	// Symbol //
	//========//
	const SYMBOL_PART_NAMES = [
		"origin",
		"given",
		"change",
		"keep",
	]
	
	EAT.symbolName = EAT.many(EAT.regex(/[^ 	\n]/))
	
	EAT.symbolPartReference = (source) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success, snippet} = EAT.name(code)
		if (!success) return EAT.fail(code)
		if (!SYMBOL_PART_NAMES.includes(snippet)) return EAT.fail(code)
		
		return result
	}
	
	EAT.symbolPart = (source, scope) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success, snippet} = EAT.symbolPartReference(code)
		const symbolPartName = snippet
		if (!success) return EAT.fail(code)
		
		result = {code} = EAT.gap(code)
		result = {code, success, snippet} = EAT.symbolName(code)
		const symbolName = snippet
		if (!success) return EAT.fail(code)
		const nojsResult = result
		
		result = {code} = EAT.gap(code)
		
		// TODO: before checking for javascript, check for:
		// (a) another symbol name to copy from
		//      note: what is copied should be different for symbol, input and output
		// (b) an element to base myself on - resultant code depends on what part it is
		
		// TODO: throw warning if you add javascript to a symbol part that doesn't use it
		// eg: origin, symbol
		result = {code, success, snippet} = EAT.javascript(code)
		const javascript = snippet
		
		if (scope.symbols[symbolName] == undefined) {
			scope.symbols[symbolName] = {}
			for (const symbolPartName of SYMBOL_PART_NAMES) {
				scope.symbols[symbolName][symbolPartName] = []
			}
		}
		const symbol = scope.symbols[symbolName]
		
		if (symbol[symbolPartName] == undefined) {
			symbol[symbolPartName] = []
		}
		const symbolPart = symbol[symbolPartName]
		symbolPart.push(javascript)
		
		if (!success) return nojsResult
		else return result
	}
	
	EAT.behave = (source, scope) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.string("behave")(code)
		if (!success) return EAT.fail(code)
		
		result = {code} = EAT.gap(code)
		result = {code, success, snippet} = EAT.javascript(code, undefined, undefined, undefined, undefined, true)
		if (!success) return EAT.fail(code)
		scope.instructions.push({type: INSTRUCTION.TYPE.BEHAVE, value: result.funcCode})
		return result
	}
	
	//=============//
	// Declaration //
	//=============//
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
		"visible",
	]
	
	EAT.propertyName = (source) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success, snippet} = EAT.name(code)
		if (!success) return EAT.fail(code)
		if (!PROPERTY_NAMES.includes(snippet)) return EAT.fail(code)
		
		return result
		
	}
	
	EAT.property = (source, scope) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success, snippet} = EAT.propertyName(code)
		const propertyName = snippet
		if (!success) return EAT.fail(code)
		const name = result.snippet
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.javascript(code)
		if (!success) return EAT.fail(code)
		
		if (propertyName == "category") {
			scope.properties.categories.push(result.value)
		}
		else scope.properties[name] = result.value
		
		return result
	}
	
	EAT.data = (source, scope) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.string("data")(code)
		if (!success) return EAT.fail(code)
		
		result = {code, success} = EAT.gap(code)
		if (!success) return EAT.fail(code)
		
		result = {code, success, snippet} = EAT.name(code)
		if (!success) return EAT.fail(code)
		const name = result.snippet
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.javascript(code)
		if (!success) return EAT.fail(code)
		
		scope.data[name] = result.value
		
		return result
		
	}
	
	EAT.arg = (source, scope) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.string("arg")(code)
		if (!success) return EAT.fail(code)
		
		result = {code, success} = EAT.gap(code)
		if (!success) return EAT.fail(code)
		
		result = {code, success, snippet} = EAT.name(code)
		if (!success) return EAT.fail(code)
		const name = result.snippet
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.javascript(code)
		//if (!success) code 
		
		scope.args[name] = result.value
		
		return {...result, success: true}
		
	}
	
	EAT.customProperty = (source, scope) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.string("prop")(code)
		if (!success) return EAT.fail(code)
		
		result = {code, success} = EAT.gap(code)
		if (!success) return EAT.fail(code)
		
		result = {code, success, snippet} = EAT.name(code)
		if (!success) return EAT.fail(code)
		const name = result.snippet
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.javascript(code)
		if (!success) return EAT.fail(code)
		
		scope.properties[name] = result.value
		
		return result
		
	}
	
	//==========//
	// Function //
	//==========//
	EAT.mimic = (source, scope) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.string("mimic")(code)
		if (!success) return EAT.fail(code)
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.string("(")(code)
		if (!success) return EAT.fail(code)
		
		result = {code} = EAT.gap(code)
		result = {code, success, snippet} = EAT.javascriptArg(code, undefined, undefined, undefined, undefined, true)
		if (!success) return EAT.fail(code)
		
		scope.instructions.push({type: INSTRUCTION.TYPE.MIMIC, value: result.value})
		
		return result
		
	}
	
	EAT.random = (source, scope) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.string("maybe")(code)
		if (!success) return EAT.fail(code)
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.string("(")(code)
		if (!success) return EAT.fail(code)
		
		result = {code} = EAT.gap(code)
		result = {code, success, snippet} = EAT.javascriptArg(code)
		if (!success) return EAT.fail(code)
		
		const chance = result.value
		
		scope.instructions.push({type: INSTRUCTION.TYPE.MAYBE, value: result.value})
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.todeSplatBlock(code, scope)
		if (!success) return EAT.fail(code)
		
		scope.instructions.push(...result.blockScope.instructions)
		scope.instructions.push({type: INSTRUCTION.TYPE.BLOCK_END})
		
		return result
		
	}
	
	EAT.pov = (source, scope) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.string("pov")(code)
		if (!success) return EAT.fail(code)
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.string("(")(code)
		if (!success) return EAT.fail(code)
		
		let jsHead = ``
		for (const povName in POV.TYPE) {
			jsHead += `const ${povName.as(LowerCase)} = POV.TYPE.${povName}\n`
		}
		
		result = {code} = EAT.gap(code)
		result = {code, success, snippet} = EAT.javascriptArg(code, jsHead)
		if (!success) return EAT.fail(code)
		
		const chance = result.value
		
		scope.instructions.push({type: INSTRUCTION.TYPE.POV, value: result.value})
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.todeSplatBlock(code, scope)
		if (!success) return EAT.fail(code)
		
		scope.instructions.push(...result.blockScope.instructions)
		scope.instructions.push({type: INSTRUCTION.TYPE.BLOCK_END})
		
		return result
		
	}
	
	EAT.for = (source, scope) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.string("for")(code)
		if (!success) return EAT.fail(code)
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.string("(")(code)
		if (!success) return EAT.fail(code)
		
		let jsHead = ``
		for (const symmetryName in SYMMETRY.TYPE) {
			jsHead += `const ${symmetryName.as(LowerCase)} = SYMMETRY.TYPE.${symmetryName}\n`
		}
		
		result = {code} = EAT.gap(code)
		result = {code, success, snippet} = EAT.javascriptArg(code, jsHead)
		if (!success) return EAT.fail(code)
		
		const chance = result.value
		
		scope.instructions.push({type: INSTRUCTION.TYPE.FOR, value: result.value})
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.todeSplatBlock(code, scope)
		if (!success) return EAT.fail(code)
		
		scope.properties.o= result.blockScope.properties
		scope.instructions.push(...result.blockScope.instructions)
		scope.instructions.push({type: INSTRUCTION.TYPE.BLOCK_END})
		
		return result
		
	}
	
	EAT.any = (source, scope) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.string("any")(code)
		if (!success) return EAT.fail(code)
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.string("(")(code)
		if (!success) return EAT.fail(code)
		
		let jsHead = ``
		for (const symmetryName in SYMMETRY.TYPE) {
			jsHead += `const ${symmetryName.as(LowerCase)} = SYMMETRY.TYPE.${symmetryName}\n`
		}
		
		result = {code} = EAT.gap(code)
		result = {code, success, snippet} = EAT.javascriptArg(code, jsHead)
		if (!success) return EAT.fail(code)
		
		const chance = result.value
		
		scope.instructions.push({type: INSTRUCTION.TYPE.ANY, value: result.value})
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.todeSplatBlock(code, scope)
		if (!success) return EAT.fail(code)
		
		scope.properties.o= result.blockScope.properties
		scope.instructions.push(...result.blockScope.instructions)
		scope.instructions.push({type: INSTRUCTION.TYPE.BLOCK_END})
		
		return result
		
	}
	
	EAT.action = (source, scope) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.string("action")(code)
		if (!success) return EAT.fail(code)
		
		scope.instructions.push({type: INSTRUCTION.TYPE.ACTION})
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.todeSplatBlock(code, scope)
		if (!success) return EAT.fail(code)
		
		scope.instructions.push(...result.blockScope.instructions)
		scope.instructions.push({type: INSTRUCTION.TYPE.BLOCK_END})
		
		return result
		
	}
	
	//=====//
	// Arg //
	//=====//
	EAT.javascriptArg = (source, head="", innerHead="", innerTail="", tail="", lazy=false) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		let innerCode = ""
		let state = "normal"
		let nestLevel = 1
		let stringEnder = undefined
		
		for (let i = 0; i < code.length; i++) {
			const char = code[i]
			
			if (state == "normal") {
				if (char == "(") {
					nestLevel++
				}
				else if (char == ")") {
					nestLevel--
					if (nestLevel <= 0) {
						state = "finished"
						break
					}
				}
				else if (char == '"') {
					state = "string"
					stringEnder = '"'
				}
				else if (char == "'") {
					state = "string"
					stringEnder = "'"
				}
				else if (char == "`") {
					throw new Error(`[SpaceTode] Template strings are not supported, sorry...`)
				}
				innerCode += char
			}
			
			else if (state == "string") {
				innerCode += char
				if (char == "\\") {
					state = "stringEscape"
				}
				if (char == stringEnder) {
					state = "normal"
					stringEnder = undefined
				}
			}
			
			else if (state == "stringEscape") {
				innerCode += char
				state = "string"
			}
		}
		
		if (state != "finished") return EAT.fail(code)
		
		result = {success} = EAT.javascript(innerCode, head, innerHead, innerTail, tail, lazy)
		if (!success) return EAT.fail(code)
		
		return {success, snippet: innerCode+")", code: source.slice(innerCode.length+1), value: result.value}
		
	}
	
	//=========//
	// Diagram //
	//=========//
	EAT.diagram = (source, scope, arrowOnly=false) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		const lines = code.split("\n")
		
		// CUTOUT DIAGRAM
		const diagram = []
		
		// reject empty starting line
		if (lines[0].is(WhiteSpace)) return EAT.fail(code)
		
		// reject non-arrow lines
		if (arrowOnly && !lines[0].includes("=>")) return EAT.fail(code)
		
		// scoop up first line
		const notes = {arrowFound: false, firstLine: true}
		result = {code, success, snippet} = EAT.diagramLine(code, notes)
		if (!success) return EAT.fail(code)
		diagram.push(snippet)
		
		// scoop up each line
		result = {code, success, snippet} = EAT.many (
			EAT.list (
				EAT.oneNonindent,
				EAT.diagramLine,
			)	
		)(code, notes)
		
		if (success) diagram.push(...snippet.split("\n").slice(1))
		
		// pad ends of diagram lines if they're too short
		const maxLength = Math.max(...diagram.map(line => line.length))
		for (const i in diagram) {
			const line = diagram[i]
			if (line.length < maxLength) {
				diagram[i] = line + [" "].repeat(maxLength - line.length).join("")
			}
		}
		
		// READ DIAGRAM
		// find arrow position
		let arrowX = undefined
		let arrowY = undefined
		for (let i = 0; i < diagram.length; i++) {
			const line = diagram[i]
			const arrowIndex = line.indexOf("=>")
			if (arrowIndex != -1) {
				arrowX = arrowIndex
				arrowY = i
				break
			}
		}
		
		if (arrowX == undefined) throw new Error(`[SpaceTode] Couldn't find arrow's x position.\n\nNOTE: I am trying to interpret a line of code as a diagram, but it is possible that you intended to write something else. The line in question is:\n\n${diagram[0]}\n`)
		if (arrowY == undefined) throw new Error(`[SpaceTode] Couldn't find arrow's y position. This shouldn't happen.`)
		
		// split into lhs and rhs
		let lhs = diagram.map(line => line.slice(0, arrowX))
		const mid = diagram.map(line => line.slice(arrowX, arrowX + "=>".length))
		let rhs = diagram.map(line => line.slice(arrowX + "=>".length))
		
		// reject if junk in middle
		for (let i = 0; i < mid.length; i++) {
			if (i == arrowY) continue
			const line = mid[i]
			if (!line.is(WhiteSpace)) throw new Error(`[SpaceTode] You can't have any symbols crossing over with a diagram's arrow.`)
		}
		
		// find the shortest margins of the diagram
		const lhsMarginLeft = Math.min(...lhs.map(getStringMarginLeft))
		const lhsMarginRight = Math.min(...lhs.map(getStringMarginRight))
		const rhsMarginLeft = Math.min(...rhs.map(getStringMarginLeft))
		const rhsMarginRight = Math.min(...rhs.map(getStringMarginRight))
		
		// trim each side down
		const lhsTrimmed = lhs.map(line => line.slice(lhsMarginLeft, line.length - lhsMarginRight))
		const rhsTrimmed = rhs.map(line => line.slice(rhsMarginLeft, line.length - rhsMarginRight))
		
		lhs = lhsTrimmed
		rhs = rhsTrimmed
		
		// check that the silhouettes of both sides are the same
		for (let i = 0; i < diagram.length; i++) {
		
			const lhsLine = lhsTrimmed[i]
			const rhsLine = rhsTrimmed[i]
			if (lhsLine.length != rhsLine.length) throw new Error(`[SpaceTode] Right-hand-side silhouette did not match left-hand-side silhouette.\n\nNOTE: I am trying to interpret a line of code as a diagram, but it is possible that you intended to write something else. The line in question is:\n\n${diagram[0]}\n`)
		
			for (let j = 0; j < lhsTrimmed.length; j++) {
				if (lhsTrimmed[i][j] == " " && rhsTrimmed[i][j] != " ") throw new Error(`[SpaceTode] Right-hand-side silhouette did not match left-hand-side silhouette.`)
				if (rhsTrimmed[i][j] == " " && lhsTrimmed[i][j] != " ") throw new Error(`[SpaceTode] Right-hand-side silhouette did not match left-hand-side silhouette.`)
			}
		}
		
		// find origin
		let originX = undefined
		let originY = undefined
		if (lhs.length == 1 && lhs[0].trim().length == 1) {
			originX = 0
			originY = 0
		}
		else for (let i = 0; i < lhs.length; i++) {
			const line = lhs[i]
			for (let j = 0; j < line.length; j++) {
				const char = line[j]
				const symbol = getSymbol(char, scope)
				if (symbol && symbol.origin.length > 0) {
					if (originX != undefined) throw new Error(`[SpaceTode] You can't have more than one origin in the left-hand-side of a diagram.`)
					originX = j
					originY = i
				}
			}
		}
		
		if (originX == undefined) throw new Error(`[SpaceTode] Couldn't find origin in left-hand-side of diagram.`)
		if (originY == undefined) throw new Error(`[SpaceTode] Couldn't find origin's y position. This shouldn't happen.`)
		
		// get positions of symbols
		const spaces = []
		for (let i = 0; i < lhs.length; i++) {
			const lhsLine = lhs[i]
			const rhsLine = rhs[i]
			for (let j = 0; j < lhsLine.length; j++) {
				const lhsChar = lhsLine[j]
				const rhsChar = rhsLine[j]
				
				if (lhsChar == " ") continue
				
				const x = j - originX
				const y = originY - i
				
				const input = getSymbol(lhsChar, scope)
				const output = getSymbol(rhsChar, scope)
				
				if (input == undefined) throw new Error(`[SpaceTode] Unrecognised symbol: ${lhsChar}`)
				if (output == undefined) throw new Error(`[SpaceTode] Unrecognised symbol: ${rhsChar}`)
				
				if (input.origin.length == 0 && input.given.length == 0 ) {
					throw new Error(`[SpaceTode] Symbol '${lhsChar}' used on left-hand-side of diagram but doesn't have any left-hand-side parts, eg: given`)
				}
				
				if (output.change.length == 0  && output.keep.length == 0 ) {
					throw new Error(`[SpaceTode] Symbol '${rhsChar}' used on right-hand-side of diagram but doesn't have any right-hand-side parts, eg: change`)
				}
				
				const space = {x, y, input, output}
				spaces.push(space)
			}
		}
		
		const instruction = {type: INSTRUCTION.TYPE.DIAGRAM, value: spaces}
		scope.instructions.push(instruction)
		
		return {success: true, code: result.code, snippet: diagram.join("\n")}
		
	}
	
	EAT.diagramLine = (source, notes) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		const lines = code.split("\n")
		const line = lines[0]
		
		// reject if it's another todesplat line
		if (!notes.firstLine) {
			const dummyScope = makeScope()
			result = {success} = EAT.todeSplatLine(code, dummyScope, true)
			if (success) return EAT.fail(code)
		}
		else notes.firstLine = false
		
		// reject tabs
		if (line.includes("	")) throw new Error("[SpaceTode] You can't use tabs inside a diagram.")
		
		// find arrow
		if (line.includes("=>")) {
			if (!notes.arrowFound) notes.arrowFound = true
			else return EAT.fail(code)
		}
		
		return EAT.line(code)
		
	}
	
	//============//
	// Javascript //
	//============//
	EAT.javascript = (source, head="", innerHead="", innerTail="", tail="", lazy=false) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.block(EAT.javascriptInner)(code, head, innerHead, innerTail, tail, lazy)
		if (!success) return EAT.fail(code)
		
		return result
	}
	
	EAT.javascriptInner = (type) => (source, head="", innerHead="", innerTail="", tail="", lazy=false) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		if (type == EAT.BLOCK_INLINE) {
			return EAT.or (
				EAT.javascriptInlineMulti,
				EAT.javascriptInlineSingle,
			)(code, head, innerHead, innerTail, tail, lazy)
			
		}
		
		if (type == EAT.BLOCK_SINGLE) {
			result = {code, snippet, success} = EAT.many(EAT.regex(/[^}](?!\n)/))(code) //????
			if (!success) return EAT.fail(code)
			const funcCode = head + snippet + tail
			const func = new Function(funcCode)
			const value = lazy? func : func()
			result.value = value
			const niceFuncCode = `(() => {`+ funcCode + `})()`
			return {...result, snippet: funcCode, funcCode: niceFuncCode}
		}
		
		if (type == EAT.BLOCK_MULTI) {
			indentDepth++
			result = {code, snippet, success} = EAT.list (
				EAT.maybe(EAT.many(EAT.javascriptBraceLine)),
			)(code)
			let endResult = {code, success} = EAT.unindent(code)
			if (!success) return endResult
			const funcCode = head + snippet + tail
			const func = new Function(funcCode)
			const value = lazy? func : func()
			result.value = value
			const niceFuncCode = `(() => {`+ funcCode + `\n})()`
			return {...result, snippet: funcCode, funcCode: niceFuncCode, code}
		}
		
		return result
	}
	
	EAT.javascriptInlineSingle = (source, head="", innerHead="", innerTail="", tail="", lazy=false) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, snippet, success} = EAT.line(code)
		if (!success) return EAT.fail(code)
		const funcCode = head + "return " + innerHead + snippet + innerTail + tail
		const func = new Function(funcCode)
		const value = lazy? func : func()
		result.value = value
		const niceFuncCode = head + innerHead + snippet + innerTail + tail
		result.funcCode = niceFuncCode
		return result
	}
	
	EAT.javascriptInlineMulti = (source, head="", innerHead="", innerTail="", tail="", lazy=false) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		let js = ""
		result = {code, snippet, success} = EAT.line(code)
		if (!success) return EAT.fail(code)
		js += snippet
		
		result = {success} = EAT.indent(code)
		indentDepth--
		if (!success) {
			return EAT.fail(code)
		}
		
		indentDepth++
		result = {code, success, snippet} = EAT.many(EAT.javascriptInlineMultiLine)(code)
		js += snippet
		
		indentDepth--
		result = {code, success, snippet} = EAT.nonindent(code)
		if (!success) return EAT.fail(code)
		js += "\n"
		
		result = {code, success, snippet} = EAT.line(code)
		if (!success) return EAT.fail(code)
		js += snippet
		const funcCode = head + "return " + innerHead + js + innerTail + tail
		const func = new Function(funcCode)
		const value = lazy? func : func()
		result.value = value
		const niceFuncCode = head + innerHead + js + innerTail + tail
		result.funcCode = niceFuncCode
		
		return result
	}
	
	EAT.javascriptInlineMultiLine = (source) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {success} = EAT.nonindent(code)
		if (!success) return EAT.fail(code)
		
		result = {code, success} = EAT.newline(code)
		if (!success) return EAT.fail(code)
		
		result = {code, success} = EAT.line(code)
		if (!success) return EAT.fail(code)
		
		return {...result, snippet: "\n" + result.snippet}
	}
	
	EAT.javascriptBraceLine = (source) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.newline(code)
		
		const emptyResult = EAT.list (
			EAT.maybe(EAT.gap),
			EAT.newline,
			
		)(code)
		
		if (emptyResult.success) return {...emptyResult, code: "\n" + emptyResult.code}
		
		result = {code, success} = EAT.maybe(EAT.margin)(code)
		const actualMargin = result.snippet
		if (!success) return EAT.fail(code)
		
		const margin = getMargin(indentDepth)
		if (actualMargin.slice(0, margin.length) != margin) return EAT.fail(code)
		
		const marginDifference = actualMargin.length - margin.length
		const niceMargin = actualMargin.slice(0, marginDifference+1)
		
		result = {snippet} = EAT.line(code)
		result.snippet = "\n" + niceMargin + snippet
		
		return result

	}
	
}
