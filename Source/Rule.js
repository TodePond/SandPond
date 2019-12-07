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
		
		//const funcs = eventLists.map(events => compileRuleFunc(events))
		
		//print(funcs[0].as(String))
		
		const rule = {
		
			// Meaningful Data
			eventLists,
			oneSymmetries,
			isAction,
			
			// Cache
			//reflectionCount: funcs.length,
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
	
}

