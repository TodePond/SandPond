//==========//
// Symmetry //
//==========//
const SYMMETRY = {}

{

	// Symmetry Job Description
	//=======================
	// "I do confusing symmetry stuff lol."
	
	//========//
	// Public //
	//========//
	
	
	//===========//
	// Functions //
	//===========//	
	const tryRule = (self, rule, sites) => {
	
		const reflectionNumber = RULE.getReflectionNumber(rule)
		const args = {self}
		args.args = args //args
		
		const events = rule.events
		const layerCount = rule.layerCount
		const eventCount = rule.eventCount
		
		// FIRST: LAYERS
		for (let layerNumber = 0; layerNumber < layerCount; layerNumber++) {
			for (let eventNumber = 0; eventNumber < eventCount; eventNumber++) {
				//if (paused) continue
				const event = events[eventNumber]
				const siteNumber = event.siteNumbers[reflectionNumber]
				const site = sites[siteNumber]
				const space = site
				args.space = space
				
				const func = event.layers[layerNumber]
				const result = func(args)
				if (!result) return false
			}
		}
		//if (paused) return
		
		return true
	}
	
	
	
}