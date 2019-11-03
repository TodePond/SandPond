//======//
// Rule //
//======//
{
	
	const getTests = (inputs) => {
		const miniTests = inputs.map(input => input.test)
		//const test = (...args) => miniTests.every(miniTest => miniTest(...args))
		//return test
		return miniTests
	}
	const getInstruction = (output) => output.instruction
	
	const getEventWindowNumbers = (symmetries = {}, x, y, z) => {
			
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
	
	const parseSpaces = (rawSpaces, axes, superSymmetries) => {
	
		const rawSpacesLength = rawSpaces.length
		if (superSymmetries != undefined) for (let i = 0; i < rawSpacesLength; i++) {
			const rawSpace = rawSpaces[i]
			const rawSymmetrySpaces = getRawSuperSymmetrySpaces(superSymmetries, rawSpace.x, rawSpace.y, rawSpace.z)
			for (const rawSymmetrySpace of rawSymmetrySpaces) {
				if (isRelativeSpaceInArray(rawSpaces, rawSymmetrySpace)) continue
				rawSpaces.push({
					x: rawSymmetrySpace.x,
					y: rawSymmetrySpace.y,
					z: rawSymmetrySpace.z,
					input: rawSpace.input,
					output: rawSpace.output,
				})
			}
		}
	
		const spaces = []
		for (const rawSpace of rawSpaces) {
		
			const x = rawSpace.x | 0
			const y = rawSpace.y | 0
			const z = rawSpace.z | 0
			const eventWindowNumbers = getEventWindowNumbers(axes, x, y, z)
			
			const tests = getTests(rawSpace.input)
			const instruction = getInstruction(rawSpace.output)
			const space = {eventWindowNumbers, tests, instruction}
			spaces.push(space)
		}
		
		return spaces
	}
	
	Rule = class Rule {
		constructor(axes, rawSpaces, superSymmetries, isAction) {
			this.rawSpaces = rawSpaces
			this.axes = axes
			this.isAction = isAction
			this.spaces = parseSpaces(rawSpaces, axes, superSymmetries)
			this.layers = this.spaces[0].tests.length
			this.symmetryCount = this.spaces[0].eventWindowNumbers.length
			this.spaceCount = this.spaces.length
		}
		
		getNewSymmetryNumber() {
			return Math.floor(Math.random() * this.symmetryCount)
		}
	}
	
	
}

