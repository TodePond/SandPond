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
				const elementBelow = spaceBelow.element
				if (elementBelow == Empty) {
					const atomBelow = spaceBelow.atom
					SPACE.setAtom(origin, atomBelow, elementBelow)
					SPACE.setAtom(spaceBelow, self, Sand)
					atomBelow.track = !currentTrack
					return
				}
				const rando = Math.trunc(Math.random() * 4)
				const slideSite = sites[symms[rando]]
				const slideAtom = slideSite.atom
				const slideElement = slideAtom.element
				if (slideElement == Empty || slideElement == Water || slideElement == Steam) {
					SPACE.setAtom(origin, slideAtom, slideElement)
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
				const elementBelow = spaceBelow.atom.element
				if (elementBelow == Void) return
				if (elementBelow == Empty || elementBelow == Steam) {
					SPACE.setAtom(origin, spaceBelow.atom, elementBelow)
					SPACE.setAtom(spaceBelow, self, Water)
					return
				}
				if (elementBelow == Fire) {
					SPACE.setAtom(spaceBelow, new Empty(), Empty)
					SPACE.setAtom(origin, new Steam(), Steam)
				}
				const rando = Math.trunc(Math.random() * 4)
				const slideSite = sites[symms[rando]]
				const slideElement = slideSite.atom.element
				if (slideElement == Empty) {
					SPACE.setAtom(origin, slideSite.atom, Empty)
					SPACE.setAtom(slideSite, self, Water)
				}
				else if (slideElement == Fire) {
					SPACE.setAtom(origin, new Steam(), Steam)
					SPACE.setAtom(slideSite, new Empty(), Empty)
				}
				else if (slideElement == Lava) {
					SPACE.setAtom(origin, new Steam(), Steam)
					SPACE.setAtom(slideSite, new Stone(), Stone)
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
		else if (name == "Slime") return () => {
			
			const behave = (self, origin) => {
				const sites = origin.sites
				const spaceBelow = sites[17]
				if (spaceBelow.atom.element == Void) return
				if (spaceBelow.atom.element == Empty || spaceBelow.element == Water  || spaceBelow.element == Steam) {
					SPACE.setAtom(origin, spaceBelow.atom, spaceBelow.element)
					SPACE.setAtom(spaceBelow, self, self.element)
					return
				}
				if (Math.random() < 0.9) return
				const rando = Math.trunc(Math.random() * 4)
				const slideSite = sites[symms[rando]]
				if (slideSite.atom.element == Empty) {
					SPACE.setAtom(origin, slideSite.atom, Empty)
					SPACE.setAtom(slideSite, self, self.element)
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
		else if (name == "Lava") return () => {
			
			const behave = (self, origin) => {
				const sites = origin.sites
				const siteAbove = sites[siteNumAbove]
				if (siteAbove.element == Empty) {
					SPACE.setAtom(siteAbove, new Fire(), Fire)
				}
				const spaceBelow = sites[17]
				const belowElement = spaceBelow.atom.element
				if (belowElement == Void) return
				if (belowElement == Empty || belowElement == Steam) {
					SPACE.setAtom(origin, spaceBelow.atom, spaceBelow.element)
					SPACE.setAtom(spaceBelow, self, self.element)
					return
				}
				else if (belowElement == Water) {
					SPACE.setAtom(origin, new Stone(), Stone)
					SPACE.setAtom(spaceBelow, new Steam(), Steam)
				}
				if (Math.random() < 0.9) return
				const rando = Math.trunc(Math.random() * 4)
				const slideSite = sites[symms[rando]]
				const slideElement = slideSite.atom.element
				if (slideElement == Empty) {
					SPACE.setAtom(origin, slideSite.atom, Empty)
					SPACE.setAtom(slideSite, self, self.element)
				}
				else if (slideElement == Water) {
					SPACE.setAtom(origin, new Stone(), Stone)
					SPACE.setAtom(slideSite, new Steam(), Steam)
				}
			}
			
			const symms = [
				EVENTWINDOW.getSiteNumber(1, 0, 0),
				EVENTWINDOW.getSiteNumber(-1, 0, 0),
				EVENTWINDOW.getSiteNumber(0, 0, 1),
				EVENTWINDOW.getSiteNumber(0, 0, -1),
			]
			
			const siteNumAbove = EVENTWINDOW.getSiteNumber(0, 1, 0)
			
			return behave
			
		}
		else if (name == "StickyStone") return () => {
			
			const behave = (self, origin) => {
				const sites = origin.sites
				const spaceBelow = sites[17]
				const elementBelow = spaceBelow.element
				const selfStuck = self.stuck
				for (let i = 0; i < 6; i++) {
					const site = sites[symms[i]]
					if (site.element == StickyStone) {
						if (selfStuck === true) site.atom.stuck = true
						if (site.atom.stuck === true) self.stuck = true
					}
					
					const site2 = sites[symms2[i]]
					if (site2.element == StickyStone) {
						if (selfStuck === true) site2.atom.stuck = true
						if (site2.atom.stuck === true) {
							const stone = new StickyStone()
							stone.stuck = true
							SPACE.setAtom(site, stone, StickyStone)
							self.stuck = true
						}
					}
				}
				
				for (let i = 0; i < symms3.length; i++) {
					const site = sites[symms3[i]]
					if (site.element == StickyStone) {
						if (selfStuck === true) site.atom.stuck = true
						if (site.atom.stuck === true) self.stuck = true
					}
				}
				
				if (self.stuck) return
				
				if (elementBelow == Empty || elementBelow == Water || elementBelow == Steam) {
					SPACE.setAtom(origin, spaceBelow.atom, spaceBelow.element)
					SPACE.setAtom(spaceBelow, self, self.element)
					return
				}
				self.stuck = true
			}
			
			const symms = [
				EVENTWINDOW.getSiteNumber(1, 0, 0),
				EVENTWINDOW.getSiteNumber(-1, 0, 0),
				EVENTWINDOW.getSiteNumber(0, 1, 0),
				EVENTWINDOW.getSiteNumber(0, -1, 0),
				EVENTWINDOW.getSiteNumber(0, 0, 1),
				EVENTWINDOW.getSiteNumber(0, 0, -1),
			]
			
			const symms2 = [
				EVENTWINDOW.getSiteNumber(2, 0, 0),
				EVENTWINDOW.getSiteNumber(-2, 0, 0),
				EVENTWINDOW.getSiteNumber(0, 2, 0),
				EVENTWINDOW.getSiteNumber(0, -2, 0),
				EVENTWINDOW.getSiteNumber(0, 0, 2),
				EVENTWINDOW.getSiteNumber(0, 0, -2),
			]
			
			const symms3 = [
				EVENTWINDOW.getSiteNumber(1, 1, 0),
				EVENTWINDOW.getSiteNumber(1, -1, 0),
				EVENTWINDOW.getSiteNumber(-1, 1, 0),
				EVENTWINDOW.getSiteNumber(-1, -1, 0),
				EVENTWINDOW.getSiteNumber(0, 1, 1),
				EVENTWINDOW.getSiteNumber(0, 1, -1),
				EVENTWINDOW.getSiteNumber(0, -1, 1),
				EVENTWINDOW.getSiteNumber(0, -1, -1),
				EVENTWINDOW.getSiteNumber(1, 0, 1),
				EVENTWINDOW.getSiteNumber(1, 0, -1),
				EVENTWINDOW.getSiteNumber(-1, 0, -1),
				EVENTWINDOW.getSiteNumber(-1, 0, 1),
			]
			
			return behave
		}
		else if (name == "Stone") return () => {
			
			const behave = (self, origin) => {
				const sites = origin.sites
				const spaceBelow = sites[17]
				const elementBelow = spaceBelow.element
				if (elementBelow == Empty || elementBelow == Water || elementBelow == Steam) {
					SPACE.setAtom(origin, spaceBelow.atom, spaceBelow.element)
					SPACE.setAtom(spaceBelow, self, self.element)
					return
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
		else if (name == "Fire") return () => {
			
			const behave = (self, origin) => {
				const sites = origin.sites
				const spaceAbove = sites[7]
				const elementAbove = spaceAbove.atom.element
				if (elementAbove == Empty) {
					SPACE.setAtom(origin, spaceAbove.atom, Empty)
					if (Math.random() < 0.8) SPACE.setAtom(spaceAbove, self, Fire)
					return
				}
				else if (elementAbove == Water) {
					SPACE.setAtom(spaceAbove, new Steam(), Steam)
					SPACE.setAtom(origin, new Empty(), Empty)
				}
				if (elementAbove != Fire) SPACE.setAtom(origin, new Empty(), Empty)
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
		else if (name == "Steam") return () => {
			const behave = (self, origin) => {
				const sites = origin.sites
				const spaceAbove = sites[7]
				if (spaceAbove.atom.element == Empty) {
					SPACE.setAtom(origin, spaceAbove.atom, Empty)
					SPACE.setAtom(spaceAbove, self, Steam)
					return
				}
				const rando = Math.trunc(Math.random() * 4)
				const slideSite = sites[symms[rando]]
				if (slideSite.atom.element == Empty) {
					SPACE.setAtom(origin, slideSite.atom, Empty)
					SPACE.setAtom(slideSite, self, Steam)
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
		else if (name == "DReg") return () => {
			const behave = (self, origin) => {
				const rando = Math.trunc(Math.random() * 6)
				const site = origin.sites[symms[rando]]
				const element = site.element
				if (element == Empty) {
					if (Math.random() < 1/1000) return SPACE.setAtom(site, new DReg(), DReg)
					if (Math.random() < 1/200) return SPACE.setAtom(site, new Res(), Res)
					
					const atom = site.atom
					SPACE.setAtom(origin, atom, Empty)
					SPACE.setAtom(site, self, self.element)
				}
				else if (element == DReg) {
					if (Math.random() < 1/10) return SPACE.setAtom(site, new Empty(), Empty)
				}
				else if (element != Void) {
					if (Math.random() < 1/100) return SPACE.setAtom(site, new Empty(), Empty)
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


