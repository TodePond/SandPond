"use strict";
//====//
// UI //
//====//
const UI = {}
UIstarted = true

{
	//=========//
	// Globals //
	//=========//
	UI.selectedElement = window.Sand
	UI.highlightedElement = undefined
	UI.selectedSize = SIZE
	UI.selectedShape = SHAPE
	UI.selectedRandom = RANDOM
	UI.selectedDimensions = D1_MODE? "d1" : (D2_MODE? "d2" : "d3")
	UI.selectedReality = VR_MODE? "vr" : "nonvr"
	UI.selectedSource = "todeSplat"
	UI.floorTypeOption = FLOOR_TYPE
	
	//======//
	// HTML //
	//======//
	const UI_STYLE = HTML `
		<style>
			
			#ui {
				position: absolute;
				top: 0px;
				user-select: none;
			}
			
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
			
			.search.heading, .source.heading {
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
			
			.highlighted {
				background-color: black !important;
				color: white;
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
				overflow: auto;
				max-height: calc(100vh - 102px);
				margin: 16px;
			}
			
			.sourceType > .label {
				font-size: 15px;
			}
			
			.slider {
				-webkit-appearance: none;
				background: white;
				width: 200px;
				margin: 0px;
			}
			
			.slider::-webkit-slider-thumb {
				-webkit-appearance: none;
				width: 16px;
				height: 24px;
				background: #FC0;
			}
			
			/*.slider:hover {
				outline: 2px solid white;
			}*/
			
			.inputLabel {
				display: inline-block;
				font-family: UbuntuMono;
				font-size: 18px;
				margin: 0px 10px;
			}
			
			.sliderContainer {
				display: flex;
				align-items: center;
			}
			
		</style>
	`
	
	const UI_ELEMENT = HTML `
		<div id="ui">
		
			<div id="menu" class="menu">
				<div class="heading box clickable" id="elementsHeading"><div class="label">Elements</div></div>
				<div class="heading box clickable" id="sourceHeading"><div class="label">Source</div></div>
				<div class="heading box clickable" id="controlsHeading"><div class="label">Controls</div></div>
				<div class="heading box clickable" id="dropperHeading"><div class="label">Dropper</div></div>
				<div class="heading box clickable" id="modeHeading"><div class="label">Mode</div></div>
				<!--<div class="heading box clickable" id="configHeading"><div class="label">Config</div></div>
				-->
			</div>
			
			<div class="windowContainer">
			
				<div id="source" class="minimised">
					<div class="menu">
						<div class="heading box clickable sourceType selected" id="todeSplatSource"><div class="label">TodeSplat</div></div>
						<div class="heading box clickable sourceType" id="javaScriptSource"><div class="label">JavaScript</div></div>
					</div>
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
				
				<div id="dropper" class="form minimised">
					<section>
						<div class="miniTitle">SIZE</div>
						<div class="sliderContainer">
							<input class="slider clickable" id="dropperSizeSlider" type="range" min="0" max="10">
							<div class="inputLabel" id="dropperSizeSliderLabel"></div>
						</div>
					</section>
				</div>
				
				<div id="mode" class="form minimised">
					<section>
						<div class="miniTitle">SIZE</div>
						<div id="tinyOption" class="sizeOption option box clickable"><div class="label">Tiny</div></div>
						<div id="smallOption" class="sizeOption option box clickable"><div class="label">Small</div></div>
						<div id="mediumOption" class="sizeOption option box clickable"><div class="label">Medium</div></div>
						<div id="bigOption" class="sizeOption option box clickable"><div class="label">Big</div></div>
						<div id="massiveOption" class="sizeOption option box clickable"><div class="label">Massive</div></div>
					</section>
					<section>
						<div class="miniTitle">SHAPE</div>
						<div id="cubeOption" class="shapeOption option box clickable"><div class="label">Normal</div></div>
						<div id="longOption" class="shapeOption option box clickable"><div class="label">Long</div></div>
					</section>
					<section>
						<div class="miniTitle">DIMENSIONS</div>
						<div id="d1Option" class="dimensionOption option box clickable"><div class="label">1D</div></div>
						<div id="d2Option" class="dimensionOption option box clickable"><div class="label">2D</div></div>
						<div id="d3Option" class="dimensionOption option box clickable"><div class="label">3D</div></div>
					</section>
					<!--<section>
						<div class="miniTitle">DISPLAY</div>
						<div id="nonvrOption" class="realityOption option box clickable"><div class="label">Screen</div></div>
						<div id="vrOption" class="realityOption option box clickable"><div class="label">VR</div></div>
					</section>-->
					<section>
						<div class="miniTitle">FLOOR</div>
						<div id="floorOption" class="floorTypeOption option box clickable"><div class="label">Floor</div></div>
						<div id="nofloorOption" class="floorTypeOption option box clickable"><div class="label">No Floor</div></div>
					</section>
					<section>
						<div class="miniTitle">RANDOMNESS</div>
						<div id="trackOption" class="randomOption option box clickable"><div class="label">Tracking</div></div>
						<div id="pureOption" class="randomOption option box clickable"><div class="label">Shuffled</div></div>
						<div id="shuffleOption" class="randomOption option box clickable"><div class="label">Shuffling</div></div>
					</section>
					<section>
						<div id="modeGo" class="box option clickable"><div class="label">RELOAD</div></div>
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
		const source = UI.selectedSource == "todeSplat"? UI.selectedElement.source : UI.selectedElement.behave
		$("#sourceBox").textContent = source
	}
	
	//=======//
	// Setup //
	//=======//
	document.head.appendChild(UI_STYLE)
	document.body.appendChild(UI_ELEMENT)
	
	for (const element of TodeSplat.global.elements) {
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
				if (category == "Sandbox") newCategoryElement.classList.add("selected")
			}
		}

	}
	
	updatePauseUI()
	updateSourceUI()
	
	$(`#${UI.selectedSize}Option`).classList.add("selected")
	$(`#${UI.selectedShape}Option`).classList.add("selected")
	$(`#${UI.selectedRandom}Option`).classList.add("selected")
	
	if (UI.selectedDimensions == "d1") $("#d1Option").classList.add("selected")
	else if (UI.selectedDimensions == "d2") $("#d2Option").classList.add("selected")
	else if (UI.selectedDimensions == "d3") $("#d3Option").classList.add("selected")
	
	//if (UI.selectedReality == "vr") $("#vrOption").classList.add("selected")
	//else if (UI.selectedReality == "nonvr") $("#nonvrOption").classList.add("selected")
	
	$(`#${UI.floorTypeOption}Option`).classList.add("selected")
	
	if (UI.selectedElement) $(`#${UI.selectedElement.name}Button`).classList.add("selected")
	
	//========//
	// Events //
	//========//	
	on.keydown(e => {
		const searchWindow = $("#searchBar")
		if (!searchWindow.classList.contains("minimised")) {
			const searchBar = $("#searchBar")
			searchBar.focus()
		}
		else {
			if (e.key == " ") {
				paused = !paused
				updatePauseUI()
			}
			else if (e.key == "ArrowRight") {
				stepCount++
			}
			else if (e.key == "Shift") {
				orbit.enableZoom = false
			}
		}
	})
	
	
	$("#dropperSizeSlider").on.input(e => {
		MAX_DROPPER = e.target.value.as(Number)
		DROPPER.refreshShadows()
		updateDropperSlider()
	})
	
	const updateDropperSlider = () => {
		$("#dropperSizeSlider").value = MAX_DROPPER
		$("#dropperSizeSliderLabel").textContent = MAX_DROPPER
	}
	
	updateDropperSlider()
	
	on.wheel(e => {
		if (e.deltaY < 0) {
			MAX_DROPPER++
			if (MAX_DROPPER > 10) MAX_DROPPER = 10
		}
		else if (e.deltaY > 0) {
			MAX_DROPPER--
			if (MAX_DROPPER < 0) MAX_DROPPER = 0
			DROPPER.refreshShadows()
		}
		updateDropperSlider()
	})
	
	on.keyup(e => {
		if (e.key == "Shift") {
			orbit.enableZoom = true
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
		let query = $("#searchBar").value.as(LowerCase)
		if ($("#searchBar").classList.contains("minimised")) query = ""
		const categories = []
		for (const category of $$(".category")) {
			if (!category.classList.contains("selected")) continue
			const categoryName = category.id.slice(0, category.id.length - "Heading".length)
			categories.push(categoryName)
		}
		
		for (const elementButton of $$("#searchItems > .elementButton")) {
			const id = elementButton.id
			const name = id.slice(0, id.length - "Button".length)
			const element = TodeSplat.global.elements[name]
			const index = name.as(LowerCase).indexOf(query)
			
			elementButton.classList.add("minimised")
			
			if (index >= 0) {
				if (categories.length == 0/* && $("#searchHeading").classList.contains("selected")*/) {
					elementButton.classList.remove("minimised")
				}
				else if (categories.some(category => category == element.categories.includes(category))) {
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
		params += UI.selectedSize + "&"
		params += UI.selectedShape + "&"
		params += UI.selectedRandom + "&"
		if (UI.selectedDimensions == "d1") params += "1d&"
		else if (UI.selectedDimensions == "d2") params += "2d&"
		if (UI.selectedReality == "nonvr") params += "nonvr&"
		else if (UI.selectedReality == "vr") params += "vr&"
		params += UI.floorTypeOption
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
	
	$$(".shapeOption").on.click(function() {
		for (const shapeOption of $$(".shapeOption")) shapeOption.classList.remove("selected")
		this.classList.add("selected")
		const id = this.id
		const sizeName = id.slice(0, id.length - "Option".length)
		UI.selectedShape = sizeName
	})
	
	$$(".randomOption").on.click(function() {
		for (const randomOption of $$(".randomOption")) randomOption.classList.remove("selected")
		this.classList.add("selected")
		const id = this.id
		const randomName = id.slice(0, id.length - "Option".length)
		UI.selectedRandom = randomName
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
	
	$$(".floorTypeOption").on.click(function() {
		for (const floorTypeOption of $$(".floorTypeOption")) floorTypeOption.classList.remove("selected")
		this.classList.add("selected")
		const id = this.id
		const floorTypeOption = id.slice(0, id.length - "Option".length)
		UI.floorTypeOption = floorTypeOption
	})
	
	$$(".elementButton").on.click(function(e) {
		const newButton = this
		const newId = newButton.id
		
		const idEnd = "Button"
		
		const name = newId.slice(0, newId.length - idEnd.length)
		const newElement = TodeSplat.global.elements[name]
		const oldElement = UI.selectedElement
		
		const oldId = oldElement.name + idEnd
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
	
	$$(".elementButton").on.mousedown(function(e) {
		if (e.button != 2) return
		
		const newButton = this
		const newId = newButton.id
		const idEnd = "Button"
		const name = newId.slice(0, newId.length - idEnd.length)
		const newElement = TodeSplat.global.elements[name]
		
		const oldElement = UI.highlightedElement
		if (oldElement) {
			const oldId = oldElement.name + idEnd
			const oldButton = $("#" + oldId)
			oldButton.classList.remove("highlighted")
		}
		
		if (newElement) {
		
			if (oldElement == newElement) {
				UI.highlightedElement = undefined
				
				for (const space of spaces) {
					const atom = space.atom
					if (!atom) continue
					atom.shaderOpacity = atom.element.shaderOpacity
					SPACE.setAtom(space, atom)
				}
				return
			}
		
			newButton.classList.add("highlighted")
			UI.highlightedElement = newElement
			
			for (const space of spaces) {
				const atom = space.atom
				if (!atom) continue
				if (atom.element == newElement) atom.shaderOpacity = 255
				else atom.shaderOpacity = 0
				
				SPACE.setAtom(space, atom)
			}
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
			if (oldHeading.id == "sourceHeading") orbit.enableZoom = true
		}
		
		if (newHeading) {
			const id = newHeading.id
			const name = id.slice(0, id.length - "Heading".length)
			const window = windowContainer.$("#" + name)
			if (window) window.classList.remove("minimised")
			if (newHeading.id == "sourceHeading") orbit.enableZoom = false
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
	
	$$(".sourceType").on.click(function() {
		$$(".sourceType").forEach(category => {
			category.classList.remove("selected")
		})
		this.classList.add("selected")
		if (this.id == "javaScriptSource") UI.selectedSource = "javaScript"
		else UI.selectedSource = "todeSplat"
		updateSourceUI()
	})
	
	
}

