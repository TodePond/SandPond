//======//
// Atom //
//======//
const Atom = {}

{

	// Atom Job Description
	//=====================
	// "I keep my ELEMENT and DATA."
	//
	// I am NOT responsible for my events!
	
	function makeAtom(type, args) {
		const atom = {type, ...type.properties, ...args}
		return atom
	}
	
	// Not my job (move to Event.js)
	function atomThink(atom, space) {
		for (let r = 0; r < atom.type.ruleCount; r++) {
			const rule = atom.type.rules[r]
			const result = tryRule(atom, rule, space)
			if (result) return
		}
	}
	
	// Not my job (move to Event.js)
	function tryRule(atom, rule, space) {
	
		const symmetryNumber = rule.getNewSymmetryNumber()
		const args = {tests: [], self: atom}
		args.args = args //args
		
		// Check input
		for (let layer = 0; layer < rule.layers; layer++) {
			for (let i = 0; i < rule.spaceCount; i++) {
				const ruleSpace = rule.spaces[i]
				const siteNumber = ruleSpace.eventWindowNumbers[symmetryNumber]
				const site = space.eventWindow[siteNumber]
				const test = ruleSpace.tests[layer]
				const result = test({space: site.space, ...args})
				if (!result) return false
			}
			
			for (let i = 0; i < args.tests.length; i++) {
				const test = args.tests[i]
				const result = test(args)
				if (!result) return false
			}
		}
		
		// Do output
		for (let i = 0; i < rule.spaceCount; i++) {
			const ruleSpace = rule.spaces[i]
			const siteNumber = ruleSpace.eventWindowNumbers[symmetryNumber]
			const site = space.eventWindow[siteNumber]
			ruleSpace.instruction({space: site.space, ...args})
		}
		
		return true
	}
	
	
	
}