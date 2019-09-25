//======//
// Rule //
//======//
{
	
	const getTest = matcher (
		["@"], o=> (space, atom) => space && space.atom && space.atom.type == atom.type,
		["_"], o=> (space) => space && space.atom === undefined,
		["."], o=> (space) => space,
		["#"], o=> (space) => space && space.atom,
		["s"], o=> (space) => space && space.atom && space.atom.type.state == "solid",
	)
	
	const getInstruction = (output, input) => {
		if (output == input) return () => {}
		if (output == ".") return () => {}
		if (output == "_") return (space) => setSpaceAtom(world, space, undefined)
		if (output == "@") return (space, atom) => {
			const newAtom = new Atom(atom.type)
			setSpaceAtom(world, space, newAtom)
		}
	}
	
	const getNeighbourNumbers = (axes = {}, x, y, z) => {
	
		const neighbourNumbers = []
		
		if (axes.x && axes.y && axes.z) {
			neighbourNumbers.push(getNeighbourNumber(x, y, z))
		}
		
		if (axes.x && axes.y && !axes.z) {
			neighbourNumbers.push(getNeighbourNumber(x, y, z))
			neighbourNumbers.push(getNeighbourNumber(x, y, -z))
		}
		
		if (!axes.x && axes.y && axes.z) {
			neighbourNumbers.push(getNeighbourNumber(x, y, z))
			neighbourNumbers.push(getNeighbourNumber(-x, y, z))
		}
		
		if (!axes.x && !axes.y && axes.z) {
			neighbourNumbers.push(getNeighbourNumber(x, y, z))
			neighbourNumbers.push(getNeighbourNumber(-x, y, z))
			neighbourNumbers.push(getNeighbourNumber(x, -y, z))
			neighbourNumbers.push(getNeighbourNumber(-x, -y, z))
			
			neighbourNumbers.push(getNeighbourNumber(y, x, z))
			neighbourNumbers.push(getNeighbourNumber(-y, x, z))
			neighbourNumbers.push(getNeighbourNumber(y, -x, z))
			neighbourNumbers.push(getNeighbourNumber(-y, -x, z))
		}
		
		if (!axes.x && axes.y && !axes.z) {
			neighbourNumbers.push(getNeighbourNumber(x, y, z))
			neighbourNumbers.push(getNeighbourNumber(-x, y, z))
			neighbourNumbers.push(getNeighbourNumber(x, y, -z))
			neighbourNumbers.push(getNeighbourNumber(-x, y, -z))
			
			neighbourNumbers.push(getNeighbourNumber(z, y, x))
			neighbourNumbers.push(getNeighbourNumber(-z, y, x))
			neighbourNumbers.push(getNeighbourNumber(z, y, -x))
			neighbourNumbers.push(getNeighbourNumber(-z, y, -x))
		}
		
		if (axes.x && !axes.y && !axes.z) {
			neighbourNumbers.push(getNeighbourNumber(x, y, z))
			neighbourNumbers.push(getNeighbourNumber(x, y, -z))
			neighbourNumbers.push(getNeighbourNumber(x, -y, z))
			neighbourNumbers.push(getNeighbourNumber(x, -y, -z))
			
			neighbourNumbers.push(getNeighbourNumber(x, z, y))
			neighbourNumbers.push(getNeighbourNumber(x, -z, y))
			neighbourNumbers.push(getNeighbourNumber(x, z, -y))
			neighbourNumbers.push(getNeighbourNumber(x, -z, -y))
		}
		
		if (!axes.x && !axes.y && !axes.z) {
			neighbourNumbers.push(getNeighbourNumber(x, y, z))
			neighbourNumbers.push(getNeighbourNumber(x, -y, z))
			neighbourNumbers.push(getNeighbourNumber(x, y, -z))
			neighbourNumbers.push(getNeighbourNumber(x, -y, -z))
			
			neighbourNumbers.push(getNeighbourNumber(-x, y, z))
			neighbourNumbers.push(getNeighbourNumber(-x, -y, z))
			neighbourNumbers.push(getNeighbourNumber(-x, y, -z))
			neighbourNumbers.push(getNeighbourNumber(-x, -y, -z))
			
			neighbourNumbers.push(getNeighbourNumber(z, x, y))
			neighbourNumbers.push(getNeighbourNumber(z, -x, y))
			neighbourNumbers.push(getNeighbourNumber(z, x, -y))
			neighbourNumbers.push(getNeighbourNumber(z, -x, -y))
			
			neighbourNumbers.push(getNeighbourNumber(-z, x, y))
			neighbourNumbers.push(getNeighbourNumber(-z, -x, y))
			neighbourNumbers.push(getNeighbourNumber(-z, x, -y))
			neighbourNumbers.push(getNeighbourNumber(-z, -x, -y))
			
			neighbourNumbers.push(getNeighbourNumber(y, z, x))
			neighbourNumbers.push(getNeighbourNumber(y, -z, x))
			neighbourNumbers.push(getNeighbourNumber(y, z, -x))
			neighbourNumbers.push(getNeighbourNumber(y, -z, -x))
			
			neighbourNumbers.push(getNeighbourNumber(-y, z, x))
			neighbourNumbers.push(getNeighbourNumber(-y, -z, x))
			neighbourNumbers.push(getNeighbourNumber(-y, z, -x))
			neighbourNumbers.push(getNeighbourNumber(-y, -z, -x))
		}
		
		return neighbourNumbers
	}
	
	const parseSpaces = (rawSpaces, axes) => {
		const spaces = []
		for (const rawSpace of rawSpaces) {
		
			const x = rawSpace.x | 0
			const y = rawSpace.y | 0
			const z = rawSpace.z | 0
			const neighbourNumbers = getNeighbourNumbers(axes, x, y, z)
			
			const test = getTest(rawSpace.input)
			const instruction = getInstruction(rawSpace.output, rawSpace.input)
			const space = {neighbourNumbers, test, instruction}
			spaces.push(space)
		}
		return spaces
	}
	
	Rule = class Rule {
		constructor(axes, rawSpaces) {
			this.rawSpaces = rawSpaces
			this.axes = axes
			this.spaces = parseSpaces(rawSpaces, axes)
			this.symmetryCount = this.spaces[0].neighbourNumbers.length
			this.spaceCount = this.spaces.length
		}
		
		getNewSymmetry() {
			//return 0
			const rando = Math.random() * this.symmetryCount
			let chosenSymmetry
			for (let i = 0; i < this.symmetryCount; i++) {
				if (rando < i + 1) {
					chosenSymmetry = i
					break
				}
			}
			return chosenSymmetry
		}
	}
	
	
}

