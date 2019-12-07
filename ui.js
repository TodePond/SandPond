"use strict";
//====//
// UI //
//====//
const UI = {}

{
	//=========//
	// Globals //
	//=========//
	UI.selectedElement = Sand
	UI.selectedSize = SMALL_MODE? "small" : "big"
	UI.selectedDimensions = D1_MODE? "d1" : (D2_MODE? "d2" : "d3")
	UI.selectedReality = VR_MODE? "vr" : "nonvr"
	
	//======//
	// HTML //
	//======//
	const UI_STYLE = HTML `
		<style>
			
			.menu {
				font-size: 0px;
				height: 35px;
				position: relative;
			}
			
			.box {
				text-align: center;
				width: 75px;
				height: 35px;
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
			
			.small.box {
				width: 45px;
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
			
			.miniTitle {
				font-family: Rosario;
				font-size: 14px;
			}
			
			.form {
				margin: 10px;
				cursor: default;
			}
			
			.form > section {
				margin-top: 10px;
			}
			
			.box.option {
				background-color: white;
				color: black;
			}
			
			.box.option:hover {
				outline: 2px solid white;
			}
			
			.box.option.selected {
				outline: 2px solid black;
			}
			
			#modeGo {
				background-color: #ffcc00;
			}
			
			#modeGo > .label {
				font-size: 14px;
			}
			
			#modeGo:hover {
				outline: 2px solid #ffcc00;
			}
			
			#searchBar {
				margin: 5px;
				margin-bottom: 0px;
				font-size: 16px;
				font-family: Rosario;
			}
			
			#sourceBox {
				font-family: UbuntuMono;
				font-size: 18px;
			}
			
		</style>
	`
	
	const UI_ELEMENT = HTML `
		<div id="ui">
		
			<div id="menu" class="menu">
				<div class="heading box clickable" id="elementsHeading"><div class="label">Elements</div></div>
				<div class="heading box clickable" id="sourceHeading"><div class="label">Source</div></div>
				<div class="heading box clickable" id="controlsHeading"><div class="label">Controls</div></div>
				<div class="heading box clickable" id="modeHeading"><div class="label">Mode</div></div>
				<!--<div class="heading box clickable" id="configHeading"><div class="label">Config</div></div>
				-->
			</div>
			
			<div class="windowContainer">
			
				<div id="source" class="minimised form">
					<pre id="sourceBox"></pre>
				</div>
			
				<div id="elements" class="minimised">
					<div class="menu">
						<div class="heading box search clickable" id="searchHeading"><div class="label">&#8981;</div></div>
						<!--<div class="category heading box clickable" id="sandboxHeading"><div class="label">Sandbox</div></div>
						<div class="category heading box clickable" id="lifeHeading"><div class="label">Life</div></div>
						<div class="category heading box clickable" id="playerHeading"><div class="label">Player</div></div>
						<div class="category heading box clickable" id="t2tileHeading"><div class="label">T2Tile</div></div>
						<div class="category heading box clickable" id="clearHeading"><div class="label">Clear</div></div>-->
					</div>
					<div id="search">
						<input class="minimised clickable" type="text" id="searchBar">
						<div id="searchItems" class="elementList"></div>
					</div>
				</div>
				
				<div id="mode" class="form minimised">
					<section>
						<div class="miniTitle">SIZE</div>
						<div id="smallOption" class="sizeOption option box clickable"><div class="label">Small</div></div>
						<div id="bigOption" class="sizeOption option box clickable"><div class="label">Big</div></div>
					</section>
					<section>
						<div class="miniTitle">DIMENSIONS</div>
						<div id="d1Option" class="dimensionOption option box clickable"><div class="label">1D</div></div>
						<div id="d2Option" class="dimensionOption option box clickable"><div class="label">2D</div></div>
						<div id="d3Option" class="dimensionOption option box clickable"><div class="label">3D</div></div>
					</section>
					<section>
						<div class="miniTitle">DISPLAY</div>
						<div id="nonvrOption" class="realityOption option box clickable"><div class="label">Screen</div></div>
						<div id="vrOption" class="realityOption option box clickable"><div class="label">VR</div></div>
					</section>
					<section>
						<div id="modeGo" class="box option clickable"><div class="label">SUBMIT</div></div>
					</section>
				</div>
				
				<div id="controls" class="form minimised">
					<section>
						<div class="miniTitle">PLAYBACK</div>
						<div id="playPause" class="option small box clickable"><div class="label"></div></div>
						<div id="stepControl" class="option small box clickable"><div class="label">&#10074;&#9658;</div></div>
					</section>
				</div>
			</div>
			
		</div>
	`
	
	const makeElementButton = (element) => HTML `
		<div id="${element.name}Button" class="${element.name}Button elementButton box vertical clickable"><div class="label">${element.name}</div></div>
	`
	
	const updatePauseUI = () => {
		if (!paused) $("#playPause > .label").innerHTML = "&#10074;&#10074;"
		else $("#playPause > .label").innerHTML = "&#9658;"
	}
	
	const updateSourceUI = () => {
		if (!UI.selectedElement) return
		const source = UI.selectedElement.source
		$("#sourceBox").textContent = source
	}
	
	//=======//
	// Setup //
	//=======//
	document.head.appendChild(UI_STYLE)
	document.body.appendChild(UI_ELEMENT)
	
	for (const element of ELEMENT.globalElements) {
		if (element.hidden) continue
		
		const searchItemButton = makeElementButton(element)
		const searchItems = $("#searchItems")
		searchItems.appendChild(searchItemButton)
		
		const style = HTML `
			<style>
				
				.${element.name}Button {
					background-color: ${element.colour};
				}
				
				.${element.name}Button:hover {
					outline: 2px solid ${element.colour};
					overflow: visible;
				}
				
				.${element.name}Button.selected {
					outline: 2px solid black;
				}
				
			</style>
		`
		document.head.appendChild(style)
		
		if (element.default) {
			UI.selectedElement = element
		}
		
		for (const category of element.categories) {
			const categoryElement = $(`#${category}Heading.category`)
			if (!categoryElement) {
				const newCategoryElement = HTML `<div class="category heading box clickable" id="${category}Heading"><div class="label">${category}</div></div>`
				$("#elements > .menu").appendChild(newCategoryElement)
			}
		}

	}
	
	updatePauseUI()
	updateSourceUI()
	
	if (UI.selectedSize == "small") $("#smallOption").classList.add("selected")
	else if (UI.selectedSize == "big") $("#bigOption").classList.add("selected")
	
	if (UI.selectedDimensions == "d1") $("#d1Option").classList.add("selected")
	else if (UI.selectedDimensions == "d2") $("#d2Option").classList.add("selected")
	else if (UI.selectedDimensions == "d3") $("#d3Option").classList.add("selected")
	
	if (UI.selectedReality == "vr") $("#vrOption").classList.add("selected")
	else if (UI.selectedReality == "nonvr") $("#nonvrOption").classList.add("selected")
	
	
	$(`#${UI.selectedElement.name}Button`).classList.add("selected")
	
	//========//
	// Events //
	//========//
	on.keydown(e => {
		const searchWindow = $("#elements")
		if (!searchWindow.classList.contains("minimised")) {
			const searchBar = $("#searchBar")
			searchBar.focus()
		}
		else {
			if (e.key == "p") {
				paused = !paused
				updatePauseUI()
			}
			else if (e.key == "ArrowRight") {
				stepCount++
			}
		}
	})
	
	UI.clicking = false
	$$(".clickable").on.mousedown(() => UI.clicking = true)
	on.mouseup(() => UI.clicking = false)
	
	$("#stepControl").on.click(() => {
		stepCount++
	})
	
	$("#playPause").on.click(() => {
		paused = !paused
		updatePauseUI()
	})
	
	const updateSearch = () => {
		const query = $("#searchBar").value.as(LowerCase)
		const categories = []
		for (const category of $$(".category")) {
			if (!category.classList.contains("selected")) continue
			const categoryName = category.id.slice(0, category.id.length - "Heading".length)
			categories.push(categoryName)
		}
		
		for (const elementButton of $$("#searchItems > .elementButton")) {
			const id = elementButton.id
			const name = id.slice(0, id.length - "Button".length)
			const element = ELEMENT.globalElements[name]
			const index = name.as(LowerCase).indexOf(query)
			
			elementButton.classList.add("minimised")
			
			if (index >= 0) {
				if (categories.length == 0/* && $("#searchHeading").classList.contains("selected")*/) {
					elementButton.classList.remove("minimised")
				}
				else if (categories.some(category => category == element.category)) {
					elementButton.classList.remove("minimised")
				}
			}
		}
	}
	
	updateSearch()
	
	$("#searchBar").on.input(function() {
		updateSearch()
	})
	
	$("#modeGo").on.click(() => {
		let params = ""
		if (UI.selectedSize == "small") params += "small&"
		else if (UI.selectedSize == "big") params += "big&"
		if (UI.selectedDimensions == "d1") params += "1d&"
		else if (UI.selectedDimensions == "d2") params += "2d&"
		if (UI.selectedReality == "nonvr") params += "nonvr"
		else if (UI.selectedReality == "vr") params += "vr"
		const baseUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`
		window.location = `${baseUrl}?${params}`
	})
	
	$$(".sizeOption").on.click(function() {
		for (const sizeOption of $$(".sizeOption")) sizeOption.classList.remove("selected")
		this.classList.add("selected")
		const id = this.id
		const sizeName = id.slice(0, id.length - "Option".length)
		UI.selectedSize = sizeName
	})
	
	$$(".dimensionOption").on.click(function() {
		for (const dimensionOption of $$(".dimensionOption")) dimensionOption.classList.remove("selected")
		this.classList.add("selected")
		const id = this.id
		const dimensionName = id.slice(0, id.length - "Option".length)
		UI.selectedDimensions = dimensionName
	})
	
	$$(".realityOption").on.click(function() {
		for (const realityOption of $$(".realityOption")) realityOption.classList.remove("selected")
		this.classList.add("selected")
		const id = this.id
		const realityName = id.slice(0, id.length - "Option".length)
		UI.selectedReality = realityName
	})
	
	$$(".elementButton").on.click(function() {
		const newButton = this
		const newId = newButton.id
		
		const idEnd = "Button"
		
		const name = newId.slice(0, newId.length - idEnd.length)
		const newElement = ELEMENT.globalElements[name]
		const oldElement = UI.selectedElement
		
		const oldId = (oldElement? oldElement.name : "") + idEnd
		const oldButton = $("#" + oldId)
		
		if (oldElement) {
			oldButton.classList.remove("selected")
		}
		
		if (newElement) {
			newButton.classList.add("selected")
			UI.selectedElement = newElement
			newButton.style.outline = ""
			updateSourceUI()
		}
	})
	
	$$(".menu > .heading").on.click(function() {
	
		const menu = this.parentElement
		const menuContainer = menu.parentElement
		const windowContainer = menuContainer.$(".windowContainer")
		const oldHeading = menu.selectedHeading
		const newHeading = oldHeading != this? this : undefined
		
		if (!windowContainer) return
		
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
	
	$("#searchHeading").on.click(function() {
		$("#searchBar").classList.toggle("minimised")
		this.classList.toggle("selected")
		updateSearch()
	})
	
	$$(".category").on.click(function() {
		$$(".category").forEach(category => {
			if (category != this) category.classList.remove("selected")
		})
		this.classList.toggle("selected")
		updateSearch()
	})
	
	
}

