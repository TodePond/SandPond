//============//
// Javascript //
//============//
const JAVASCRIPT = {}

{
	// Javascript Job Description
	//===========================
	// "I generate Javascript for an element's 'behave' function."

	//========//
	// Public //
	//========//
	JAVASCRIPT.makeBehave = (instructions, name) => {
		if (name == "Sand") return () => {
			
			const behave = (self, origin) => {
				const sites = origin.sites
				const spaceBelow = sites[17]
				const elementBelow = spaceBelow.atom.element
				if (elementBelow == Empty || elementBelow == Water) {
					SPACE.setAtom(origin, spaceBelow.atom, elementBelow)
					SPACE.setAtom(spaceBelow, self, Sand)
					return
				}
				const rando = Math.trunc(Math.random() * 4)
				const slideSite = sites[symms[rando]]
				const slideElement = slideSite.atom.element
				if (slideElement == Empty || slideElement == Water) {
					SPACE.setAtom(origin, slideSite.atom, slideElement)
					SPACE.setAtom(slideSite, self, Sand)
				}
			}
			
			const symms = [
				EVENTWINDOW.getSiteNumber(1, -1, 0),
				EVENTWINDOW.getSiteNumber(-1, -1, 0),
				EVENTWINDOW.getSiteNumber(0, -1, 1),
				EVENTWINDOW.getSiteNumber(0, -1, -1),
			]
			
			return behave
			
		}
		else if (name == "Water") return () => {
			
			const behave = (self, origin) => {
				const sites = origin.sites
				const spaceBelow = sites[17]
				if (spaceBelow.atom.element == Void) return
				if (spaceBelow.atom.element == Empty) {
					SPACE.setAtom(origin, spaceBelow.atom, Empty)
					SPACE.setAtom(spaceBelow, self, Water)
					return
				}
				const rando = Math.trunc(Math.random() * 4)
				const slideSite = sites[symms[rando]]
				if (slideSite.atom.element == Empty) {
					SPACE.setAtom(origin, slideSite.atom, Empty)
					SPACE.setAtom(slideSite, self, Water)
				}
			}
			
			const symms = [
				EVENTWINDOW.getSiteNumber(1, 0, 0),
				EVENTWINDOW.getSiteNumber(-1, 0, 0),
				EVENTWINDOW.getSiteNumber(0, 0, 1),
				EVENTWINDOW.getSiteNumber(0, 0, -1),
			]
			
			return behave
			
		}
		else if (name == "Wall") return () => {
			
			const behave = (self, origin) => {
				const sites = origin.sites
				const spaceBelow = sites[17]
				if (spaceBelow.atom.element == Empty) {
					SPACE.setAtom(origin, spaceBelow.atom, Empty)
					SPACE.setAtom(spaceBelow, self, Wall)
					return
				}
			}
			return behave
		}
		else if (name == "Fire") return () => {
			
			const behave = (self, origin) => {
				const sites = origin.sites
				const spaceAbove = sites[7]
				if (spaceAbove.atom.element == Empty) {
					SPACE.setAtom(origin, spaceAbove.atom, Empty)
					if (Math.random() < 0.8) SPACE.setAtom(spaceAbove, self, Fire)
					return
				}
				if (spaceAbove.atom.element != Fire) SPACE.setAtom(origin, new Empty(), Empty)
			}
			
			return behave
			
		}
		else if (name == "Tracker") return () => {
			const behave = (self, origin) => {
				const rando = Math.trunc(Math.random() * 6)
				const site = origin.sites[symms[rando]]
				if (site.atom.element == Empty) {
					SPACE.setAtom(site, self, Tracker)
				}
			}
			
			const symms = [
				EVENTWINDOW.getSiteNumber(1, 0, 0),
				EVENTWINDOW.getSiteNumber(-1, 0, 0),
				EVENTWINDOW.getSiteNumber(0, 1, 0),
				EVENTWINDOW.getSiteNumber(0, -1, 0),
				EVENTWINDOW.getSiteNumber(0, 0, 1),
				EVENTWINDOW.getSiteNumber(0, 0, -1),
			]
			
			return behave
		}
		else if (name == "Trailer") return () => {
			const behave = (self, origin) => {
				const rando = Math.trunc(Math.random() * 6)
				const site = origin.sites[symms[rando]]
				if (site.atom.element == Empty) {
					SPACE.setAtom(origin, new Trail(), Trail)
					SPACE.setAtom(site, self, Empty)
				}
			}
			
			const symms = [
				EVENTWINDOW.getSiteNumber(1, 0, 0),
				EVENTWINDOW.getSiteNumber(-1, 0, 0),
				EVENTWINDOW.getSiteNumber(0, 1, 0),
				EVENTWINDOW.getSiteNumber(0, -1, 0),
				EVENTWINDOW.getSiteNumber(0, 0, 1),
				EVENTWINDOW.getSiteNumber(0, 0, -1),
			]
			
			return behave
		}
		else if (name == "Forkbomb") return () => {
			const behave = (self, origin) => {
				const rando = Math.floor(Math.random() * 6)
				const symm = symms[rando]
				const sites = origin.sites
				const site = sites[symm]
				if (site.element === Empty) {
					SPACE.setAtom(site, new Forkbomb(), Forkbomb)
				}
			}
			
			const symms = [
				13,
				11,
				7,
				17,
				32,
				37,
			]

			/*const symms = [
				(sites) => {
					const site = sites[13]
					if (site.element === Empty) {
						SPACE.setAtom(site, new Forkbomb(), Forkbomb)
					}
				},
				(sites) => {
					const site = sites[11]
					if (site.element === Empty) {
						SPACE.setAtom(site, new Forkbomb(), Forkbomb)
					}
				},
				(sites) => {
					const site = sites[7]
					if (site.element === Empty) {
						SPACE.setAtom(site, new Forkbomb(), Forkbomb)
					}
				},
				(sites) => {
					const site = sites[17]
					if (site.element === Empty) {
						SPACE.setAtom(site, new Forkbomb(), Forkbomb)
					}
				},
				(sites) => {
					const site = sites[32]
					if (site.element === Empty) {
						SPACE.setAtom(site, new Forkbomb(), Forkbomb)
					}
				},
				(sites) => {
					const site = sites[37]
					if (site.element === Empty) {
						SPACE.setAtom(site, new Forkbomb(), Forkbomb)
					}
				}
			]*/			
			return behave
		}
		else if (name == "Res") return () => {
			const behave = (self, origin) => {
				const rando = Math.trunc(Math.random() * 6)
				const site = origin.sites[symms[rando]]
				const atom = site.atom
				if (atom.element == Empty) {
					SPACE.setAtom(origin, atom, Empty)
					SPACE.setAtom(site, self, Res)
				}
			}
			
			const symms = [
				EVENTWINDOW.getSiteNumber(1, 0, 0),
				EVENTWINDOW.getSiteNumber(-1, 0, 0),
				EVENTWINDOW.getSiteNumber(0, 1, 0),
				EVENTWINDOW.getSiteNumber(0, -1, 0),
				EVENTWINDOW.getSiteNumber(0, 0, 1),
				EVENTWINDOW.getSiteNumber(0, 0, -1),
			]
			
			return behave
		}
		else return () => () => {}
	}
	
	show = (element) => {
		
		print(element.name)
		
		for (const instruction of element.instructions) {
		
			print(instruction)
			//print(instruction.type.toDescription())
			
			if (instruction.type == INSTRUCTION.TYPE.DIAGRAM) {
				for (const space of instruction.value) {
					const sn = EVENTWINDOW.getSiteNumber(space.x, space.y, 0)
					//print(space)
				}
			}
			
			if (instruction.type == INSTRUCTION.TYPE.MIMIC) {
				//print(instruction.value)
			}
		}
	}
	
	JAVASCRIPT.makeConstructor = (name, data, args) => {
	
		let closureArgNames = ``
		let constructorArgNames = ``
		let propertyNames = ``
	
		for (const argName in data) {
			if (closureArgNames.length == 0) {
				closureArgNames += `${argName}Default`
				propertyNames += `${argName}: ${argName}Default`
			}
			else {
				closureArgNames += `, ${argName}Default`
				propertyNames += `, ${argName}: ${argName}Default`
			}
		}
		
		for (const argName in args) {
			if (closureArgNames.length == 0) {
				closureArgNames += `${argName}Default`
			}
			else {
				closureArgNames += `, ${argName}Default`
			}
			if (constructorArgNames.length == 0) {
				constructorArgNames += `${argName} = ${argName}Default`
				propertyNames += `, ${argName}: ${argName}`
			}
			else {
				constructorArgNames += `, ${argName} = ${argName}Default`
				propertyNames += `, ${argName}: ${argName}`
			}
		}
	
		return (`(${closureArgNames}) => {\n` +
		`\n`+
		`const element = function ${name}(${constructorArgNames}) {\n`+
		`	const atom = {element, visible: element.visible, colour: element.shaderColour, emissive: element.shaderEmissive, opacity: element.shaderOpacity, ${propertyNames}}\n`+
		`	return atom\n`+
		`}\n`+
		`	return element\n`+
		`}`)
	}
	
	//=========//
	// Private //
	//=========//
	const indentInnerCode = (code) => {
		const lines = code.split("\n")
		const indentedLines = lines.map((line, i) => (i == 0 || i >= lines.length-2)? line : `	${line}`)
		const indentedCode = indentedLines.join("\n")
		return indentedCode
	}
	
	const ALPHABET = "abcdefghijklmnopqrstuvwxyz"
	
	const getParams = (func) => {
		const code = func.as(String)
		const params = []
		let buffer = ""
		for (let i = 0; i < code.length; i++) {
			const char = code[i]
			if ((char == "(" || char == "{" || char == " " || char == "	") && buffer == "") continue
			
			if (char.match(/[a-zA-Z0-9]/)) buffer += char
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
	
}


