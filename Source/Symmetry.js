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
	SYMMETRY.getReflections = (symmetries) => REFLECTIONS[symmetries]
	
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
	const REFLECTIONS = {
	
		[""]: [
			(x, y, z) => V(x, y, z),
		],
		
		x: [
			(x, y, z) => V(x, y, z),
			(x, y, z) => V(-x, y, z),
		],
		
		y: [
			(x, y, z) => V(x, y, z),
			(x, y, z) => V(x, -y, z),
		],
		
		z: [
			(x, y, z) => V(x, y, z),
			(x, y, z) => V(x, y, -z),
		],
		
		xy: [
			(x, y, z) => V(x, y, z),
			(x, y, z) => V(-x, y, z),
			(x, y, z) => V(x, -y, z),
			(x, y, z) => V(-x, -y, z),
			
			(x, y, z) => V(y, x, z),
			(x, y, z) => V(-y, x, z),
			(x, y, z) => V(y, -x, z),
			(x, y, z) => V(-y, -x, z),
		],
		
		xz: [
			(x, y, z) => V(x, y, z),
			(x, y, z) => V(-x, y, z),
			(x, y, z) => V(x, y, -z),
			(x, y, z) => V(-x, y, -z),
			
			(x, y, z) => V(z, y, x),
			(x, y, z) => V(-z, y, x),
			(x, y, z) => V(z, y, -x),
			(x, y, z) => V(-z, y, -x),
		],
		
		yz: [
			(x, y, z) => V(x, y, z),
			(x, y, z) => V(x, -y, z),
			(x, y, z) => V(x, y, -z),
			(x, y, z) => V(x, -y, -z),
			
			(x, y, z) => V(x, z, y),
			(x, y, z) => V(x, -z, y),
			(x, y, z) => V(x, z, -y),
			(x, y, z) => V(x, -z, -y),
		],
		
		xyz: [
			(x, y, z) => V(x, y, z),
			(x, y, z) => V(x, -y, z),
			(x, y, z) => V(x, y, -z),
			(x, y, z) => V(x, -y, -z),
		
			(x, y, z) => V(-x, y, z),
			(x, y, z) => V(-x, -y, z),
			(x, y, z) => V(-x, y, -z),
			(x, y, z) => V(-x, -y, -z),
		
			(x, y, z) => V(z, x, y),
			(x, y, z) => V(z, -x, y),
			(x, y, z) => V(z, x, -y),
			(x, y, z) => V(z, -x, -y),
		
			(x, y, z) => V(-z, x, y),
			(x, y, z) => V(-z, -x, y),
			(x, y, z) => V(-z, x, -y),
			(x, y, z) => V(-z, -x, -y),
		
			(x, y, z) => V(y, z, x),
			(x, y, z) => V(y, -z, x),
			(x, y, z) => V(y, z, -x),
			(x, y, z) => V(y, -z, -x),
			
			(x, y, z) => V(-y, z, x),
			(x, y, z) => V(-y, -z, x),
			(x, y, z) => V(-y, z, -x),
			(x, y, z) => V(-y, -z, -x),
		],
	}
	
}