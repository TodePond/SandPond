//========//
// Symbol //
//========//
const SYMBOL = {}
{

	SYMBOL.make = (name, {givens = [], votes = [], checks = [], selects = [], changes = [], keeps = []} = {}) => {
		return {name, givens, votes, checks, selects, changes, keeps}
	}
	
}

