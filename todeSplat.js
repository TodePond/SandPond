{
	function TodeSPLAT([source]) {
		let input = source
		
		input = eatWhiteSpace(input).input
		input = eatElements(input).input
		input = eatWhiteSpace(input).input
		
	}
	
	const eatWhiteSpace = (input) => {
		let i = 0
		let depth = 0
		while (i < input.length) {
			const char = input[i]
			if (char != " " && char != "	" && char != "\n") break
			depth++
			if (char == "\n") depth = 0
			i++
		}
		return {
			input: input.slice(i),
			success: i > 0,
			depth,
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
	
	const eatProperties = (source, elementArgs, inputs, outputs, depth) => {
	
		const result = eatProperty(source, elementArgs, inputs, outputs, depth)
		if (!result.success) return result
		
		let input = result.input
		const whiteSpaceResult = eatWhiteSpace(input)
		const propertyDepth = whiteSpaceResult.depth
		input = whiteSpaceResult.input
		input = eatProperties(input, elementArgs, inputs, outputs, propertyDepth).input
		
		return {input, success: result.success}
	}
	
	// Currently only supports single line function
	const eatJavascript = (source, startDepth) => {
		
		let input = source
		const lines = input.split("\n")
		const endCharacter = lines[0][lines[0].length - 1]
		if (endCharacter != "{") {
			const lineResult = eatLine(input)
			return {
				success: true,
				javascript: lineResult.line,
				input: lineResult.input,
			}
		}
		
		let lineNumber = 0
		for (const line of lines) {
			const lineEndCharacter = line[line.length-1]
			if (lineEndCharacter == "}") {
				const lineDepth = eatWhiteSpace(line).depth
				if (lineDepth == startDepth) break
			}
			lineNumber++
		}
		
		const javascript = lines.slice(0, lineNumber + 1).join("\n")
		input = lines.slice(lineNumber + 1).join("\n")
		
		return {
			success: true,
			javascript,
			input, 
		}
		
	}
	
	const eatLine = (source) => {
		let input = source
		let i = 0
		while (i < input.length) {
			const char = input[i]
			if (char == "\n") break
			i++
		}
		
		return {
			success: true, //haha
			line: input.slice(0, i),
			input: input.slice(i),
		}
	}
	
	const eatProperty = (source, elementArgs, inputs, outputs, depth) => {
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
			
			const result = eatJavascript(input, depth)
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
			
			const result = eatJavascript(input, depth)
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
			if (isNamePOV(name)) {
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
		
		const propertyValueResult = eatLine(input)
		const propertyValue = eval(propertyValueResult.line)
		if (!propertyValueResult.success) return {input: source, success: false}
		input = propertyValueResult.input
		
		elementArgs[propertyName] = propertyValue
		return {input, success: true}
		
	}
	
	const isNamePOV = (name) => {
		return name == "top" || name == "front" || name == "side"
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
		
		const whiteSpaceResult = eatWhiteSpace(input)
		const propertyDepth = whiteSpaceResult.depth
		input = whiteSpaceResult.input
		input = eatProperties(input, elementArgs, inputs, outputs, propertyDepth).input
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
	
		// Get first label (could be axes or POV)
		const firstNameResult = eatName(source)
		const firstName = firstNameResult.name
		const axes = {}
		let pov = "front"
		if (isNameSymmetries(firstName)) for (const c of firstName) {
			axes[c] = true
		}
		else if (isNamePOV(firstName)) {
			pov = firstName
		}
		
		// Get second label (could be axes or POV)
		if (firstNameResult.success) {
			let labelInput = firstNameResult.input
			labelInput = eatGap(labelInput).input
			const secondNameResult = eatName(labelInput)
			const secondName = secondNameResult.name
			if (isNameSymmetries(secondName)) for (const c of secondName) {
				axes[c] = true
			}
			else if (isNamePOV(secondName)) {
				pov = secondName
			}
		}
		
		// Decide which axes the diagram follows
		let xAxis
		let yAxis
		if (pov == "front") {
			xAxis = "x"
			yAxis = "y"
		}
		else if (pov == "top") {
			xAxis = "x"
			yAxis = "z"
		}
		else if (pov == "side") {
			xAxis = "z"
			yAxis = "y"
		}
		else {
			throw new Error("[TodeSplat] That POV is not recognised...")
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
				rawSpaces.push({[xAxis]: relativeX, [yAxis]: relativeY, input: ruleInput})
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
			const rightCharX = rightFirstX + rawSpace[xAxis] - firstSpace[xAxis]
			const rightCharY = rightFirstY - rawSpace[yAxis] + firstSpace[yAxis]
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