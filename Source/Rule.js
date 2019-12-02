//======//
// Rule //
//======//
const RULE = {}

{
	
	// Rule Job Description
	//=======================
	// "I describe how an atom behaves."
	
	RULE.make = (spaces, oneSymmetries, allSymmetries, isAction = false) => {
	
		// all(xyz)
		const allSpaces = allSymmetries? SYMMETRY.getAllSpaces(spaces, allSymmetries) : spaces
		
		// one(xyz)
		const oneReflections = SYMMETRY.getReflections(oneSymmetries)
		
		const oneReflectedEvents = oneReflections.map(reflection => {
		
			const reflectedSpaces = allSpaces.map(space => {
				const reflectedPosition = reflection(space.x, space.y, space.z)
				const reflectedSpace = {
					...reflectedPosition,
					input: space.input,
					output: space.output,
				}
				return reflectedSpace
			})
			
			const reflectedEvents = reflectedSpaces.map(space => EVENT.make(space))
			return reflectedEvents
		})
		
		const rule = {
		
			// Meaningful Data
			oneReflectedEvents,
			isAction,
			
			// Cache
			reflectionCount: oneReflectedEvents.length,
			eventCount: oneReflectedEvents[0].length,
			
		}
		
		return rule
	}
	
}

