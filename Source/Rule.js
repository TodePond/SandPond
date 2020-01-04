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
		
		const rule = {
		
			// Meaningful Data
			eventLists,
			isAction,
			
			// Cache
			oneSymmetries, //technically deductable from 'eventLists' but why bother
			oneSymmetriesCount: eventLists.length,
			
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
