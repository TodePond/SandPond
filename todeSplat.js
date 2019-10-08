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
	
	const eatKeyword = (input, keyword) => {
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
	
	const eatProperties = (source, elementArgs, inputs, outputs) => {
	
		const result = eatProperty(source, elementArgs, inputs, outputs)
		if (!result.success) return result
		
		let input = result.input
		input = eatWhiteSpace(input).input
		input = eatProperties(input, elementArgs, inputs, outputs).input
		
		return {input, success: result.success}
	}
	
	// Currently only supports single line function
	const eatJavascript = (source) => {
		let input = source
		let i = 0
		while (i < input.length) {
			const char = input[i]
			if (char == "\n") break
			i++
		}
		
		return {
			success: true, //haha
			javascript: input.slice(0, i),
			input: input.slice(i),
		}
	}
	
	const eatProperty = (source, elementArgs, inputs, outputs) => {
		let input = source
		let output = ""
		
		
		const propertyNameResult = eatName(input)
		const propertyName = propertyNameResult.name
		
		if (propertyName == "input") {
			input = propertyNameResult.input
			input = eatGap(input).input
			const keyResult = eatName(input)
			const key = keyResult.name
			input = keyResult.input
			input = eatGap(input).input
			
			const result = eatJavascript(input)
			if (!result.success) return {input: source, success: false}
			input = result.input
			const test = eval(result.javascript)
			const ruleInput = makeInput(key, test)
			inputs.set(key, ruleInput)
			return {
				input,
				success: true,
			}
		}
		
		if (propertyName == "output") {
			input = propertyNameResult.input
			input = eatGap(input).input
			const keyResult = eatName(input)
			const key = keyResult.name
			input = keyResult.input
			input = eatGap(input).input
			
			const result = eatJavascript(input)
			if (!result.success) return {input: source, success: false}
			input = result.input
			const instruction = eval(result.javascript)
			const ruleOutput = makeOutput(key, instruction)
			outputs.set(key, ruleOutput)
			return {
				input,
				success: true,
			}
		}
		
		if (propertyName == "rule") {
			input = propertyNameResult.input
			input = eatGap(input).input
			const result = eatName(input)
			const name = result.name
			if (name == "{") {
				return eatRule(input, elementArgs, inputs, outputs)
			}
			if (isNameSymmetries(name)) {
				return eatRule(input, elementArgs, inputs, outputs)
			}
			if (!result.success) return {input: source, success: false}
			input = result.input
			elementArgs.rules.push(eval(name))
			return {
				input,
				success: true,
			}
		}
		
		if (propertyName == "}") return {input, success: false}
		if (!propertyNameResult.success) return {input: source, success: false}
		input = propertyNameResult.input
		input = eatGap(input).input
		
		const propertyValueResult = eatName(input)
		const propertyValue = eval(propertyValueResult.name)
		if (!propertyValueResult.success) return {input: source, success: false}
		input = propertyValueResult.input
		
		elementArgs[propertyName] = propertyValue
		return {input, success: true}
		
	}
	
	const isNameSymmetries = (name) => {
		if (name.length > 3) return false
		if (name.length <= 0) return false
		if (name[0] == name[1]) return false
		if (name[0] != "x" && name[0] != "y" && name[0] != "z") return false
		if (name.length > 1 && name[1] != "x" && name[1] != "y" && name[1] != "z") return false
		if (name.length > 2 && name[2] != "x" && name[2] != "y" && name[2] != "z") return false
		return true
	}
	
	const eatElement = (source) => {
	
		let input = source
		const elementArgs = {rules: []}
		const inputs = new Map()
		const outputs = new Map()
		
		const keywordResult = eatKeyword(input, "element")
		if (!keywordResult.success) return {input, success: false}
		input = keywordResult.input
		
		input = eatGap(input).input
		const nameResult = eatName(input)
		const name = nameResult.name
		input = nameResult.input
		input = eatGap(input).input
		
		const openBracketResult = eatKeyword(input, "{")
		if (!openBracketResult.success) return {input, success: false}
		input = openBracketResult.input
		
		input = eatWhiteSpace(input).input
		input = eatProperties(input, elementArgs, inputs, outputs).input
		input = eatWhiteSpace(input).input
		
		const closeBracketResult = eatKeyword(input, "}")
		if (!closeBracketResult.success) return {input, success: false}
		input = closeBracketResult.input
		
		elementArgs.name = name
		print(elementArgs)
		window[name] = new AtomType({scene, ...elementArgs})
		
		return {input, success: true}
	}
	
	const eatRule = (source, elementArgs, inputs, outputs) => {
	
		// Get axes
		const axesName = eatName(source).name
		const axes = {}
		if (axesName != "{") for (const c of axesName) {
			axes[c] = true
		}
		
		// Get inner code
		const openBracketIndex = source.indexOf("{")
		const closeBracketIndex = source.indexOf("}")
		const inner = source.slice(openBracketIndex + 1, closeBracketIndex)
		const lines = inner.split("\n")
		
		// Find the middle arrow
		let arrowX = -1
		for (const line of lines) {
			const arrowIndex = line.indexOf("=>")
			if (arrowIndex != -1) {
				arrowX = arrowIndex
				break
			}
		}
		if (arrowX == -1) throw new Error("[TodeSplat] Couldn't find an arrow in rule")
		
		// Split into left-hand-side and right-hand-side
		const lhs = []
		const rhs = []
		for (const line of lines) {
			const leftLine = line.slice(0, arrowX)
			const rightLine = line.slice(arrowX + 2)
			lhs.push(leftLine)
			rhs.push(rightLine)
		}
		
		// Find the "@" symbol on the left-hand-side
		let originX = -1
		let originY = -1
		for (let i = 0; i < lhs.length; i++) {
			const leftLine = lhs[i]
			const originIndex = leftLine.indexOf("@")
			if (originIndex != -1) {
				originX = originIndex
				originY = i
				break
			}
		}
		
		// Get the relative positions of other spaces on the left-hand-side
		// Add the inputs to those positions as you go
		const rawSpaces = []
		let leftFirstX
		let leftFirstY
		for (let i = 0; i < lhs.length; i++) {
			const leftLine = lhs[i]
			for (let j = 0; j < leftLine.length; j++) {
				const char = leftLine[j]
				if (char == " " || char == "	") continue
				if (leftFirstX == undefined) {
					leftFirstX = j
					leftFirstY = i
				}
				const relativeX = j - originX
				const relativeY = originY - i
				let ruleInput = inputs.get(char)
				if (ruleInput == undefined) ruleInput = makeInput(char, () => true)
				rawSpaces.push({x: relativeX, y: relativeY, input: ruleInput})
			}
		}
		
		// Get the first space on the right-hand-side (we will use it as an anchor for the other spaces)
		let rightFirstX
		let rightFirstY
		for (let i = 0; i < rhs.length; i++) {
			const rightLine = rhs[i]
			for (let j = 0; j < rightLine.length; j++) {
				const char = rightLine[j]
				if (char == " " || char == "	") continue
				rightFirstX = j
				rightFirstY = i
				break
			}
			if (rightFirstX != undefined) break
		}
		
		// Go through the positions, adding each output 
		for (const rawSpace of rawSpaces) {
			const firstSpace = rawSpaces[0]
			const rightCharX = rightFirstX + rawSpace.x - firstSpace.x
			const rightCharY = rightFirstY - rawSpace.y + firstSpace.y
			const rightChar = rhs[rightCharY][rightCharX]
			let output = outputs.get(rightChar)
			if (output == undefined) output = makeOutput(rightChar, () => {})
			rawSpace.output = output
		}
		
		const rule = new Rule(axes, rawSpaces)
		elementArgs.rules.push(rule)
		
		return {
			success: true,
			input: source.slice(closeBracketIndex + 1),
		}
		
	}

}