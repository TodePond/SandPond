//======//
// Atom //
//======//

{
	paused = false
	Atom = class Atom {
		constructor(type) {
			this.type = type
		}
		
		think(space) {
			if (paused) return
			for (let r = 0; r < this.type.ruleCount; r++) {
				const rule = this.type.rules[r]
				const result = this.tryRule(rule, space)
				if (result) return
			}
		}
		
		tryRule(rule, space) {
			const symmetry = rule.getNewSymmetry()
			const outputArgs = {}
			const inputTests = {}
			
			// Check input
			for (let s = 0; s < rule.spaceCount; s++) {
				const ruleSpace = rule.spaces[s]
				const eventWindowNumber = ruleSpace.eventWindowNumbers[symmetry]
				if (paused) continue
				const neighbour = space.eventWindow[eventWindowNumber] // this line here is really slow
				const result = ruleSpace.test(neighbour, outputArgs, inputTests)
				if (!result) return false
			}
			if (paused) return
			
			for (const test of inputTests) {
				if (!test(outputArgs)) return false
			}
			
			// Do output
			for (let s = 0; s < rule.spaceCount; s++) {
				const ruleSpace = rule.spaces[s]
				const eventWindowNumber = ruleSpace.eventWindowNumbers[symmetry]
				const neighbour = space.eventWindow[eventWindowNumber]
				ruleSpace.instruction(neighbour, outputArgs)
			}
			return true
		}
		
	}
	
	
	
}