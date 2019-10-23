//=============//
// EventWindow //
//=============//
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
	
	const eventWindowPositions = [
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
	
	const eventWindowNumbers = []
	for (const i in eventWindowPositions) {
		const position = eventWindowPositions[i]
		const key = getEventWindowKey(...position)
		eventWindowNumbers[key] = parseInt(i)
	}
	
	//===========//
	// Functions //
	//===========//	
	function getEventWindowKey(x, y, z) {
		return `${x}${y}${z}`
	}
	
	function getEventWindowNumber(x, y, z) {
		const key = getEventWindowKey(x, y, z)
		return eventWindowNumbers[key]
	}
	
	function makeEventWindow(grid, x, y, z) {
		return [
			World.selectGridSpace(grid, x + -2, y + 2, z + 0),
			World.selectGridSpace(grid, x + -1, y + 2, z + 0),
			World.selectGridSpace(grid, x + 0, y + 2, z + 0),
			World.selectGridSpace(grid, x + 1, y + 2, z + 0),
			World.selectGridSpace(grid, x + 2, y + 2, z + 0),
			
			World.selectGridSpace(grid, x + -2, y + 1, z + 0),
			World.selectGridSpace(grid, x + -1, y + 1, z + 0),
			World.selectGridSpace(grid, x + 0, y + 1, z + 0),
			World.selectGridSpace(grid, x + 1, y + 1, z + 0),
			World.selectGridSpace(grid, x + 2, y + 1, z + 0),
			
			World.selectGridSpace(grid, x + -2, y + 0, z + 0),
			World.selectGridSpace(grid, x + -1, y + 0, z + 0),
			World.selectGridSpace(grid, x + 0, y + 0, z + 0),
			World.selectGridSpace(grid, x + 1, y + 0, z + 0),
			World.selectGridSpace(grid, x + 2, y + 0, z + 0),
			
			World.selectGridSpace(grid, x + -2, y + -1, z + 0),
			World.selectGridSpace(grid, x + -1, y + -1, z + 0),
			World.selectGridSpace(grid, x + 0, y + -1, z + 0),
			World.selectGridSpace(grid, x + 1, y + -1, z + 0),
			World.selectGridSpace(grid, x + 2, y + -1, z + 0),
			
			World.selectGridSpace(grid, x + -2, y + -2, z + 0),
			World.selectGridSpace(grid, x + -1, y + -2, z + 0),
			World.selectGridSpace(grid, x + 0, y + -2, z + 0),
			World.selectGridSpace(grid, x + 1, y + -2, z + 0),
			World.selectGridSpace(grid, x + 2, y + -2, z + 0),
			
			World.selectGridSpace(grid, x + -2, y + 0, z + 2),
			World.selectGridSpace(grid, x + -1, y + 0, z + 2),
			World.selectGridSpace(grid, x + 0, y + 0, z + 2),
			World.selectGridSpace(grid, x + 1, y + 0, z + 2),
			World.selectGridSpace(grid, x + 2, y + 0, z + 2),
			
			World.selectGridSpace(grid, x + -2, y + 0, z + 1),
			World.selectGridSpace(grid, x + -1, y + 0, z + 1),
			World.selectGridSpace(grid, x + 0, y + 0, z + 1),
			World.selectGridSpace(grid, x + 1, y + 0, z + 1),
			World.selectGridSpace(grid, x + 2, y + 0, z + 1),
			/*
			World.selectGridSpace(grid, x + -2, y + 0, z + 0),
			World.selectGridSpace(grid, x + -1, y + 0, z + 0),
			World.selectGridSpace(grid, x + 0, y + 0, z + 0),
			World.selectGridSpace(grid, x + 1, y + 0, z + 0),
			World.selectGridSpace(grid, x + 2, y + 0, z + 0),
			*/
			World.selectGridSpace(grid, x + -2, y + 0, z + -1),
			World.selectGridSpace(grid, x + -1, y + 0, z + -1),
			World.selectGridSpace(grid, x + 0, y + 0, z + -1),
			World.selectGridSpace(grid, x + 1, y + 0, z + -1),
			World.selectGridSpace(grid, x + 2, y + 0, z + -1),
			
			World.selectGridSpace(grid, x + -2, y + 0, z + -2),
			World.selectGridSpace(grid, x + -1, y + 0, z + -2),
			World.selectGridSpace(grid, x + 0, y + 0, z + -2),
			World.selectGridSpace(grid, x + 1, y + 0, z + -2),
			World.selectGridSpace(grid, x + 2, y + 0, z + -2),
			
			World.selectGridSpace(grid, x + 0, y + 2, z + -2),
			World.selectGridSpace(grid, x + 0, y + 2, z + -1),
			/*World.selectGridSpace(grid, x + 0, y + 2, z + 0),*/
			World.selectGridSpace(grid, x + 0, y + 2, z + 1),
			World.selectGridSpace(grid, x + 0, y + 2, z + 2),
			
			World.selectGridSpace(grid, x + 0, y + 1, z + -2),
			World.selectGridSpace(grid, x + 0, y + 1, z + -1),
			/*World.selectGridSpace(grid, x + 0, y + 1, z + 0),*/
			World.selectGridSpace(grid, x + 0, y + 1, z + 1),
			World.selectGridSpace(grid, x + 0, y + 1, z + 2),
			/*
			World.selectGridSpace(grid, x + 0, y + 0, z + -2),
			World.selectGridSpace(grid, x + 0, y + 0, z + -1),
			World.selectGridSpace(grid, x + 0, y + 0, z + 0),
			World.selectGridSpace(grid, x + 0, y + 0, z + 1),
			World.selectGridSpace(grid, x + 0, y + 0, z + 2),
			*/
			World.selectGridSpace(grid, x + 0, y + -1, z + -2),
			World.selectGridSpace(grid, x + 0, y + -1, z + -1),
			/*World.selectGridSpace(grid, x + 0, y + -1, z + 0),*/
			World.selectGridSpace(grid, x + 0, y + -1, z + 1),
			World.selectGridSpace(grid, x + 0, y + -1, z + 2),
			
			World.selectGridSpace(grid, x + 0, y + -2, z + -2),
			World.selectGridSpace(grid, x + 0, y + -2, z + -1),
			/*World.selectGridSpace(grid, x + 0, y + -2, z + 0),*/
			World.selectGridSpace(grid, x + 0, y + -2, z + 1),
			World.selectGridSpace(grid, x + 0, y + -2, z + 2),
		]
	}
	
}