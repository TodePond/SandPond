//=======//
// Stage //
//=======//
// Simple ThreeJS canvas
// For quick easy prototyping
{

	//===========//
	// Functions //
	//===========//
	const makeRenderer = (canvas) => {
		const renderer = new THREE.WebGLRenderer({
			canvas,
			antialias: true,
			powerPreference: "high-performance",
			alpha: false,
		})
		renderer.autoClear = false
		return renderer
	}
	
	const makeCanvas = o=> {
		const style = `
			width: 100%;
			height: 100%;
			display: block;
		`
		return HTML `<canvas style="${style}"></canvas>`
	}
	
	const makeCamera = o=> {
		const camera = new THREE.PerspectiveCamera()
		camera.fov = 30
		camera.position.set(0, 50, 75)
		camera.lookAt(0, 0, 0)
		camera.far = 99999999
		return camera
	}
	
	//=======//
	// Class //
	//=======//	
	Stage = class Stage {
		
		constructor(element, {start = true} = {}) {
		
			const self = this		
			this.canvas = makeCanvas()
			element.appendChild(this.canvas)
			
			this.renderer = makeRenderer(this.canvas)
			this.scene = new THREE.Scene()
			this.camera = makeCamera()
			this.raycaster = new THREE.Raycaster()
			
			this.cursor = {
				get position3D() { return self.getCursorPosition3D(mesh => !mesh.unclickable) },
				get position2D() {
					return {
						get x() { return Mouse.x / self.canvas.clientWidth * 2 - 1 },
						get y() { return Mouse.y / self.canvas.clientHeight * -2 + 1 },
					}
				}
			}
			
			this.previousTimeStamp = 0
			if (start) this.start()
		}
		
		start() {
			requestAnimationFrame(this.o.render)
		}
		
		render(timeStampMilliseconds) {
			const timeStamp = timeStampMilliseconds * 0.001
			const tickTime = timeStamp - this.previousTimeStamp
			
			this.process(tickTime)
			this.resize()
			this.renderer.render(this.scene, this.camera)
			
			this.previousTimeStamp = timeStamp
			requestAnimationFrame(this.o.render)
		}
		
		process(tickTime) {
			this.fireEvent("process", {tickTime})
		}
		
		resize() {
			if (this.canvas.width == this.canvas.clientWidth && this.canvas.height == this.canvas.clientHeight) return
			this.renderer.setSize(this.canvas.clientWidth / 1, this.canvas.clientHeight / 1, false)
			this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight
			this.camera.updateProjectionMatrix()
		}
		
		getCursorPosition3D(filter) {
			this.raycaster.setFromCamera(this.cursor.position2D, this.camera)
			const intersects = this.raycaster.intersectObjects(this.scene.children.filter(filter))
			if (intersects.length == 0) return
			const intersect = intersects[0]
			return intersect.point
		}
	}
}
