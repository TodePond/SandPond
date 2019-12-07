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
	
		const func = makeRulesFunc(rules)
	
		const element = {
			name, colour, emissive, opacity,
			precise, floor, hidden, pour,
			func, rules, data, ...properties
		}
		ELEMENT.globalElements[name] = element
		createShaderColours(element)
		return element
	}
	
	//===========//
	// Functions //
	//===========//
	
	const makeRulesFunc = (rules, preparedParams = ["self", "sites"]) => {
		
		const rule = rules[0]
		const nextRules = rules.slice(1)
		
		const eventLists = rule.eventLists
		
		if (eventLists.length > 1) {
			throw new Error("[TodeSplat] Symmetries not supported yet")
		}
		
		const events = eventLists[0] //TODO: go through different symmetries somehow
		
		let code = ""
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
					const nextFunc = makeRulesFunc(nextRules, doneParams.d)
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
		print(captureCode)
		const captureFunc = JS (captureCode)
		const func = captureFunc(...captures)
		
		
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

