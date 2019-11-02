//=======//
// Event //
//=======//
const Behave = {}

{

	// Behave Job Description
	//=======================
	// "I make an atom BEHAVE in its space."
	
	//========//
	// Public //
	//========//
	Behave.spaceBehave = (space) => {
		const atom = space.atom
		if (!atom) return
		let ruleDone = false
		for (let r = 0; r < atom.type.ruleCount; r++) {
			const rule = atom.type.rules[r]
			if (ruleDone && !rule.isAction) continue
			const result = tryRule(atom, rule, space)
			if (result) {
				ruleDone = true
			}
		}
	}
	
	//===========//
	// Functions //
	//===========//
	const tryRule = (atom, rule, space) => {
	
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