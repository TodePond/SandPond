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
	ATOM.make = (element, args) => {
		const atom = {element, ...element.data, ...args}
		return atom
	}
	
	
}