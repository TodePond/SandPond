//==========//
// Symmetry //
//==========//
const SYMMETRY = {}

SYMMETRY.TYPE = {
	X: Symbol("X"),
	Y: Symbol("Y"),
	Z: Symbol("Z"),
	XZ: Symbol("XZ"),
	XY: Symbol("XY"),
	YZ: Symbol("YZ"),
	XYZ: Symbol("XYZ"),
}

{

	// Symmetry Job Description
	//=======================
	// "I do confusing symmetry stuff lol."
	
	//========//
	// Public //
	//========//
	SYMMETRY.getReflections = (symmetries, reflectionDatabase = REFLECTIONS) => {
		return reflectionDatabase[symmetries].map(r => REFLECTION[r])
	}
	
	SYMMETRY.getUniqueReflections = (symmetries) => {
		return REFLECTIONS_UNIQUE[symmetries].map(r => REFLECTION[r])
	}
	
	SYMMETRY.getOneNumber = (rule) => Math.floor(Math.random() * rule.reflectionCount)
	
	SYMMETRY.getAllDiagram = (spaces, symmetries) => {
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
	
	SYMMETRY.getIterations = (diagram, forSymmetries, symmetryNumber) => {
	
		const iterations = []
		const orders = REFLECTIONS_FOR[forSymmetries]
		if (orders == undefined) throw new Error(`[TodeSplat] Unrecognised 'for' type: '${forSymmetries}'`)
		const order = orders[symmetryNumber]
		for (const symmName of order) {
			const reflector = REFLECTION[symmName]
			const reflectedDiagram = reflectDiagram(diagram, reflector)
			const iteration = getEventList(reflectedDiagram)
			iterations.push(iteration)
		}
		
		return iterations
	}
	
	const getEventList = (diagram) => diagram.map(space => EVENT.make(space))
	
	const getEventLists = (spaceLists) => {
		const eventLists = spaceLists.map(spaces => {
			const events = spaces.map(space => EVENT.make(space))
			return events
		})
		return eventLists
	}
	
	SYMMETRY.getSymmetryDiagrams = (spaces, symmetries) => {
		const reflections = SYMMETRY.getReflections(symmetries)
		const diagrams = reflections.map(reflection => spaces.map(space => getReflectedSpace(space, reflection)))
		return diagrams
	}
	
	SYMMETRY.getUniqueSymmetryDiagrams = (spaces, symmetries) => {
		const reflections = SYMMETRY.getUniqueReflections(symmetries)
		const diagrams = reflections.map(reflection => spaces.map(space => getReflectedSpace(space, reflection)))
		const uniqueDiagrams = []
		for (const diagram of diagrams) {
			if (uniqueDiagrams.some(uniqueDiagram => SYMMETRY.isDiagramEqual(uniqueDiagram, diagram))) continue
			else uniqueDiagrams.push(diagram)
		}
		return uniqueDiagrams
	}
	
	SYMMETRY.isDiagramEqual = (a, b) => {
	
		if (a.length != b.length) return false
		for (let s = 0; s < a.length; s++) {
			const aSpace = a[s]
			const bSpace = b[s]
			if (!V.equals(aSpace, bSpace)) return false
		}
		
		return true
	}
	
	//=========//
	// Private //
	//=========//
	const reflectDiagram = (diagram, reflection) => {
		return diagram.map(space => getReflectedSpace(space, reflection))
	}
	
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
			// No Flip                                     // Flip X
			"x, y, z", "x, y, z", "x, y, z", "x, y, z",    "-x, y, z", "-x, y, z", "-x, y, z", "-x, y, z",
			"x, y, z", "x, y, z", "x, y, z", "x, y, z",    "-x, y, z", "-x, y, z", "-x, y, z", "-x, y, z",
			"x, y, z", "x, y, z", "x, y, z", "x, y, z",    "-x, y, z", "-x, y, z", "-x, y, z", "-x, y, z",
			"x, y, z", "x, y, z", "x, y, z", "x, y, z",    "-x, y, z", "-x, y, z", "-x, y, z", "-x, y, z",
			"x, y, z", "x, y, z", "x, y, z", "x, y, z",    "-x, y, z", "-x, y, z", "-x, y, z", "-x, y, z",
			"x, y, z", "x, y, z", "x, y, z", "x, y, z",    "-x, y, z", "-x, y, z", "-x, y, z", "-x, y, z",
		],
		
		y: [
			// No Flip                // Flip Y                   // repeat pattern...
			"x, y, z", "x, y, z",     "x, -y, z", "x, -y, z",     "x, y, z", "x, y, z",     "x, -y, z", "x, -y, z", 
			"x, y, z", "x, y, z",     "x, -y, z", "x, -y, z",     "x, y, z", "x, y, z",     "x, -y, z", "x, -y, z", 
			"x, y, z", "x, y, z",     "x, -y, z", "x, -y, z",     "x, y, z", "x, y, z",     "x, -y, z", "x, -y, z", 
			"x, y, z", "x, y, z",     "x, -y, z", "x, -y, z",     "x, y, z", "x, y, z",     "x, -y, z", "x, -y, z", 
			"x, y, z", "x, y, z",     "x, -y, z", "x, -y, z",     "x, y, z", "x, y, z",     "x, -y, z", "x, -y, z", 
			"x, y, z", "x, y, z",     "x, -y, z", "x, -y, z",     "x, y, z", "x, y, z",     "x, -y, z", "x, -y, z", 
		],
		
		z: [
			// No Flip     // Flip Z       // repeat pattern...
			"x, y, z",     "x, y, -z",     "x, y, z",     "x, y, -z",     "x, y, z",     "x, y, -z",     "x, y, z",     "x, y, -z",
			"x, y, z",     "x, y, -z",     "x, y, z",     "x, y, -z",     "x, y, z",     "x, y, -z",     "x, y, z",     "x, y, -z",
			"x, y, z",     "x, y, -z",     "x, y, z",     "x, y, -z",     "x, y, z",     "x, y, -z",     "x, y, z",     "x, y, -z",
			"x, y, z",     "x, y, -z",     "x, y, z",     "x, y, -z",     "x, y, z",     "x, y, -z",     "x, y, z",     "x, y, -z",
			"x, y, z",     "x, y, -z",     "x, y, z",     "x, y, -z",     "x, y, z",     "x, y, -z",     "x, y, z",     "x, y, -z",
			"x, y, z",     "x, y, -z",     "x, y, z",     "x, y, -z",     "x, y, z",     "x, y, -z",     "x, y, z",     "x, y, -z",
		],
		
		xz: [
			// No Flip     // Flip Z       // same again...                // Flip X      // Flip X+Z      // same again...
			"x, y, z",     "x, y, -z",     "x, y, z",     "x, y, -z",     "-x, y, z",     "-x, y, -z",     "-x, y, z",     "-x, y, -z",	// No Swap
			"x, y, z",     "x, y, -z",     "x, y, z",     "x, y, -z",     "-x, y, z",     "-x, y, -z",     "-x, y, z",     "-x, y, -z",	// No Swap
			"z, y, x",     "z, y, -x",     "z, y, x",     "z, y, -x",     "-z, y, x",     "-z, y, -x",     "-z, y, x",     "-z, y, -x",	// Swap XZ
			"x, y, z",     "x, y, -z",     "x, y, z",     "x, y, -z",     "-x, y, z",     "-x, y, -z",     "-x, y, z",     "-x, y, -z",	// No Swap
			"z, y, x",     "z, y, -x",     "z, y, x",     "z, y, -x",     "-z, y, x",     "-z, y, -x",     "-z, y, x",     "-z, y, -x",	// Swap XZ
			"z, y, x",     "z, y, -x",     "z, y, x",     "z, y, -x",     "-z, y, x",     "-z, y, -x",     "-z, y, x",     "-z, y, -x",	// Swap XZ
		],
		
		xy: [
			// No Flip                // Flip Y                   // Flip X                   // Flip X+Y
			"x, y, z", "x, y, z",     "x, -y, z", "x, -y, z",     "-x, y, z", "-x, y, z",     "-x, -y, z", "-x, -y, z",	// No Swap
			"x, y, z", "x, y, z",     "x, -y, z", "x, -y, z",     "-x, y, z", "-x, y, z",     "-x, -y, z", "-x, -y, z",
			"x, y, z", "x, y, z",     "x, -y, z", "x, -y, z",     "-x, y, z", "-x, y, z",     "-x, -y, z", "-x, -y, z",
			
			"y, x, z", "y, x, z",     "y, -x, z", "y, -x, z",     "-y, x, z", "-y, x, z",     "-y, -x, z", "-y, -x, z",	// Swap XY
			"y, x, z", "y, x, z",     "y, -x, z", "y, -x, z",     "-y, x, z", "-y, x, z",     "-y, -x, z", "-y, -x, z",
			"y, x, z", "y, x, z",     "y, -x, z", "y, -x, z",     "-y, x, z", "-y, x, z",     "-y, -x, z", "-y, -x, z",
		],
		
		yz: [
			// No Flip     // Flip Z       // Flip Y       // Flip Y+Z      // same again...
			"x, y, z",     "x, y, -z",     "x, -y, z",     "x, -y, -z",     "x, y, z",     "x, y, -z",     "x, -y, z",     "x, -y, -z", // No Swap
			"x, z, y",     "x, z, -y",     "x, -z, y",     "x, -z, -y",     "x, z, y",     "x, z, -y",     "x, -z, y",     "x, -z, -y", // Swap YZ
			"x, y, z",     "x, y, -z",     "x, -y, z",     "x, -y, -z",     "x, y, z",     "x, y, -z",     "x, -y, z",     "x, -y, -z", // No Swap
			"x, y, z",     "x, y, -z",     "x, -y, z",     "x, -y, -z",     "x, y, z",     "x, y, -z",     "x, -y, z",     "x, -y, -z", // No Swap
			"x, z, y",     "x, z, -y",     "x, -z, y",     "x, -z, -y",     "x, z, y",     "x, z, -y",     "x, -z, y",     "x, -z, -y", // Swap YZ
			"x, z, y",     "x, z, -y",     "x, -z, y",     "x, -z, -y",     "x, z, y",     "x, z, -y",     "x, -z, y",     "x, -z, -y", // Swap YZ
		],
		
		xyz: [
			// No Flip     // Flip Z       // Flip Y       // Flip Y+Z      // Flip X       // Flip X+Z      // Flip X+Z      // Flip X+Y+Z
			"x, y, z",     "x, y, -z",     "x, -y, z",     "x, -y, -z",     "-x, y, z",     "-x, y, -z",     "-x, -y, z",     "-x, -y, -z", // No Swap
			"x, z, y",     "x, z, -y",     "x, -z, y",     "x, -z, -y",     "-x, z, y",     "-x, z, -y",     "-x, -z, y",     "-x, -z, -y", // Swap YZ
			"z, y, x",     "z, y, -x",     "z, -y, x",     "z, -y, -x",     "-z, y, x",     "-z, y, -x",     "-z, -y, x",     "-z, -y, -x", // Swap XZ
			"y, x, z",     "y, x, -z",     "y, -x, z",     "y, -x, -z",     "-y, x, z",     "-y, x, -z",     "-y, -x, z",     "-y, -x, -z", // Swap XY
			"z, x, y",     "z, x, -y",     "z, -x, y",     "z, -x, -y",     "-z, x, y",     "-z, x, -y",     "-z, -x, y",     "-z, -x, -y", // Swap XZ+YZ
			"y, z, x",     "y, z, -x",     "y, -z, x",     "y, -z, -x",     "-y, z, x",     "-y, z, -x",     "-y, -z, x",     "-y, -z, -x", // Swap XY+YZ
		],
		
	}
	
	const xz1 = ["x, y, z", "-x, y, z", "x, y, -z", "-x, y, -z", "z, y, x", "-z, y, x", "z, y, -x", "-z, y, -x"]
	//const xz2 = ["x, y, -z", "-x, y, -z", "x, y, z", "-x, y, z", "z, y, -x", "-z, y, -x", "z, y, x", "-z, y, x"]
	const xz2 = ["x, y, -z", "x, y, z", "-x, y, -z", "-x, y, z", "z, y, -x", "z, y, x", "-z, y, -x", "-z, y, x"]
	const xz3 = ["-x, y, z", "-x, y, -z", "x, y, z", "x, y, -z", "-z, y, x", "-z, y, -x", "z, y, x", "z, y, -x"]
	const xz4 = ["-x, y, -z", "x, y, -z", "-x, y, z", "x, y, z", "-z, y, -x", "z, y, -x", "-z, y, x", "z, y, x"]
	const xz5 = ["z, y, x", "-z, y, x", "z, y, -x", "-z, y, -x", "x, y, z", "-x, y, z", "x, y, -z", "-x, y, -z"]
	//const xz6 = ["z, y, -x", "-z, y, -x", "z, y, x", "-z, y, x", "x, y, -z", "-x, y, -z", "x, y, z", "-x, y, z"]
	const xz6 = ["z, y, -x", "z, y, x", "-z, y, -x", "-z, y, x", "x, y, -z", "x, y, z", "-x, y, -z", "-x, y, z"]
	const xz7 = ["-z, y, x", "-z, y, -x", "z, y, x", "z, y, -x", "-x, y, z", "-x, y, -z", "x, y, z", "x, y, -z"]
	const xz8 = ["-z, y, -x", "z, y, -x", "-z, y, x", "z, y, x", "-x, y, -z", "x, y, -z", "-x, y, z", "x, y, z"]
	
	const xy1 = ["x, y, z", "x, -y, z", "-x, y, z", "-x, -y, z", "y, x, z", "y, -x, z", "-y, x, z", "-y, -x, z"]
	const xy2 = ["x, -y, z", "x, -y, z", "-x, y, z", "-x, -y, z", "y, x, z", "y, -x, z", "-y, x, z", "-y, -x, z"]
	
	REFLECTIONS_FOR = {
		[""]: [["x, y, z"]].repeat(48),
		["x"]: [...[["x, y, z", "-x, y, z"]].repeat(4), ...[["-x, y, z", "x, y, z"]].repeat(4)].repeat(6),
		["y"]: [...[["x, y, z", "-x, y, z"]].repeat(2), ...[["-x, y, z", "x, y, z"]].repeat(2)].repeat(12),
		["z"]: [["x, y, z", "x, y, -z"], ["x, y, -z", "x, y, z"]].repeat(24),
		["xz"]: [
			xz1, xz2, xz1, xz2, xz3, xz4, xz3, xz4,
			xz1, xz2, xz1, xz2, xz3, xz4, xz3, xz4,
			xz5, xz6, xz5, xz6, xz7, xz8, xz7, xz8,
			xz1, xz2, xz1, xz2, xz3, xz4, xz3, xz4,
			xz5, xz6, xz5, xz6, xz7, xz8, xz7, xz8,
			xz5, xz6, xz5, xz6, xz7, xz8, xz7, xz8,
		],
	}
	
	
	
	REFLECTIONS_UNIQUE = {
		[""]: [
			"x, y, z",
		],
		
		x: [
			"x, y, z",
			"-x, y, z", 
		],
		
		y: [
			"x, y, z",
			"x, -y, z",
		],
		
		z: [
			"x, y, z",
			"x, y, -z",
		],
		
		xz: [
			"x, y, z",     "x, y, -z",     "-x, y, z",     "-x, y, -z",
			"z, y, x",     "z, y, -x",     "-z, y, x",     "-z, y, -x",
		],
		
		xy: [
			"x, y, z",     "x, -y, z", "-x, y, z",      "-x, -y, z", 
			"y, x, z",     "y, -x, z", "-y, x, z",      "-y, -x, z", 
		],
		
		yz: [
			// No Flip     // Flip Z       // Flip Y       // Flip Y+Z
			"x, y, z",     "x, y, -z",     "x, -y, z",     "x, -y, -z",
			"x, z, y",     "x, z, -y",     "x, -z, y",     "x, -z, -y",
		],
		
		xyz: [
			// No Flip     // Flip Z       // Flip Y       // Flip Y+Z      // Flip X       // Flip X+Z      // Flip X+Z      // Flip X+Y+Z
			"x, y, z",     "x, y, -z",     "x, -y, z",     "x, -y, -z",     "-x, y, z",     "-x, y, -z",     "-x, -y, z",     "-x, -y, -z", // No Swap
			"x, z, y",     "x, z, -y",     "x, -z, y",     "x, -z, -y",     "-x, z, y",     "-x, z, -y",     "-x, -z, y",     "-x, -z, -y", // Swap YZ
			"z, y, x",     "z, y, -x",     "z, -y, x",     "z, -y, -x",     "-z, y, x",     "-z, y, -x",     "-z, -y, x",     "-z, -y, -x", // Swap XZ
			"y, x, z",     "y, x, -z",     "y, -x, z",     "y, -x, -z",     "-y, x, z",     "-y, x, -z",     "-y, -x, z",     "-y, -x, -z", // Swap XY
			"z, x, y",     "z, x, -y",     "z, -x, y",     "z, -x, -y",     "-z, x, y",     "-z, x, -y",     "-z, -x, y",     "-z, -x, -y", // Swap XZ+YZ
			"y, z, x",     "y, z, -x",     "y, -z, x",     "y, -z, -x",     "-y, z, x",     "-y, z, -x",     "-y, -z, x",     "-y, -z, -x", // Swap XY+YZ
		],
		
	}
	
}