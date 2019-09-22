//=======//
// Voxel //
//=======//

{

	const geometry = new THREE.BoxGeometry(1, 1, 1)
	
	function makeVoxel(atomType, ...positionArgs) {
		
		const material = atomType.material
		const mesh = new THREE.Mesh(geometry, material)
		
		mesh.matrixAutoUpdate = false
		mesh.position.set(...positionArgs)
		mesh.updateMatrix()
		return mesh
	}
	
}