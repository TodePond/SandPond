//=======//
// Stage //
//=======//
// Simple ThreeJS canvas
// For quick easy prototyping
{

	//===========//
	// Functions //
	//===========//
	const makeRenderer = (canvas, alpha = false) => {
		const renderer = new THREE.WebGLRenderer({
			canvas,
			antialias: true,
			powerPreference: "high-performance",
			alpha,
		})
		renderer.autoClear = false
		return renderer
	}
	
	const makeCanvas = o=> {
		const style = `
			width: 100%;
			height: 100%;
			/*position: absolute;*/
			z-index: -1;
		`
		return HTML `<canvas style="${style}"></canvas>`
	}
	
	const makeCamera = o=> {
		const camera = new THREE.PerspectiveCamera()
		camera.fov = 30
		camera.position.set(0, 1, 3)
		camera.lookAt(0, 0, 0)
		//camera.far = 99999999
		return camera
	}
	
	const makeDummyCamera = o=> {
		const camera = new THREE.PerspectiveCamera()
		//camera.fov = 30
		camera.position.set(0, 1.6, 0)
		camera.lookAt(0, 0, 0)
		//camera.far = 99999999
		return camera
	}
	
	//=======//
	// Class //
	//=======//
	Stage = class Stage {
		
		constructor(element, {start = true, alpha = false} = {}) {
		
			const self = this		
			this.canvas = makeCanvas()
			element.appendChild(this.canvas)
			
			this.renderer = makeRenderer(this.canvas, alpha)
			this.scene = new THREE.Scene()
			this.camera = makeCamera()
			this.raycaster = new THREE.Raycaster()
			
			this.vrEnabled = false
			this.dummyCamera = makeDummyCamera()
			
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
			this.renderer.setAnimationLoop(this.o.render)
		}
		
		render(timeStampMilliseconds) {
			const timeStamp = timeStampMilliseconds * 0.001
			const tickTime = timeStamp - this.previousTimeStamp
			
			this.process(tickTime)
			this.resize()
			this.renderer.render(this.scene, this.camera)
			
			this.previousTimeStamp = timeStamp
		}
		
		process(tickTime) {
			this.fireEvent("process", {tickTime})
		}
		
		resize() {
			if (this.renderer.vr.isPresenting()) return
			if (this.canvas.width == this.canvas.clientWidth && this.canvas.height == this.canvas.clientHeight) return
			this.renderer.setSize(this.canvas.clientWidth / 1, this.canvas.clientHeight / 1, false)
			this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight
			this.camera.updateProjectionMatrix()
		}
		
		getCursorPosition3D(filter = () => true) {
			this.raycaster.setFromCamera(this.cursor.position2D, this.camera)
			//else this.raycaster.setFromCamera(this.cursor.position2D, this.dummyCamera)
			const intersects = this.raycaster.intersectObjects(this.scene.children.filter(filter))
			if (intersects.length == 0) return
			const intersect = intersects[0]
			return intersect.point
		}
	}
}
