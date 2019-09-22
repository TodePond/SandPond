//==========//
// Lighting //
//==========//
function makeSun() {
	const sun = new THREE.DirectionalLight()
	sun.position.set(-200, 400, 100)
	return sun
}

function makeBackground() {
	const background = new THREE.Color()
	background.setHSL(Math.random(), 1, 0.92)
	return background
}