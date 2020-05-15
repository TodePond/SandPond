//=======//
// Stage //
//=======//
// Simple ThreeJS canvas
// For quick easy prototyping
{

	//===========//
	// Functions //
	//===========//
	const makeRenderer = (canvas, alpha = false, shadow = false) => {
		const renderer = new THREE.WebGLRenderer({
			canvas,
			antialias: true,
			powerPreference: "high-performance",
			alpha,
		})
		if (shadow) {
			renderer.shadowMap.enabled = true
			renderer.shadowMap.type = THREE.PCFSoftShadowMap
		}
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
	
	//=======//
	// Class //
	//=======//
	Stage = class Stage {
		
		constructor(element, {start = true, alpha = false, shadow = false, postProcess = false} = {}) {
		
			const self = this		
			this.canvas = makeCanvas()
			element.appendChild(this.canvas)
			
			this.renderer = makeRenderer(this.canvas, alpha, shadow)
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
			
			if (postProcess === true) {
				this.composer = new THREE.EffectComposer(this.renderer)
				const renderPass = new THREE.RenderPass(this.scene, this.camera)
				this.composer.addPass(renderPass)
				this.draw = () => this.composer.render()
			}
			else {
				this.draw = () => this.renderer.render(this.scene, this.camera)
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
			this.draw()
			
			this.previousTimeStamp = timeStamp
		}
		
		process(tickTime) {
			this.fireEvent("process", {tickTime})
		}
		
		resize() {
			if (this.canvas.width == this.canvas.clientWidth && this.canvas.height == this.canvas.clientHeight) return
			this.renderer.setSize(this.canvas.clientWidth / 1, this.canvas.clientHeight / 1, false)
			this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight
			this.camera.updateProjectionMatrix()
			if (this.composer) this.composer.setSize(this.canvas.clientWidth, this.canvas.clientHeight)
		}
		
		getCursorPosition3D(filter = undefined, objects = this.scene.children) {
			this.raycaster.setFromCamera(this.cursor.position2D, this.camera)
			const sample = filter === undefined? objects : objects.filter(filter)
			const intersects = this.raycaster.intersectObjects(sample)
			if (intersects.length == 0) return
			const intersect = intersects[0]
			return intersect.point
		}
		
		getCursorIntersect(filter = undefined, objects = this.scene.children) {
			this.raycaster.setFromCamera(this.cursor.position2D, this.camera)
			const sample = filter === undefined? objects : objects.filter(filter)
			const intersects = this.raycaster.intersectObjects(sample)
			if (intersects.length == 0) return
			const intersect = intersects[0]
			return intersect
		}
		
		getTouchPosition2D(id = 0) {
			const touch = Touches[id]
			if (touch === undefined) return undefined
			return {
				x: touch.x / this.canvas.clientWidth * 2 - 1,
				y: touch.y / this.canvas.clientHeight * -2 + 1,
			}
		}
		
		getTouchPosition3D(id = 0, filter = undefined, objects = this.scene.children) {
			const position2D = this.getTouchPosition2D(id)
			if (position2D === undefined) return undefined
			this.raycaster.setFromCamera(position2D, this.camera)
			const sample = filter === undefined? objects : objects.filter(filter)
			const intersects = this.raycaster.intersectObjects(sample)
			if (intersects.length == 0) return
			const intersect = intersects[0]
			return intersect.point
		}
	}
}
