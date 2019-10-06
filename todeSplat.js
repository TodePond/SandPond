{
	function TodeSPLAT([source]) {
		let input = source
		let output = ""
		
		;[input, output] = doEat(eatWhiteSpace, input, output)
		;[input, output] = doEat(eatElement, input, output)
		;[input, output] = doEat(eatWhiteSpace, input, output)
		
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
			success: i > 0,
			input: input.slice(i),
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
	
	const eatKeyword = (keyword) => (input) => {
		if (input.slice(0, keyword.length) != keyword) return {success: false}
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
			output: input.slice(0, i),
			success: i > 0,
			input: input.slice(i),
		}
	}
	
	const eatProperties = (elementArgs) => (source) => {
		let input = source
		let output = ""
		let success = false
		
		;[input, output, success] = doEat(eatProperty(elementArgs), input, output)
		if (!success) return {success: false}
		
		;[input, output, success] = doEat(eatWhiteSpace, input, output)
		;[input, output, success] = doEat(eatProperties(elementArgs), input, output)
		
		return {input, output, success}
	}
	
	const eatProperty = (elementArgs) => (source) => {
		let input = source
		let output = ""
		
		if (eatKeyword("colour")(input).success) {
			let colourColour = ""
			;[input] = doEat(eatKeyword("colour"), input, output)
			;[input] = doEat(eatGap, input, output)
			;[input, colourColour] = doEat(eatName, input, output)
			elementArgs.colour = colourColour
			return {
				input,
				success: true,
			}
		}
		
		else if (eatKeyword("emissive")(input).success) {
			let emissiveColour = ""
			;[input] = doEat(eatKeyword("emissive"), input, output)
			;[input] = doEat(eatGap, input, output)
			;[input, emissiveColour] = doEat(eatName, input, output)
			elementArgs.emissive = emissiveColour
			return {
				input,
				success: true,
			}
		}
		
		else if (eatKeyword("state")(input).success) {
			let state = ""
			;[input] = doEat(eatKeyword("state"), input, output)
			;[input] = doEat(eatGap, input, output)
			;[input, state] = doEat(eatName, input, output)
			elementArgs.state = state
			return {
				input,
				success: true,
			}
		}
		
		else if (eatKeyword("rule")(input).success) {
			let ruleName = ""
			;[input] = doEat(eatKeyword("rule"), input, output)
			;[input] = doEat(eatGap, input, output)
			;[input, ruleName] = doEat(eatName, input, output)
			elementArgs.rules.push(eval(ruleName))
			return {
				input,
				success: true,
			}
		}
		
		else return {success: false}
		
	}
	
	const eatElement = (source) => {
	
		let input = source
		let output = ""
		
		let name = ""
		const elementArgs = {rules: []}
		
		;[input] = doEat(eatKeyword("element"), input, output)
		;[input] = doEat(eatGap, input, output)
		;[input, name] = doEat(eatName, input, output)
		;[input] = doEat(eatGap, input, output)
		;[input] = doEat(eatKeyword("{"), input, output)
		;[input] = doEat(eatWhiteSpace, input, output)
		;[input] = doEat(eatProperties(elementArgs), input, output)
		;[input] = doEat(eatWhiteSpace, input, output)
		;[input] = doEat(eatKeyword("}"), input, output)
		
		print(elementArgs)
		window[name] = new AtomType({name, scene, ...elementArgs})
		
		return {success: true}
	}
	
	function applyPropertiesToElement(element, ...args) {
		
	}

}