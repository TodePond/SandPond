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
		return {
		
			// Real Data
			atom: undefined,
			
			// Cached Data
			world,
			id,
			sites: [], //EVENTWINDOW makes this
			colourOffset0: id*3 + 0, //not really my job to make this... WORLD should make this
			colourOffset1: id*3 + 1,
			colourOffset2: id*3 + 2,
			
		}
	}
	
	SPACE.setAtom = (space, atom) => {
		space.atom = atom
		if (atom == undefined) {
			WORLD.setSpaceVisible(space.world, space, false)
			return
		}
		WORLD.setSpaceVisible(space.world, space, true)
		
		// April fools
		if (atom.w != undefined && atom.w != 0) WORLD.setSpaceVisible(space.world, space, false)
		//=================
		
		WORLD.setSpaceOpacity(space.world, space, atom.element.shaderOpacity)
		WORLD.setSpaceColour(space.world, space, atom.element.shaderColour, atom.element.shaderEmissive)
	}
	
}