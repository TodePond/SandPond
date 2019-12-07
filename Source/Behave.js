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
		//const sites = space.sites
		
		atom.element.func(atom, space.sites)
		
		/*let ruleDone = false
		for (let r = 0; r < atom.element.rules.length; r++) {
			const rule = atom.element.rules[r]
			if (ruleDone && !rule.isAction) continue
			const result = tryRule(atom, rule, sites)
			if (result) {
				if (!rule.isAction)	ruleDone = true
			}
		}*/
	}
	
	//===========//
	// Functions //
	//===========//
	const tryRule = (self, rule, sites) => {
		const reflectionNumber = SYMMETRY.getOneNumber(rule)
		return rule.funcs[reflectionNumber](self, sites)
	}
	
	/*const tryRule = (self, rule, sites) => {
	
		const reflectionNumber = SYMMETRY.getOneNumber(rule)
		
		const events = rule.eventLists[reflectionNumber]
		const eventCount = rule.eventCount
		
		const selection = {}
		const checks = []
		const spaces = []
		
		for (let eventNumber = 0; eventNumber < eventCount; eventNumber++) {
		
			const event = events[eventNumber]
			
			//args.atom = space? space.atom : undefined
			//args.element = args.atom? args.atom.element : undefined
			
			const inputResult = event.inputFunc(event, sites, self, selection)
			if (paused) continue
			if (!inputResult) return false
		}
		
		if (paused) return
		
		//args.atom = undefined
		//args.element = undefined
		
		// Do CHANGE + KEEP
		for (let eventNumber = 0; eventNumber < eventCount; eventNumber++) {
			const event = events[eventNumber]
			event.outputFunc(event, sites, self, selection)
		}
		
		return true
	}*/
	
}