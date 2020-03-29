
{
	//=======//
	// Scope //
	//=======//
	const makeScope = (parent) => ({
		parent,
		elements: {},
		data: {},
		categories: [],
		instructions: [],
		symbols: {_: undefined},
	})
	
	const absorbScope = (receiver, target) => {
		receiver.elements.o= target.elements
		receiver.data.o= target.data
		receiver.categories.push(...target.categories)
		receiver.instructions.push(...target.instructions)
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
		if (indentBase == undefined) throw new Error(`[TodeSplat] The base indent level should have been discovered by now - something has gone wrong`)
		
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
		if (indentDepth < 0) throw new Error(`[TodeSplat] Can't reduce indent level below zero. This shouldn't happen.`)
		
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success, snippet} = EAT.emptyLines(code)
		if (!success) return EAT.fail(code)
		
		//result = {code, snippet} = EAT.maybe(EAT.margin)(code)
		
		if (indentBase == undefined) throw new Error(`[TodeSplat] The base indent level should have been discovered by now - something has gone wrong`)
		if (indentUnit == undefined) throw new Error(`[TodeSplat] The indent unit should have been discovered by now - something has gone wrong`)
		
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
		
		return {...resultProperties, ...result}
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
	// TodeSplat //
	//===========//
	function TodeSplat([source]) {
	
		resetIndentInfo()
	
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		const scope = makeScope(TodeSplat.global)
		result = {success, code} = EAT.todeSplatMultiInner(code, scope)
		
		for (const name in scope.elements) {
			const element = scope.elements[name]
			if (window[name] != undefined) console.warn(`[TodeSplat] Overriding existing value with new element: '${name}'`)
			window[name] = element
		}
		
		absorbScope(TodeSplat.global, scope)
		
		return scope
		
	}
	
	TodeSplat.global = makeScope()
	
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
		
		// TODO: 'arg' or 'param' ???
		// ...
		
		result = {success} = EAT.mimic(code, scope)
		if (success) return result
		
		// symbol part
		result = {success} = EAT.symbolPart(code, scope)
		if (success) return result
		
		// 'colour', 'emissive', 'category', etc
		result = {success} = EAT.property(code, scope)
		if (success) return result
		
		// IF ALL ELSE FAILS
		// rule diagram!
		if (!ignoreDiagram) {
			result = {success} = EAT.diagram(code, scope)
			if (success) return result
		}
		
		return EAT.fail(code)
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
		if (!success) throw new Error(`[TodeSplat] Expected 'element' keyword at start of element but got '${code[0]}'`)
		
		result = {code, success} = EAT.gap(code)
		if (!success) throw new Error(`[TodeSplat] Expected gap after 'element' keyword but got '${code[0]}'`)
		
		result = {code, success, snippet} = EAT.name(code)
		if (!success) throw new Error(`[TodeSplat] Expected element name but got '${code[0]}'`)
		scope.name = snippet
		
		scope.instructions.push({type: INSTRUCTION.TYPE.BLOCK_START})
		
		result = {code, success} = EAT.block(EAT.todeSplat)(code, scope)
		if (!success) throw new Error(`[TodeSplat] Expected element block but got something else`)
		
		scope.instructions.push({type: INSTRUCTION.TYPE.BLOCK_END})
		
		snippet = source.slice(0, source.length - result.code.length)
		scope.source = snippet
		
		const element = ELEMENT.make(scope)
		parentScope.elements[scope.name] = element
		parentScope
		
		return {success: true, snippet, code: result.code}
	}
	
	EAT.elementReference = (source, scope) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success, snippet} = EAT.name(code)
		if (!success) return EAT.fail(code)
		
		const elementName = snippet
		const element = getElement(elementName, scope)
		if (element == undefined) return EAT.fail(code)
		
		return {success: true, snippet: elementName, code: result.code}
		
	}
	
	//========//
	// Symbol //
	//========//
	const SYMBOL_PART_NAMES = [
		"origin",
		"given",
		"change",
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
		
		if (propertyName == "category") scope.categories.push(result.value)
		else scope[name] = result.value
		
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
		
		scope[name] = result.value
		
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
		result = {code, success, snippet} = EAT.elementReference(code, scope)
		if (!success) return EAT.fail(code)
		const elementName = snippet
		const element = getElement(elementName, scope)
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.string(")")(code)
		if (!success) return EAT.fail(code)
		
		scope.instructions.push(...element.instructions)
		
		return result
		
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
		
		if (arrowX == undefined) throw new Error(`[TodeSplat] Couldn't find arrow's x position.\n\nNOTE: I am trying to interpret a line of code as a diagram, but it is possible that you intended to write something else. The line in question is:\n\n${diagram[0]}\n`)
		if (arrowY == undefined) throw new Error(`[TodeSplat] Couldn't find arrow's y position. This shouldn't happen.`)
		
		// split into lhs and rhs
		let lhs = diagram.map(line => line.slice(0, arrowX))
		const mid = diagram.map(line => line.slice(arrowX, arrowX + "=>".length))
		let rhs = diagram.map(line => line.slice(arrowX + "=>".length))
		
		// reject if junk in middle
		for (let i = 0; i < mid.length; i++) {
			if (i == arrowY) continue
			const line = mid[i]
			if (!line.is(WhiteSpace)) throw new Error(`[TodeSplat] You can't have any symbols crossing over with a diagram's arrow.`)
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
			if (lhsLine.length != rhsLine.length) throw new Error(`[TodeSplat] Right-hand-side silhouette did not match left-hand-side silhouette.`)
		
			for (let j = 0; j < lhsTrimmed.length; j++) {
				if (lhsTrimmed[i][j] == " " && rhsTrimmed[i][j] != " ") throw new Error(`[TodeSplat] Right-hand-side silhouette did not match left-hand-side silhouette.`)
				if (rhsTrimmed[i][j] == " " && lhsTrimmed[i][j] != " ") throw new Error(`[TodeSplat] Right-hand-side silhouette did not match left-hand-side silhouette.`)
			}
		}
		
		// find origin
		// TODO: allow for custom origin symbols
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
				if (symbol && symbol.has("origin")) {
					if (originX != undefined) throw new Error(`[TodeSplat] You can't have more than one origin in the left-hand-side of a diagram.`)
					originX = j
					originY = i
				}
			}
		}
		
		if (originX == undefined) throw new Error(`[TodeSplat] Couldn't find origin in left-hand-side of diagram.`)
		if (originY == undefined) throw new Error(`[TodeSplat] Couldn't find origin's y position. This shouldn't happen.`)
		
		// get positions of lhs symbols
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
				
				if (input == undefined) throw new Error(`[TodeSplat] Unrecognised symbol: ${lhsChar}`)
				if (output == undefined) throw new Error(`[TodeSplat] Unrecognised symbol: ${rhsChar}`)
				
				if (input.origin == undefined && input.given == undefined) {
					throw new Error(`[TodeSplat] Symbol '${lhsChar}' used on left-hand-side but doesn't have any left-hand-side parts, eg: given`)
				}
				
				if (output.change == undefined) {
					throw new Error(`[TodeSplat] Symbol '${rhsChar}' used on right-hand-side but doesn't have any right-hand-side parts, eg: change`)
				}
				
				const space = {x, y, input, output}
				spaces.push(space)
			}
		}
		
		const instruction = {type: INSTRUCTION.TYPE.DIAGRAM, spaces}
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
		if (line.includes("	")) throw new Error("[TodeSplat] You can't use tabs inside a diagram.")
		
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
	EAT.javascript = (source) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success} = EAT.block(EAT.javascriptInner)(code)
		if (!success) return EAT.fail(code)
		
		return result
	}
	
	EAT.javascriptInner = (type) => (source) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		if (type == EAT.BLOCK_INLINE) {
			return EAT.or (
				EAT.javascriptInlineMulti,
				EAT.javascriptInlineSingle,
			)(code)
			
		}
		
		if (type == EAT.BLOCK_SINGLE) {
			result = {code, snippet, success} = EAT.many(EAT.regex(/[^}](?!\n)/))(code)
			if (!success) return EAT.fail(code)
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
	
	EAT.javascriptInlineSingle = (source) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, snippet, success} = EAT.line(code)
		if (!success) return EAT.fail(code)
		
		result.value = new Function("return " + snippet)()
		return result
	}
	
	EAT.javascriptInlineMulti = (source) => {
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
		
		result.value = new Function("return " + js)()
		
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
		result = {code, success} = EAT.maybe(EAT.margin)(code)
		if (!success) return EAT.fail(code)
		
		const margin = getMargin(indentDepth)
		if (result.snippet.slice(0, margin.length) != margin) return EAT.fail(code)
		
		result = {snippet} = EAT.line(code)
		result.snippet = "\n" + snippet
		
		return result

	}
	
}