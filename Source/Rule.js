//======//
// Rule //
//======//
const RULE = {}


{
	
	// Rule Job Description
	//=======================
	// "I am a data structure for holding rules."
	
	//========//
	// Public //
	//========//
	
	// This function is all wrong - should not perform optimizations here. It makes it very hard to work with.
	// Optimisations should ONLY happen in Javascript.js
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
