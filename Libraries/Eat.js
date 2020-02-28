
//
// Every result has three properties...
//
// 'success'
// true if the desired thing was found
//
// 'snippet'
// the desired thing
//
// 'code'
// the rest of the code (with the desired thing removed)
//

const EAT = {}

{
	
	//====================//
	// Control Structures //
	//====================//
	EAT.many = (func) => (source) => {
		
		// Buffers
		let success = undefined
		let code = source
		
		// Head
		let headResult = undefined
		headResult = {success, code} = func(source)
		if (!success) return {...headResult, code: source}
		
		// Tail
		let tailResult = undefined
		tailResult = {success, code} = EAT.many(func)(code)
		if (!success) return headResult
		tailResult.snippet = headResult.snippet + tailResult.snippet
		return tailResult
		
	}
	
	EAT.maybe = (func) => (source) => {
		
		let result = undefined
		let success = undefined
		let code = source
		
		result = {success, code} = func(code)
		if (!success) {
			result.success = true
			result.snippet = ""
		}
		
		return result
	}
	
	EAT.list = (...funcs) => (source) => {
		
		// Buffers
		let success = undefined
		let code = source
		
		// Head
		let headResult = undefined
		const headFunc = funcs[0]
		headResult = {success, code} = headFunc(code)
		if (!success) return {...headResult, code: source}
		
		// Tail
		let tailResult = undefined
		const tailFuncs = funcs.slice(1)
		if (tailFuncs.length == 0) return headResult
		tailResult = {success, code} = EAT.list(...tailFuncs)(code)
		tailResult.snippet = headResult.snippet + tailResult.snippet
		return tailResult
		
	}
	
	EAT.or = (...funcs) => (source) => {
	
		for (const func of funcs) {
		
			let result = undefined
			let success = undefined
			let code = source
			
			result = {success, code} = func(code)
			if (success) return result
		}
		
		const success = false
		const code = source
		const snippet = undefined
		return {success, code, snippet}
	}
	
	//====================//
	// In-Built Functions //
	//====================//	
	EAT.string = (string) => (source) => {
		const success = source.slice(0, string.length) == string
		const snippet = success? string : undefined
		const code = success? source.slice(string.length) : source
		return {success, snippet, code}
	}
	
	EAT.space = EAT.string(" ")
	EAT.tab = EAT.string("	")
	EAT.newline = EAT.newLine = EAT.string("\n")
	
	EAT.gap = EAT.many (
		EAT.or (
			EAT.space,
			EAT.tab,
		)
	)
	
	EAT.whitespace = EAT.whiteSpace = EAT.many (
		EAT.or (
			EAT.space,
			EAT.tab,
			EAT.newline,
		)
	)
	
	EAT.emptyLine = EAT.list (
		EAT.maybe(EAT.gap),
		EAT.newline,
	)
	
}