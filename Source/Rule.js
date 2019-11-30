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
		
		const oneReflectedDiagrams = oneReflections.map(reflection => {
		
			const reflectedSpaces = allSpaces.map(space => {
				const reflectedPosition = reflection(space.x, space.y, space.z)
				const reflectedSpace = {
					...reflectedPosition,
					input: space.input,
					output: space.output,
				}
				return reflectedSpace
			})
			
			const reflectedDiagram = EVENT.makeEvents(reflectedSpaces)
			return reflectedDiagram
		})
		
		// events
		//const events = EVENT.makeEvents(allSpaces, oneSymmetries)
		
		const rule = {
		
			// Meaningful Data
			oneReflectedDiagrams,
			isAction,
			
			// Cache
			reflectionCount: oneReflectedDiagrams.length,
			eventCount: oneReflectedDiagrams[0].length,
			
		}
		
		return rule
	}
	
}

