//==========//
// Symmetry //
//==========//
const SYMMETRY = {}

{
	
	const transformationCache = {}
	const getTransformation = (sig) => {
		if (transformationCache.has(sig)) return transformationCache[sig]
		const xSign = getAxisSign(sig, "x")
		const ySign = getAxisSign(sig, "y")
		const zSign = getAxisSign(sig, "z")
		const xAxis = getAxisAxis(sig, 0)
		const yAxis = getAxisAxis(sig, 1)
		const zAxis = getAxisAxis(sig, 2)
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
	
	SYMMETRY.TYPE.xyz = {}
	SYMMETRY.TYPE.xyz.rotations = SYMMETRY.make("XYZ.ROTATIONS", [
		T("xyz"),
		T("-xy-z"),
		T("zyx"),
		T("-zy-x"),
		T("yxz"),
		T("-y-xz"),
	])
}
