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
		throw new Error("IMPLEMENT ME!")
		/*let input = source
		const inputResult = eatInput(input)
		if (!inputResult.success) return {input, success: false}
		const name = inputResult.name
		const ruleInput = inputResult.ruleInput
		input = inputResult.input
		globalInputs.set(name, ruleInput)
		return {input, success: true}*/
	}
	
	const eatGlobalOutput = (source, depth) => {
		throw new Error("IMPLEMENT ME!")
		/*let input = source
		const outputResult = eatOutput(input)
		if (!outputResult.success) return {input, success: false}
		const name = outputResult.name
		const ruleOutput = outputResult.ruleOutput
		input = outputResult.input
		globalOutputs.set(name, ruleOutput)
		return {input, success: true}	*/	
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
		let isComment = false
		let isBlockComment = false
		while (i < input.length) {
		
			const char = input[i]
			const nextChar = input[i+1]
			
			if (isComment) {
				if (char == "\n") {
					isComment = false
					depth = 0
				}
				i++
				continue
			}
			
			if (isBlockComment) {
				if (char == "*" && nextChar == "/") {
					isBlockComment = false
					i += 2
					continue
				}
				i++
				continue
			}
			
			if (char == "/" && nextChar == "/") {
				isComment = true
				i += 2
				continue
			}
			
			if (char == "/" && nextChar == "*") {
				isBlockComment = true
				i += 2
				continue
			}
			
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
		
		if (propertyName == "category") {
			input = propertyNameResult.input
			input = eatGap(input).input
			
			const lineResult = eatLine(input)
			const line = lineResult.line
			input = lineResult.input
			
			const categoryName = eval(line)
			elementArgs.categories.push(categoryName)
		}
		
		if (propertyName == "given") {
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
			
			const ruleInput = inputs.get(key) || EVENT.makeInput()
			ruleInput.givens.push(test)
			inputs.set(key, ruleInput)
			return {
				input,
				success: true,
			}
		}
		
		if (propertyName == "vote") {
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
			
			const ruleInput = inputs.get(key) || EVENT.makeInput()
			ruleInput.votes.push(test)
			inputs.set(key, ruleInput)
			return {
				input,
				success: true,
			}
		}
		
		if (propertyName == "select") {
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
			
			const ruleInput = inputs.get(key) || EVENT.makeInput()
			ruleInput.selects.push(test)
			inputs.set(key, ruleInput)
			return {
				input,
				success: true,
			}
		}
		
		if (propertyName == "change") {
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
			const ruleOutput = outputs.get(key) || EVENT.makeOutput()
			ruleOutput.changes.push(instruction)
			outputs.set(key, ruleOutput)
			return {
				input,
				success: true,
			}
		}
		
		if (propertyName == "rule" || propertyName == "action") {
			input = propertyNameResult.input
			input = eatGap(input).input
			const result = eatName(input)
			const name = result.name
			const isAction = propertyName == "action"? true : false
			return eatRule(input, elementArgs, inputs, outputs, isAction)
		}
		
		if (propertyName == "ruleset") {
			input = propertyNameResult.input
			input = eatGap(input).input
			
			const result = eatName(input)
			input = result.input
			const elementName = result.name
			
			const element = ELEMENT.globalElements[elementName]
			if (!element) throw new Error(`[TodeSplat] Can't find element '${elementName}'`)
			elementArgs.rules.push(...element.rules)
			return {
				input,
				success: true,
			}
		}
		
		if (propertyName == "data") {
			input = propertyNameResult.input
			input = eatGap(input).input
			
			const result = eatName(input)
			const name = result.name
			input = result.input
			input = eatGap(input).input
			
			const lineResult = eatLine(input)
			const line = lineResult.line
			input = lineResult.input
			
			elementArgs.data[name] = eval(line)
			
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
		
		const name0 = name[0]
		const name1 = (name[1] || "")
		const name2 = (name[2] || "")
		
		if (name0 != "x" && name0 != "y" && name0 != "z") return false
		if (name.length > 1 && name1 != "x" && name1 != "y" && name1 != "z") return false
		if (name.length > 2 && name2 != "x" && name2 != "y" && name2 != "z") return false
		return true
	}
	
	const isNameSuperSymmetries = (name) => {
		if (name.length > 3) return false
		if (name.length <= 0) return false
		
		const name0 = name[0]
		const name1 = (name[1] || "")
		const name2 = (name[2] || "")
		
		if (name0 != "X" && name0 != "Y" && name0 != "Z") return false
		if (name.length > 1 && name1 != "X" && name1 != "Y" && name1 != "Z") return false
		if (name.length > 2 && name2 != "X" && name2 != "Y" && name2 != "Z") return false
		return true
	}
	
	const eatElement = (source) => {
	
		let input = source
		const elementArgs = {rules: [], data: [], categories: []}
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
		const element = ELEMENT.make(elementArgs)
		element.source = source.slice(0, source.length - input.length)
		window[name] = element
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
		
		if (isNameSuperSymmetries(name)) {
			const superSymmetries = {}
			for (const c of name) {
				superSymmetries[c] = true
			}
			return {input, success: true, labels: {superSymmetries}}
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
	
	const getFirstArrowIndex = (lines) => {
		for (const line of lines) {
			const arrowIndex = line.indexOf("=>")
			if (arrowIndex != -1) return arrowIndex
		}
		return -1
	}
	
	const splitRuleLinesWithArrow = (lines) => {
		const arrowX = getFirstArrowIndex(lines)
		if (arrowX == -1) return {lhs: lines}
		const lhs = []
		const rhs = []
		for (const line of lines) {
			const leftLine = line.slice(0, arrowX)
			const rightLine = line.slice(arrowX + 2)
			lhs.push(leftLine)
			rhs.push(rightLine)
		}
		
		const nextSide = {lhs: rhs}
		//const nextSide = splitRuleLinesWithArrow(rhs)
		return {lhs, nextSide}
	}
	
	const getFirstCharPos = (lines) => {
		for (let y = 0; y < lines.length; y++) {
			const line = lines[y]
			for (let x = 0; x < line.length; x++) {
				const char = line[x]
				if (char == " " || char == "	") continue
				return {x, y}
			}
		}
	}
	
	const readSides = (sides, rawSpaces, xAxis, yAxis, inputs, outputs) => {
		const sideLines = sides.lhs
		const firstCharPos = getFirstCharPos(sideLines)
		for (const rawSpace of rawSpaces) {
			const firstSpace = rawSpaces[0]
			const charX = firstCharPos.x + rawSpace[xAxis] - firstSpace[xAxis]
			const charY = firstCharPos.y - rawSpace[yAxis] + firstSpace[yAxis]
			const char = sideLines[charY][charX]
			
			// Is this the final diagram? ie: the output
			if (sides.nextSide == undefined) {
				let output = outputs.get(char)
				if (output == undefined) {
					const globalOutput = globalOutputs.get(char)
					if (globalOutput) output = globalOutput
					else output = EVENT.makeOutput()
				}
				rawSpace.output = output
			}
			
			// Otherwise, it must be an input
			else {
				let input = inputs.get(char)
				if (input == undefined) {
					const globalInput = globalInputs.get(char)
					if (globalInput) input = globalInput
					else input = makeInput(char, () => true)
				}
				rawSpace.input.push(input)
			}
		}
		
		if (sides.nextSide != undefined) readSides(sides.nextSide, rawSpaces, xAxis, yAxis, inputs, outputs)
	}
	
	const eatRule = (source, elementArgs, inputs, outputs, isAction) => {
	
		// Read the meta labels before the rule
		const labelsResult = eatRuleLabels(source)
		const labels = labelsResult.labels
		
		let axes = {}
		let pov = "front"
		let chance = undefined
		let superSymmetries = undefined
		
		if (labels.axes) axes = labels.axes
		if (labels.pov) pov = labels.pov
		if (labels.chance) chance = labels.chance
		if (labels.superSymmetries) superSymmetries = labels.superSymmetries
		
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
		
		// Split into left-hand-side and right-hand-side
		const splitResult = splitRuleLinesWithArrow(lines)
		const lhs = splitResult.lhs
		const nextSide = splitResult.nextSide
		//const rhs = nextSide.lhs
		if (lhs == undefined) throw new Error(`[TodeSplat] Failed to split rule with arrow(s)...`)
		
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
					//else ruleInput = makeInput(char, () => true)
					else throw new Error(`[TodeSplat] Unrecognised input: '${char}'`)
				}
				
				// Add chance to origin test
				if (chance != undefined && relativeX == 0 && relativeY == 0) {
					const test = ruleInput
					const chanceTest = (...args) => Math.random() < chance && test(...args)
					const chanceRuleInput = makeInput(char, chanceTest)
					ruleInput = chanceRuleInput
				}
				rawSpaces.push({[xAxis]: relativeX, [yAxis]: relativeY, input: ruleInput})
			}
		}
		
		// Get the first space on the right-hand-side (we will use it as an anchor for the other spaces)
		// Go through the positions, adding each output
		readSides(nextSide, rawSpaces, xAxis, yAxis, inputs, outputs)
		
		// Make the rule
		const rule = RULE.make(rawSpaces, axes, superSymmetries, isAction)
		elementArgs.rules.push(rule)
		
		return {
			success: true,
			input: source.slice(closeBracketIndex + 1),
		}
		
	}

}