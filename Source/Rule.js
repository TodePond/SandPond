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
	// reflections
	// - reflection0
	// - reflection1
	// - ...
	// - reflection47
	
	// reflection
	// - event0
	// - event1
	// - ...
	// - eventN
	
	// event
	// - siteNumber
	// - input
	// - output
	
	RULE.make = (rawDiagram, oneSymmetries = "", allSymmetries = "", isAction = false, forSymmetries = "") => {
	
		if (oneSymmetries != "" && forSymmetries != "") throw new Error("[TodeSplat] You can't combine a 'for' with a 'one' because I find it too confusing to code sorry.")
		
		const allDiagram = SYMMETRY.getAllDiagram(rawDiagram, allSymmetries)
		//const forDiagrams = SYMMETRY.getSymmetryDiagrams(allDiagram, forSymmetries)
		
		const oneDiagrams = SYMMETRY.getSymmetryDiagrams(allDiagram, oneSymmetries)
		const reflections = getEventLists(oneDiagrams)
		
		const rule = {
		
			isAction,
			reflections, 
			
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
