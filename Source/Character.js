//===========//
// Character //
//===========//
const CHARACTER = {}

{

	CHARACTER.make = (name, {givens = [], votes = [], checks = [], selects = [], changes = [], keeps = []} = {}) => {
		return {name, givens, votes, checks, selects, changes, keeps}
	}
	
}

