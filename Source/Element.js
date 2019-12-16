//=========//
// Element //
//=========//
const ELEMENT = {}

{
	// Element Job Description
	//========================
	// "I describe how I look and behave."

	//========//
	// Public //
	//========//
	ELEMENT.globalElements = {}
	ELEMENT.make = ({
		name, colour = "white", emissive = colour, opacity = 1.0,
		precise = false, floor = false, hidden = false, pour = true,
		rules = [], data = {}, ...properties
	}) => {
	
		const code = makeCode(rules, {name})
		const func = new Function(code)()
		
		const elementInfo = {
			
			// Appearance
			name, colour, emissive, opacity,
			
			// Dropper
			precise, floor, hidden, pour,
			
			// Debug
			code, rules,
			
			// Behaviour
			func, data, ...properties
			
		}
		
		const elementMaker = JS `() => {
			const element = function ${name}() {
				return {element}
			}
			return element
		}`
		
		const element = elementMaker()
		element.o= elementInfo
		
		ELEMENT.globalElements[name] = element
		createShaderColours(element)
		return element
	}
	
	//===========//
	// Functions //
	//===========//
	const makeCode = (rules, {name}) => {
		
		const ruleFuncs = {}
		const symmetryArrays = {}
		const symmetryFuncs = {}
		
		//======================//
		// MAIN FUNC GENERATION //
		//======================//
		// Header
		const mainFuncName = `${name}Behave`
		let mainCode = ""
		mainCode += `const ${mainFuncName} = (atom, sites) => {\n`
		
		// Go through each rule
		for (let r = 0; r < rules.length; r++) {
		
			//======================//
			// RULE FUNC GENERATION //
			//======================//
			// Header
			const rule = rules[r]
			const ruleFuncName = `${name}Rule${r}`
			let ruleCode = ""
			ruleCode += `(atom, sites) => {\n`
			
			// Prepare One Symmetries
			const oneSymmetryNumberName = `one${rule.oneSymmetries.as(UpperCase)}`
			const symmetryArrayName = `${ruleFuncName}Symmetries`
			ruleCode += `const ${oneSymmetryNumberName} = Math.floor(Math.random() * ${rule.oneSymmetriesCount})\n`
			ruleCode += `return ${symmetryArrayName}[${oneSymmetryNumberName}](atom, sites)\n`
			
			// End rule func
			ruleCode += "}\n"
			ruleCode = indentInnerCode(ruleCode)
			ruleFuncs[ruleFuncName] = ruleCode
			mainCode += `if (${ruleFuncName}(atom, sites)) return true\n`
			//============================================//
			
			//===========================//
			// SYMMETRY ARRAY GENERATION //
			//===========================//
			let symmetryArrayCode = ""
			symmetryArrayCode += "[\n"
			
			// Go through each symmetry
			for (let s = 0; s < rule.oneSymmetriesCount; s++) {
				const symmetryFuncName = `${ruleFuncName}Symmetry${rule.oneSymmetries.as(UpperCase)}${s}`
				symmetryArrayCode += `${symmetryFuncName},\n`
				
				//==========================//
				// SYMMETRY FUNC GENERATION //
				//==========================//
				let symmetryCode = ""
				symmetryCode += `(atom, sites) => {\n`
				symmetryCode += `//event code goes here\n`
				symmetryCode += `}\n`
				symmetryCode = indentInnerCode(symmetryCode)
				symmetryFuncs[symmetryFuncName] = symmetryCode
			}
			
			// End symmetry array
			symmetryArrayCode += "]\n"
			symmetryArrayCode = indentInnerCode(symmetryArrayCode)
			symmetryArrays[symmetryArrayName] = symmetryArrayCode
			//============================================//
			

			
		}
		
		// End behave func
		mainCode += `}\n`
		mainCode = indentInnerCode(mainCode)
		//============================================//
		
		// Group all rule functions together
		let rulesCode = ""
		for (const ruleFuncName in ruleFuncs) {
			const ruleCode = ruleFuncs[ruleFuncName]
			rulesCode += `const ${ruleFuncName} = ${ruleCode}\n`
		}
		
		// Group all symmetry arrays together
		let symmetryArraysCode = ""
		for (const symmetryArrayName in symmetryArrays) {
			const symmetryArrayCode = symmetryArrays[symmetryArrayName]
			symmetryArraysCode += `const ${symmetryArrayName} = ${symmetryArrayCode}\n`
		}
		
		// Group all symmetry funcs together
		let symmetryFuncsCode = ""
		for (const symmetryFuncName in symmetryFuncs) {
			const symmetryFuncCode = symmetryFuncs[symmetryFuncName]
			symmetryFuncsCode += `const ${symmetryFuncName} = ${symmetryFuncCode}\n`
		}
		
		// Group all symmetry funcs together
		
		// Group everything together
		let code = ""
		code += `//======//\n`
		code += `// MAIN //\n`
		code += `//======//\n`
		code += mainCode
		code += "\n"
		code += `//=======//\n`
		code += `// RULES //\n`
		code += `//=======//\n`
		code += rulesCode
		code += `//============//\n`
		code += `// SYMMETRIES //\n`
		code += `//============//\n`
		code += symmetryFuncsCode
		code += `//=================//\n`
		code += `// SYMMETRY ARRAYS //\n`
		code += `//=================//\n`
		code += symmetryArraysCode
		code += `return ${mainFuncName}`
		print(code)
		return code
	}
	
	const indentInnerCode = (code) => {
		const lines = code.split("\n")
		const indentedLines = lines.map((line, i) => (i == 0 || i >= lines.length-2)? line : `	${line}`)
		const indentedCode = indentedLines.join("\n")
		return indentedCode
	}
	
	// Old
	const makeRulesFunc = (sources, funcName, ruleNumber, ruleLetter, rules, preparedParams = ["self", "sites"], preparedSymmetries = {[""]: 0}) => {
		
		let source = ""
		
		const rule = rules[0]
		const nextRules = rules.slice(1)
		const eventLists = rule.eventLists
		
		if (preparedSymmetries[rule.oneSymmetries] == undefined) {
			
			let code = ``
			
			code += `const reflectionNumber = Math.floor(Math.random() * ${eventLists.length})\n`
			const reflectionFuncs = []
			const params = []
			
			for (let i = 0; i < eventLists.length; i++) {
				const events = eventLists[i]
				const nextPreparedSymmetries = {
					[rule.oneSymmetries]: i,
					...preparedSymmetries,
				}
				const reflectionFunc = makeRulesFunc(i == 0? sources : [], funcName, ruleNumber, ruleLetter, rules, preparedParams, nextPreparedSymmetries)
				const reflectionParams = getParams(reflectionFunc)
				
				reflectionFuncs.push(reflectionFunc)
				for (const param of reflectionParams) {
					if (!params.includes(param)) params.push(param)
				}
			}
			
			/*const funcs = reflectionFuncs.map(func => {
				const funcParams = getParams(func)
				if (funcParams.every((param, i) => param == params[i])) return func
				const maker = JS (`(func) => (${params.join(", ")}) => func(${funcParams.join(", ")})`)
				return maker(func)
			})*/
			
			const funcs = reflectionFuncs
			
			code += `return funcs[reflectionNumber](${params.join(", ")})\n`
			
			let makerCode = `(funcs) => (${params.join(", ")}) => {\n`
			makerCode += code
			makerCode += `}`
			
			const maker = JS (makerCode)
			const func = maker(funcs)
			
			const lines = func.as(String).split(`\n`)
			const prettyLines = lines.map((l, i) => (i == 0 || i == lines.length-1)? l : `	` + l)
			const prettySource = prettyLines.join(`\n`)
			sources.unshift(prettySource)
			
			return func
		}
		
		const reflectionNumber = preparedSymmetries[rule.oneSymmetries]
		const events = eventLists[reflectionNumber]
		
		let code = ``
		const doneParams = [...preparedParams]
		const desiredParams = ["self", "sites"]
		const captures = {}
		let givenNumber = 0
		let changeNumber = 0
		let nextRuleNumber = 0
		
		// INPUTTY
		code += `// INPUTS\n`
		code += `//--------\n`
		for (let eventNumber = 0; eventNumber < events.length; eventNumber++) {
			
			code += `// Input ${eventNumber}\n`
			
			const event = events[eventNumber]
			const siteNumber = event.siteNumber
			const input = event.input
			
			// GIVENS
			const givens = input.givens
			for (const given of givens) {
			
				captures[`given${givenNumber}`] = given
			
				const params = getParams(given)
				
				// Get params
				for (const param of params) {
				
					if (param == "space" || param == "atom" || param == "element") {
						const paramName = `space${siteNumber}`
						if (!doneParams.includes(paramName)) {
							code += `const space${siteNumber} = sites[${siteNumber}]\n`
							doneParams.push(paramName)
						}
					}
					
					if (param == "atom" || param == "element") {
						const paramName = `atom${siteNumber}`
						if (!doneParams.includes(paramName)) {
							code += `const atom${siteNumber} = space${siteNumber} ? space${siteNumber}.atom : undefined\n`
							doneParams.push(paramName)
						}
					}
					
					if (param == "element") {
						const paramName = `element${siteNumber}`
						if (!doneParams.includes(paramName)) {
							code += `const element${siteNumber} = atom${siteNumber} ? atom${siteNumber}.element : undefined\n`
							doneParams.push(paramName)
						}
					}
				}
				
				// Get params from cache
				for (const param of params) {
					if (param == "space") {
						const paramName = `space${siteNumber}`
						if (preparedParams.includes(paramName)) {
							if (!desiredParams.includes(paramName)) desiredParams.push(paramName)
						}
					}
					
					if (param == "atom") {
						const paramName = `atom${siteNumber}`
						if (preparedParams.includes(paramName)) {
							if (!desiredParams.includes(paramName)) desiredParams.push(paramName)
						}
						if (preparedParams.includes(`space${siteNumber}`)) {
							if (!desiredParams.includes(`space${siteNumber}`)) desiredParams.push(`space${siteNumber}`)
						}
					}
					
					if (param == "element") {
						const paramName = `element${siteNumber}`
						if (preparedParams.includes(paramName)) {
							if (!desiredParams.includes(paramName)) desiredParams.push(paramName)
						}
						if (preparedParams.includes(`atom${siteNumber}`)) {
							if (!desiredParams.includes(`atom${siteNumber}`)) desiredParams.push(`atom${siteNumber}`)
						}
					}
				}
				
				const siteParams = params.map(param => {
					if (param == "self") return param
					else return `${param}${siteNumber}`
				})
				
				let returnCode = ``
				if (nextRules.length == 0) returnCode = `return false`
				else {
					const nextRuleLetter = nextRuleNumber
					const nextFunc = makeRulesFunc(sources, `nextRule${nextRuleNumber}`, ruleNumber + 1, nextRuleLetter, nextRules, doneParams)
					const nextParams = getParams(nextFunc)
					
					for (const nextParam of nextParams) {
						if (preparedParams.includes(nextParam) && !desiredParams.includes(nextParam)) desiredParams.push(nextParam)
					}
					
					captures[`nextRule${nextRuleNumber}`] = nextFunc
					returnCode = `return nextRule${nextRuleNumber}(${nextParams.join(", ")})`
					nextRuleNumber++
				}
				
				code += `if (!given${givenNumber}(${siteParams.join(", ")})) ${returnCode}\n`
				
				givenNumber++
				
			}
			
			code += `\n`
			
		}
		
		// OUTPUTTY
		code += `// OUTPUTS\n`
		code += `//---------\n`
		for (let eventNumber = 0; eventNumber < events.length; eventNumber++) {
			
			code += `// Output ${eventNumber}\n`
			
			const event = events[eventNumber]
			const siteNumber = event.siteNumber
			const output = event.output
			
			// CHANGES
			const changes = output.changes
			for (const change of changes) {
				
				captures[`change${changeNumber}`] = change
				
				const params = getParams(change)
				
				if (!doneParams.includes(`space${siteNumber}`)) {
					code += `const space${siteNumber} = sites[${siteNumber}]\n`
					doneParams.push(`space${siteNumber}`)
				}
				
				for (const param of params) {
					// atom
					// element
					// selected
					// etc...
				}
				
				const siteParams = params.map(param => {
					if (param == "self") return param
					else return `${param}${siteNumber}`
				})
				
				code += `const newAtom${siteNumber} = change${changeNumber}(${siteParams.join(", ")})\n`
				code += `SPACE.setAtom(space${siteNumber}, newAtom${siteNumber})\n`
				
				changeNumber++
			}
			
			code += `\n`
			
		}
		
		code += `return true\n\n`
		//print(code)
		//print(captures)
		
		const captureNames = Object.keys(captures)
		const captureCode = `(${captureNames.join(", ")}) => (${desiredParams.join(", ")}) => {\n\n${code}}`
		//print(captureCode)
		const captureFunc = JS (captureCode)
		const func = captureFunc(...captures)
		
		
		let headerCode = ""
		const ruleBoxInner = `:: Rule ${ruleNumber}${ruleLetter == undefined? "" : ALPHABET[ruleLetter]} ::`
		headerCode += ruleBoxInner.map(() => ":") + `\n`
		headerCode += ruleBoxInner + "\n"
		headerCode += ruleBoxInner.map(() => ":") + `\n`
		
		const lines = func.as(String).split(`\n`)
		const prettyLines = lines.map((l, i) => (i == 0 || i == lines.length-1)? l : `	` + l)
		const prettySource = `const ${funcName} = ` + prettyLines.join(`\n`)
		sources.unshift(headerCode + prettySource)
		
		return func
	}
	
	const ALPHABET = "abcdefghijklmnopqrstuvwxyz"
	
	const getParams = (func) => {
		const code = func.as(String)
		const params = []
		let buffer = ""
		for (let i = 0; i < code.length; i++) {
			const char = code[i]
			if ((char == "(" || char == "{" || char == " " || char == "	") && buffer == "") continue
			
			if (char.match(/[a-zA-Z0-9]/)) buffer += char
			else if (char == " " || char == "," || char == "	" || char == "}" || char == ")") {
				if (buffer != "") {
					params.push(buffer)
					buffer = ""
				}
			}
			else throw new Error(`[TodeSplat] Unexpected character in named parameters: '${char}'`)
			
			if (char == "}" || char == ")") break
		}
		return params
	}
	
	const createShaderColours = (element) => {
		const colourColour = new THREE.Color(element.colour)
		const emissiveColour = new THREE.Color(element.emissive)
		
		element.shaderColour = {
			r: colourColour.r * 255,
			g: colourColour.g * 255,
			b: colourColour.b * 255,
		}
		
		element.shaderOpacity = element.opacity * 255
		
		element.shaderEmissive = {
			r: emissiveColour.r * 255,
			g: emissiveColour.g * 255,
			b: emissiveColour.b * 255,
		}
	}
	
}

