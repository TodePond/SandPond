//=======//
// World //
//=======//
const WORLD = {}
{
	
	// World Job Description
	//======================
	// "I store my SPACES."
	// "I draw myself."
	//
	// GRID: keep a huge 3D grid of spaces
	// MESH: keep one giant mesh that renders to display all spaces in this world
	// ATTRIBUTES and INSTANCES: a fancy way of telling the renderer how to render the mesh
	
	//========//
	// Public //
	//========//
	WORLD.make = (rawArea) => {
	
		const world = {}
		const area = readArea(rawArea)
		const grid = makeSpacesGrid(world, area)
		const spaces = getSpacesArray(grid, area)
		const count = spaces.length
		
		const matrixInstances = makeMatrixInstances(count)
		const colourInstances = new Uint8Array(count * 4)
		const emissiveInstances = new Uint8Array(count * 3)
		const visibleInstances = new Uint8Array(count)
		
		const matrixAttributes = makeMatrixAttributes(matrixInstances)
		const colourAttribute = new THREE.InstancedBufferAttribute(colourInstances, 4, true)
		const emissiveAttribute = new THREE.InstancedBufferAttribute(emissiveInstances, 3, true)
		const visibleAttribute = new THREE.InstancedBufferAttribute(visibleInstances, 1)
		
		colourAttribute.usage = THREE.DynamicDrawUsage
		emissiveAttribute.usage = THREE.DynamicDrawUsage
		visibleAttribute.usage = THREE.DynamicDrawUsage
		
		const geometry = makeGeometry(GEOMETRY_TEMPLATE)
		addMatrixAttributes(geometry, matrixAttributes)
		geometry.setAttribute("aInstanceColor", colourAttribute)
		geometry.setAttribute("aInstanceEmissive", emissiveAttribute)
		geometry.setAttribute("aVisible", visibleAttribute)
		
		const mesh = makeMesh(geometry, MATERIAL)
		positionInstances(matrixInstances, matrixAttributes, grid, area)
		setInstancesVisible(visibleInstances, visibleAttribute, count)
		scene.add(mesh)
		
		world.o={
			colourAttribute,
			colourInstances,
			emissiveAttribute,
			emissiveInstances,
			visibleAttribute,
			visibleInstances,
			spaces,
			grid,
			area,
		}
		return world
	}
	
	WORLD.selectSpace = (world, x, y, z) => {
		return selectGridSpace(world.grid, x, y, z)
	}
	
	WORLD.setSpaceColour = (world, space, colour, emissive, opacity) => {
		
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
	
	WORLD.setVisible = (world, space, visible) => {
		world.visibleInstances[space.id] = visible
		world.visibleAttribute.needsUpdate = true
	}
	
	//=========//
	// Globals //
	//=========//
	/*
	
		Note: I edit the transform function too early man. or something
		Or at least, I edit the transform function, but leave the "position" untouched.
		Check out where mr doob's instance matrix thing happens - its a bit later.
		It also looks like he edits it in a way that propogates down to further shading.
		try this out yo.
	
	*/
	const HIDDEN_MATRIX = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 10, 0, 1]
	const GEOMETRY_TEMPLATE = new THREE.BoxBufferGeometry(1, 1, 1)
	const MATERIAL = new THREE.MeshLambertMaterial({
		transparent: true,
		opacity: 0.0,
		premultipliedAlpha: true,
		//depthFunc: THREE.NotEqualDepth,
		//depthWrite: true,
		//side: THREE.DoubleSide,
		onBeforeCompile: (shader) => {
		
			shader.vertexShader = `
				attribute vec4 aInstanceMatrix0;
				attribute vec4 aInstanceMatrix1;
				attribute vec4 aInstanceMatrix2;
				attribute vec4 aInstanceMatrix3;
				
				attribute vec4 aInstanceColor;
				attribute vec3 aInstanceEmissive;
				
				attribute float aVisible;
				
				varying vec4 vInstanceColor;
				varying vec3 vInstanceEmissive;
				
				const mat4 mHidden = mat4(1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, -10.0, 0.0, 1.0);
				
			` + shader.vertexShader
			
			/*shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", `
				
				vec3 transformed;
				
				if (aVisible <= 0.0) transformed = (mHidden * vec4(position, 1)).xyz;
				else {
					mat4 aInstanceMatrix = mat4(
						aInstanceMatrix0,
						aInstanceMatrix1,
						aInstanceMatrix2,
						aInstanceMatrix3
					);
					
					transformed = (aInstanceMatrix * vec4(position, 1)).xyz;
				}
				
			`)*/
			
			shader.vertexShader = shader.vertexShader.replace("#include <project_vertex>", `
				
				vec4 mvPosition = vec4(0.0, 0.0, 0.0, 0.0);
				
				if (aVisible <= 0.0) mvPosition = vec4(0.0, 0.0, 0.0, 0.0);
				else {
					mat4 aInstanceMatrix = mat4(
						aInstanceMatrix0,
						aInstanceMatrix1,
						aInstanceMatrix2,
						aInstanceMatrix3
					);
					
					mvPosition = vec4((aInstanceMatrix * vec4(position, 1)).xyz, 1.0);
				}
				
				#ifdef USE_INSTANCING
					mvPosition = instanceMatrix * mvPosition;
				#endif
				mvPosition = modelViewMatrix * mvPosition;
				gl_Position = projectionMatrix * mvPosition;
			`)
			
			shader.vertexShader = shader.vertexShader.replace("#include <color_vertex>", `
				#include <color_vertex>
				vInstanceColor = aInstanceColor;
				vInstanceEmissive = aInstanceEmissive;
			`)
			
			//shader.fragmentShader = "ERRORRR" + shader.fragmentShader
			
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
			
			print(shader.vertexShader)
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
					const space = SPACE.make(world, id)
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
	
	const selectGridSpace = (grid, x, y, z) => {
		const gridy = grid[y]
		if (!gridy) return
		const gridyx = gridy[x]
		if (!gridyx) return
		return gridyx[z]
	}
	
	//===========//
	// Instances //
	//===========//
	const makeMatrixInstances = (count) => [
		new Float32Array(count * 4),
		new Float32Array(count * 4),
		new Float32Array(count * 4),
		new Float32Array(count * 4),
	]
	
	//============//
	// Attributes //
	//============//	
	const makeMatrixAttributes = (instances) => {
		const attributes = [
			new THREE.InstancedBufferAttribute(instances[0], 4),
			new THREE.InstancedBufferAttribute(instances[1], 4),
			new THREE.InstancedBufferAttribute(instances[2], 4),
			new THREE.InstancedBufferAttribute(instances[3], 4),
		]
		
		for (let i = 0; i < 4; i++) {
			const attribute = attributes[i]
			attribute.usage = THREE.DynamicDrawUsage
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
			geometry.setAttribute(`aInstanceMatrix${i}`, attribute)
		}
	}
	
	const addColourAttribute = (geometry, attribute) => {
		geometry.setAttribute("aInstanceColor", attribute)
	}
	
	const addEmissiveAttribute = (geometry, attribute) => {
		geometry.setAttribute("aInstanceEmissive", attribute)
	}
	
	const addVisibleAttribute = (geometry, attribute) => {
		geometry.setAttribute("aVisible", attribute)
	}
	
	//==========//
	// Position //
	//==========//
	const dummy = new THREE.Object3D()
	getMatrixWorld = (x, y, z) => {
		dummy.position.set(x, y, z)
		dummy.updateMatrixWorld()
		return dummy.matrixWorld.elements
	}
	
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
		const matrixWorld = getMatrixWorld(x, y, z)
		for (let a = 0; a < 4; a++) {
			for (let m = 0; m < 4; m++) {
				matrixInstances[a][id*4 + m] = matrixWorld[a*4 + m]
			}
			matrixAttributes[a].needsUpdate = true
		}
	}
	
	//============//
	// Appearance //
	//============//
	const setInstancesVisible = (visibleInstances, visibleAttribute, count, visible) => {
		for (let id = 0; id < count; id++) {
			setInstanceVisible(visibleInstances, visibleAttribute, id, visible)
		}
	}
	
	const setInstanceVisible = (visibleInstances, visibleAttribute, id, visible) => {
		const value = visible? 1 : 0
		visibleInstances[id] = value
		visibleAttribute.needsUpdate = true
	}
}