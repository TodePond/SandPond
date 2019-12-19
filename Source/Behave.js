//=======//
// Event //
//=======//
const BEHAVE = {}

{

	// Behave Job Description
	//=======================
	// "I make an atom BEHAVE in its space."
	
	//========//
	// Public //
	//========//
	BEHAVE.spaceBehave = (space) => {
		const atom = space.atom
		if (!atom) return		
		atom.element.func(atom, space.sites)
	}
	
	//===========//
	// Functions //
	//===========//
	
	
}