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
				background-color: lightgreen;
			}
			
			#modeGo > .label {
				font-size: 14px;
			}
			
			#modeGo:hover {
				outline: 2px solid lightgreen;
			}
			
			#searchBar {
				margin: 5px;
				margin-bottom: 0px;
				font-size: 16px;
				font-family: Rosario;
			}
			
		</style>
	`
	
	const ELEMENT = HTML `
		<div id="ui">
		
			<div id="menu" class="menu">
				<div class="heading box" id="elementsHeading"><div class="label">Elements</div></div>
				<div class="heading box" id="controlsHeading"><div class="label">Controls</div></div>
				<div class="heading box" id="modeHeading"><div class="label">Mode</div></div>
				<!--<div class="heading box" id="configHeading"><div class="label">Config</div></div>
				<div class="heading box" id="sourceHeading"><div class="label">Source</div></div>
				-->
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
							<input type="text" id="searchBar">
							<div id="searchItems" class="elementList"></div>
						</div>
						<div id="sandbox" class="elementList minimised"></div>
						<div id="life" class="elementList minimised"></div>
						<div id="t2tile" class="elementList minimised"></div>
						<div id="clear" class="elementList minimised"></div>
					</div>
				</div>
				
				<div id="mode" class="form minimised">
					<section>
						<div class="miniTitle">SIZE</div>
						<div id="smallOption" class="sizeOption option box"><div class="label">Small</div></div>
						<div id="bigOption" class="sizeOption option box"><div class="label">Big</div></div>
					</section>
					<section>
						<div class="miniTitle">DIMENSIONS</div>
						<div id="d1Option" class="dimensionOption option box"><div class="label">1D</div></div>
						<div id="d2Option" class="dimensionOption option box"><div class="label">2D</div></div>
						<div id="d3Option" class="dimensionOption option box"><div class="label">3D</div></div>
					</section>
					<section>
						<div id="modeGo" class="box option"><div class="label">SUBMIT</div></div>
					</section>
				</div>
				
				<div id="controls" class="form minimised">
					<section>
						<div class="miniTitle">PLAYBACK</div>
						<div id="playPause" class="option small box"><div class="label"></div></div>
						<div id="stepControl" class="option small box"><div class="label">&#10074;&#9658;</div></div>
					</section>
				</div>
			</div>
			
		</div>
	`
	
	const makeElementButton = (element) => HTML `
		<div id="${element.name}Button" class="elementButton box vertical"><div class="label">${element.name}</div></div>
	`
	
	const updatePauseUI = () => {
		if (!paused) $("#playPause > .label").innerHTML = "&#10074;&#10074;"
		else $("#playPause > .label").innerHTML = "&#9658;"
	}
	
	//=======//
	// Setup //
	//=======//
	document.head.appendChild(STYLE)
	document.body.appendChild(ELEMENT)
	
	updatePauseUI()
	
	for (const element of atomTypes) {
		if (element.hidden) continue
		
		const searchItemButton = makeElementButton(element)
		const searchItems = $("#searchItems")
		searchItems.appendChild(searchItemButton)
		
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
	
	if (UI.selectedSize == "small") $("#smallOption").classList.add("selected")
	else if (UI.selectedSize == "big") $("#bigOption").classList.add("selected")
	
	if (UI.selectedDimensions == "d1") $("#d1Option").classList.add("selected")
	else if (UI.selectedDimensions == "d2") $("#d2Option").classList.add("selected")
	else if (UI.selectedDimensions == "d3") $("#d3Option").classList.add("selected")
	
	//========//
	// Events //
	//========//
	on.keydown(e => {
		const searchWindow = $("#search")
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
	
	$("#stepControl").on.click(() => {
		stepCount++
	})
	
	$("#playPause").on.click(() => {
		paused = !paused
		updatePauseUI()
	})
	
	$("#searchBar").on.input(function() {
		const matches = []
		const query = this.value.as(LowerCase)
		for (const elementButton of $$("#searchItems > .elementButton")) {
			const id = elementButton.id
			const name = id.slice(0, id.length - "Button".length).as(LowerCase)
			const index = name.indexOf(query)
			if (index >= 0) elementButton.classList.remove("minimised")
			else elementButton.classList.add("minimised")
		}
	})
	
	$("#modeGo").on.click(() => {
		let params = ""
		if (UI.selectedSize == "small") params += "small&"
		if (UI.selectedDimensions == "d1") params += "1d&"
		else if (UI.selectedDimensions == "d2") params += "2d&"
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
	
}

