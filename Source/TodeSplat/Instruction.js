//=============//
// Instruction //
//=============//
const INSTRUCTION = {}
const POV = {}

INSTRUCTION.TYPE = {
	//BLOCK_START: Symbol("BlockStart"),
	BLOCK_END: Symbol("EndBlock"),
	DIAGRAM: Symbol("Diagram"),
	ANY: Symbol("AnyBlock"),
	FOR: Symbol("ForBlock"),
	MAYBE: Symbol("MaybeBlock"),
	ACTION: Symbol("ActionBlock"),
	MIMIC: Symbol("Mimic"),
	POV: Symbol("PointOfView"),
}

POV.TYPE = {
	FRONT: Symbol("Front"),
	BACK: Symbol("Back"),
	RIGHT: Symbol("Side"),
	LEFT: Symbol("Right"),
	BOTTOM: Symbol("Bottom"),
	TOP: Symbol("Top"),
}


