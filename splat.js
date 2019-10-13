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
		
		const modeMenu = makeModeMenu()
		splat.appendChild(modeMenu)
		
		return splat
	}
	
	const makeModeMenu = () => {
		const style = `
			/*border-right: 4px solid rgba(0, 0, 0, 0.2);*/
			/*background-color: rgba(0, 0, 0, 0.1);*/
			vertical-align: top;
			height: 100vh;
			display: inline-block;
		`
		const modeMenu = HTML `
			<div id="modeMenu" style="${style}"></div>
		`
		
		const menuMenuButton = makeMenuMenuButton("Modes")
		modeMenu.appendChild(menuMenuButton)
		
		const normalButton = makeMenuButton("Normal", "lightgrey")
		normalButton.id = "normalMode"
		normalButton.classList.add("mode")
		modeMenu.appendChild(normalButton)
		
		const smallButton = makeMenuButton("Small", "lightgrey")
		smallButton.id = "smallMode"
		smallButton.classList.add("mode")
		modeMenu.appendChild(smallButton)
		
		const d2Button = makeMenuButton("2D", "lightgrey")
		d2Button.id = "d2Mode"
		d2Button.classList.add("mode")
		modeMenu.appendChild(d2Button)
		
		const smallD2Mode = makeMenuButton("Small2D", "lightgrey")
		smallD2Mode.id = "smallD2Mode"
		smallD2Mode.classList.add("mode")
		modeMenu.appendChild(smallD2Mode)
		
		return modeMenu
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
		
		const menuMenuButton = makeMenuMenuButton("Elements")
		topMenu.appendChild(menuMenuButton)
		
		for (const atomType of atomTypes) {
			if (atomType.hidden) continue
			const button = makeMenuButton(atomType.name, atomType.colour)
			button.classList.add("element")
			topMenu.appendChild(button)
		}
		
		return topMenu
	}
	
	const makeMenuMenuButton = (name) => {
		const style = `
			padding: 7px 5px;
			background-color: black;
			opacity: ${BUTTON_OPACITY};
			display: block;
			margin: 5px;
			font-family: Rosario;
			cursor: default;
			color: white;
			font-size: 16px;
			width: 75px;
		`
		const menuButton = HTML `
			<div class="${name} menuMenuButton menuButton" id="" style="${style}">${name}</div>
		`
		return menuButton
	}
	
	const makeMenuButton = (name, colour) => {
		const style = `
			padding: 7px 5px;
			background-color: ${colour};
			opacity: ${BUTTON_OPACITY};
			display: block;
			margin: 5px;
			font-family: Rosario;
			cursor: default;
			width: 75px;
			font-size: 16px;
			overflow: hidden;
		`
		const menuButton = HTML `
			<div class="menuButton" id="${name}" style="${style}">${name}</div>
		`
		return menuButton
	}
	
	const makeRules = () => {
		const style = `
			position: absolute;
			left: 110px;
			right: 0px;
			top: 25px;
			vertical-align: top;
			font-family: UbuntuMono;
			text-align: left;
			font-size: 25px; 
			cursor: default;
		`
		const atomType = $AtomType(selectedAtom)
		const html = HTML `
			<pre id="rules" style="${style}">${atomType.source}</pre>
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
	$$(".element").on.mouseover(e => {
		e.target.style.opacity = BUTTON_OPACITY_HOVER
		if ($("#" + selectedAtom) == e.target) return
		e.target.style.outline = `2px solid ${$AtomType(e.target.id).colour}`
	})
	
	$$(".element").on.mouseout(e => {
		e.target.style.opacity = BUTTON_OPACITY
		e.target.style.outline = ""
		updateOutline()
	})
	
	$$(".element").on.mousedown(e => {
		if (selectedAtom) {
			$("#" + selectedAtom).style.outline = ""
		}
		selectedAtom = e.target.id
		e.target.style.outline = "2px solid black"
		updateRules()
	})
	
	$$(".menuButton:not(.element)").on.mouseover(e => {
		e.target.style.outline = `2px solid black`
	})
	
	$$(".menuButton:not(.element)").on.mouseout(e => {
		e.target.style.outline = `0px`
	})
	
	let menuOpen = true
	const updateElements = () => {
		if (!menuOpen) $$(".element").forEach(button => button.style.visibility = "hidden")
		else $$(".element").forEach(button => button.style.visibility = "visible")
	}
	updateElements()
	$(".elements").on.mousedown(e => {
		menuOpen = !menuOpen
		updateElements()
	})
	
	let modeMenuOpen = false
	const updateModes = () => {
		if (!modeMenuOpen) $$(".mode").forEach(button => button.style.visibility = "hidden")
		else $$(".mode").forEach(button => button.style.visibility = "visible")
	}
	updateModes()
	$(".Modes").on.mousedown(e => {
		modeMenuOpen = !modeMenuOpen
		updateModes()
	})
	
	$("#smallMode").on.click(e => { 
		const baseUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`
		window.location = `${baseUrl}?small`
	})
	
	$("#normalMode").on.click(e => {
		const baseUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`
		window.location = `${baseUrl}`
	})
	
	$("#d2Mode").on.click(e => {
		const baseUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`
		window.location = `${baseUrl}?2d`
	})
	
	$("#smallD2Mode").on.click(e => {
		const baseUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`
		window.location = `${baseUrl}?2d&small`
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

