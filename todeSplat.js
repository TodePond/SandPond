{
	function TodeSPLAT([source]) {
		let input = source
		
		input = eatWhiteSpace(input).input
		input = eatElements(input).input
		input = eatWhiteSpace(input).input
		
	}
	
	const doEat = (eat, input, output="") => {
		const result = eat(input)
		if (result.input == undefined) result.input = input
		if (result.output == undefined) result.output = ""
		return [
			result.input,
			result.output,
			result.success,
		]
	}
	
	const eatWhiteSpace = (input) => {
		let i = 0
		while (i < input.length) {
			const char = input[i]
			if (char != " " && char != "	" && char != "\n") break
			i++
		}
		return {
			input: input.slice(i),
			success: i > 0,
		}
	}
	
	const eatGap = (input) => {
		let i = 0
		while (i < input.length) {
			const char = input[i]
			if (char != " " && char != "	") break
			i++
		}
		return {
			success: i > 0,
			input: input.slice(i),
		}
	}
	
	const eatKeyword = (keyword, input) => {
		if (input.slice(0, keyword.length) != keyword) return {input, success: false}
		else return {
			success: true,
			input: input.slice(keyword.length),
		}
	}
	
	const eatName = (input) => {
		let i = 0
		while (i < input.length) {
			const char = input[i]
			if (char == " " || char == "	" || char == "\n") break
			i++
		}
		return {
			name: input.slice(0, i),
			success: i > 0,
			input: input.slice(i),
		}
	}
	
	const eatElements = (source) => {
		
		const result = eatElement(source)
		if (!result.success) return result
		
		let input = result.input
		input = eatWhiteSpace(input).input
		input = eatElements(input).input
		
		return {input, success: result.success}
	}
	
	const eatProperties = (elementArgs, source) => {
	
		const result = eatProperty(elementArgs, source)
		if (!result.success) return result
		
		let input = result.input
		input = eatWhiteSpace(input).input
		input = eatProperties(elementArgs, input).input
		
		return {input, success: result.success}
	}
	
	const eatProperty = (elementArgs, source) => {
		let input = source
		let output = ""
		
		if (eatKeyword("colour", input).success) {
			input = eatKeyword("colour", input).input
			input = eatGap(input).input
			const result = eatName(input)
			input = result.input
			elementArgs.colour = result.name
			return {
				input,
				success: true,
			}
		}
		
		else if (eatKeyword("emissive", input).success) {
			input = eatKeyword("emissive", input).input
			input = eatGap(input).input
			const result = eatName(input)
			input = result.input
			elementArgs.emissive = result.name
			return {
				input,
				success: true,
			}
		}
		
		else if (eatKeyword("state", input).success) {
			input = eatKeyword("state", input).input
			input = eatGap(input).input
			const result = eatName(input)
			input = result.input
			elementArgs.state = result.name
			return {
				input,
				success: true,
			}
		}
		
		else if (eatKeyword("rule", input).success) {
			input = eatKeyword("rule", input).input
			input = eatGap(input).input
			const result = eatName(input)
			input = result.input
			elementArgs.rules.push(eval(result.name))
			return {
				input,
				success: true,
			}
		}
		
		else return {input, success: false}
		
	}
	
	const eatElement = (source) => {
	
		let input = source
		const elementArgs = {rules: []}
		
		const keywordResult = eatKeyword("element", input)
		if (!keywordResult.success) return {input, success: false}
		input = keywordResult.input
		
		input = eatGap(input).input
		const nameResult = eatName(input)
		const name = nameResult.name
		input = nameResult.input
		input = eatGap(input).input
		
		const openBracketResult = eatKeyword("{", input)
		if (!openBracketResult.success) return {input, success: false}
		input = openBracketResult.input
		
		input = eatWhiteSpace(input).input
		input = eatProperties(elementArgs, input).input
		input = eatWhiteSpace(input).input
		
		const closeBracketResult = eatKeyword("}", input)
		if (!closeBracketResult.success) return {input, success: false}
		input = closeBracketResult.input
		
		print(elementArgs)
		window[name] = new AtomType({name, scene, ...elementArgs})
		
		return {input, success: true}
	}

}