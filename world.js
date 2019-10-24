//=======//
// World //
//=======//
const World = {}
{
	
	//========//
	// Public //
	//========//
	World.make = (rawArea) => {
	
		const world = {}
		const area = readArea(rawArea)
		const grid = makeSpacesGrid(world, area)
		const spaces = getSpacesArray(grid, area)
		const count = spaces.length
		createEventWindows(grid, area)
		
		const matrixInstances = makeMatrixInstances(count)
		const colourInstances = makeColourInstances(count)
		const emissiveInstances = makeEmissiveInstances(count)
		
		const matrixAttributes = makeMatrixAttributes(matrixInstances)
		const colourAttribute = makeColourAttribute(colourInstances)
		const emissiveAttribute = makeEmissiveAttribute(emissiveInstances)
		
		const geometry = makeGeometry(GEOMETRY_TEMPLATE)
		addMatrixAttributes(geometry, matrixAttributes)
		addColourAttribute(geometry, colourAttribute)
		addEmissiveAttribute(geometry, emissiveAttribute)
		const mesh = makeMesh(geometry, MATERIAL)
		
		positionInstances(matrixInstances, matrixAttributes, grid, area)
		scene.add(mesh)
		
		world.o={
			colourAttribute,
			colourInstances,
			emissiveAttribute,
			emissiveInstances,
			spaces,
			grid,
		}
		return world
	}
	
	World.selectGridSpace = (grid, x, y, z) => {
		const gridy = grid[y]
		if (!gridy) return
		const gridyx = gridy[x]
		if (!gridyx) return
		return gridyx[z]
	}
	
	World.selectSpace = (world, x, y, z) => {
		return World.selectGridSpace(world.grid, x, y, z)
	}
	
	World.setSpaceColour = (world, space, colour, emissive, opacity) => {
		
		if (colour == false) {
			world.colourInstances[space.colourOffset0] = 0
			world.colourInstances[space.colourOffset1] = 0
			world.colourInstances[space.colourOffset2] = 0
			world.colourInstances[space.colourOffset3] = 0
			world.colourAttribute.needsUpdate = true
			return
		}
		
		world.colourInstances[space.colourOffset0] = colour.r
		world.colourInstances[space.colourOffset1] = colour.g
		world.colourInstances[space.colourOffset2] = colour.b
		world.colourInstances[space.colourOffset3] = opacity
		
		world.emissiveInstances[space.emissiveOffset0] = emissive.r
		world.emissiveInstances[space.emissiveOffset1] = emissive.g
		world.emissiveInstances[space.emissiveOffset2] = emissive.b
					
		world.colourAttribute.needsUpdate = true
		world.emissiveAttribute.needsUpdate = true
		
	}
	
	//=========//
	// Globals //
	//=========//
	const GEOMETRY_TEMPLATE = new THREE.BoxBufferGeometry(1, 1, 1)
	const MATERIAL = new THREE.MeshLambertMaterial({
		transparent: true,
		opacity: 1.0,
		depthFunc: THREE.LessEqualDepth,
		depthWrite: true,
		side: THREE.DoubleSide,
		onBeforeCompile: (shader) => {
		
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
		},
	})
	
	//======//
	// Grid //
	//======//
	const readArea = (rawArea) => {
		return {
			xStart: rawArea.x[0],
			xEnd:   rawArea.x[1],
			yStart: rawArea.y[0],
			yEnd:   rawArea.y[1],
			zStart: rawArea.z[0],
			zEnd:   rawArea.z[1],
		}
	}
	
	const makeSpacesGrid = (world, area) => {
		const grid = []
		let id = 0
		for (const y of area.yStart.to(area.yEnd)) {
			grid[y] = []
			for (const x of area.xStart.to(area.xEnd)) {
				grid[y][x] = []
				for (const z of area.zStart.to(area.zEnd)) {
					const space = Space.make(world, id)
					grid[y][x][z] = space
					id++
				}
			}
		}
		
		return grid
	}
	
	const getSpacesArray = (grid, area) => {
		const spaces = []
		for (const y of area.yStart.to(area.yEnd)) {
			for (const x of area.xStart.to(area.xEnd)) {
				for (const z of area.zStart.to(area.zEnd)) {
					const space = grid[y][x][z]
					spaces.push(space)
				}
			}
		}
		return spaces
	}
	
	const createEventWindows = (grid, area) => {
		for (const y of area.yStart.to(area.yEnd)) {
			for (const x of area.xStart.to(area.xEnd)) {
				for (const z of area.zStart.to(area.zEnd)) {
					const space = grid[y][x][z]
					space.eventWindow = makeEventWindow(grid, x, y, z)
				}
			}
		}
	}
	
	//===========//
	// Instances //
	//===========//
	const makeColourInstances = (count) => new Uint8Array(count * 4)
	const makeEmissiveInstances = (count) => new Uint8Array(count * 3)
	const makeMatrixInstances = (count) => [
		new Float32Array(count * 4),
		new Float32Array(count * 4),
		new Float32Array(count * 4),
		new Float32Array(count * 4),
	]
	
	//============//
	// Attributes //
	//============//
	const makeColourAttribute = (instances) => {
		const attribute = new THREE.InstancedBufferAttribute(instances, 4, true)
		attribute.dynamic = true
		return attribute
	}
	
	const makeEmissiveAttribute = (instances) => {
		const attribute = new THREE.InstancedBufferAttribute(instances, 3, true)
		attribute.dynamic = true
		return attribute
	}
	
	const makeMatrixAttributes = (instances) => {
		const attributes = [
			new THREE.InstancedBufferAttribute(instances[0], 4),
			new THREE.InstancedBufferAttribute(instances[1], 4),
			new THREE.InstancedBufferAttribute(instances[2], 4),
			new THREE.InstancedBufferAttribute(instances[3], 4),
		]
		
		for (let i = 0; i < 4; i++) {
			const attribute = attributes[i]
			attribute.dynamic = true
		}
		return attributes
	}
	
	//==========//
	// Geometry //
	//==========//
	const makeGeometry = (template) => new THREE.InstancedBufferGeometry().copy(template)
	const makeMesh = (geometry, material) => new THREE.Mesh(geometry, material)
	const addMatrixAttributes = (geometry, attributes) => {
		for (let i = 0; i < 4; i++) {
			const attribute = attributes[i]
			geometry.addAttribute(`aInstanceMatrix${i}`, attribute)
		}
	}
	
	const addColourAttribute = (geometry, attribute) => {
		geometry.addAttribute("aInstanceColor", attribute)
	}
	
	const addEmissiveAttribute = (geometry, attribute) => {
		geometry.addAttribute("aInstanceEmissive", attribute)
	}
	
	//==========//
	// Position //
	//==========//
	const positionInstances = (matrixInstances, matrixAttributes, grid, area) => {
		for (const y of area.yStart.to(area.yEnd)) {
			for (const x of area.xStart.to(area.xEnd)) {
				for (const z of area.zStart.to(area.zEnd)) {
					const space = grid[y][x][z]
					setInstancePosition(matrixInstances, matrixAttributes, space.id, x, y, z)
				}
			}
		}
	}
	
	const setInstancePosition = (matrixInstances, matrixAttributes, id, x, y, z) => {
		const object = new THREE.Object3D()
		object.position.set(x, y, z)
		object.updateMatrixWorld()
		
		for (let a = 0; a < 4; a++) {
			for (let m = 0; m < 4; m++) {
				matrixInstances[a][id*4 + m] = object.matrixWorld.elements[a*4 + m]
			}
			matrixAttributes[a].needsUpdate = true
		}
	}
	
}