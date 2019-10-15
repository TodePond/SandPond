//======//
// Atom //
//======//

{
	paused = false
	
	function makeAtom(type, args) {
		const atom = {type, ...type.properties, ...args}
		return atom
	}
	
	function atomThink(atom, space) {
		if (paused) return
		for (let r = 0; r < atom.type.ruleCount; r++) {
			const rule = atom.type.rules[r]
			const result = tryRule(rule, space)
			if (result) return
		}
	}
	
	function vote(name, max) {
		return {vote: {name, max}}
	}
	
	function tryRule(rule, space) {
	
		const symmetryNumber = rule.getNewSymmetryNumber()
		const args = {tests: []}
		
		// Check input
		for (let i = 0; i < rule.spaceCount; i++) {
			const ruleSpace = rule.spaces[i]
			const siteNumber = ruleSpace.eventWindowNumbers[symmetryNumber]
			const site = space.eventWindow[siteNumber]
			const result = ruleSpace.test(site, args)
			if (!result) return false
		}
		
		for (let i = 0; i < args.tests.length; i++) {
			const test = args.tests[i]
			const result = test(args)
			if (!result) return false
		}
		
		// Do output
		for (let i = 0; i < rule.spaceCount; i++) {
			const ruleSpace = rule.spaces[i]
			const siteNumber = ruleSpace.eventWindowNumbers[symmetryNumber]
			const site = space.eventWindow[siteNumber]
			ruleSpace.instruction(site, args)
		}
		
		return true
	}
	
	
	
}