//======//
// Atom //
//======//
const ATOM = {}

{

	// Atom Job Description
	//=====================
	// "I keep my ELEMENT and DATA."
	
	//========//
	// Public //
	//========//
	ATOM.make = (type, args) => {
		const atom = {type, ...type.data, ...args}
		return atom
	}
	
	
}