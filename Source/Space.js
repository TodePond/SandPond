//=======//
// Space //
//=======//
const Space = {}

{

	// Space Job Description
	//======================
	// "I am responsible for my ATOM."
	// "I keep a CACHE of stuff to speed up rendering."

	//========//
	// Public //
	//========//
	Space.make = (world, id) => {
		const space = {
		
			// Real Data
			atom: undefined,
			
			// Cached Data
			world,
			id,
			colourOffset0: id*4 + 0, //not really my job... someone else should tell me how to do this calculation
			colourOffset1: id*4 + 1,
			colourOffset2: id*4 + 2,
			colourOffset3: id*4 + 3,
			emissiveOffset0: id*3 + 0,
			emissiveOffset1: id*3 + 1,
			emissiveOffset2: id*3 + 2,
			
		}
		return space
	}
	
	Space.setAtom = (space, atom) => {
		space.atom = atom
		if (atom == undefined) {
			World.setSpaceColour(space.world, space, false)
			return
		}
		World.setSpaceColour(space.world, space, atom.type.shaderColour, atom.type.shaderEmissive, atom.type.shaderOpacity)
	}
	
}