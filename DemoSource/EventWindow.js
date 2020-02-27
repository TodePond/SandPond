//=============//
// EventWindow //
//=============//
const EVENTWINDOW = {}

{

	// Event Window Job Description
	//=============================
	// "I am responsible for my SITES."

	//========//
	// Public //
	//========//
	EVENTWINDOW.getSiteNumber = (x, y, z) => {
		const key = getSiteKey(x, y, z)
		return SITE_NUMBERS[key]
	}
	
	EVENTWINDOW.updateUniverse = (universe) => {
		const world = universe.world
		const area = world.area
		const grid = world.grid
		for (const y of area.yStart.to(area.yEnd)) {
			for (const x of area.xStart.to(area.xEnd)) {
				for (const z of area.zStart.to(area.zEnd)) {
					const space = grid[y][x][z]
					const sites = makeSites(universe, x, y, z)
					for (let siteNumber = 0; siteNumber < sites.length; siteNumber++) {
						space.sites[siteNumber] = sites[siteNumber]
					}
				}
			}
		}
	}
	
	//===========//
	// Constants //
	//===========//	
	SITE_POSITIONS = [
		// >x ^y
		// looking from the front
		[-2,2,0],  [-1,2,0],  [0,2,0],  [1,2,0],  [2,2,0],
		[-2,1,0],  [-1,1,0],  [0,1,0],  [1,1,0], [2,1,0],
		[-2,0,0],  [-1,0,0],  [0,0,0],  [1,0,0], [2,0, 0],
		[-2,-1,0], [-1,-1,0], [0,-1,0], [1,-1,0],[2,-1,0],
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
	
	const SITE_NUMBERS = []
	
	//=======//
	// Setup //
	//=======//
	const getSiteKey = (x, y, z) => {
		return `${x}${y}${z}`
	}
	
	for (const i in SITE_POSITIONS) {
		const position = SITE_POSITIONS[i]
		const key = getSiteKey(...position)
		SITE_NUMBERS[key] = parseInt(i)
	}
	
	//===========//
	// Functions //
	//===========//
	const makeSites = (universe, x, y, z) => {
	
		// Written by hand because it made lookup faster compared to dynamically filling the array
		const sites = [
			SITE.make(UNIVERSE.selectSpace(universe, x + -2, y + 2, z + 0), x + -2, y + 2, z + 0),
			SITE.make(UNIVERSE.selectSpace(universe, x + -1, y + 2, z + 0), x + -1, y + 2, z + 0),
			SITE.make(UNIVERSE.selectSpace(universe, x + 0, y + 2, z + 0), x + 0, y + 2, z + 0),
			SITE.make(UNIVERSE.selectSpace(universe, x + 1, y + 2, z + 0), x + 1, y + 2, z + 0),
			SITE.make(UNIVERSE.selectSpace(universe, x + 2, y + 2, z + 0), x + 2, y + 2, z + 0),
			
			SITE.make(UNIVERSE.selectSpace(universe, x + -2, y + 1, z + 0), x + -2, y + 1, z + 0),
			SITE.make(UNIVERSE.selectSpace(universe, x + -1, y + 1, z + 0), x + -1, y + 1, z + 0),
			SITE.make(UNIVERSE.selectSpace(universe, x + 0, y + 1, z + 0), x + 0, y + 1, z + 0),
			SITE.make(UNIVERSE.selectSpace(universe, x + 1, y + 1, z + 0), x + 1, y + 1, z + 0),
			SITE.make(UNIVERSE.selectSpace(universe, x + 2, y + 1, z + 0), x + 2, y + 1, z + 0),
			
			SITE.make(UNIVERSE.selectSpace(universe, x + -2, y + 0, z + 0), x + -2, y + 0, z + 0),
			SITE.make(UNIVERSE.selectSpace(universe, x + -1, y + 0, z + 0), x + -1, y + 0, z + 0),
			SITE.make(UNIVERSE.selectSpace(universe, x + 0, y + 0, z + 0), x + 0, y + 0, z + 0),
			SITE.make(UNIVERSE.selectSpace(universe, x + 1, y + 0, z + 0), x + 1, y + 0, z + 0),
			SITE.make(UNIVERSE.selectSpace(universe, x + 2, y + 0, z + 0), x + 2, y + 0, z + 0),
			
			SITE.make(UNIVERSE.selectSpace(universe, x + -2, y + -1, z + 0), x + -2, y + -1, z + 0),
			SITE.make(UNIVERSE.selectSpace(universe, x + -1, y + -1, z + 0), x + -1, y + -1, z + 0),
			SITE.make(UNIVERSE.selectSpace(universe, x + 0, y + -1, z + 0), x + 0, y + -1, z + 0),
			SITE.make(UNIVERSE.selectSpace(universe, x + 1, y + -1, z + 0), x + 1, y + -1, z + 0),
			SITE.make(UNIVERSE.selectSpace(universe, x + 2, y + -1, z + 0), x + 2, y + -1, z + 0),
			
			SITE.make(UNIVERSE.selectSpace(universe, x + -2, y + -2, z + 0), x + -2, y + -2, z + 0),
			SITE.make(UNIVERSE.selectSpace(universe, x + -1, y + -2, z + 0), x + -1, y + -2, z + 0),
			SITE.make(UNIVERSE.selectSpace(universe, x + 0, y + -2, z + 0), x + 0, y + -2, z + 0),
			SITE.make(UNIVERSE.selectSpace(universe, x + 1, y + -2, z + 0), x + 1, y + -2, z + 0),
			SITE.make(UNIVERSE.selectSpace(universe, x + 2, y + -2, z + 0), x + 2, y + -2, z + 0),
			
			SITE.make(UNIVERSE.selectSpace(universe, x + -2, y + 0, z + 2), x + -2, y + 0, z + 2),
			SITE.make(UNIVERSE.selectSpace(universe, x + -1, y + 0, z + 2), x + -1, y + 0, z + 2),
			SITE.make(UNIVERSE.selectSpace(universe, x + 0, y + 0, z + 2), x + 0, y + 0, z + 2),
			SITE.make(UNIVERSE.selectSpace(universe, x + 1, y + 0, z + 2), x + 1, y + 0, z + 2),
			SITE.make(UNIVERSE.selectSpace(universe, x + 2, y + 0, z + 2), x + 2, y + 0, z + 2),
			
			SITE.make(UNIVERSE.selectSpace(universe, x + -2, y + 0, z + 1), x + -2, y + 0, z + 1),
			SITE.make(UNIVERSE.selectSpace(universe, x + -1, y + 0, z + 1), x + -1, y + 0, z + 1),
			SITE.make(UNIVERSE.selectSpace(universe, x + 0, y + 0, z + 1), x + 0, y + 0, z + 1),
			SITE.make(UNIVERSE.selectSpace(universe, x + 1, y + 0, z + 1), x + 1, y + 0, z + 1),
			SITE.make(UNIVERSE.selectSpace(universe, x + 2, y + 0, z + 1), x + 2, y + 0, z + 1),
			/*
			SITE.make(UNIVERSE.selectSpace(universe, x + -2, y + 0, z + 0), x + -2, y + 0, z + 0),
			SITE.make(UNIVERSE.selectSpace(universe, x + -1, y + 0, z + 0), x + -1, y + 0, z + 0),
			SITE.make(UNIVERSE.selectSpace(universe, x + 0, y + 0, z + 0), x + 0, y + 0, z + 0),
			SITE.make(UNIVERSE.selectSpace(universe, x + 1, y + 0, z + 0), x + 1, y + 0, z + 0),
			SITE.make(UNIVERSE.selectSpace(universe, x + 2, y + 0, z + 0), x + 2, y + 0, z + 0),
			*/
			SITE.make(UNIVERSE.selectSpace(universe, x + -2, y + 0, z + -1), x + -2, y + 0, z + -1),
			SITE.make(UNIVERSE.selectSpace(universe, x + -1, y + 0, z + -1), x + -1, y + 0, z + -1),
			SITE.make(UNIVERSE.selectSpace(universe, x + 0, y + 0, z + -1), x + 0, y + 0, z + -1),
			SITE.make(UNIVERSE.selectSpace(universe, x + 1, y + 0, z + -1), x + 1, y + 0, z + -1),
			SITE.make(UNIVERSE.selectSpace(universe, x + 2, y + 0, z + -1), x + 2, y + 0, z + -1),
			
			SITE.make(UNIVERSE.selectSpace(universe, x + -2, y + 0, z + -2), x + -2, y + 0, z + -2),
			SITE.make(UNIVERSE.selectSpace(universe, x + -1, y + 0, z + -2), x + -1, y + 0, z + -2),
			SITE.make(UNIVERSE.selectSpace(universe, x + 0, y + 0, z + -2), x + 0, y + 0, z + -2),
			SITE.make(UNIVERSE.selectSpace(universe, x + 1, y + 0, z + -2), x + 1, y + 0, z + -2),
			SITE.make(UNIVERSE.selectSpace(universe, x + 2, y + 0, z + -2), x + 2, y + 0, z + -2),
			
			SITE.make(UNIVERSE.selectSpace(universe, x + 0, y + 2, z + -2), x + 0, y + 2, z + -2),
			SITE.make(UNIVERSE.selectSpace(universe, x + 0, y + 2, z + -1), x + 0, y + 2, z + -1),
			/*UNIVERSE.selectSpace(universe, x + 0, y + 2, z + 0),*/
			SITE.make(UNIVERSE.selectSpace(universe, x + 0, y + 2, z + 1), x + 0, y + 2, z + 1),
			SITE.make(UNIVERSE.selectSpace(universe, x + 0, y + 2, z + 2), x + 0, y + 2, z + 2),
			
			SITE.make(UNIVERSE.selectSpace(universe, x + 0, y + 1, z + -2), x + 0, y + 1, z + -2),
			SITE.make(UNIVERSE.selectSpace(universe, x + 0, y + 1, z + -1), x + 0, y + 1, z + -1),
			/*UNIVERSE.selectSpace(universe, x + 0, y + 1, z + 0),*/
			SITE.make(UNIVERSE.selectSpace(universe, x + 0, y + 1, z + 1), x + 0, y + 1, z + 1),
			SITE.make(UNIVERSE.selectSpace(universe, x + 0, y + 1, z + 2), x + 0, y + 1, z + 2),
			/*
			SITE.make(UNIVERSE.selectSpace(universe, x + 0, y + 0, z + -2), x + 0, y + 0, z + -2),
			SITE.make(UNIVERSE.selectSpace(universe, x + 0, y + 0, z + -1), x + 0, y + 0, z + -1),
			SITE.make(UNIVERSE.selectSpace(universe, x + 0, y + 0, z + 0), x + 0, y + 0, z + 0),
			SITE.make(UNIVERSE.selectSpace(universe, x + 0, y + 0, z + 1), x + 0, y + 0, z + 1),
			SITE.make(UNIVERSE.selectSpace(universe, x + 0, y + 0, z + 2), x + 0, y + 0, z + 2),
			*/
			SITE.make(UNIVERSE.selectSpace(universe, x + 0, y + -1, z + -2), x + 0, y + -1, z + -2),
			SITE.make(UNIVERSE.selectSpace(universe, x + 0, y + -1, z + -1), x + 0, y + -1, z + -1),
			/*UNIVERSE.selectSpace(universe, x + 0, y + -1, z + 0),*/
			SITE.make(UNIVERSE.selectSpace(universe, x + 0, y + -1, z + 1), x + 0, y + -1, z + 1),
			SITE.make(UNIVERSE.selectSpace(universe, x + 0, y + -1, z + 2), x + 0, y + -1, z + 2),
			
			SITE.make(UNIVERSE.selectSpace(universe, x + 0, y + -2, z + -2), x + 0, y + -2, z + -2),
			SITE.make(UNIVERSE.selectSpace(universe, x + 0, y + -2, z + -1), x + 0, y + -2, z + -1),
			/*UNIVERSE.selectSpace(universe, x + 0, y + -2, z + 0),*/
			SITE.make(UNIVERSE.selectSpace(universe, x + 0, y + -2, z + 1), x + 0, y + -2, z + 1),
			SITE.make(UNIVERSE.selectSpace(universe, x + 0, y + -2, z + 2), x + 0, y + -2, z + 2),
		]
		return sites
	}
	
}