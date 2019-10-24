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
	
}