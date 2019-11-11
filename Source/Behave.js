//=======//
// Event //
//=======//
const BEHAVE = {}

{

	// Behave Job Description
	//=======================
	// "I make an atom BEHAVE in its space."
	
	//========//
	// Public //
	//========//
	BEHAVE.spaceBehave = (space) => {
		const atom = space.atom
		if (!atom) return
		let ruleDone = false
		for (let r = 0; r < atom.element.rules.length; r++) {
			const rule = atom.element.rules[r]
			if (ruleDone && !rule.isAction) continue
			const result = tryRule(atom, rule, space)
			if (result) {
				if (!rule.isAction)	ruleDone = true
			}
		}
	}
	
	//===========//
	// Functions //
	//===========//
	const tryRule = (self, rule, space) => {
	
		const reflectionNumber = RULE.getReflectionNumber(rule)
		const args = {self}
		args.args = args //args
		
		// Check input
		for (let layer = 0; layer < rule.layerCount; layer++) {
			for (let i = 0; i < rule.eventCount; i++) {
				const event = rule.events[i]
				const siteNumber = event.siteNumbers[reflectionNumber]
				const site = space.eventWindow[siteNumber]
				args.space = site.space
				const test = event.tests[layer]
				const result = test(args)
				if (!result) return false
			}
		}
		
		// Do output
		for (let i = 0; i < rule.eventCount; i++) {
			const event = rule.events[i]
			const siteNumber = event.siteNumbers[reflectionNumber]
			const site = space.eventWindow[siteNumber]
			args.space = site.space
			event.instruction(args)
		}
		
		return true
	}
	
	
	
}