//=======//
// Floor //
//=======//
{

	const floorMaterial = new THREE.MeshLambertMaterial({color: "white", emissive: "grey"})
	const floorMaterials = [
		floorMaterial,
		floorMaterial,
		floorMaterial,
		floorMaterial,
		floorMaterial,
		floorMaterial,
	]
	
	function makeFloor(width, depth) {
		const floorGeometry = new THREE.BoxGeometry(width, 1, depth)
		const floor = new THREE.Mesh(floorGeometry, floorMaterials)
		floor.position.set(0, -1, 0)
		//floor.castShadow = true
		//floor.receiveShadow = true
		return floor
	}
	
	function make2DFloor(width, height) {
		const floorGeometry = new THREE.BoxGeometry(width, height, 1)
		const floor = new THREE.Mesh(floorGeometry, floorMaterials)
		floor.position.set(0, height / 2, -1)
		return floor
	}

}