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
	
		// First, apply symmetries
		// Symmetries are just syntactic sugar
		const symmetrySpaces = getSymmetrySpaces(spaces, symmetries)
		
		// Then, link up functions to appropriate site numbers
		// If reflections are specified, there will be more than one possibility for site number
		const events = getEvents(symmetrySpaces, reflections)
		
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
	const getEvents = (spaces, reflections) => {
		
		const events = []
		for (const space of spaces) {
		
			const x = space.x | 0
			const y = space.y | 0
			const z = space.z | 0
			const siteNumbers = getSiteNumbers(reflections, x, y, z)
			
			const tests = space.input
			const instruction = space.output
			const event = {siteNumbers, tests, instruction}
			events.push(event)
		}
		
		return events
	}
	
	const getSymmetrySpaces = (spaces, symmetries) => {
		const symmetrySpaces = [...spaces]
		if (symmetries == undefined) return symmetrySpaces
		
		const spacesLength = symmetrySpaces.length
		for (let i = 0; i < spacesLength; i++) {
			const space = symmetrySpaces[i]
			const spaceSymmetrySpaces = getSpaceSymmetrySpaces(symmetries, space.x, space.y, space.z)
			for (const spaceSymmetrySpace of spaceSymmetrySpaces) {
				if (isRelativeSpaceInArray(symmetrySpaces, spaceSymmetrySpace)) continue
				symmetrySpaces.push({
					x: spaceSymmetrySpace.x,
					y: spaceSymmetrySpace.y,
					z: spaceSymmetrySpace.z,
					input: space.input,
					output: space.output,
				})
			}
		}
		
		return symmetrySpaces
		
	}
	
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
	
	const getSpaceSymmetrySpaces = (symmetries, x=0, y=0, z=0) => {
	
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

