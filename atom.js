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
			for (let r = 0; r < this.type.ruleCount; r++) {
				const rule = this.type.rules[r]
				const result = this.tryRule(rule)
				if (result) return
			}
		}
		
		tryRule(rule) {
			const symmetry = rule.getNewSymmetry()
			
			// Check input
			for (let s = 0; s < rule.spaceCount; s++) {
				const ruleSpace = rule.spaces[s]
				const neighbourNumber = ruleSpace.neighbourNumbers[symmetry]
				
				const neighbour = this.space.neighbours[neighbourNumber] // this line here is really slow
				if (paused) return
				const result = ruleSpace.test(neighbour, this)
				if (!result) return false
			}
			
			// Do output
			for (let s = 0; s < rule.spaceCount; s++) {
				const ruleSpace = rule.spaces[s]
				const neighbourNumber = ruleSpace.neighbourNumbers[symmetry]
				const neighbour = this.space.neighbours[neighbourNumber]
				ruleSpace.instruction(neighbour, this)
			}
			return true
		}
		
		checkSpace(space, type) {
			if (type == "@") return space.atom == this
			if (type == "_") return space.atom == undefined
			if (type == "#") return space.atom != undefined
			if (type == ".") return true
			if (type == "s") return space.atom && space.atom.type.state == "solid"
			if (type == "l") return space.atom && space.atom.type.state == "liquid"
			if (atomTypesKey[type]) {
				return space.atom && space.atom.type == atomTypesKey[type]
			}
		}
		
		changeSpace(newSpace, oldSpace = this.space) {
			this.space = newSpace
			if (oldSpace) oldSpace.setAtom(undefined)
			newSpace.setAtom(this)
		}
		
	}
	
	
	
}