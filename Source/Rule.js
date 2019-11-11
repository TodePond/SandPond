//======//
// Rule //
//======//
const RULE = {}

{
	
	// Rule Job Description
	//=======================
	// "I describe how an atom behaves."
	
	//========//
	// Public //
	//========//
	RULE.make = (spaces, reflections, symmetries, isAction = false) => {
		const events = getEvents(spaces, reflections, symmetries)
		const rule = {
		
			// Meaningful Data
			events,
			isAction,
			
			// Cache
			layerCount: events[0].tests.length,
			reflectionCount: events[0].siteNumbers.length,
			eventCount: events.length,
			
		}
		return rule
	}
	
	RULE.getReflectionNumber = (rule) => {
		return Math.floor(Math.random() * rule.reflectionCount)
	}
	
	//===========//
	// Functions //
	//===========//
	const getEvents = (rawSpaces, symmetries, superSymmetries) => {
		
		// First, apply super symmetries
		// Super symmetries are just syntactic sugar
		const symmetrySpaces = getSymmetrySpaces(rawSpaces, superSymmetries)
		
		// Then, link up functions to appropriate site numbers
		// If symmetries are specified, there will be more than one possibility for site number
		const events = []
		for (const symmetrySpace of symmetrySpaces) {
		
			const x = symmetrySpace.x | 0
			const y = symmetrySpace.y | 0
			const z = symmetrySpace.z | 0
			const siteNumbers = getSiteNumbers(symmetries, x, y, z)
			
			const tests = symmetrySpace.input
			const instruction = symmetrySpace.output
			const event = {siteNumbers, tests, instruction}
			events.push(event)
		}
		
		return events
	}
	
	const getSymmetrySpaces = (rawSpaces, superSymmetries) => {
		const superSpaces = [...rawSpaces]
		const rawSpacesLength = superSpaces.length
		if (superSymmetries != undefined) for (let i = 0; i < rawSpacesLength; i++) {
			const rawSpace = superSpaces[i]
			const rawSymmetrySpaces = getRawSuperSymmetrySpaces(superSymmetries, rawSpace.x, rawSpace.y, rawSpace.z)
			for (const rawSymmetrySpace of rawSymmetrySpaces) {
				if (isRelativeSpaceInArray(superSpaces, rawSymmetrySpace)) continue
				superSpaces.push({
					x: rawSymmetrySpace.x,
					y: rawSymmetrySpace.y,
					z: rawSymmetrySpace.z,
					input: rawSpace.input,
					output: rawSpace.output,
				})
			}
		}
		
		return superSpaces
		
	}
	
	const getTests = (inputs) => {
		const spaceTests = inputs.map(input => input.test)
		return spaceTests
	}
	
	const getInstruction = (output) => output.instruction
	
	const getSiteNumbers = (symmetries = {}, x, y, z) => {
			
		if (!symmetries.x && !symmetries.y && !symmetries.z) {
			return [
				EVENTWINDOW.getSiteNumber(x, y, z),
			]
		}
		
		if (!symmetries.x && !symmetries.y && symmetries.z) {
			return [
				EVENTWINDOW.getSiteNumber(x, y, z),
				EVENTWINDOW.getSiteNumber(x, y, -z),
			]
		}
		
		if (symmetries.x && !symmetries.y && !symmetries.z) {
			return [
				EVENTWINDOW.getSiteNumber(x, y, z),
				EVENTWINDOW.getSiteNumber(-x, y, z),
			]
		}
		
		if (!symmetries.x && symmetries.y && !symmetries.z) {
			return [
				EVENTWINDOW.getSiteNumber(x, y, z),
				EVENTWINDOW.getSiteNumber(x, -y, z),
			]
		}
		
		if (symmetries.x && symmetries.y && !symmetries.z) {
			return [
				EVENTWINDOW.getSiteNumber(x, y, z),
				EVENTWINDOW.getSiteNumber(-x, y, z),
				EVENTWINDOW.getSiteNumber(x, -y, z),
				EVENTWINDOW.getSiteNumber(-x, -y, z),
			
				EVENTWINDOW.getSiteNumber(y, x, z),
				EVENTWINDOW.getSiteNumber(-y, x, z),
				EVENTWINDOW.getSiteNumber(y, -x, z),
				EVENTWINDOW.getSiteNumber(-y, -x, z),
			]
		}
		
		if (symmetries.x && !symmetries.y && symmetries.z) {
			return [
				EVENTWINDOW.getSiteNumber(x, y, z),
				EVENTWINDOW.getSiteNumber(-x, y, z),
				EVENTWINDOW.getSiteNumber(x, y, -z),
				EVENTWINDOW.getSiteNumber(-x, y, -z),
			
				EVENTWINDOW.getSiteNumber(z, y, x),
				EVENTWINDOW.getSiteNumber(-z, y, x),
				EVENTWINDOW.getSiteNumber(z, y, -x),
				EVENTWINDOW.getSiteNumber(-z, y, -x),
			]
		}
		
		if (!symmetries.x && symmetries.y && symmetries.z) {
			return [
				EVENTWINDOW.getSiteNumber(x, y, z),
				EVENTWINDOW.getSiteNumber(x, y, -z),
				EVENTWINDOW.getSiteNumber(x, -y, z),
				EVENTWINDOW.getSiteNumber(x, -y, -z),
			
				EVENTWINDOW.getSiteNumber(x, z, y),
				EVENTWINDOW.getSiteNumber(x, -z, y),
				EVENTWINDOW.getSiteNumber(x, z, -y),
				EVENTWINDOW.getSiteNumber(x, -z, -y),
			]
		}
		
		if (symmetries.x && symmetries.y && symmetries.z) {
			return [
				EVENTWINDOW.getSiteNumber(x, y, z),
				EVENTWINDOW.getSiteNumber(x, -y, z),
				EVENTWINDOW.getSiteNumber(x, y, -z),
				EVENTWINDOW.getSiteNumber(x, -y, -z),
			
				EVENTWINDOW.getSiteNumber(-x, y, z),
				EVENTWINDOW.getSiteNumber(-x, -y, z),
				EVENTWINDOW.getSiteNumber(-x, y, -z),
				EVENTWINDOW.getSiteNumber(-x, -y, -z),
			
				EVENTWINDOW.getSiteNumber(z, x, y),
				EVENTWINDOW.getSiteNumber(z, -x, y),
				EVENTWINDOW.getSiteNumber(z, x, -y),
				EVENTWINDOW.getSiteNumber(z, -x, -y),
			
				EVENTWINDOW.getSiteNumber(-z, x, y),
				EVENTWINDOW.getSiteNumber(-z, -x, y),
				EVENTWINDOW.getSiteNumber(-z, x, -y),
				EVENTWINDOW.getSiteNumber(-z, -x, -y),
			
				EVENTWINDOW.getSiteNumber(y, z, x),
				EVENTWINDOW.getSiteNumber(y, -z, x),
				EVENTWINDOW.getSiteNumber(y, z, -x),
				EVENTWINDOW.getSiteNumber(y, -z, -x),
				
				EVENTWINDOW.getSiteNumber(-y, z, x),
				EVENTWINDOW.getSiteNumber(-y, -z, x),
				EVENTWINDOW.getSiteNumber(-y, z, -x),
				EVENTWINDOW.getSiteNumber(-y, -z, -x),
			]
		}
	}
	
	const makeRelativeSpace = (x=0, y=0, z=0) => ({x, y, z})
	
	const getRawSuperSymmetrySpaces = (symmetries, x=0, y=0, z=0) => {
	
		if (!symmetries.X && !symmetries.Y && !symmetries.Z) {
			return [
				makeRelativeSpace(x, y, z),
			]
		}
		
		if (!symmetries.X && !symmetries.Y && symmetries.Z) {
			return [
				makeRelativeSpace(x, y, z),
				makeRelativeSpace(x, y, -z),
			]
		}
		
		if (symmetries.X && !symmetries.Y && !symmetries.Z) {
			return [
				makeRelativeSpace(x, y, z),
				makeRelativeSpace(-x, y, z),
			]
		}
		
		if (!symmetries.X && symmetries.Y && !symmetries.Z) {
			return [
				makeRelativeSpace(x, y, z),
				makeRelativeSpace(x, -y, z),
			]
		}
		
		if (symmetries.X && symmetries.Y && !symmetries.Z) {
			return [
				makeRelativeSpace(x, y, z),
				makeRelativeSpace(-x, y, z),
				makeRelativeSpace(x, -y, z),
				makeRelativeSpace(-x, -y, z),
			
				makeRelativeSpace(y, x, z),
				makeRelativeSpace(-y, x, z),
				makeRelativeSpace(y, -x, z),
				makeRelativeSpace(-y, -x, z),
			]
		}
		
		if (symmetries.X && !symmetries.Y && symmetries.Z) {
			return [
				makeRelativeSpace(x, y, z),
				makeRelativeSpace(-x, y, z),
				makeRelativeSpace(x, y, -z),
				makeRelativeSpace(-x, y, -z),
			
				makeRelativeSpace(z, y, x),
				makeRelativeSpace(-z, y, x),
				makeRelativeSpace(z, y, -x),
				makeRelativeSpace(-z, y, -x),
			]
		}
		
		if (!symmetries.X && symmetries.Y && symmetries.Z) {
			return [
				makeRelativeSpace(x, y, z),
				makeRelativeSpace(x, y, -z),
				makeRelativeSpace(x, -y, z),
				makeRelativeSpace(x, -y, -z),
			
				makeRelativeSpace(x, z, y),
				makeRelativeSpace(x, -z, y),
				makeRelativeSpace(x, z, -y),
				makeRelativeSpace(x, -z, -y),
			]
		}
		
		if (symmetries.X && symmetries.Y && symmetries.Z) {
			return [
				makeRelativeSpace(x, y, z),
				makeRelativeSpace(x, -y, z),
				makeRelativeSpace(x, y, -z),
				makeRelativeSpace(x, -y, -z),
			
				makeRelativeSpace(-x, y, z),
				makeRelativeSpace(-x, -y, z),
				makeRelativeSpace(-x, y, -z),
				makeRelativeSpace(-x, -y, -z),
			
				makeRelativeSpace(z, x, y),
				makeRelativeSpace(z, -x, y),
				makeRelativeSpace(z, x, -y),
				makeRelativeSpace(z, -x, -y),
			
				makeRelativeSpace(-z, x, y),
				makeRelativeSpace(-z, -x, y),
				makeRelativeSpace(-z, x, -y),
				makeRelativeSpace(-z, -x, -y),
			
				makeRelativeSpace(y, z, x),
				makeRelativeSpace(y, -z, x),
				makeRelativeSpace(y, z, -x),
				makeRelativeSpace(y, -z, -x),
				
				makeRelativeSpace(-y, z, x),
				makeRelativeSpace(-y, -z, x),
				makeRelativeSpace(-y, z, -x),
				makeRelativeSpace(-y, -z, -x),
			]
		}
	}
	
	const isRelativeSpaceInArray = (array, relativeSpace) => {
		return array.some(s => {
			const r = makeRelativeSpace(s.x, s.y, s.z)
			return r.x == relativeSpace.x && r.y == relativeSpace.y && r.z == relativeSpace.z
		})
	}
	
	
}

