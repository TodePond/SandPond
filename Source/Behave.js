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
		
		const events = rule.events
		const eventCount = rule.eventCount
		
		const changers = []
		const spaces = []
		const selects = []
		
		const args = {
			self: self,
			space: undefined,
			votes: 0,
			//get atom() { return this.space? this.space.atom : undefined },
		}
		args.args = args //args
		
		
		// GET SPACES
		for (let eventNumber = 0; eventNumber < eventCount; eventNumber++) {
		
			const event = events[eventNumber]
			const siteNumber = event.siteNumbers[reflectionNumber]
			const site = sites[siteNumber]
			const space = site
			
			args.space = space
			args.atom = space? space.atom : undefined
			args.element = args.atom? args.atom.element : undefined
			
			// GIVEN		
			if (event.givenFunc) {
				const givenResult = event.givenFunc(args)
				if (!givenResult) return false
			}
			
			// SELECT
			if (event.selectFunc) {
				const selectResult = event.selectFunc(args)
				selects.push(selectResult)
			}
			
			// VOTE
			if (event.voteFunc) {
				const voteResult = event.voteFunc(args)
				if (voteResult) args.votes++
			}
			
			// Prepare CHANGE
			const changer = event.changeFunc
			changers[eventNumber] = changer
			spaces[eventNumber] = space
		}
		
		if (selects.length == 1) args.selected = selects[0]
		else if (selects.length > 1) args.selected = selects[Math.floor(Math.random() * selects.length)]
		
		// Do CHANGE
		for (let eventNumber = 0; eventNumber < eventCount; eventNumber++) {
			const space = spaces[eventNumber]
			const changer = changers[eventNumber]
			
			args.space = space
			changer(args)
		}
		
		return true
	}
	
}