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
		const sites = space.sites
		//if (paused) return
		let ruleDone = false
		for (let r = 0; r < atom.element.rules.length; r++) {
			const rule = atom.element.rules[r]
			if (ruleDone && !rule.isAction) continue
			const result = tryRule(atom, rule, sites)
			if (result) {
				if (!rule.isAction)	ruleDone = true
			}
		}
	}
	
	//===========//
	// Functions //
	//===========//	
	const tryRule = (self, rule, sites) => {
	
		const reflectionNumber = RULE.getReflectionNumber(rule)
		const args = {self}
		args.args = args //args
		
		const events = rule.events
		const eventCount = rule.eventCount
		
		// GIVEN + VOTE LAYER
		for (let eventNumber = 0; eventNumber < eventCount; eventNumber++) {
		
			const event = events[eventNumber]
			const siteNumber = event.siteNumbers[reflectionNumber]
			const site = sites[siteNumber]
			const space = site
			args.space = space
			
			const func = event.testFunc
			const result = func(args)
			if (!result.givenSuccess) return false
		}
		
		// CHANGE LAYER
		for (let eventNumber = 0; eventNumber < eventCount; eventNumber++) {
		
			const event = events[eventNumber]
			const siteNumber = event.siteNumbers[reflectionNumber]
			const site = sites[siteNumber]
			const space = site
			args.space = space
			
			const func = event.changeFunc
			const atom = func(args)
			SPACE.setAtom(space, atom)
		}
		
		return true
	}
	
	
	
}