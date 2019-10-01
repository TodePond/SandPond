//======//
// Rule //
//======//
{
	function makeInput(key, test) {
		return {key, test}
	}
	
	function makeOutput(key, instruction) {
		return {key, instruction}
	}
		
	const getTest = (input) => input.test
	const getInstruction = (output) => output.instruction
	
	const getEventWindowNumbers = (axes = {}, x, y, z) => {
	
		const eventWindowNumbers = []
		
		if (axes.x && axes.y && axes.z) {
			return [
				getEventWindowNumber(x, y, z),
			]
		}
		
		if (axes.x && axes.y && !axes.z) {
			return [
				getEventWindowNumber(x, y, z),
				getEventWindowNumber(x, y, -z),
			]
		}
		
		if (!axes.x && axes.y && axes.z) {
			return [
				getEventWindowNumber(x, y, z),
				getEventWindowNumber(-x, y, z),
			]
		}
		
		if (axes.x && !axes.y && axes.z) {
			return [
				getEventWindowNumber(x, y, z),
				getEventWindowNumber(x, -y, z),
			]
		}
		
		if (!axes.x && !axes.y && axes.z) {
			return [
				getEventWindowNumber(x, y, z),
				getEventWindowNumber(-x, y, z),
				getEventWindowNumber(x, -y, z),
				getEventWindowNumber(-x, -y, z),
			
				getEventWindowNumber(y, x, z),
				getEventWindowNumber(-y, x, z),
				getEventWindowNumber(y, -x, z),
				getEventWindowNumber(-y, -x, z),
			]
		}
		
		if (!axes.x && axes.y && !axes.z) {
			return [
				getEventWindowNumber(x, y, z),
				getEventWindowNumber(-x, y, z),
				getEventWindowNumber(x, y, -z),
				getEventWindowNumber(-x, y, -z),
			
				getEventWindowNumber(z, y, x),
				getEventWindowNumber(-z, y, x),
				getEventWindowNumber(z, y, -x),
				getEventWindowNumber(-z, y, -x),
			]
		}
		
		if (axes.x && !axes.y && !axes.z) {
			return [
				getEventWindowNumber(x, y, z),
				getEventWindowNumber(x, y, -z),
				getEventWindowNumber(x, -y, z),
				getEventWindowNumber(x, -y, -z),
			
				getEventWindowNumber(x, z, y),
				getEventWindowNumber(x, -z, y),
				getEventWindowNumber(x, z, -y),
				getEventWindowNumber(x, -z, -y),
			]
		}
		
		if (!axes.x && !axes.y && !axes.z) {
			return [
				getEventWindowNumber(x, y, z),
				getEventWindowNumber(x, -y, z),
				getEventWindowNumber(x, y, -z),
				getEventWindowNumber(x, -y, -z),
			
				getEventWindowNumber(-x, y, z),
				getEventWindowNumber(-x, -y, z),
				getEventWindowNumber(-x, y, -z),
				getEventWindowNumber(-x, -y, -z),
			
				getEventWindowNumber(z, x, y),
				getEventWindowNumber(z, -x, y),
				getEventWindowNumber(z, x, -y),
				getEventWindowNumber(z, -x, -y),
			
				getEventWindowNumber(-z, x, y),
				getEventWindowNumber(-z, -x, y),
				getEventWindowNumber(-z, x, -y),
				getEventWindowNumber(-z, -x, -y),
			
				getEventWindowNumber(y, z, x),
				getEventWindowNumber(y, -z, x),
				getEventWindowNumber(y, z, -x),
				getEventWindowNumber(y, -z, -x),
			
				getEventWindowNumber(-y, z, x),
				getEventWindowNumber(-y, -z, x),
				getEventWindowNumber(-y, z, -x),
				getEventWindowNumber(-y, -z, -x),
			]
		}
	}
	
	const parseSpaces = (rawSpaces, axes) => {
		const spaces = []
		for (const rawSpace of rawSpaces) {
		
			const x = rawSpace.x | 0
			const y = rawSpace.y | 0
			const z = rawSpace.z | 0
			const eventWindowNumbers = getEventWindowNumbers(axes, x, y, z)
			
			const test = getTest(rawSpace.input)
			const instruction = getInstruction(rawSpace.output)
			const space = {eventWindowNumbers, test, instruction}
			spaces.push(space)
		}
		return spaces
	}
	
	Rule = class Rule {
		constructor(axes, rawSpaces) {
			this.rawSpaces = rawSpaces
			this.axes = axes
			this.spaces = parseSpaces(rawSpaces, axes)
			this.symmetryCount = this.spaces[0].eventWindowNumbers.length
			this.spaceCount = this.spaces.length
		}
		
		getNewSymmetry() {
			return Math.floor(Math.random() * this.symmetryCount)
		}
	}
	
	
}

