//======//
// Rule //
//======//
const RULE = {}

{
	
	// Rule Job Description
	//=======================
	// "I describe how an atom behaves."
	
	//========//
	// Public //
	//========//
	RULE.make = (spaces, oneSymmetries = "", allSymmetries = "", isAction = false) => {
	
		const allSpaces = SYMMETRY.getAllSpaces(spaces, allSymmetries)
		const oneSpaceLists = SYMMETRY.getOneSpaceLists(allSpaces, oneSymmetries)
		
		const eventLists = getEventLists(oneSpaceLists)
		
		const funcs = eventLists.map(events => compileRuleFunc(events))
		
		print(funcs[0].as(String))
		
		const rule = {
		
			// Meaningful Data
			funcs,
			isAction,
			
			// Cache
			reflectionCount: funcs.length,
			//eventCount: eventLists[0].length,
			
		}
		
		return rule
	}
	
	//=========//
	// Private //
	//=========//
	const getEventLists = (spaceLists) => {
		const eventLists = spaceLists.map(spaces => {
			const events = spaces.map(space => EVENT.make(space))
			return events
		})
		return eventLists
	}
	
	const compileRuleFunc = (events) => {
		
		let code = ""
		const doneParams = []
		const captures = {}
		let givenNumber = 0
		let changeNumber = 0
		
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
				for (const param of params) {
				
					if (param == "space" || param == "atom") {
						if (!doneParams.includes(`space${siteNumber}`)) {
							code += `const space${siteNumber} = sites[${siteNumber}]\n`
							doneParams.push(`space${siteNumber}`)
						}
					}
					
					if (param == "atom") {
						if (!doneParams.includes(`atom${siteNumber}`)) {
							code += `const atom${siteNumber} = space${siteNumber} ? space${siteNumber}.atom : undefined\n`
							doneParams.push(`atom${siteNumber}`)
						}
					}
				}
				
				const siteParams = params.map(param => {
					if (param == "self") return param
					else return `${param}${siteNumber}`
				})
				
				code += `if (!given${givenNumber}(${siteParams.join(", ")})) return false\n`
				
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
		
		const captureNames = Object.keys(captures)
		const captureCode = `(${captureNames.join(", ")}) => (self, sites) => {\n\n${code}}`
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
			
			if (char.match(/[a-zA-Z]/)) buffer += char
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
	
}

