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
		colour = "grey", emissive = colour, opacity = 1.0, visible = true, source = "",
		precise = false, floor = false, hidden = false, pour = true,
		...otherProperties
	} = {}) => {
	
	
		const behaveMaker = JAVASCRIPT.makeBehave(instructions, name)
		const behave = behaveMaker()
		const constructorCode = JAVASCRIPT.makeConstructor(name, data, args)
		const constructor = JS(constructorCode)(...data, ...args)
		const shaderColours = makeShaderColours(colour, emissive, opacity)
		const elementInfo = {
			
			// Appearance
			name, colour, emissive, opacity, categories, ...shaderColours, visible,
			
			// Dropper
			precise, floor, hidden, pour,
			
			// Debug
			source, constructorCode, behaveCode: behaveMaker.toString(), instructions,
			
			// Behaviour
			behave, ...otherProperties
			
		}
		
		const element = constructor
		element.o= elementInfo
		
		for (const childName in element.elements) {
			const child = element.elements[childName]
			element[child.name] = child
		}
		
		return element
		
	}
	
	
	//=========//
	// Private //
	//=========//
	const makeShaderColours = (colour, emissive, opacity) => {
		const colourColour = new THREE.Color(colour)
		const emissiveColour = new THREE.Color(emissive)
		
		const shaderColour = {
			r: colourColour.r * 255,
			g: colourColour.g * 255,
			b: colourColour.b * 255,
		}
		
		const shaderOpacity = opacity * 255
		const shaderEmissive = {
			r: emissiveColour.r * 255,
			g: emissiveColour.g * 255,
			b: emissiveColour.b * 255,
		}
		
		return {shaderColour, shaderEmissive, shaderOpacity}
		
	}
	
}
