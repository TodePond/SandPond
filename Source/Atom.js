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
	// Not really used
	ATOM.make = (element, args) => {
		return {element, ...element.data, ...args}
	}
	
	
}