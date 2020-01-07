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
	RULE.make = (rawDiagram, oneSymmetries = "", allSymmetries = "", isAction = false, forSymmetries = "") => {
	
		const diagram = SYMMETRY.getAllDiagram(rawDiagram, allSymmetries) 
		const forDiagrams = SYMMETRY.getSymmetryDiagrams(diagram, forSymmetries)
		const oneForDiagrams = []
		for (const forDiagram of forDiagrams) {
			const oneDiagrams = SYMMETRY.getSymmetryDiagrams(forDiagram, oneSymmetries)
			oneForDiagrams.push(oneDiagrams)
		}
		
		const oneDiagrams = SYMMETRY.getSymmetryDiagrams(diagram, oneSymmetries)
		const eventLists = getEventLists(oneDiagrams)
		
		
		const rule = {
		
			diagrams: oneForDiagrams,
			eventLists,
			isAction,
			
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
