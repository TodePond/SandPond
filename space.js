//=======//
// Space //
//=======//
{

	//===========//
	// Constants //
	//===========//
	// Event Window 3.0
	// >x ^y
	// looking from the front
	// 00  01 |02| 03  04
	//        |  |
	// 05  06 |07| 08  09
	// _______|__|_______
	// 10  11 |12| 13  14
	// _______|__|_______
	// 15  16 |17| 18  19
	//        |  |
	// 20  21 |22| 23  24
	
	// >x ^z
	// looking from the top
	// 25  26 |27| 28  29
	//        |  |
	// 30  31 |32| 33  34
	// _______|__|_______
	// 10  11 |12| 13  14
	// _______|__|_______
	// 35  36 |37| 38  39
	//        |  |
	// 40  41 |42| 43  44
	
	// >z ^y
	// looking from the side
	// 45  46 |02| 47  48
	//        |  |
	// 49  50 |07| 51  52
	// _______|__|_______
	// 42  37 |12| 32  27	//???
	// _______|__|_______
	// 53  54 |37| 55  56
	//        |  |
	// 57  58 |42| 59  60
	
	eventWindowPositions = [
		// >x ^y
		// looking from the front
		[-2,2,0],  [-1,2,0],  [0,2,0],  [1,2,0],  [2,2,0],
		[-2,1,0],  [-1,1,0],  [0,1,0],  [1,1,0],  [2,1,0],
		[-2,0,0],  [-1,0,0],  [0,0,0],  [1,0,0],  [2,0, 0],
		[-2,-1,0], [-1,-1,0], [0,-1,0], [1,-1,0], [2,-1,0],
		[-2,-2,0], [-1,-2,0], [0,-2,0], [1,-2,0], [2,-2,0],
		
		// >x ^z
		// looking from the top
		[-2,0,2],  [-1,0,2],  [0,0,2],  [1,0,2],  [2,0,2],
		[-2,0,1],  [-1,0,1],  [0,0,1],  [1,0,1],  [2,0,1],
		/*[-2,0,0], [-1,0,0], [0,0,0], [1,0,0], [2,0,0],*/
		[-2,0,-1], [-1,0,-1], [0,0,-1], [1,0,-1], [2,0,-1],
		[-2,0,-2], [-1,0,-2], [0,0,-2], [1,0,-2], [2,0,-2],
		
		//>z ^y
		// looking from the side
		[0,2,-2], [0,2,-1], /*[0,2,0],*/ [0,2,1], [0,2,2],
		[0,1,-2], [0,1,-1], /*[0,1,0],*/ [0,1,1], [0,1,2],
		/*[0,0,-2], [0,0,-1], [0,0,0], [0,0,1], [0,0,2],*/
		[0,-1,-2], [0,-1,-1], /*[0,-1,0],*/ [0,-1,1], [0,-1,2],
		[0,-2,-2], [0,-2,-1], /*[0,-1,0],*/ [0,-2,1], [0,-2,2],
		
	]
	
	// Event Window 1.0
	// Bottom Layer
	//  0  1  2
	//  3  4  5
	//  6  7  8
	//
	// Middle Layer
	//  9 10 11
	// 12 13 14
	// 15 16 17
	//
	// Top Layer
	// 18 19 20
	// 21 22 23
	// 24 25 26
	NEIGHBOUR_DOWN_FORWARD_LEFT = 0
	NEIGHBOUR_DOWN_FORWARD = 1
	NEIGHBOUR_DOWN_FORWARD_RIGHT = 2
	NEIGHBOUR_DOWN_LEFT = 3
	NEIGHBOUR_DOWN = 4
	NEIGHBOUR_DOWN_RIGHT = 5
	NEIGHBOUR_DOWN_BACK_LEFT = 6
	NEIGHBOUR_DOWN_BACK = 7
	NEIGHBOUR_DOWN_BACK_RIGHT = 8
	
	NEIGHBOUR_FORWARD_LEFT = 9
	NEIGHBOUR_FORWARD = 10
	NEIGHBOUR_FORWARD_RIGHT = 11
	NEIGHBOUR_LEFT = 12
	NEIGHBOUR_ME = 13
	NEIGHBOUR_RIGHT = 14
	NEIGHBOUR_BACK_LEFT = 15
	NEIGHBOUR_BACK = 16
	NEIGHBOUR_BACK_RIGHT = 17
	
	NEIGHBOUR_UP_FORWARD_LEFT = 18
	NEIGHBOUR_UP_FORWARD = 19
	NEIGHBOUR_UP_FORWARD_RIGHT = 20
	NEIGHBOUR_UP_LEFT = 21
	NEIGHBOUR_UP = 22
	NEIGHBOUR_UP_RIGHT = 23
	NEIGHBOUR_UP_BACK_LEFT = 24
	NEIGHBOUR_UP_BACK = 25
	NEIGHBOUR_UP_BACK_RIGHT = 26
	
	getNeighbourNumber = matcher (
		[-1, -1, -1], NEIGHBOUR_DOWN_FORWARD_LEFT,
		[0, -1, -1], NEIGHBOUR_DOWN_FORWARD,
		[1, -1, -1], NEIGHBOUR_DOWN_FORWARD_RIGHT,
		[-1, -1, 0], NEIGHBOUR_DOWN_LEFT,
		[0, -1, 0], NEIGHBOUR_DOWN,
		[1, -1, 0], NEIGHBOUR_DOWN_RIGHT,
		[-1, -1, 1], NEIGHBOUR_DOWN_BACK_LEFT,
		[0, -1, 1], NEIGHBOUR_DOWN_BACK,
		[1, -1, 1], NEIGHBOUR_DOWN_BACK_RIGHT,
		
		[-1, 0, -1], NEIGHBOUR_FORWARD_LEFT,
		[0, 0, -1], NEIGHBOUR_FORWARD,
		[1, 0, -1], NEIGHBOUR_FORWARD_RIGHT,
		[-1, 0, 0], NEIGHBOUR_LEFT,
		[0, 0, 0], NEIGHBOUR_ME,
		[1, 0, 0], NEIGHBOUR_RIGHT,
		[-1, 0, 1], NEIGHBOUR_BACK_LEFT,
		[0, 0, 1], NEIGHBOUR_BACK,
		[1, 0, 1], NEIGHBOUR_BACK_RIGHT,
		
		[-1, 1, -1], NEIGHBOUR_UP_FORWARD_LEFT,
		[0, 1, -1], NEIGHBOUR_UP_FORWARD,
		[1, 1, -1], NEIGHBOUR_UP_FORWARD_RIGHT,
		[-1, 1, 0], NEIGHBOUR_UP_LEFT,
		[0, 1, 0], NEIGHBOUR_UP,
		[1, 1, 0], NEIGHBOUR_UP_RIGHT,
		[-1, 1, 1], NEIGHBOUR_UP_BACK_LEFT,
		[0, 1, 1], NEIGHBOUR_UP_BACK,
		[1, 1, 1], NEIGHBOUR_UP_BACK_RIGHT,
	)
	
	//===========//
	// Functions //
	//===========//
	function makeSpace(id) {
		const space = {
			id,
			atom: undefined,
			colourOffset0: id*4 + 0,
			colourOffset1: id*4 + 1,
			colourOffset2: id*4 + 2,
			colourOffset3: id*4 + 3,
			emissiveOffset0: id*3 + 0,
			emissiveOffset1: id*3 + 1,
			emissiveOffset2: id*3 + 2,
		}
		return space
	}
	
	function makeNeighbours (world, space, x, y, z) {
		const neighbours = [
			world.$Space(x + -1, y + -1, z + -1),
			world.$Space(x + 0, y + -1, z + -1),
			world.$Space(x + 1, y + -1, z + -1),
			world.$Space(x + -1, y + -1, z + 0),
			world.$Space(x + 0, y + -1, z + 0),
			world.$Space(x + 1, y + -1, z + 0),
			world.$Space(x + -1, y + -1, z + 1),
			world.$Space(x + 0, y + -1, z + 1),
			world.$Space(x + 1, y + -1, z + 1),
		
			world.$Space(x + -1, y + 0, z + -1),
			world.$Space(x + 0, y + 0, z + -1),
			world.$Space(x + 1, y + 0, z + -1),
			world.$Space(x + -1, y + 0, z + 0),
			world.$Space(x + 0, y + 0, z + 0),
			world.$Space(x + 1, y + 0, z + 0),
			world.$Space(x + -1, y + 0, z + 1),
			world.$Space(x + 0, y + 0, z + 1),
			world.$Space(x + 1, y + 0, z + 1),
		
			world.$Space(x + -1, y + 1, z + -1),
			world.$Space(x + 0, y + 1, z + -1),
			world.$Space(x + 1, y + 1, z + -1),
			world.$Space(x + -1, y + 1, z + 0),
			world.$Space(x + 0, y + 1, z + 0),
			world.$Space(x + 1, y + 1, z + 0),
			world.$Space(x + -1, y + 1, z + 1),
			world.$Space(x + 0, y + 1, z + 1),
			world.$Space(x + 1, y + 1, z + 1),
		]
		return neighbours
	}
	
	function setSpaceAtom(world, space, atom) {
		space.atom = atom
		if (atom == undefined) {
			world.setSpaceColour(space, false)
			return
		}
		atom.space = space
		world.setSpaceColour(space, atom.type.shaderColour, atom.type.shaderEmissive, atom.type.shaderOpacity)
	}
	
}