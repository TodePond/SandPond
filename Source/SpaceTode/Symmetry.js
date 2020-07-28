//==========//
// Symmetry //
//==========//
const SYMMETRY = {}

{
	
	const transformationCache = {}
	const getTransformation = (sig) => {
		if (transformationCache.has(sig)) return transformationCache[sig]
		const xAxis = getAxisAxis(sig, 0)
		const yAxis = getAxisAxis(sig, 1)
		const zAxis = getAxisAxis(sig, 2)
		const xSign = getAxisSign(sig, xAxis)
		const ySign = getAxisSign(sig, yAxis)
		const zSign = getAxisSign(sig, zAxis)
		const code = `(x, y, z) => [${xSign}${xAxis}, ${ySign}${yAxis}, ${zSign}${zAxis}]`
		return JS(code)
		
	}
	
	const getAxisSign = (sig, axis) => {
		const head = sig.split(axis)[0]
		if (head[head.length-1] === "-") return "-"
		return ""
	}
	
	const getAxisAxis = (sig, axisId) => {
		const uSig = sig.filter(c => c === "x" || c === "y" || c === "z")
		return uSig[axisId]
	}
	
	const T = getTransformation
	
	SYMMETRY.make = (name, transformations) => ({name, transformations})
	SYMMETRY.TYPE = {}
	SYMMETRY.TYPE.x = SYMMETRY.make("X", [
		T("xyz"),
		T("-xyz"),
	])
	
	SYMMETRY.TYPE.y = SYMMETRY.make("X", [
		T("xyz"),
		T("x-yz"),
	])
	
	SYMMETRY.TYPE.z = SYMMETRY.make("X", [
		T("xyz"),
		T("xy-z"),
	])
	
	SYMMETRY.TYPE.xy = SYMMETRY.make("XY", [
		T("xyz"),
		T("-xyz"),
		T("x-yz"),
		T("-x-yz"),
		T("yxz"),
		T("-yxz"),
		T("y-xz"),
		T("-y-xz"),
	])
	
	SYMMETRY.TYPE.xy.reflections = SYMMETRY.make("XY.REFLECTIONS", [
		T("xyz"),
		T("yxz"),
	])
	
	SYMMETRY.TYPE.xy.shifts = SYMMETRY.make("XY.SHIFTS", [...SYMMETRY.TYPE.xy.transformations])
	
	SYMMETRY.TYPE.xy.rotations = SYMMETRY.make("XY.ROTATIONS", [
		T("xyz"),
		T("-yxz"),
		T("-x-yz"),
		T("y-xz"),
	])
	
	SYMMETRY.TYPE.xy.directions = SYMMETRY.make("XY.DIRECTIONS", [
		T("xyz"),
		T("-x-yz"),
		T("yxz"),
		T("-y-xz"),
	])
	
	SYMMETRY.TYPE.xy.others = SYMMETRY.make("XY.OTHERS", [
		() => [-2,2,0],  () => [-1,2,0],  () => [0,2,0],  () => [1,2,0], () => [2,2,0],
		() => [-2,1,0],  () => [-1,1,0],  () => [0,1,0],  () => [1,1,0], () => [2,1,0],
		() => [-2,0,0],  () => [-1,0,0],/*() => [0,0,0],*/  () => [1,0,0], () => [2,0, 0],
		() => [-2,-1,0], () => [-1,-1,0], () => [0,-1,0], () => [1,-1,0],() => [2,-1,0],
		() => [-2,-2,0], () => [-1,-2,0], () => [0,-2,0], () => [1,-2,0], () => [2,-2,0],
	])
	
	SYMMETRY.TYPE.xz = SYMMETRY.make("XZ", [
		T("xyz"),
		T("-xyz"),
		T("xy-z"),
		T("-xy-z"),
		T("zyx"),
		T("-zyx"),
		T("zy-x"),
		T("-zy-x"),
	])
	
	SYMMETRY.TYPE.xz.rotations = SYMMETRY.make("XZ.ROTATIONS", [
		T("xyz"),
		T("-xy-z"),
		T("zyx"),
		T("-zy-x"),
	])
	
	SYMMETRY.TYPE.yz = SYMMETRY.make("YZ", [
		T("xyz"),
		T("x-yz"),
		T("xy-z"),
		T("x-y-z"),
		T("xzy"),
		T("x-zy"),
		T("xz-y"),
		T("x-z-y"),
	])
	
	SYMMETRY.TYPE.yz.rotations = SYMMETRY.make("YZ.ROTATIONS", [
		T("xyz"),
		T("x-y-z"),
		T("xzy"),
		T("x-z-y"),
	])
	
	SYMMETRY.TYPE.yz.directions = SYMMETRY.make("YZ.DIRECTIONS", [
		T("xyz"),
		T("x-y-z"),
		T("xzy"),
		T("x-z-y"),
	])
	
	SYMMETRY.TYPE.xyz = {}
	
	SYMMETRY.TYPE.xyz.directions = SYMMETRY.make("XYZ.DIRECTIONS", [
		T("xyz"),
		T("-x-yz"),
		
		T("zxy"),
		T("z-x-y"),
		
		T("yzx"),
		T("-yz-x"),
	])
	
	SYMMETRY.TYPE.xyz.shifts = SYMMETRY.make("XYZ.SHIFTS", [
		T("xyz"),
		T("x-yz"),
		T("-xyz"),
		T("-x-yz"),
		
		T("zxy"),
		T("z-xy"),
		T("zx-y"),
		T("z-x-y"),
		
		T("yzx"),
		T("yz-x"),
		T("-yzx"),
		T("-yz-x"),
	])
	
	SYMMETRY.TYPE.xyz.rotations = SYMMETRY.make("XYZ.ROTATIONS", [
		T("xyz"),	T("xzy"),
		T("x-yz"),	T("xz-y"),
		T("-xyz"),	T("-xzy"),
		T("-x-yz"),	T("-xz-y"),
		
		T("zyx"),	T("yxz"),
		T("z-yx"),	T("-yxz"),
		T("zy-x"),	T("y-xz"),
		T("z-y-x"),	T("-y-xz"),
		
		T("zxy"),	T("yzx"),
		T("zx-y"),	T("-yzx"),
		T("z-xy"),	T("yz-x"),
		T("z-x-y"),	T("-yz-x"),
	])
	
	SYMMETRY.TYPE.xyz.others = SYMMETRY.make("XYZ.OTHERS", SITE_POSITIONS.filter((p, i) => i !== 12).map(p => () => p))
}
