//======//
// Atom //
//======//
const Atom = {}

{

	// Atom Job Description
	//=====================
	// "I keep my ELEMENT and DATA."
	
	//========//
	// Public //
	//========//
	Atom.make = (type, args) => {
		const atom = {type, ...type.properties, ...args}
		return atom
	}
	
	
}