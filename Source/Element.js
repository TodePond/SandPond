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
	
		const sources = []
		const func = makeRulesFunc(sources, rules)
		
		const element = {
			
			// Appearance
			name, colour, emissive, opacity,
			
			// Dropper
			precise, floor, hidden, pour,
			
			// Debug
			sources, funcSource: sources.join("\n\n"),
			
			// Behaviour
			func, rules, data, ...properties
			
		}
	
		ELEMENT.globalElements[name] = element
		createShaderColours(element)
		return element
	}
	
	//===========//
	// Functions //
	//===========//
	const makeRulesFunc = (sources, rules, preparedParams = ["self", "sites"], preparedSymmetries = {[""]: 0}) => {
		
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
				const reflectionFunc = makeRulesFunc(i == 0? sources : [], rules, preparedParams, nextPreparedSymmetries)
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
			
			sources.unshift(func.as(String))
			
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
		code += `//========//\n`
		code += `// INPUTS //\n`
		code += `//========//\n`
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
				
					if (param == "space" || param == "atom") {
						const paramName = `space${siteNumber}`
						if (!doneParams.includes(paramName)) {
							code += `const space${siteNumber} = sites[${siteNumber}]\n`
							doneParams.push(paramName)
						}
					}
					
					if (param == "atom") {
						const paramName = `atom${siteNumber}`
						if (!doneParams.includes(paramName)) {
							code += `const atom${siteNumber} = space${siteNumber} ? space${siteNumber}.atom : undefined\n`
							doneParams.push(paramName)
						}
					}
				}
				
				// Get params from cache
				for (const param of params) {
					if (param == "space") {
						const paramName = `space${siteNumber}`
						if (preparedParams.includes(paramName)) {
							desiredParams.push(paramName)
						}
					}
					
					if (param == "atom") {
						const paramName = `atom${siteNumber}`
						if (preparedParams.includes(paramName)) {
							desiredParams.push(paramName)
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
					const nextFunc = makeRulesFunc(sources, nextRules, doneParams)
					const nextParams = getParams(nextFunc)
					
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
		code += `//=========//\n`
		code += `// OUTPUTS //\n`
		code += `//=========//\n`
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
		headerCode += `//==========================\n`
		headerCode += `// Rules Remaining: ${rules.length}\n`
		if (rule.oneSymmetries != "") headerCode += `// Reflections Remaining: ${reflectionNumber}\n`
		headerCode += `//==========================\n`
		
		sources.unshift(headerCode + func.as(String))
		
		return func
	}
		
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

