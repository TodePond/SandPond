{

	//========//
	// Export //
	//========//
	TODESPLAT = {}
	TODESPLAT.globalElements = {}
	TODESPLAT.globalSymbols = {}
	
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
			TODESPLAT.globalElements[name] = element
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
		
			// EMPTY
			result = {success} = EAT.list (
				EAT.nonindent,
				EAT.string("}"),
			)(code)
			
			if (success) return EAT.nonindent(code)
			
			// NON-EMPTY
			return EAT.todeSplatMulti(code, args)
		}
		
	}
	
	EAT.todeSplatMulti = (source, args) => {
	
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
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
	
	EAT.todeSplatLine = (source, args, ignoreDiagram=false) => {
	
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		// 'element' keyword
		result = {success} = EAT.string("element")(code)
		if (success) return EAT.element(code, args)
		
		// 'prop'
		result = {code, success} = EAT.customProperty(code, args)
		if (success) return result
		
		// 'data'
		result = {code, success} = EAT.data(code, args)
		if (success) return result
		
		// TODO: 'arg' or 'param' ???
		// ...
		
		// 'colour', 'emissive', 'category', etc
		result = {code, success} = EAT.property(code, args)
		if (success) return result
		
		// IF ALL ELSE FAILS
		// rule diagram!
		if (!ignoreDiagram) {
			result = {code, success} = EAT.diagram(code, args)
			if (success) return result
		}
		
		return {success: false, code: source, snippet: undefined}
	}
	
	//============//
	// Expression //
	//============//
	EAT.diagram = (source, args, arrowOnly=false) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		const lines = code.split("\n")
		
		// CUTOUT DIAGRAM
		const diagram = []
		
		// reject empty starting line
		if (lines[0].is(WhiteSpace)) return {success: false, code: source, snippet: undefined}
		
		// reject non-arrow lines
		if (arrowOnly && !lines[0].includes("=>")) return {success: false, code: source, snippet: undefined}
		
		// scoop up first line
		const notes = {arrowFound: false}
		result = {code, success, snippet} = EAT.diagramLine(code, notes)
		if (!success) return {success: false, code: source, snippet: undefined}
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
		
		if (arrowX == undefined) throw new Error(`[TodeSplat] Couldn't find arrow's x position. This shouldn't happen.`)
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
			const originIndex = line.indexOf("@")
			if (originIndex != -1) {
				if (originX != undefined) throw new Error(`[TodeSplat] You can't have more than one origin in the left-hand-side of a diagram.`)
				originX = originIndex
				originY = i
			}
		}
		
		if (originX == undefined) throw new Error(`[TodeSplat] Couldn't find origin in left-hand-side of diagram.`)
		if (originY == undefined) throw new Error(`[TodeSplat] Couldn't find origin's y position. This shouldn't happen.`)
		
		// get positions of lhs symbols
		const inputs = []
		for (let i = 0; i < lhs.length; i++) {
			const line = lhs[i]
			for (let j = 0; j < line.length; j++) {
				const char = line[j]
				if (char == " " || char == "	") continue
				
				const x = j - originX
				const y = originY - i
				
				inputs.push({x, y, char})
			}
		}
		
		// get position of rhs symbols
		const outputs = []
		for (let i = 0; i < rhs.length; i++) {
			const line = rhs[i]
			for (let j = 0; j < line.length; j++) {
				const char = line[j]
				if (char == " " || char == "	") continue
				
				const x = j - originX
				const y = originY - i
				
				outputs.push({x, y, char})
				
			}
		}
		
		const instruction = INSTRUCTION.make(INSTRUCTION.TYPE.DIAGRAM, {inputs, outputs})
		args.instructions.push(instruction)
		
		return {success: true, code: result.code, snippet: diagram.join("\n")}
		
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
	
	EAT.diagramLine = (source, notes) => {
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		const lines = code.split("\n")
		const line = lines[0]
		
		// reject if it's another todesplat line
		const dummyArgs = {data: {}, children: {}, categories: [], instructions: []}
		result = {success} = EAT.todeSplatLine(code, dummyArgs, true)
		if (success) return {success: false, code: source, snippet: undefined}
		
		// reject tabs
		if (line.includes("	")) throw new Error("[TodeSplat] You can't use tabs inside a diagram.")
		
		// find arrow
		if (line.includes("=>")) {
			if (!notes.arrowFound) notes.arrowFound = true
			else return {success: false, code: source, snippet: undefined}
		}
		
		return EAT.line(code)
		
	}
	
	EAT.element = (source, parentArgs) => {
		
		const args = {data: {}, children: {}, categories: [], instructions: []}
		
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
		print(args.name)
		
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
		
		indentDepth++
		result = {code, success, snippet} = EAT.many(EAT.javascriptNakedMultiLine)(code)
		js += snippet
		
		indentDepth--
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
		if (!success) return {success: false, snippet: undefined, code: source}
		
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
	EAT.oneNonindent = (source, args) => EAT.nonindent(source, {...args, oneOnly: true})
	
	// Stay on the same indent level
	EAT.nonindent = (source, {oneOnly=false} = {}) => {
		
		let result = undefined
		let success = undefined
		let snippet = undefined
		let code = source
		
		result = {code, success, snippet} = EAT.emptyLines(code)
		if (!success) return {success: false, snippet: undefined, code: source}
		
		const numberOfLines = snippet.split("\n").length - 1
		if (oneOnly == true && numberOfLines > 1) return {success: false, snippet: undefined, code: source}
		
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
		
		return {success: false, snippet: undefined, code: source}
		
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
			return {success: false, snippet: undefined, code: source}
		}
		
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
		result = {code, snippet} = EAT.string(expectedMargin)(code)
		return result
		
		
	}
	
	

}