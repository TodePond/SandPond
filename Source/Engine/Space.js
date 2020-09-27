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
			atom: new Empty(),
			element: Empty,
			
			// Cached Data
			id,
			sites: [], //EVENTWINDOW makes this
			colourOffset0: id*3 + 0, //not really my job to make this... WORLD should make this
			colourOffset1: id*3 + 1,
			colourOffset2: id*3 + 2,
			
		}
	}
	
	const updateAppearanceShadow = (space, _world = world) => {
		const atom = space.atom
		if (atom == undefined || !atom.visible) {
			//WORLD.setSpaceVisible(world, space, false)
			WORLD.hideSpace(_world, space)
			//WORLD.setSpaceColour(world, space, atom.colour, atom.emissive)
			//WORLD.setSpaceOpacity(world, space, 255)
			return
		}
		//WORLD.setSpaceVisible(world, space, true)
		WORLD.showSpace(_world, space)
		WORLD.setSpaceOpacity(_world, space, atom.opacity)
		WORLD.setSpaceColour(_world, space, atom.colour, atom.emissive)
	}

	
	const updateAppearanceNoShadow = (space, _world = world) => {
		const atom = space.atom
		if (atom == undefined || !atom.visible) {
			WORLD.setSpaceVisible(_world, space, false)
			//WORLD.hideSpace(world, space)
			//WORLD.setSpaceColour(world, space, atom.colour, atom.emissive)
			//WORLD.setSpaceOpacity(world, space, 255)
			return
		}
		WORLD.setSpaceVisible(_world, space, true)
		//WORLD.showSpace(world, space)
		WORLD.setSpaceOpacity(_world, space, atom.opacity)
		WORLD.setSpaceColour(_world, space, atom.colour, atom.emissive)
	}
	
	SPACE.updateAppearance = SHADOW_MODE? updateAppearanceShadow : updateAppearanceNoShadow
	SPACE.update = SPACE.updateAppearance
	
	SPACE.setAtom = (space, atom, element = atom.element) => {
		space.atom = atom
		space.element = element
		SPACE.updateAppearance(space)
	}
	
}