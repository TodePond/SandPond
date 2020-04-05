//=========//
// Element //
//=========//
const ELEMENT = {}

{
	// Element Job Description
	//========================
	// "I describe how I look and behave."

	//========//
	// Public //
	//========//
	ELEMENT.make = ({name, instructions = [], data = {}, args = {}, categories = []}, {
		colour = "grey", emissive = colour, opacity = 1.0,
		precise = false, floor = false, hidden = false, pour = true,
		...otherProperties
	} = {}) => {
	
		const behaveCode = JAVASCRIPT.makeBehave(instructions, name)
		const constructorCode = JAVASCRIPT.makeConstructor(name, data, args)
		
		const behave = JS(behaveCode)()
		const constructor = JS(constructorCode)(...data, ...args)
		
		const elementInfo = {
			
			// Appearance
			name, colour, emissive, opacity, categories,
			
			// Dropper
			precise, floor, hidden, pour,
			
			// Debug
			constructorCode, behaveCode, instructions,
			
			// Behaviour
			behave, ...otherProperties
			
		}
		
		const element = constructor
		element.o= elementInfo
		createShaderColours(element)
		
		for (const childName in element.elements) {
			const child = element.elements[childName]
			element[child.name] = child
		}
		
		return element
		
	}
	
	//=========//
	// Private //
	//=========//
	const createShaderColours = (element) => {
		const colourColour = new THREE.Color(element.colour)
		const emissiveColour = new THREE.Color(element.emissive)
		
		element.shaderColour = {
			r: colourColour.r * 255,
			g: colourColour.g * 255,
			b: colourColour.b * 255,
		}
		
		element.shaderOpacity = element.opacity * 255
		element.shaderEmissive = {
			r: emissiveColour.r * 255,
			g: emissiveColour.g * 255,
			b: emissiveColour.b * 255,
		}
		
	}
	
}
