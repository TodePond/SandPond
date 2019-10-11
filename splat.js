//=======//
// Splat //
//=======//
{

	//===========//
	// Constants //
	//===========//
	const BUTTON_OPACITY = 1.0
	const BUTTON_OPACITY_HOVER = 1.0
	
	const SPACE_SIZE = 55
	const SPACE_PADDING = 2
	const SPACE_SIZE_TOTAL = SPACE_SIZE + SPACE_PADDING * 2

	//=========//
	// Globals //
	//=========//
	selectedAtom = "Sand"
	
	//=================//
	// Making Elements //
	//=================//
	const makeSplat = () => {
		const style = `
			position: absolute;
			background-color: rgba(0, 0, 128, 0.0);
			top: 0%;
			left: 0%;
			/*transform: translateX(-50%);*/
			/*visibility: hidden;*/
		`
		
		const splat = HTML `
			<div id="splat" style="${style}"></div>
		`
		
		const topMenu = makeTopMenu()
		splat.appendChild(topMenu)
		
		const rules = makeRules()
		splat.appendChild(rules)
		
		return splat
	}
	
	const makeTopMenu = () => {
		const style = `
			/*border-right: 4px solid rgba(0, 0, 0, 0.2);*/
			/*background-color: rgba(0, 0, 0, 0.1);*/
			vertical-align: top;
			height: 100vh;
			display: inline-block;
		`
		const topMenu = HTML `
			<div id="topMenu" style="${style}"></div>
		`
		
		for (const atomType of atomTypes) {
			if (atomType.hidden) continue
			const button = makeMenuButton(atomType.name, atomType.colour)
			topMenu.appendChild(button)
		}
		
		
		return topMenu
	}
	
	const makeMenuButton = (name, colour) => {
		const style = `
			height: 40px;
			width: 40px;
			background-color: ${colour};
			opacity: ${BUTTON_OPACITY};
			display: block;
			margin: 10px;
		`
		const menuButton = HTML `
			<div class="menuButton" id="${name}" style="${style}"></div>
		`
		return menuButton
	}
	
	const makeRules = () => {
	
		const style = `
			margin-bottom: 20px;
			vertical-align: top;
			display: inline-block;
		`
		const html = HTML `
			<div id="rules" style="${style}"></div>
		`
		
		const atomType = $AtomType(selectedAtom)
		if (!atomType) return HTML `<div id="rules"></div>`
		const atomRules = atomType.rules
		for (const rule of atomRules) {
			const ruleElement = makeRule(rule)
			html.appendChild(ruleElement)
		}
		return html
	}
	
	const makeRule = (rule) => {
		const style = `
			margin-right: 40px;
			margin-left: 40px;
			margin-top: 20px;
			margin-bottom: 20px;
		`
		const html = HTML `
			<div class="rule" style="${style}"></div>
		`
		
		const axes = makeAxes(rule.axes)
		html.appendChild(axes)
		
		const input = makeSide(rule.rawSpaces, "input")
		html.appendChild(input)
		
		const arrow = makeArrow()
		html.appendChild(arrow)
		
		const output = makeSide(rule.rawSpaces, "output")
		html.appendChild(output)
		
		return html
	}
	
	const makeAxes = (axes = {}) => {
		const style = `
			font-family: UbuntuMono;
			font-weight: boldest;
			font-size: 300%;
			display: inline-block;
			left: -30px;
			position: relative;
			opacity: 0.8;
		`
		let text = ""
		if (axes.y) text += "&#8597;<br>"
		if (axes.x) text += "&#8596;"
		const html = HTML `
			<div class="axes" style="${style}">${text}</div>
		`
		return html
	}
	
	const makeSide = (side, type) => {
		const style = `
			display: inline-block;
			margin: 10px;
			vertical-align: middle;
			position: relative
		`
		const html = HTML `
			<div class="side" style="${style}"></div>
		`
		
		let xMin = 0
		let yMin = 0
		
		let xMax = 0
		let yMax = 0
		
		for (const space of side) {
			if (space.y != undefined && space.y < yMin) yMin = space.y
			if (space.y != undefined && space.y > yMax) yMax = space.y
			if (space.x != undefined && space.x < xMin) xMin = space.x
			if (space.x != undefined && space.x > xMax) xMax = space.x
			const spaceElement = makeSpace(space, type)
			html.appendChild(spaceElement)
		}
		
		const xDiff = xMax - xMin
		const yDiff = yMax - yMin
		
		html.style.width = `${xDiff * SPACE_SIZE_TOTAL}px`
		html.style.height = `${yDiff * SPACE_SIZE_TOTAL}px`
		
		return html
	}
	
	const makeSpace = (space, type) => {
		
		const colour = space[type].key.match(
			"@", o=> $AtomType(selectedAtom).colour,
			"_", "lightgrey",
			"W", "lightblue",
			Any, "grey",
		)
		
		const spaceY = space.y || 0
		const spaceX = space.x || 0
		
		let y = -(SPACE_SIZE_TOTAL/2) - spaceY * SPACE_SIZE_TOTAL
		let x = -(SPACE_SIZE_TOTAL/2) + spaceX * SPACE_SIZE_TOTAL
		
		const style = `
			background-color: ${colour};
			padding: ${SPACE_PADDING}px;
			font-family: UbuntuMono;
			width: ${SPACE_SIZE}px;
			height: ${SPACE_SIZE}px;
			font-size: ${SPACE_SIZE * 4/5}px;
			opacity: 0.8;
			position: absolute;
			transform: translate(${x}px, ${y}px);
		`
		const html = HTML `
			<div class="space" style="${style}">${space[type].key}</div>
		`
		return html
	}
	
	const makeArrow = () => {
		const style = `
			display: inline-block;
			font-family: UbuntuMono;
			/*font-weight: bold;*/
			font-size: 50px;
			margin: 50px;
			color: black;
			vertical-align: middle;
			opacity: 0.8;
		`
		const html = HTML `
			<div style="${style}">&#129094;</div>
		`
		return html
	}
	
	//====================//
	// Updating and Stuff //
	//====================//
	const updateOutline = () => {
		$("#" + selectedAtom).style.outline = "2px solid black"
	}
	
	const removeRules = () => {
		$("#rules").remove()
	}
	
	const updateRules = () => {
		removeRules()
		const rules = makeRules()
		$("#splat").appendChild(rules)
		if (splatHidden) hideSplat()
		updateOutline()
	}
	
	//=======//
	// Setup //
	//=======//
	const splatElement = makeSplat()
	document.body.appendChild(splatElement)
	updateRules()
	hideSplat()
	
	//========//
	// Events //
	//========//
	$$(".menuButton").on.mouseover(e => {
		e.target.style.opacity = BUTTON_OPACITY_HOVER
		if ($("#" + selectedAtom) == e.target) return
		e.target.style.outline = `2px solid ${$AtomType(e.target.id).colour}`
	})
	
	$$(".menuButton").on.mouseout(e => {
		e.target.style.opacity = BUTTON_OPACITY
		e.target.style.outline = ""
		updateOutline()
	})
	
	$$(".menuButton").on.mousedown(e => {
		if (selectedAtom) {
			$("#" + selectedAtom).style.outline = ""
		}
		selectedAtom = e.target.id
		e.target.style.outline = "2px solid black"
		updateRules()
	})
	
	//==================//
	// Public Functions //
	//==================//
	function showSplat() {
		$("#rules").style.visibility = "visible"
	}
	
	function hideSplat() {
		$("#rules").style.visibility = "hidden"
	}
}

