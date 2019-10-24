//==========//
// Universe //
//==========//
const Universe = {}
{
	
	//========//
	// Public //
	//========//
	Universe.make = (rawArea) => {
		const world = World.make(rawArea)
		const universe = {world}
		return universe
	}
	
	Universe.selectSpace = (universe, x, y, z) => {
		return World.selectSpace(universe.world, x, y, z)
	}
	
	Universe.setSpaceColour = (universe, space, colour, emissive, opacity) => {
		World.setSpaceColour(universe.world, space, colour, emissive, opacity)
	}
	
}