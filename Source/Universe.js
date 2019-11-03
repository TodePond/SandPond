//==========//
// Universe //
//==========//
const UNIVERSE = {}
{
	
	// Universe Job Description
	//=========================
	// "I join up my WORLDS."
	// "I try to keep EVENT WINDOWS up to date."
	//
	// WORLD: currently, I just look after one world
	// 
	// I do NOT work with spaces
	
	
	//========//
	// Public //
	//========//
	UNIVERSE.make = (rawArea) => {
		const world = WORLD.make(rawArea)
		const universe = {world}
		EVENTWINDOW.updateUniverse(universe)
		return universe
	}
	
	UNIVERSE.selectWorld = (universe, x, y, z) => {
		return universe.world
	}
	
	UNIVERSE.selectSpace = (universe, x, y, z) => {
		const world = UNIVERSE.selectWorld(universe, x, y, z)
		const space = WORLD.selectSpace(world, x, y, z)
		return space
	}
	
}