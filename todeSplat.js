{
	globalInputs = new Map()
	globalOutputs = new Map()
	
	function TodeSplat([source]) {
		let input = source
		
		const whiteSpaceResult = eatWhiteSpace(input)
		input = whiteSpaceResult.input
		const depth = whiteSpaceResult.depth
		
		input = eatExpressions(input, depth).input
		input = eatWhiteSpace(input).input
		
	}
	
	const eatExpressions = (source, depth) => {
		
		const result = eatExpression(source, depth)
		if (!result.success) return result
		let input = result.input
		
		const whiteSpaceResult = eatWhiteSpace(input)
		input = whiteSpaceResult.input
		const nextDepth = whiteSpaceResult.depth
		
		input = eatExpressions(input, nextDepth).input
		
		return {input, success: result.success}
	}
	
	const eatExpression = (source, depth) => {
		let input = source
		const nameResult = eatName(input)
		const name = nameResult.name
		if (name == "element") return eatElement(input)
		if (name == "input") return eatGlobalInput(input)
		if (name == "output") return eatGlobalOutput(input)
		return {input, success: false}
	}
	
	const eatGlobalInput = (source, depth) => {
		let input = source
		const inputResult = eatInput(input)
		if (!inputResult.success) return {input, success: false}
		const ruleInput = inputResult.ruleInput
		input = inputResult.input
		globalInputs.set(ruleInput.key, ruleInput)
		return {input, success: true}
	}
	
	const eatGlobalOutput = (source, depth) => {
		let input = source
		const outputResult = eatOutput(input)
		if (!outputResult.success) return {input, success: false}
		const ruleOutput = outputResult.ruleOutput
		input = outputResult.input
		globalOutputs.set(ruleOutput.key, ruleOutput)
		return {input, success: true}		
	}
	
	const eatInput = (source, depth) => {
		let input = source
		input = eatKeyword(input, "input").input //input input input input (haha great naming, Luke)
		input = eatGap(input).input
		const functionResult = eatFunction(input)
		if (!functionResult.success) return {input: source, success: false}
		input = functionResult.input
		const name = functionResult.name
		const func = functionResult.func
		const ruleInput = makeInput(name, func)
		return {input, success: true, ruleInput}
	}
	
	const eatOutput = (source, depth) => {
		let input = source
		input = eatKeyword(input, "output").input
		input = eatGap(input).input
		const functionResult = eatFunction(input)
		if (!functionResult.success) return {input: source, success: false}
		input = functionResult.input
		const name = functionResult.name
		const func = functionResult.func
		const ruleOutput = makeOutput(name, func)
		return {input, success: true, ruleOutput}
	}
	
	const eatFunction = (source, depth) => {
		let input = source
		const nameResult = eatName(input)
		const name = nameResult.name
		input = nameResult.input
		input = eatGap(input).input
		
		const result = eatJavascript(input, depth)
		if (!result.success) return {input: source, success: false}
		input = result.input
		const func = eval(result.javascript)
		
		return {input, success: true, name, func}
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
			return eatRule(input, elementArgs, inputs, outputs)
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
		
		const name0 = name[0].as(LowerCase)
		const name1 = (name[1] || "").as(LowerCase)
		const name2 = (name[2] || "").as(LowerCase)
		
		if (name0 != "x" && name0 != "y" && name0 != "z") return false
		if (name.length > 1 && name1 != "x" && name1 != "y" && name1 != "z") return false
		if (name.length > 2 && name2 != "x" && name2 != "y" && name2 != "z") return false
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
	
	const eatRuleLabels = (source) => {
		
		let input = source
		if (source[0] == "{") return {input, success: false, labels: {}}
		
		const result = eatRuleLabel(source)
		if (!result.success) return result
		
		input = result.input
		input = eatGap(input).input
		const secondResult = eatRuleLabels(input)
		input = secondResult.input
		
		const labels = {...result.labels, ...secondResult.labels}
		
		return {input, success: result.success, labels}
	}
	
	const eatRuleLabel = (source) => {
		let input = source
		const nameResult = eatName(source)
		const name = nameResult.name
		input = nameResult.input
		
		if (isNameSymmetries(name)) {
			const axes = {}
			for (const c of name) {
				axes[c] = true
			}
			return {input, success: true, labels: {axes}}
		}
		
		if (isNamePOV(name)) {
			const pov = name
			return {input, success: true, labels: {pov}}
		}
		
		else {
			const chanceString = name
			const chance = chanceString.as(Number)
			return {input, success: true, labels: {chance}}
		}
		
		throw new Error(`[TodeSplat] Couldn't recognise that rule label...`)
	}
	
	const eatRule = (source, elementArgs, inputs, outputs) => {
	
		// Read the meta labels before the rule
		const labelsResult = eatRuleLabels(source)
		const labels = labelsResult.labels
		
		let axes = {}
		let pov = "front"
		let chance = undefined
		
		if (labels.axes) axes = labels.axes
		if (labels.pov) pov = labels.pov
		if (labels.chance) chance = labels.chance
		
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
				
				if (ruleInput == undefined) {
					const globalInput = globalInputs.get(char)
					if (globalInput) ruleInput = globalInput
					else ruleInput = makeInput(char, () => true)
				}
				
				// Add chance to origin test
				if (chance != undefined && relativeX == 0 && relativeY == 0) {
					const test = ruleInput.test
					const chanceTest = (...args) => Math.random() < chance && test(...args)
					const chanceRuleInput = makeInput(char, chanceTest)
					ruleInput = chanceRuleInput
				}
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
			if (output == undefined) {
				const globalOutput = globalOutputs.get(rightChar)
				if (globalOutput) output = globalOutput
				else output = makeOutput(rightChar, () => {})
			}
			rawSpace.output = output
		}
		
		// Make the rule
		const rule = new Rule(axes, rawSpaces)
		elementArgs.rules.push(rule)
		
		return {
			success: true,
			input: source.slice(closeBracketIndex + 1),
		}
		
	}

}