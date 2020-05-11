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
	}
	
	//const helper = new THREE.CameraHelper(sun.shadow.camera)
	//scene.add(helper)
	
	if (is2D) sun.position.set(-200, 100, 400)
	return sun
}

function makeBackground() {
	const background = new THREE.Color()
	background.setHSL(Math.random(), 1, 0.92)
	return background
}