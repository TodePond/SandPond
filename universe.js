//==========//
// Universe //
//==========//
const Universe = {}
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
	Universe.make = (rawArea) => {
		const world = World.make(rawArea)
		const universe = {world}
		EventWindow.updateUniverse(universe)
		return universe
	}
	
	Universe.selectWorld = (universe, x, y, z) => {
		return universe.world
	}
	
	Universe.selectSpace = (universe, x, y, z) => {
		const world = Universe.selectWorld(universe, x, y, z)
		const space = World.selectSpace(world, x, y, z)
		return space
	}
	
}