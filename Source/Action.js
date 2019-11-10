//=======//
// Event //
//=======//
{
	
	function makeInput(character, test, extender) {
		if (extender) return {test: (...args) => extender.test(...args) && test(...args)}
		else return {test}
	}
	
	function makeOutput(character, instruction) {
		return {instruction}
	}
	
}

