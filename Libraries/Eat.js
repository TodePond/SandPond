
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
	
	//======//
	// Meta //
	//======//
	EAT.many = new Proxy(EAT, {
		get(...args) {
			const prop = Reflect.get(...args)
			if (typeof prop != "function") return prop
			else return makeManyFunc(prop)
		}
	})
	
	const makeManyFunc = (func) => {
		const manyFunc = (source, ...args) => {
		
			// Head
			let result = undefined
			let success = undefined
			let code = source
			result = {success, code} = func(source, ...args)
			if (!success) return {...result, code: source}
			
			// Tail
			let nextResult = undefined
			nextResult = {success, code} = manyFunc(code, ...args)
			nextResult.snippet = result.snippet + nextResult.snippet
			if (!success) return result
			else return nextResult
			
		}
		return manyFunc
	}
	
	//========//
	// Things //
	//========//
	EAT.gap = (source) => {
	
		let i = 0
		while (i < source.length) {
			const c = source[i]
			if (c == " " || c == "	") {
				i++
			}
			else break
		}
		
		const success = i > 0
		const snippet = source.slice(0, i)
		const code = source.slice(i)
		return {success, snippet, code}
	}
	
	EAT.newLine = (source) => {
		const success = source[0] == "\n"
		const snippet = success? "\n" : undefined
		const code = success? source.slice(1) : source
		return {success, snippet, code}
	}
	
	EAT.emptyLine = (source) => {
		let code = source
		let result = undefined
		let success = undefined
		
		result = {code} = EAT.gap(code)
		result = {code, success} = EAT.newLine(code)
		
		const snippetLength = source.length - code.length
		const snippet = source.slice(0, snippetLength)
		return {success, snippet, code}
	}
	
	EAT.lineIndent = (source) => {
		
	}
	
}