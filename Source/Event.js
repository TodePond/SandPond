//=============//
// InputOutput //
//=============//
const EVENT = {}

{
	
	EVENT.makeInput = ({givens = [], votes = [], checks = []} = {}) => {
		return {givens, votes, checks}
	}
	
	EVENT.makeOutput = ({changes = []} = {}) => {
		return {changes}
	}
	
	EVENT.makeTestFunc = (input) => {
	
		const votes = input.votes
		const givens = input.givens
		
		return (...args) => {
		
			// Votes
			let voteCount = 0
			if (votes.length > 0) votes.forEach(vote => {
				if (vote(...args)) voteCount++
			})
			
			// Givens
			if (givens.length <= 0) return {voteCount}
			const givenSuccess = givens.every(given => given(...args))
			return {givenSuccess, voteCount}
			
		}
	}
	
	EVENT.makeChangeFunc = (output) => {
	
		const changes = output.changes
	
		if (changes.length <= 0) return () => {}
		else if (changes.length == 1) return changes[0]
		else return (...args) => {
		
			for (let i = 0; i < changes.length; i++) {
				const change = changes[i]
				args.atom = change(...args)
			}
			
			return args.atom
		}
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

