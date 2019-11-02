//==========//
// Lighting //
//==========//
function makeSun(is2D = false) {
	const sun = new THREE.DirectionalLight()
	sun.position.set(-200, 400, 100)
	if (is2D) sun.position.set(-200, 100, 400)
	return sun
}

function makeBackground() {
	const background = new THREE.Color()
	background.setHSL(Math.random(), 1, 0.92)
	return background
}