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
	// - iteration0
	// - iteration1
	// - ...
	// - iterationN
	
	// iteration
	// - event0
	// - event1
	// - ...
	// - eventN
	
	// event
	// - siteNumber
	// - input
	// - output
	
	RULE.make = (rawDiagram, oneSymmetries = "", allSymmetries = "", isAction = false, forSymmetries = "") => {
		
		const reflections = []
		
		const allDiagram = SYMMETRY.getAllDiagram(rawDiagram, allSymmetries)
		const oneDiagrams = SYMMETRY.getSymmetryDiagrams(allDiagram, oneSymmetries)
		
		let i = 0
		for (const oneDiagram of oneDiagrams) {
			const iterations = SYMMETRY.getIterations(oneDiagram, forSymmetries, i)
			reflections.push(iterations)
			i++
		}
		
		const rule = {
		
			isAction,
			reflections, 
			
		}
		
		return rule
	}
	
}
