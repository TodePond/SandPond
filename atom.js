//======//
// Atom //
//======//

{
	paused = false
	Atom = class Atom {
		constructor(type) {
			this.type = type
			this.space = undefined
		}
		
		think(tick) {
			if (paused) return
			for (let r = 0; r < this.type.ruleCount; r++) {
				const rule = this.type.rules[r]
				const result = this.tryRule(rule)
				if (result) return
			}
		}
		
		tryRule(rule) {
			const symmetry = rule.getNewSymmetry()
			const outputArgs = {}
			
			// Check input
			for (let s = 0; s < rule.spaceCount; s++) {
				const ruleSpace = rule.spaces[s]
				const eventWindowNumber = ruleSpace.eventWindowNumbers[symmetry]
				if (paused) continue
				const neighbour = this.space.eventWindow[eventWindowNumber] // this line here is really slow
				const result = ruleSpace.test(neighbour, outputArgs)
				if (!result) return false
			}
			if (paused) return
			
			// Do output
			for (let s = 0; s < rule.spaceCount; s++) {
				const ruleSpace = rule.spaces[s]
				const eventWindowNumber = ruleSpace.eventWindowNumbers[symmetry]
				const neighbour = this.space.eventWindow[eventWindowNumber]
				ruleSpace.instruction(neighbour, outputArgs)
			}
			return true
		}
		
	}
	
	
	
}