//==========//
// Lighting //
//==========//
function makeSun(is2D = false) {
	const sun = new THREE.DirectionalLight()
	sun.position.set(-200, 400, 100)
	
	if (SHADOW_MODE) {
		sun.castShadow = true
		sun.shadow.mapSize.width = 1024
		sun.shadow.mapSize.height = 1024
		sun.shadow.camera.near = 450
		sun.shadow.camera.far = 475
		sun.shadow.bias = -0.0004
	}
	
	//const helper = new THREE.CameraHelper(sun.shadow.camera)
	//scene.add(helper)
	
	if (is2D) sun.position.set(-200, 100, 400)
	return sun
}

/*function makeBackground() {
	const background = new THREE.Color()
	background.setHSL(Math.random(), 1, 0.92)
	return background
}*/

const bgColour = new THREE.Color()
bgColour.setHSL(Math.random(), 1, 0.85)
const bgColourString = `rgb(${Math.floor(bgColour.r * 255)}, ${Math.floor(bgColour.g * 255)}, ${Math.floor(bgColour.b * 255)})`

function makeBackground() {
	return bgColour
}

function createScreen() {
	//const geo = new THREE.PlaneGeometry(WORLD_WIDTH * ATOM_SIZE, WORLD_HEIGHT * ATOM_SIZE
	const geo = new THREE.PlaneGeometry(WORLD_WIDTH, WORLD_HEIGHT)
	const mat = new THREE.MeshBasicMaterial({
		color: bgColour,
		side: THREE.FrontSide,
	})
	
	const mesh0 = new THREE.Mesh(geo, mat)
	mesh0.frustrumCulled = false
	mesh0.position.set (
		mesh0.position.x,
		mesh0.position.y + ((WORLD_HEIGHT-1) * ATOM_SIZE) / 2,
		mesh0.position.z - ((WORLD_DEPTH) * ATOM_SIZE) / 2,
	)
	if (D2_MODE) mesh0.position.z -= ATOM_SIZE
	scene.add(mesh0)
	
	const mesh1 = new THREE.Mesh(geo, mat)
	mesh1.frustrumCulled = false
	mesh1.position.set (
		mesh1.position.x,
		mesh1.position.y + ((WORLD_HEIGHT-1) * ATOM_SIZE) / 2,
		mesh1.position.z + ((WORLD_DEPTH) * ATOM_SIZE) / 2,
	)
	mesh1.rotateY(Math.PI)
	scene.add(mesh1)
	
	const mesh2 = new THREE.Mesh(geo, mat)
	mesh2.frustrumCulled = false
	mesh2.position.set (
		mesh2.position.x - ((WORLD_WIDTH) * ATOM_SIZE) / 2,
		mesh2.position.y + ((WORLD_HEIGHT-1) * ATOM_SIZE) / 2,
		mesh2.position.z,
	)
	mesh2.rotateY(Math.PI / 2)
	scene.add(mesh2)
	
	const mesh3 = new THREE.Mesh(geo, mat)
	mesh3.frustrumCulled = false
	mesh3.position.set (
		mesh3.position.x + ((WORLD_WIDTH) * ATOM_SIZE) / 2,
		mesh3.position.y + ((WORLD_HEIGHT-1) * ATOM_SIZE) / 2,
		mesh3.position.z,
	)
	mesh3.rotateY(-Math.PI / 2)
	scene.add(mesh3)
	
}