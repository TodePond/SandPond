//==========//
// Symmetry //
//==========//
const SYMMETRY = {}

{

	// Symmetry Job Description
	//=======================
	// "I do confusing symmetry stuff lol."
	
	//========//
	// Public //
	//========//	
	SYMMETRY.getReflections = (symmetries) => {
		return REFLECTIONS[symmetries].map(ref => REFLECTION[ref])
	}
	
	SYMMETRY.getOneNumber = (rule) => Math.floor(Math.random() * rule.reflectionCount)
	
	SYMMETRY.getAllSpaces = (spaces, symmetries) => {
		const allSpaces = []		
		const spacesLength = spaces.length
		const reflections = SYMMETRY.getReflections(symmetries)
		for (let i = 0; i < spacesLength; i++) {
			const space = spaces[i]
			const reflectedSpaces = reflections.map(reflection => getReflectedSpace(space, reflection))
			for (const reflectedSpace of reflectedSpaces) {
				if (isVectorInArray(allSpaces, reflectedSpace)) continue
				allSpaces.push({
					x: reflectedSpace.x,
					y: reflectedSpace.y,
					z: reflectedSpace.z,
					input: space.input,
					output: space.output,
				})
			}
		}
		return allSpaces
	}
	
	SYMMETRY.getOneSpaceLists = (spaces, symmetries) => {
		const reflections = SYMMETRY.getReflections(symmetries)
		const diagrams = reflections.map(reflection => spaces.map(space => getReflectedSpace(space, reflection)) )
		return diagrams
	}
	
	//=========//
	// Private //
	//=========//	
	const getReflectedSpace = (space, reflection) => {
		const reflectedPosition = reflection(space.x, space.y, space.z)
		const reflectedSpace = {
			...reflectedPosition,
			input: space.input,
			output: space.output,
		}
		return reflectedSpace
	}
	
	const isVectorInArray = (array, vector) => array.some(element => element.x == vector.x && element.y == vector.y && element.z == vector.z)
	
	//============//
	// Long Stuff //
	//============//
	REFLECTION = {
		["x, y, z"]: (x, y, z) => V(x, y, z),
		["x, y, -z"]: (x, y, z) => V(x, y, -z),
		["x, -y, z"]: (x, y, z) => V(x, -y, z),
		["x, -y, -z"]: (x, y, z) => V(x, -y, -z),
		["-x, y, z"]: (x, y, z) => V(-x, y, z),
		["-x, y, -z"]: (x, y, z) => V(-x, y, -z),
		["-x, -y, z"]: (x, y, z) => V(-x, -y, z),
		["-x, -y, -z"]: (x, y, z) => V(-x, -y, -z),
		
		["x, z, y"]: (x, y, z) => V(x, z, y),
		["x, z, -y"]: (x, y, z) => V(x, z, -y),
		["x, -z, y"]: (x, y, z) => V(x, -z, y),
		["x, -z, -y"]: (x, y, z) => V(x, -z, -y),
		["-x, z, y"]: (x, y, z) => V(-x, z, y),
		["-x, z, -y"]: (x, y, z) => V(-x, z, -y),
		["-x, -z, y"]: (x, y, z) => V(-x, -z, y),
		["-x, -z, -y"]: (x, y, z) => V(-x, -z, -y),
		
		["z, y, x"]: (x, y, z) => V(z, y, x),
		["z, y, -x"]: (x, y, z) => V(z, y, -x),
		["z, -y, x"]: (x, y, z) => V(z, -y, x),
		["z, -y, -x"]: (x, y, z) => V(z, -y, -x),
		["-z, y, x"]: (x, y, z) => V(-z, y, x),
		["-z, y, -x"]: (x, y, z) => V(-z, y, -x),
		["-z, -y, x"]: (x, y, z) => V(-z, -y, x),
		["-z, -y, -x"]: (x, y, z) => V(-z, -y, -x),
		
		["y, x, z"]: (x, y, z) => V(y, x, z),
		["y, x, -z"]: (x, y, z) => V(y, x, -z),
		["y, -x, z"]: (x, y, z) => V(y, -x, z),
		["y, -x, -z"]: (x, y, z) => V(y, -x, -z),
		["-y, x, z"]: (x, y, z) => V(-y, x, z),
		["-y, x, -z"]: (x, y, z) => V(-y, x, -z),
		["-y, -x, z"]: (x, y, z) => V(-y, -x, z),
		["-y, -x, -z"]: (x, y, z) => V(-y, -x, -z),
		
		["z, x, y"]: (x, y, z) => V(z, x, y),
		["z, x, -y"]: (x, y, z) => V(z, x, -y),
		["z, -x, y"]: (x, y, z) => V(z, -x, y),
		["z, -x, -y"]: (x, y, z) => V(z, -x, -y),
		["-z, x, y"]: (x, y, z) => V(-z, x, y),
		["-z, x, -y"]: (x, y, z) => V(-z, x, -y),
		["-z, -x, y"]: (x, y, z) => V(-z, -x, y),
		["-z, -x, -y"]: (x, y, z) => V(-z, -x, -y),
		
		["y, z, x"]: (x, y, z) => V(y, z, x),
		["y, z, -x"]: (x, y, z) => V(y, z, -x),
		["y, -z, x"]: (x, y, z) => V(y, -z, x),
		["y, -z, -x"]: (x, y, z) => V(y, -z, -x),
		["-y, z, x"]: (x, y, z) => V(-y, z, x),
		["-y, z, -x"]: (x, y, z) => V(-y, z, -x),
		["-y, -z, x"]: (x, y, z) => V(-y, -z, x),
		["-y, -z, -x"]: (x, y, z) => V(-y, -z, -x),
	}
	
	REFLECTIONS = {
		[""]: [
			"x, y, z", "x, y, z", "x, y, z", "x, y, z", "x, y, z", "x, y, z", "x, y, z", "x, y, z",
			"x, y, z", "x, y, z", "x, y, z", "x, y, z", "x, y, z", "x, y, z", "x, y, z", "x, y, z",
			"x, y, z", "x, y, z", "x, y, z", "x, y, z", "x, y, z", "x, y, z", "x, y, z", "x, y, z", 
			"x, y, z", "x, y, z", "x, y, z", "x, y, z", "x, y, z", "x, y, z", "x, y, z", "x, y, z", 
			"x, y, z", "x, y, z", "x, y, z", "x, y, z", "x, y, z", "x, y, z", "x, y, z", "x, y, z", 
			"x, y, z", "x, y, z", "x, y, z", "x, y, z", "x, y, z", "x, y, z", "x, y, z", "x, y, z", 
		],
		
		x: [
			// No Flip                                  	// Flip X
			"x, y, z", "x, y, z", "x, y, z", "x, y, z", 	"-x, y, z", "-x, y, z", "-x, y, z", "-x, y, z",
			"x, y, z", "x, y, z", "x, y, z", "x, y, z", 	"-x, y, z", "-x, y, z", "-x, y, z", "-x, y, z",
			"x, y, z", "x, y, z", "x, y, z", "x, y, z", 	"-x, y, z", "-x, y, z", "-x, y, z", "-x, y, z",
			"x, y, z", "x, y, z", "x, y, z", "x, y, z", 	"-x, y, z", "-x, y, z", "-x, y, z", "-x, y, z",
			"x, y, z", "x, y, z", "x, y, z", "x, y, z", 	"-x, y, z", "-x, y, z", "-x, y, z", "-x, y, z",
			"x, y, z", "x, y, z", "x, y, z", "x, y, z", 	"-x, y, z", "-x, y, z", "-x, y, z", "-x, y, z",
		],
		
		y: [
			// No Flip            	// Flip Y               	// repeat pattern...
			"x, y, z", "x, y, z", 	"x, -y, z", "x, -y, z", 	"x, y, z", "x, y, z", 	"x, -y, z", "x, -y, z", 
			"x, y, z", "x, y, z", 	"x, -y, z", "x, -y, z", 	"x, y, z", "x, y, z", 	"x, -y, z", "x, -y, z", 
			"x, y, z", "x, y, z", 	"x, -y, z", "x, -y, z", 	"x, y, z", "x, y, z", 	"x, -y, z", "x, -y, z", 
			"x, y, z", "x, y, z", 	"x, -y, z", "x, -y, z", 	"x, y, z", "x, y, z", 	"x, -y, z", "x, -y, z", 
			"x, y, z", "x, y, z", 	"x, -y, z", "x, -y, z", 	"x, y, z", "x, y, z", 	"x, -y, z", "x, -y, z", 
			"x, y, z", "x, y, z", 	"x, -y, z", "x, -y, z", 	"x, y, z", "x, y, z", 	"x, -y, z", "x, -y, z", 
		],
		
		z: [
			// No Flip 	// Flip Z		// repeat pattern...
			"x, y, z", 	"x, y, -z", 	"x, y, z", 	"x, y, -z", 	"x, y, z", 	"x, y, -z", 	"x, y, z", 	"x, y, -z",
			"x, y, z", 	"x, y, -z", 	"x, y, z", 	"x, y, -z", 	"x, y, z", 	"x, y, -z", 	"x, y, z", 	"x, y, -z",
			"x, y, z", 	"x, y, -z", 	"x, y, z", 	"x, y, -z", 	"x, y, z", 	"x, y, -z", 	"x, y, z", 	"x, y, -z",
			"x, y, z", 	"x, y, -z", 	"x, y, z", 	"x, y, -z", 	"x, y, z", 	"x, y, -z", 	"x, y, z", 	"x, y, -z",
			"x, y, z", 	"x, y, -z", 	"x, y, z", 	"x, y, -z", 	"x, y, z", 	"x, y, -z", 	"x, y, z", 	"x, y, -z",
			"x, y, z", 	"x, y, -z", 	"x, y, z", 	"x, y, -z", 	"x, y, z", 	"x, y, -z", 	"x, y, z", 	"x, y, -z",
		],
		
	}
	
}