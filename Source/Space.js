//=======//
// Space //
//=======//
const SPACE = {}

{

	// Space Job Description
	//======================
	// "I am responsible for my ATOM."
	// "I keep a CACHE of stuff to speed up rendering."

	//========//
	// Public //
	//========//
	SPACE.make = (world, id) => {
		const space = {
		
			// Real Data
			atom: undefined,
			
			// Cached Data
			world,
			id,
			colourOffset0: id*3 + 0, //not really my job... someone else should tell me how to do this calculation
			colourOffset1: id*3 + 1,
			colourOffset2: id*3 + 2,
			
		}
		return space
	}
	
	SPACE.setAtom = (space, atom) => {
		space.atom = atom
		if (atom == undefined) {
			WORLD.setSpaceVisible(space.world, space, false)
			return
		}
		WORLD.setSpaceVisible(space.world, space, true)
		WORLD.setSpaceOpacity(space.world, space, atom.element.shaderOpacity)
		WORLD.setSpaceColour(space.world, space, atom.element.shaderColour, atom.element.shaderEmissive)
	}
	
}