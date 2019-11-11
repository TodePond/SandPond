//========//
// Action //
//========//
{
	
	function makeInput(character, test, extender) {
		if (extender) return (...args) => extender(...args) && test(...args)
		else return test
	}
	
	function makeOutput(character, instruction) {
		return instruction
	}
	
}

