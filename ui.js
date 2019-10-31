//====//
// UI //
//====//
const UI = {}
{
	
	//=========//
	// Globals //
	//=========//
	UI.selectedElement = Sand
	
	//======//
	// HTML //
	//======//
	const STYLE = HTML `
		<style>
			
			.menu {
				font-size: 0px;
				height: 35px;
				position: relative;
			}
			
			.box {
				text-align: center;
				width: 75px;
				height: 100%;
				vertical-align: top;
				cursor: default;
				display: inline-block;
				overflow: hidden;
			}
			
			.box.vertical {
				width: 75px;
				height: 35px;
				display: block;
			}
			
			.elementButton {
				margin: 5px;
			}
			
			.elementButton > .label {
				font-size: 14px;
			}
			
			.heading {
				background-color: black;
				color: white;
			}
			
			.label {
				font-family: Rosario;
				font-size: 16px;
				position: relative;
				top: 50%;
				transform: translateY(-50%);
				margin: 0px 5px;
			}
			
			.heading:hover {
				background-color: white;
				color: black;
			}
			
			.heading.selected {
				color: #ffcc00;
			}
			
			.search.heading {
				width: auto;
				padding: 0px 6px;
			}
			
			.search.heading > .label {
				font-size: 40px;
				transform: translateY(-55%);
			}
			
			.minimised {
				position: absolute;
				visibility: hidden;
			}
			
		</style>
	`
	
	const ELEMENT = HTML `
		<div id="ui">
		
			<div id="menu" class="menu">
				<div class="heading box" id="elementsHeading"><div class="label">Elements</div></div>
				<!--<div class="heading box" id="configHeading"><div class="label">Config</div></div>
				<div class="heading box" id="sourceHeading"><div class="label">Source</div></div>
				<div class="heading box" id="controlsHeading"><div class="label">Controls</div></div>
				<div class="heading box" id="modeHeading"><div class="label">Mode</div></div>-->
			</div>
			
			<div class="windowContainer">
				<div id="elements" class="minimised">
					<div class="menu">
						<div class="heading box search" id="searchHeading"><div class="label">&#8981;</div></div>
						<div class="heading box" id="sandboxHeading"><div class="label">Sandbox</div></div>
						<div class="heading box" id="lifeHeading"><div class="label">Life</div></div>
						<div class="heading box" id="t2tileHeading"><div class="label">T2Tile</div></div>
						<div class="heading box" id="clearHeading"><div class="label">Clear</div></div>
					</div>
					<div class="windowContainer">
						<div id="search" class="minimised">
							COMING SOON
						</div>
						<div id="sandbox" class="elementList minimised"></div>
						<div id="life" class="elementList minimised"></div>
						<div id="t2tile" class="elementList minimised"></div>
						<div id="clear" class="elementList minimised"></div>
					</div>
				</div>
			</div>
			
		</div>
	`
	
	const makeElementButton = (element) => HTML `
		<div id="${element.name}Button" class="elementButton box vertical"><div class="label">${element.name}</div></div>
	`
	
	//=======//
	// Setup //
	//=======//
	document.head.appendChild(STYLE)
	document.body.appendChild(ELEMENT)
	
	for (const element of atomTypes) {
		if (element.hidden) continue
		if (!element.category) continue
		const elementButton = makeElementButton(element)
		const category = $("#" + element.category)
		category.appendChild(elementButton)
		const style = HTML `
			<style>
				#${element.name}Button {
					background-color: ${element.colour};
				}
				
				#${element.name}Button:hover {
					outline: 2px solid ${element.colour};
					overflow: visible;
				}
				
				#${element.name}Button.selected {
					outline: 2px solid black;
				}
			</style>
		`
		document.head.appendChild(style)
	}
	
	//========//
	// Events //
	//========//
	$$(".elementButton").on.click(function() {
		const button = this
		const name = button.id.slice(0, button.id.length - "Button".length)
		const newElement = $AtomType(name)
		const oldElement = UI.selectedElement
		
		if (oldElement) {
			$("#" + oldElement.name + "Button").classList.remove("selected")
		}
		
		if (newElement) {
			$("#" + newElement.name + "Button").classList.add("selected")
			UI.selectedElement = newElement
		}
	})
	
	$$(".menu > .heading").on.click(function() {
	
		const menu = this.parentElement
		const menuContainer = menu.parentElement
		const windowContainer = menuContainer.$(".windowContainer")
		const oldHeading = menu.selectedHeading
		const newHeading = oldHeading != this? this : undefined
		
		if (newHeading) newHeading.classList.add("selected")
		if (oldHeading) oldHeading.classList.remove("selected")
		menu.selectedHeading = newHeading
		
		if (oldHeading) {
			const id = oldHeading.id
			const name = id.slice(0, id.length - "Heading".length)
			const window = windowContainer.$("#" + name)
			if (window) window.classList.add("minimised")
		}
		
		if (newHeading) {		
			const id = newHeading.id
			const name = id.slice(0, id.length - "Heading".length)
			const window = windowContainer.$("#" + name)
			if (window) window.classList.remove("minimised")
		}
	})
	
	/*===========*/
	
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
			margin: 2px;
		`
		
		const splat = HTML `
			<div id="splat" style="${style}"></div>
		`
		
		const elementsMenu = makeElementsMenu()
		splat.appendChild(elementsMenu)
		
		const rules = makeRules()
		splat.appendChild(rules)
		
		const modeMenu = makeModeMenu()
		splat.appendChild(modeMenu)
		
		return splat
	}
	
	const makeElementsMenu = () => {
		const style = `
			display: inline-block;
			background-color: rgba(0, 0, 128, 0.0);
			/*transform: translateX(-50%);*/
			/*visibility: hidden;*/
		`
		
		const menu = HTML `
			<div id="elementsMenu" style="${style}"></div>
		`
		
		const topMenu = makeTopMenu()
		menu.appendChild(topMenu)
		
		return menu
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
		
		const normalButton = makeMenuButton("Big", "lightgrey")
		normalButton.id = "normalMode"
		normalButton.classList.add("mode")
		modeMenu.appendChild(normalButton)
		
		const smallButton = makeMenuButton("Small", "lightgrey")
		smallButton.id = "smallMode"
		smallButton.classList.add("mode")
		modeMenu.appendChild(smallButton)
		
		const d2Button = makeMenuButton("Big 2D", "lightgrey")
		d2Button.id = "d2Mode"
		d2Button.classList.add("mode")
		modeMenu.appendChild(d2Button)
		
		const smallD2Mode = makeMenuButton("Small 2D", "lightgrey")
		smallD2Mode.id = "smallD2Mode"
		smallD2Mode.classList.add("mode")
		modeMenu.appendChild(smallD2Mode)
		
		const smallD1Mode = makeMenuButton("1D", "lightgrey")
		smallD1Mode.id = "smallD1Mode"
		smallD1Mode.classList.add("mode")
		modeMenu.appendChild(smallD1Mode)
		
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
	//const splatElement = makeSplat()
	//document.body.appendChild(splatElement)
	//updateRules()
	//hideSplat()
	
	//========//
	// Events //
	//========//
	/*$$(".element").on.mouseover(e => {
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
	
	$("#smallD1Mode").on.click(e => {
		const baseUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`
		window.location = `${baseUrl}?1d`
	})
	
	//==================//
	// Public Functions //
	//==================//
	function showSplat() {
		$("#rules").style.visibility = "visible"
	}
	
	function hideSplat() {
		$("#rules").style.visibility = "hidden"
	}*/
}

