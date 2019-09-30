//=======//
// World //
//=======//
{
	World = class World {
		constructor(scene, area) {
			this.area = area
			this.scene = scene
			
			this.createSpaces(this, area)			
			this.createInstances(this.count)
			this.positionInstances()
			
			this.createNeighbours()
			
			scene.add(this.mesh)
		}
		
		$Space(x, y, z) {
			const gridy = this.grid[y]
			if (!gridy) return
			const gridyx = gridy[x]
			if (!gridyx) return
			return gridyx[z]	
		}
		
		createNeighbours() {
			for (const y of this.yStart.to(this.yEnd)) {
				for (const x of this.xStart.to(this.xEnd)) {
					for (const z of this.zStart.to(this.zEnd)) {
						const space = this.grid[y][x][z]
						space.eventWindow = makeEventWindow(this, space, x, y, z)
					}
				}
			}
		}
		
		positionInstances(cornerNumber) {
			for (const y of this.yStart.to(this.yEnd)) {
				for (const x of this.xStart.to(this.xEnd)) {
					for (const z of this.zStart.to(this.zEnd)) {
						const space = this.grid[y][x][z]
						this.setInstancePosition(space.id, x, y, z)
					}
				}
			}
		}
		
		setInstancePosition(id, x, y, z) {
			const object = new THREE.Object3D()
			object.position.set(x, y, z)
			object.updateMatrixWorld()
			
			for (let a = 0; a < 4; a++) {
				for (let m = 0; m < 4; m++) {
					this.matrixInstances[a][id*4 + m] = object.matrixWorld.elements[a*4 + m]
				}
				this.matrixAttributes[a].needsUpdate = true
			}
		}
		
		setSpaceColour(space, colour, emissive, opacity) {
			
			if (colour == false) {
				this.colourInstances[space.colourOffset0] = 0
				this.colourInstances[space.colourOffset1] = 0
				this.colourInstances[space.colourOffset2] = 0
				this.colourInstances[space.colourOffset3] = 0
				this.colourAttribute.needsUpdate = true
				return
			}
			
			this.colourInstances[space.colourOffset0] = colour.r
			this.colourInstances[space.colourOffset1] = colour.g
			this.colourInstances[space.colourOffset2] = colour.b
			this.colourInstances[space.colourOffset3] = opacity
			
			this.emissiveInstances[space.emissiveOffset0] = emissive.r
			this.emissiveInstances[space.emissiveOffset1] = emissive.g
			this.emissiveInstances[space.emissiveOffset2] = emissive.b
						
			this.colourAttribute.needsUpdate = true
			this.emissiveAttribute.needsUpdate = true
			
		}
		
		createSpaces(area) {
		
			this.grid = []
			this.spaces = []
			let id = 0
		
			this.xStart = Math.min(...this.area.x)
			this.xEnd = Math.max(...this.area.x)
			this.yStart = Math.min(...this.area.y)
			this.yEnd = Math.max(...this.area.y)
			this.zStart = Math.min(...this.area.z)
			this.zEnd = Math.max(...this.area.z)
			
			this.width = this.xEnd - this.xStart
			this.height = this.yEnd - this.yStart
			this.depth = this.zEnd - this.zStart
			
			for (const y of this.yStart.to(this.yEnd)) {
				this.grid[y] = []
				for (const x of this.xStart.to(this.xEnd)) {
					this.grid[y][x] = []
					for (const z of this.zStart.to(this.zEnd)) {
						const space = makeSpace(id)
						this.grid[y][x][z] = space
						this.spaces.push(space)
						id++
					}
				}
			}
			
			this.count = this.spaces.length
		}
		
		createInstances(count) {
			const material = new THREE.MeshLambertMaterial({
				transparent: true,
				opacity: 1.0,
				depthFunc: THREE.LessEqualDepth,
				depthWrite: true,
				side: THREE.DoubleSide,
			})
			const geometry = new THREE.BoxBufferGeometry(1, 1, 1)
			const instancedGeometry = new THREE.InstancedBufferGeometry().copy(geometry)
			
			instancedGeometry.index = geometry.index
			instancedGeometry.maxInstancedCount = count
			
			this.colourInstances = new Uint8Array(count * 4)
			this.colourAttribute = new THREE.InstancedBufferAttribute(this.colourInstances, 4, true)
			this.colourAttribute.dynamic = true
			instancedGeometry.addAttribute("aInstanceColor", this.colourAttribute)
			
			this.emissiveInstances = new Uint8Array(count * 3)
			this.emissiveAttribute = new THREE.InstancedBufferAttribute(this.emissiveInstances, 3, true)
			this.emissiveAttribute.dynamic = true
			instancedGeometry.addAttribute("aInstanceEmissive", this.emissiveAttribute)
			
			this.matrixInstances = [
				new Float32Array(count * 4),
				new Float32Array(count * 4),
				new Float32Array(count * 4),
				new Float32Array(count * 4),
			]
			
			this.matrixAttributes = [
				new THREE.InstancedBufferAttribute(this.matrixInstances[0], 4),
				new THREE.InstancedBufferAttribute(this.matrixInstances[1], 4),
				new THREE.InstancedBufferAttribute(this.matrixInstances[2], 4),
				new THREE.InstancedBufferAttribute(this.matrixInstances[3], 4),
			]
			
			repeat (4, i => {
				const attribute = this.matrixAttributes[i]
				attribute.dynamic = true
				instancedGeometry.addAttribute(`aInstanceMatrix${i}`, attribute)
			})
			
			material.onBeforeCompile = shader => {
			
				shader.vertexShader = `
					attribute vec4 aInstanceMatrix0;
					attribute vec4 aInstanceMatrix1;
					attribute vec4 aInstanceMatrix2;
					attribute vec4 aInstanceMatrix3;
					
					attribute vec4 aInstanceColor;
					attribute vec3 aInstanceEmissive;
					
					varying vec4 vInstanceColor;
					varying vec3 vInstanceEmissive;
				` + shader.vertexShader
				
				shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", `
					
					vec3 transformed;
					
					if (vInstanceColor[3] <= 0.0) transformed = vec3(-1, -1, -1);
					else {
						mat4 aInstanceMatrix = mat4(
							aInstanceMatrix0,
							aInstanceMatrix1,
							aInstanceMatrix2,
							aInstanceMatrix3
						);
						
						transformed = (aInstanceMatrix * vec4(position , 1)).xyz;
					}
				`)
				
				shader.vertexShader = shader.vertexShader.replace("#include <color_vertex>", `
					#include <color_vertex>
					vInstanceColor = aInstanceColor;
					vInstanceEmissive = aInstanceEmissive;
				`)
				
				shader.fragmentShader = `
					varying vec4 vInstanceColor;
					varying vec3 vInstanceEmissive;
				` + shader.fragmentShader
				
				shader.fragmentShader = shader.fragmentShader.replace("vec4 diffuseColor = vec4( diffuse, opacity );", `
					vec4 diffuseColor = vInstanceColor;
				`)
				
				shader.fragmentShader = shader.fragmentShader.replace("vec3 totalEmissiveRadiance = emissive",
					"vec3 totalEmissiveRadiance = vInstanceEmissive;"
				)
				//print(shader.vertexShader)
			}
			
			this.mesh = new THREE.Mesh(instancedGeometry, material)
		}
	}
	
	//===========//
	// Functions //
	//===========//
	function setSpaceAtom(world, space, atom) {
		space.atom = atom
		if (atom == undefined) {
			world.setSpaceColour(space, false)
			return
		}
		atom.space = space
		world.setSpaceColour(space, atom.type.shaderColour, atom.type.shaderEmissive, atom.type.shaderOpacity)
	}
	
}