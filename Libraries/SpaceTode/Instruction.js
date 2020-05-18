//=============//
// Instruction //
//=============//
const POV = {}
POV.TYPE = {
	FRONT: Symbol("Front"),
	BACK: Symbol("Back"),
	RIGHT: Symbol("Side"),
	LEFT: Symbol("Right"),
	BOTTOM: Symbol("Bottom"),
	TOP: Symbol("Top"),
}

const INSTRUCTION = {}
{
	INSTRUCTION.make = (name, generate = () => "") => ({name, generate})
	INSTRUCTION.TYPE = {
		BLOCK_END: INSTRUCTION.make("EndBlock"),
		DIAGRAM: INSTRUCTION.make("Diagram", (template, diagram) => {
		
			for (const spot of diagram) {
				
				if (spot.input.given != undefined) {}
				
				template.script.given.push(spot.input.given)
				template.script.change.push(spot.output.change)
				template.script.keep.push(spot.output.keep)
				
			}
		}),
		
		NAKED: INSTRUCTION.make("NakedBlock"),
		ANY: INSTRUCTION.make("AnyBlock"),
		FOR: INSTRUCTION.make("ForBlock"),
		MAYBE: INSTRUCTION.make("MaybeBlock"),
		ACTION: INSTRUCTION.make("ActionBlock"),
		MIMIC: INSTRUCTION.make("Mimic"),
		POV: INSTRUCTION.make("PointOfView"),
		BEHAVE: INSTRUCTION.make("Behave", (template, behave) => {
			const id = template.script.behave.push(behave) - 1
			template.main.push(`behave${id}(self, origin)`)
		}),
	}
	
	

}


