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
	
	const noFloorMaterial = new THREE.MeshLambertMaterial({color: "white", emissive: "grey", opacity: 0.0, transparent: true})
	const noFloorMaterials = [
		noFloorMaterial,
		noFloorMaterial,
		noFloorMaterial,
		noFloorMaterial,
		noFloorMaterial,
		noFloorMaterial,
	]
	
	function makeFloor(FLOOR_TYPE, width, depth) {
		const floorGeometry = new THREE.BoxGeometry(width, ATOM_SIZE, depth)
		const floor = new THREE.Mesh(floorGeometry, FLOOR_TYPE == "floor"? floorMaterials : noFloorMaterials)
		floor.position.set(0, -1 * ATOM_SIZE, 0)
		//floor.castShadow = true
		//floor.receiveShadow = true
		return floor
	}
	
	function make2DFloor(FLOOR_TYPE, width, height) {
		const floorGeometry = new THREE.BoxGeometry(width, height, ATOM_SIZE)
		const floor = new THREE.Mesh(floorGeometry, floorMaterials)
		floor.position.set(0, height / 2, -1 * ATOM_SIZE)
		return floor
	}

}