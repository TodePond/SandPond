//=============//
// InputOutput //
//=============//
const EVENT = {}

{
	
	EVENT.makeInput = ({givens = [], votes = [], checks = [], selects = []} = {}) => {
		return {givens, votes, checks, selects}
	}
	
	EVENT.makeOutput = ({changes = []} = {}) => {
		return {changes}
	}
	
	EVENT.makeSelectFunc = (input) => {
		const selects = input.selects
		if (selects.length == 0) return undefined
		if (selects.length == 1) return selects[0]
		if (selects.length > 1) throw new Error("[TodeSplat] Multiple selects not implemented yet")
	}
	
	EVENT.makeVoteFunc = (input) => {
		const votes = input.votes
		if (votes.length == 0) return undefined
		if (votes.length == 1) return votes[0]
		if (votes.length > 1) throw new Error("[TodeSplat] Multiple votes not implemented yet")
	}
	
	EVENT.makeGivenFunc = (input) => {
		const givens = input.givens
		if (givens.length == 0) return undefined
		if (givens.length == 1) return givens[0]		
		if (givens.length >  1) return (args) => givens.every(given => given(args))
	}
	
	EVENT.makeChangeFunc = (output) => {
	
		const changes = output.changes
	
		if (changes.length <= 0) return () => {}
		if (changes.length == 1) return (args) => {
			const atom = changes[0](args)
			SPACE.setAtom(args.space, atom)
		}
		if (changes.length > 1) throw new Error("[TodeSplat] Multiple 'change's not supported yet")
	}
	
	// Old
	//=================
	function makeInput(character, test, extender) {
		if (extender) return (...args) => extender(...args) && test(...args)
		else return test
	}
	
	function makeOutput(character, instruction) {
		return instruction
	}
	
}

