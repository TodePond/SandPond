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
		const {grid, spaces, spacesShuffled} = makeSpacesGrid(world, area)
		const count = spaces.length
		
		const geometry = GEOMETRY_TEMPLATE
		const material = MATERIAL
		const mesh = new THREE.InstancedMesh(geometry, material, count)
		
		if (SHADOW_MODE) {
			mesh.castShadow = true
			mesh.receiveShadow = true
		}
		
		const visibleInstances = new Uint8Array(count)
		const visibleAttribute = new THREE.InstancedBufferAttribute(visibleInstances, 1)
		visibleAttribute.usage = THREE.DynamicDrawUsage
		geometry.setAttribute("aVisible", visibleAttribute)
		
		const opacityInstances = new Uint8Array(count)
		const opacityAttribute = new THREE.InstancedBufferAttribute(opacityInstances, 1, true)
		opacityAttribute.usage = THREE.DynamicDrawUsage
		geometry.setAttribute("aOpacity", opacityAttribute)
		
		const colourInstances = new Uint8Array(count * 3)
		const colourAttribute = new THREE.InstancedBufferAttribute(colourInstances, 3, true)
		colourAttribute.usage = THREE.DynamicDrawUsage
		geometry.setAttribute("aColour", colourAttribute)
		
		const emissiveInstances = new Uint8Array(count * 3)
		const emissiveAttribute = new THREE.InstancedBufferAttribute(emissiveInstances, 3, true)
		emissiveAttribute.usage = THREE.DynamicDrawUsage
		geometry.setAttribute("aEmissive", emissiveAttribute)
		
		initPosition(mesh, grid, area)
		initVisible(visibleInstances, visibleAttribute, count)
		initOpacity(opacityInstances, opacityAttribute, count)
		//mesh.position.set(mesh.position.x - 0.75, mesh.position.y, mesh.position.z)
		scene.add(mesh)
		
		world.o={
			spaces, grid, area, spacesShuffled,
			visibleInstances, visibleAttribute,
			opacityInstances, opacityAttribute,
			colourInstances, colourAttribute,
			emissiveInstances, emissiveAttribute,
			mesh,
		}
		
		for (const space of world.spaces) {
			SPACE.updateAppearance(space, world)
		}
		
		EVENTWINDOW.updateWorld(world)
		
		return world
	}
	
	WORLD.selectSpace = (world, x, y, z) => {
		return selectGridSpace(world.grid, x, y, z)
	}
	
	WORLD.setSpaceColour = (world, space, colour, emissive) => {
		
		world.colourInstances[space.colourOffset0] = colour.r
		world.colourInstances[space.colourOffset1] = colour.g
		world.colourInstances[space.colourOffset2] = colour.b
		
		world.emissiveInstances[space.colourOffset0] = emissive.r
		world.emissiveInstances[space.colourOffset1] = emissive.g
		world.emissiveInstances[space.colourOffset2] = emissive.b
		
		world.colourAttribute.needsUpdate = true
		world.emissiveAttribute.needsUpdate = true
	}
	
	WORLD.setSpaceVisible = (world, space, visible) => {
		world.visibleInstances[space.id] = visible
		world.visibleAttribute.needsUpdate = true
	}
	
	WORLD.setSpaceOpacity = (world, space, opacity) => {
		world.opacityInstances[space.id] = opacity
		world.opacityAttribute.needsUpdate = true
	}
	
	//=========//
	// Globals //
	//=========//
	const HIDDEN_MATRIX = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 10, 0, 1]
	const GEOMETRY_TEMPLATE = new THREE.BoxBufferGeometry(1 * ATOM_SIZE * ATOM_SCALE, 1 * ATOM_SIZE * ATOM_SCALE, 1 * ATOM_SIZE * ATOM_SCALE)
	//const GEOMETRY_TEMPLATE = new THREE.SphereBufferGeometry(1 * ATOM_SIZE * ATOM_SCALE)
	const MATERIAL = new THREE.MeshLambertMaterial({
		transparent: true,
		opacity: 0,
		flatShading: true,
		//premultipliedAlpha: true,
		//depthTest: false,
		//depthFunc: THREE.NotEqualDepth,
		//depthWrite: false,
		//side: THREE.DoubleSide,
		onBeforeCompile: (shader) => {
		
			shader.vertexShader = `
			
				attribute float aVisible;
				attribute float aOpacity;
				attribute vec3 aColour;
				attribute vec3 aEmissive;
				
				varying float vOpacity;
				varying vec3 vColour;
				varying vec3 vEmissive;
				
				#define LAMBERT
				varying vec3 vLightFront;
				varying vec3 vIndirectFront;
				#ifdef DOUBLE_SIDED
					varying vec3 vLightBack;
					varying vec3 vIndirectBack;
				#endif
				#include <common>
				#include <uv_pars_vertex>
				#include <uv2_pars_vertex>
				#include <envmap_pars_vertex>
				#include <bsdfs>
				#include <lights_pars_begin>
				#include <color_pars_vertex>
				#include <fog_pars_vertex>
				#include <morphtarget_pars_vertex>
				#include <skinning_pars_vertex>
				#include <shadowmap_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>
				void main() {
					#include <uv_vertex>
					#include <uv2_vertex>
					#include <color_vertex>
					
					vOpacity = aOpacity;
					vColour = aColour;
					vEmissive = aEmissive;
					
					#include <beginnormal_vertex>
					#include <morphnormal_vertex>
					#include <skinbase_vertex>
					#include <skinnormal_vertex>
					#include <defaultnormal_vertex>
				
					vec3 transformed;
					if (aVisible <= 0.0) {
						//transformed = position;
						transformed = vec3(0.0, 0.0, 0.0);
					}
					else {
						transformed = position;
					}
					
					#include <morphtarget_vertex>
					#include <skinning_vertex>
					#include <project_vertex>
					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <worldpos_vertex>
					#include <envmap_vertex>
					#include <lights_lambert_vertex>
					#include <shadowmap_vertex>
					#include <fog_vertex>
				}
			`
			
			shader.fragmentShader = `
			
				varying float vOpacity;
				varying vec3 vColour;
				varying vec3 vEmissive;
			
				uniform vec3 diffuse;
				uniform vec3 emissive;
				uniform float opacity;
				varying vec3 vLightFront;
				varying vec3 vIndirectFront;
				#ifdef DOUBLE_SIDED
					varying vec3 vLightBack;
					varying vec3 vIndirectBack;
				#endif
				#include <common>
				#include <packing>
				#include <dithering_pars_fragment>
				#include <color_pars_fragment>
				#include <uv_pars_fragment>
				#include <uv2_pars_fragment>
				#include <map_pars_fragment>
				#include <alphamap_pars_fragment>
				#include <aomap_pars_fragment>
				#include <lightmap_pars_fragment>
				#include <emissivemap_pars_fragment>
				#include <envmap_common_pars_fragment>
				#include <envmap_pars_fragment>
				#include <bsdfs>
				#include <lights_pars_begin>
				#include <fog_pars_fragment>
				#include <shadowmap_pars_fragment>
				#include <shadowmask_pars_fragment>
				#include <specularmap_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>
				void main() {
					#include <clipping_planes_fragment>
					vec4 diffuseColor = vec4( vColour, vOpacity );
					ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
					vec3 totalEmissiveRadiance = vEmissive;
					#include <logdepthbuf_fragment>
					#include <map_fragment>
					#include <color_fragment>
					#include <alphamap_fragment>
					#include <alphatest_fragment>
					#include <specularmap_fragment>
					#include <emissivemap_fragment>
					reflectedLight.indirectDiffuse = getAmbientLightIrradiance( ambientLightColor );
					#ifdef DOUBLE_SIDED
						reflectedLight.indirectDiffuse += ( gl_FrontFacing ) ? vIndirectFront : vIndirectBack;
					#else
						reflectedLight.indirectDiffuse += vIndirectFront;
					#endif
					#include <lightmap_fragment>
					reflectedLight.indirectDiffuse *= BRDF_Diffuse_Lambert( diffuseColor.rgb );
					#ifdef DOUBLE_SIDED
						reflectedLight.directDiffuse = ( gl_FrontFacing ) ? vLightFront : vLightBack;
					#else
						reflectedLight.directDiffuse = vLightFront;
					#endif
					reflectedLight.directDiffuse *= BRDF_Diffuse_Lambert( diffuseColor.rgb ) * getShadowMask();
					#include <aomap_fragment>
					vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
					#include <envmap_fragment>
					gl_FragColor = vec4( outgoingLight, diffuseColor.a );
					#include <tonemapping_fragment>
					#include <encodings_fragment>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>
					#include <dithering_fragment>
				}
			`
			
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
		const spaces = []
		let id = 0
		
		const ys = area.yStart.to(area.yEnd)
		const xs = area.xStart.to(area.xEnd)
		const zs = area.zStart.to(area.zEnd)
		
		const xzs = xs.map(x => zs.map(z => [x, z])).flat()
		const xyzs = xs.map(x => ys.map(y => zs.map(z => [x, y, z]))).flat().flat()
		
		/*if (PURE_RANDOM_MODE) for (const [x, y, z] of xyzs.shuffled) {
			if (grid[y] == undefined) grid[y] = []
			if (grid[y][x] == undefined) grid[y][x] = []
			const space = SPACE.make(world, id, new Empty())
			spaces.push(space)
			grid[y][x][z] = space
			id++
		}
		else*/ for (const y of ys) {
			grid[y] = []
			for (const [x, z] of xzs.shuffled) {
				if (grid[y][x] == undefined) grid[y][x] = []
				const space = SPACE.make(world, id, new Empty())
				spaces.push(space)
				grid[y][x][z] = space
				id++
			}
		}
		
		const spacesShuffled = spaces.shuffled
		
		return {grid, spaces, spacesShuffled}
	}
	
	const voidAtom = new Void()
	const voidSpace = {atom: voidAtom, element: Void}
	
	const selectGridSpace = (grid, x, y, z) => {
		const gridy = grid[y]
		if (!gridy) return voidSpace
		const gridyx = gridy[x]
		if (!gridyx) return voidSpace
		const space = gridyx[z]
		if (!space) return voidSpace
		return space
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
	getMatrix = (x, y, z) => {
		dummy.position.set(x * ATOM_SIZE, y * ATOM_SIZE, z * ATOM_SIZE)
		dummy.updateMatrix()
		return dummy.matrix.clone()
	}
	
	const initPosition = (mesh, grid, area) => {
		for (const y of area.yStart.to(area.yEnd)) {
			for (const x of area.xStart.to(area.xEnd)) {
				for (const z of area.zStart.to(area.zEnd)) {
					const space = grid[y][x][z]
					const matrix = getMatrix(x, y, z)
					space.matrix = matrix
					mesh.setMatrixAt(space.id, matrix)
				}
			}
		}
	}
	
	const hidePosition = getMatrix(0, -2, -2)
	WORLD.hideSpace = (world, space) => {
		world.mesh.setMatrixAt(space.id, hidePosition)
		world.mesh.instanceMatrix.needsUpdate = true
	}
	
	WORLD.showSpace = (world, space) => {
		world.mesh.setMatrixAt(space.id, space.matrix)
		world.mesh.instanceMatrix.needsUpdate = true
	}
	
	//============//
	// Appearance //
	//============//
	const initVisible = (visibleInstances, visibleAttribute, count) => {
		for (let id = 0; id < count; id++) {
			setInstanceVisible(visibleInstances, visibleAttribute, id, true)
		}
	}
	
	const setInstanceVisible = (visibleInstances, visibleAttribute, id, visible) => {
		const value = visible? 1 : 0
		visibleInstances[id] = value
		visibleAttribute.needsUpdate = true
	}
	
	const initOpacity = (opacityInstances, opacityAttribute, count) => {
		for (let id = 0; id < count; id++) {
			setInstanceOpacity(opacityInstances, opacityAttribute, id, 0.0)
		}
	}
	
	const setInstanceOpacity = (opacityInstances, opacityAttribute, id, opacity) => {
		opacityInstances[id] = opacity
		opacityAttribute.needsUpdate = true
	}
}