//===========//
// Character //
//===========//
const CHARACTER = {}

{

	CHARACTER.make = (name, {givens = [], votes = [], checks = [], selects = [], changes = [], keeps = []} = {}) => {
		return {name, givens, votes, checks, selects, changes, keeps, inputFunc: undefined, outputFunc: undefined}
	}
	
	CHARACTER.createInputFunc = (character) => {
		if (character.inputFunc) return character.inputFunc
		const inputFunc = makeInputFunc(character)
		character.inputFunc = inputFunc
		return inputFunc
	}
	
	CHARACTER.createOutputFunc = (character) => {
		if (character.outputFunc) return character.outputFunc
		const outputFunc = makeOutputFunc(character)
		character.outputFunc = outputFunc
		return outputFunc
	}
	
	const eatParams = (code) => {
		const params = []
		let buffer = ""
		for (let i = 0; i < code.length; i++) {
			const char = code[i]
			if ((char == "(" || char == "{" || char == " " || char == "	") && buffer == "") continue
			
			if (char.match(/[a-zA-Z]/)) buffer += char
			else if (char == " " || char == "," || char == "	" || char == "}" || char == ")") {
				if (buffer != "") {
					params.push(buffer)
					buffer = ""
				}
			}
			else throw new Error(`[TodeSplat] Unexpected character in named parameters: '${char}'`)
			
			if (char == "}" || char == ")") break
		}
		return params
	}
	
	const makeInputFunc = (character) => {
		
		let returnCode = "return true"
		
		const givenFunc = makeGivenFunc(character)
		let givenCode = ""
		const givenParams = []
		if (typeof givenFunc == "function") {
			givenParams.push(...eatParams(givenFunc.as(String)))
			givenCode = `if (!givenFunc(${givenParams.join(",")})) return false`
		}
		else if (givenFunc !== undefined && givenFunc.as(Boolean) === false) givenCode = `return false`
		
		const selectFunc = makeSelectFunc(character)
		const selectParams = []
		let selectCode = ""
		if (typeof selectFunc == "function") {
			selectParams.push(...eatParams(selectFunc.as(String)))
			selectCode = `
				const selected = selectFunc(${selectParams.join(",")})
				selects["${character.name}"] = selected
			`
		}
		
		const voteFunc = makeVoteFunc(character)
		const voteCode = voteFunc? `
			const voteResult = voteFunc(args)
			if (voteResult) args.votes++
		` : ""
		
		const inputParams = [...givenParams]
		const spaceCode = inputParams.includes("space") || inputParams.includes("atom") || inputParams.includes("element")? `
			const space = sites[event.siteNumber]
		` : ""
		
		const atomCode = inputParams.includes("atom") || inputParams.includes("element")? `
			const atom = space? space.atom : undefined
		` : ""
		
		const elementCode = inputParams.includes("element")? `
			const element = atom? atom.element : undefined
		` : ""
		
		const inputFuncMaker = new Function("givenFunc", "voteFunc", "selectFunc", `return (event, sites, self, selects) => {
			${spaceCode}\
			${atomCode}\
			${elementCode}\
			${givenCode}\
			${selectCode}\
			${voteCode}
			${returnCode}
		}`)
		
		const inputFunc = inputFuncMaker(givenFunc, voteFunc, selectFunc)
		return inputFunc
		
	}
	
	const makeOutputFunc = (character) => {
		
		const changeFunc = makeChangeFunc(character)
		const changeParams = []
		let changeCode = ""
		if (typeof changeFunc == "function") {
			changeParams.push(...eatParams(changeFunc.as(String)))
			if (!changeParams.includes("space")) changeParams.push("space")
			changeCode = `
				const atom = changeFunc(${changeParams.join(",")})
				SPACE.setAtom(space, atom)
			`
		}
		
		const keepFunc = makeKeepFunc(character)
		
		const inputParams = [...changeParams]
		const spaceCode = inputParams.includes("space")? `
			const space = sites[event.siteNumber]
		` : ""
		
		const atomCode = inputParams.includes("atom")? `
			${spaceCode == ""? "const space = sites[event.siteNumber]" : ""}
			const atom = space? space.atom : undefined
		` : ""
		
		const selectCode = inputParams.includes("selected")? `
			const selected = selection["${character.name}"]
		` : ""
		
		const outputFuncMaker = new Function("changeFunc", "keepFunc", `return (event, sites, self, selection) => {
			${selectCode}\
			${spaceCode}\
			${atomCode}\
			${changeCode}\
			${keepFunc? "keepFunc()" : ""}
		}`)
		
		const outputFunc = outputFuncMaker(changeFunc, keepFunc)
		return outputFunc
	}
	
	const makeVoteFunc = (character) => {
		const votes = character.votes
		if (votes.length == 0) return undefined
		if (votes.length == 1) return votes[0]
		if (votes.length > 1) throw new Error("[TodeSplat] Multiple votes not implemented yet")
	}
	
	const makeCheckFunction = (character) => {
		const checks = character.selects
		if (checks.length == 0) return undefined
		if (checks.length == 1) return checks[0]
		if (checks.length > 1) throw new Error("[TodeSplat] Multiple checks not implemented yet")
	}
	
	const makeSelectFunc = (character) => {
		const selects = character.selects
		if (selects.length == 0) return undefined
		if (selects.length == 1) return selects[0]
		if (selects.length > 1) throw new Error("[TodeSplat] Multiple selects not implemented yet")
	}

	const makeGivenFunc = (character) => {
		const givens = character.givens
		if (givens.length == 0) return undefined
		if (givens.length == 1) return givens[0]
		if (givens.length > 1) {
			
			const allParams = givens.map(given => eatParams(given.as(String)))
			const paramSet = new Set()
			const params = []
			
			allParams.forEach(params => params.forEach(param => paramSet.add(param)))
			paramSet.forEach(param => params.push(param))
			
			const givensLines = givens.map((g, i) => `if (!givens[${i}](${allParams[i]})) return false`)
			const givensCode = givensLines.join("\n")
			
			const givenFuncMaker = JS `(givens) => (${params.join(",")}) => {
				${givensCode}
				return true
			}`
			
			const givenFunc = givenFuncMaker(givens)
			return givenFunc
		}
	}

	const makeChangeFunc = (character) => {
		const changes = character.changes
		if (changes.length <= 0) return undefined
		if (changes.length == 1) return changes[0]
		if (changes.length > 1) throw new Error("[TodeSplat] Multiple changes not supported yet")
	}

	const makeKeepFunc = (character) => {
		const keeps = character.keeps
		if (keeps.length <= 0) return undefined
		if (keeps.length == 1) return keeps[0]
		if (keeps.length > 1) throw new Error("[TodeSplat] Multiple keeps not supported yet")
	}
	
}
