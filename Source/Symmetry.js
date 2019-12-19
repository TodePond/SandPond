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
		const allSpaces = [...spaces]		
		const spacesLength = spaces.length
		for (let i = 0; i < spacesLength; i++) {
			const space = spaces[i]
			const reflectedSpaces = getReflectedSpaces(symmetries, space.x, space.y, space.z)
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
	
	//=========//
	// Private //
	//=========//
	const getReflectedSpaces = (symmetries, x=0, y=0, z=0) => {
		const reflections = SYMMETRY.getReflections(symmetries)
		const reflectedSpaces = reflections.map(reflection => reflection(x, y, z))
		return reflectedSpaces
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