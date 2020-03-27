//=============//
// Instruction //
//=============//
const INSTRUCTION = {}

{
	
	INSTRUCTION.TYPE = {
		BLOCK: Symbol("Block"),
		DIAGRAM: Symbol("Diagram"),
		ANY: Symbol("Any"),
		FOR: Symbol("For"),
		MAYBE: Symbol("Maybe"),
		ACTION: Symbol("Action"),
	}
	
	//========//
	// Public //
	//========//	
	INSTRUCTION.make = (type, value) => {
		return {type, ...value}
	}
	
	//=========//
	// Private //
	//=========//
	
	
}


