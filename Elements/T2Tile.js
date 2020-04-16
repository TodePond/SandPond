const DISPLAY_OUTPUTS = true

const outputFontLoader = new THREE.FontLoader()

let outputFont = undefined

outputFontLoader.load("fonts/Rosario_Regular.json", (font) => {
	outputFont = font
})

const OUTPUT_ACCELERATION = 0.003 * ATOM_SIZE
const OUTPUT_START_SPEED = 0 * ATOM_SIZE

const outputNumbers = []
on.process(() => {
	outputNumbers.forEach(mesh => {
		if (mesh.outputSpeed == undefined) {
			mesh.outputSpeed = OUTPUT_START_SPEED
		}
		mesh.position.x += mesh.outputSpeed
		mesh.outputSpeed += OUTPUT_ACCELERATION
	})
})

TodeSplat`

element ForkBomb {

	colour "grey"
	emissive "black"
	category "T2Tile"
	
	rule xyz { @_ => @@ }
	
}

element Res {

	colour "slategrey"
	emissive "grey"
	opacity 0.05
	category "T2Tile"
	isFood true
	isWorker true
	
	rule xyz { @_ => _@ }
	
}

element DReg {

	colour "brown"
	emissive "brown"
	opacity 0.03
	category "T2Tile"
	isWorker true
	
	given D (element) => element == DReg
	given n (atom, element) => atom && element != DReg
	
	change R () => new Res()
	change D () => new DReg()
	
	rule xyz 0.001 { @_ => D@ }
	rule xyz 0.005 { @_ => R@ }
	rule xyz 0.1 { @D => _@ }
	rule xyz 0.01 { @n => _@ }
	rule xyz { @_ => _@ }
	
}

element NiceDReg {

	colour "brown"
	emissive "brown"
	opacity 0.05
	category "T2Tile"
	isWorker true
	
	given S (atom, element) => atom && element.isWorker
	
	change R () => new Res()
	change D () => new NiceDReg()
	
	rule xyz { @S => _@ }
	rule xyz 0.002 { @_ => D@ }
	rule xyz 0.05 { @_ => R@ }
	rule xyz { @_ => _@ }
	
	
}

element Pusher {
	colour "#ffdd00"
	emissive "red"
	category "T2Tile"
	opacity 0.03
	isWorker true
	
	given R (element) => element == Res
	given D (atom, element) => atom && !element.isWorker
	select D (atom) => atom
	change D (selected) => selected
	
	rule { D@_ => _@D }
	rule {
		D      _
		 @_ =>  @D
	}
	rule {
		 @_ =>  @D
		D      _
	}
	rule xyz { @R => @@ }
	rule xyz { @_ => _@ }
}

element Data {

	category "T2Tile"
	colour "grey"
	emissive "black"
	
	data initialised false
	data number undefined
	
	given u (self) => !self.initialised
	keep i (self) => {
		self.number = Math.floor(Math.random() * 100)
		self.initialised = true
		self.shaderEmissive.b = self.number * 2.55
		self.shaderEmissive.g = 255 - self.number * 2.55
	}
	action { u => i }
	rule xyz { @_ => _@ }
	
}

element Input {

	category "T2Tile"
	colour "rgb(0, 0, 255)"
	emissive "rgb(0, 0, 128)"
	data portalPower 0
	data edgePower 0
	isWorker true
	
	given I (element) => element == Input
	change I (self) => {
		const input = new Input()
		input.portalPower = 45
		return input
	}
	change D (self) => new Data()
	change o (self) => {
		self.shaderOpacity = self.shaderOpacity - 5
		if (self.shaderOpacity < 0) self.shaderOpacity = 0
		return self
	}
	
	keep p (self) => {
		self.portalPower -= 1
		if (self.portalPower < 0) self.portalPower = 0
		if (self.shaderOpacity > self.edgePower * 3 + self.portalPower * 3) return self
		self.shaderOpacity = self.edgePower * 3 + self.portalPower * 3
		return self
	}
	
	change P (atom) => {
		atom.portalPower = 30
		if (atom.shaderOpacity > atom.edgePower * 3 + atom.portalPower * 3) return atom
		atom.shaderOpacity = (atom.edgePower * 3 + atom.portalPower * 3)
		return atom
	
	}
	action { @ => p }
	
	rule { _@ => @_ }
	rule { I@ => P_ }
	rule { .@ => ._ }
	
	action { @ => o }
	action side yz { @_ => @I }
	action 0.0001 { @_ => PD }
	
	change e (self) => {
		self.edgePower = 20
		if (self.shaderOpacity > self.edgePower * 3 + self.portalPower * 3) return self
		self.shaderOpacity = self.edgePower * 3 + self.portalPower * 3
		return self
	}
	rule xz side {
		@x => e.
		x     .
	}
	rule xy side {
		@x => e.
		x     .
	}
	rule xz side {
		x     .
		@x => e.
	}
	rule xy side {
		x@ => .e
		 x     .
	}
	
	given E (element) => element == Input
	select E (atom) => atom
	change E (self, selected) => {
		self.edgePower = selected.edgePower - 1
		if (selected.portalPower > self.portalPower) self.portalPower = selected.portalPower - 0.4
		if (self.edgePower < 0.75) self.edgePower = 0.75
		if (self.portalPower < 0) self.portalPower = 0
		
		if (self.shaderOpacity > self.edgePower * 3 + self.portalPower * 3) return self
		self.shaderOpacity = self.edgePower * 3 + self.portalPower * 3
		return self
	}
	rule xyz { @E => E. }
	
	/*change v (self) => {
		if (self.edgePower != undefined && self.edgePower > 0) {
			//self.shaderOpacity = self.edgePower * 1
			self.edgePower--
		}
		return self
	}
	rule { @ => v }*/
	
	
}

element Output {

	isWorker true
	category "T2Tile"
	colour "rgb(255, 0, 0)"
	emissive "rgb(128, 0, 0)"
	data portalPower 0
	data edgePower 0
	
	data y undefined
	data z undefined
	
	given I (element) => element == Output
	change I () => new Output()
	change D (self) => new Data()
	change o (self) => {
		self.shaderOpacity = self.shaderOpacity - 5
		if (self.shaderOpacity < 0) self.shaderOpacity = 0
		return self
	}
	
	keep p (self) => {
		self.portalPower -= 1
		if (self.portalPower < 0) self.portalPower = 0
		if (self.shaderOpacity > self.edgePower * 3 + self.portalPower * 3) return self
		self.shaderOpacity = self.edgePower * 3 + self.portalPower * 3
		return self
	}
	
	given A (atom) => atom
	select A (atom) => atom
	change A (atom, selected, self) => {
		
		if (selected.element == Data && selected.number != undefined && DISPLAY_OUTPUTS) {
		
			/*const geometry = new THREE.TextGeometry(selected.number.as(String), {
				font: outputFont,
			})
			
			const material = new THREE.MeshLambertMaterial({color: "red"})
			
			const mesh = new THREE.Mesh(geometry, material)
			mesh.position.x = MAX_X + 10
			scene.add(mesh)*/
			
			
			const geometry = new THREE.TextGeometry(selected.number.as(String), {
				font: outputFont,
				size: ATOM_SIZE * 2,
				height: ATOM_SIZE * 2 / 2,
			})
			const material = new THREE.MeshLambertMaterial({
				color: \`rgb(\${Math.floor(selected.shaderColour.r)}, \${Math.floor(selected.shaderColour.g)}, \${Math.floor(selected.shaderColour.b)})\`,
				emissive: \`rgb(\${Math.floor(selected.shaderEmissive.r)}, \${Math.floor(selected.shaderEmissive.g)}, \${Math.floor(selected.shaderEmissive.b)})\`,
				transparent: true,
			})
			const mesh = new THREE.Mesh(geometry, material)
			mesh.position.set(MAX_X * ATOM_SIZE, self.y * ATOM_SIZE, self.z * ATOM_SIZE - MAX_Z * ATOM_SIZE)
			mesh.rotation.y = Math.PI / 2
			scene.add(mesh)
			outputNumbers.push(mesh)
		}
		atom.portalPower = 30
		if (atom.shaderOpacity > atom.edgePower * 3 + atom.portalPower * 3) return atom
		atom.shaderOpacity = (atom.edgePower * 3 + atom.portalPower * 3)
		return atom
		
		
	}
	
	change P (atom) => {
		atom.portalPower = 30
		if (atom.shaderOpacity > atom.edgePower * 3 + atom.portalPower * 3) return atom
		atom.shaderOpacity = (atom.edgePower * 3 + atom.portalPower * 3)
		return atom
	}
	
	keep Y (self) => self.y = 0
	action {
		@    Y
		x => .
	}
	
	given y (atom) => atom && atom.y != undefined
	select y (atom) => atom
	keep y (selected, self) => self.y = selected.y + 1
	action {
		@ => y
		y    .
	}
	
	keep Z (self) => self.z = 0
	action side {
		@x => Z.
	}
	
	given z (atom) => atom && atom.z != undefined
	select z (atom) => atom
	keep z (selected, self) => self.z = selected.z + 1
	action side {
		@z => z.
	}
	
	action { @ => p }
	
	rule { @_ => _@ }
	rule { @I => _P }
	rule { @. => _. }
	
	action { @ => o }
	action side yz { @_ => @I }
	
	action { A@ => _A }
	
	change e (self) => {
		self.edgePower = 20
		if (self.shaderOpacity > self.edgePower * 3 + self.portalPower * 3) return self
		self.shaderOpacity = self.edgePower * 3 + self.portalPower * 3
		return self
	}
	rule xz side {
		@x => e.
		x     .
	}
	rule xy side {
		@x => e.
		x     .
	}
	rule xz side {
		x     .
		@x => e.
	}
	rule xy side {
		x@ => .e
		 x     .
	}
	
	given E (element) => element == Output
	select E (atom) => atom
	change E (self, selected) => {
		self.edgePower = selected.edgePower - 1
		if (selected.portalPower > self.portalPower) self.portalPower = selected.portalPower - 0.4
		if (self.edgePower < 0.75) self.edgePower = 0.75
		if (self.portalPower < 0) self.portalPower = 0
		
		if (self.shaderOpacity > self.edgePower * 3 + self.portalPower * 3) return self
		self.shaderOpacity = self.edgePower * 3 + self.portalPower * 3
		return self
	}
	rule xyz { @E => E. }
	
	/*change v (self) => {
		if (self.edgePower != undefined && self.edgePower > 0) {
			//self.shaderOpacity = self.edgePower * 1
			self.edgePower--
		}
		return self
	}
	rule { @ => v }*/
	
	
}

`