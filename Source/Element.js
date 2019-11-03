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
	ELEMENT.globalElements = {}
	
	ELEMENT.make = ({...args}) => {
		//todo
	}
	
	//===========//
	// Functions //
	//===========//
	const atomTypesKey = {}
	AtomType = class AtomType {
		constructor({name, colour, emissive, rules = [], key, state, scene, opacity = 1.0, precise, floor, hidden, properties, pour=true, ...args}) {
			this.name = name
			this.rules = rules
			this.colour = colour
			this.emissive = emissive
			this.key = key
			this.state = state
			this.scene = scene
			this.opacity = opacity
			this.precise = precise
			this.floor = floor
			this.hidden = hidden
			this.properties = properties
			this.pour = pour
			for (const propertyName in args) {
				this[propertyName] = args[propertyName]
			}
			ELEMENT.globalElements[name] = this
			atomTypesKey[key] = this
			this.ruleCount = this.rules.length
			this.createShaderColours()
		}
		
		createShaderColours() {
			const colourColour = new THREE.Color(this.colour)
			const emissiveColour = new THREE.Color(this.emissive)
			
			this.shaderColour = {
				r: colourColour.r * 255,
				g: colourColour.g * 255,
				b: colourColour.b * 255,
			}
			
			this.shaderOpacity = this.opacity * 255
			
			this.shaderEmissive = {
				r: emissiveColour.r * 255,
				g: emissiveColour.g * 255,
				b: emissiveColour.b * 255,
			}
		}
	}
	
	function $AtomTypeKey(key) {
		return atomTypesKey[key]
	}
	
}

