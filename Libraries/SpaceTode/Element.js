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
	ELEMENT.make = ({name, instructions = [], data = {}, args = {}, categories = [], elements = []}, {
		colour = "grey", emissive = colour, opacity = 1.0, visible = true, source = "",
		hidden = false, pour = true,
		...otherProperties
	} = {}) => {
	
		const behaveCode = JAVASCRIPT.makeBehaveCode(instructions, name)
		const behaveMaker = new Function(behaveCode)
		const behave = behaveMaker()
		//print(otherScopeProperties)
		const constructorCode = JAVASCRIPT.makeConstructorCode(name, data, args)
		const element = JS(constructorCode)(...data, ...args)
		
		const shaderColours = makeShaderColours(colour, emissive, opacity)
		element.o={
			
			// Scope
			elements, data, args,
			
			// Appearance
			name, colour, emissive, opacity, categories, ...shaderColours, visible,
			
			// Dropper
			hidden, pour,
			
			// Debug
			source, constructorCode, behaveCode, instructions,
			
			// Behaviour
			behave, ...otherProperties
			
		}
		
		for (const child of element.elements) {
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
