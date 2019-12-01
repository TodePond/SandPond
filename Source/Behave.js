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
	
		const reflectionNumber = SYMMETRY.getOneNumber(rule)
		
		const events = rule.oneReflectedDiagrams[reflectionNumber]
		const eventCount = rule.eventCount
		
		const selects = []
		const spaces = []
		
		for (let eventNumber = 0; eventNumber < eventCount; eventNumber++) {
		
			const event = events[eventNumber]
			
			//args.atom = space? space.atom : undefined
			//args.element = args.atom? args.atom.element : undefined
			
			const inputResult = event.inputFunc(event, sites, self, selects)
			if (inputResult.selected) selects.push(inputResult.selected)
			if (paused) continue
			if (!inputResult) return false
		}
		
		if (paused) return
		
		let selected = undefined
		if (selects.length == 1) selected = selects[0]
		else if (selects.length > 1) selected = selects[Math.floor(Math.random() * selects.length)]
		
		//args.atom = undefined
		//args.element = undefined
		
		// Do CHANGE + KEEP
		for (let eventNumber = 0; eventNumber < eventCount; eventNumber++) {
			const event = events[eventNumber]
			event.outputFunc(event, sites, self, selected)
		}
		
		return true
	}
	
}