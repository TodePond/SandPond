{
	function TodeSPLAT([source]) {
		let input = source
		
		input = eatWhiteSpace(input).input
		input = eatElements(input).input
		input = eatWhiteSpace(input).input
		
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
		
		if (eatKeyword("rule", input).success) {
			input = eatKeyword("rule", input).input
			input = eatGap(input).input
			const result = eatName(input)
			if (!result.success) return {input: source, success: false}
			input = result.input
			elementArgs.rules.push(eval(result.name))
			return {
				input,
				success: true,
			}
		}
		
		const propertyNameResult = eatName(input)
		const propertyName = propertyNameResult.name
		if (propertyName == "}") return {input, success: false}
		if (!propertyNameResult.success) return {input: source, success: false}
		input = propertyNameResult.input
		input = eatGap(input).input
		
		const propertyValueResult = eatName(input)
		const propertyValue = propertyValueResult.name
		if (!propertyValueResult.success) return {input: source, success: false}
		input = propertyValueResult.input
		
		elementArgs[propertyName] = propertyValue
		return {input, success: true}
		
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
	
	const eatRule = (source) => {
		/*
		
		// Pseudo-code
		const inner = getEverythingBetween("{", "}", source)
		const lines = inner.split("\n")
		const arrowX = findPositionOf("=>", lines).x
		const lhs = getEverythingLeftOf(arrowX, lines)
		const rhs = getEverythingRightOf(arrowX, lines)
		
		const origin = findPositionOf("@", lhs)
		const positions = []
		for (const position of lhs) {
			const character = lhs[position]
			if (character != " ") positions += position
		}
		
		const rawSpaces = []
		for (const position of positions) {
			const rawSpace = makeRawSpace(position)
			rawSpaces.push(rawSpace)
		}
		
		...
		
		*/
	}

}