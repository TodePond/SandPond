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
	SYMMETRY.TYPE["X"] = SYMMETRY.make("X", [
		T("xyz"),
		T("-xyz"),
	])
	
	SYMMETRY.TYPE["Y"] = SYMMETRY.make("X", [
		T("xyz"),
		T("x-yz"),
	])
	
	SYMMETRY.TYPE["Z"] = SYMMETRY.make("X", [
		T("xyz"),
		T("xy-z"),
	])
}
