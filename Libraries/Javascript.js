
function JS(...args) {
	const js = args.length == 1? args[0].trim() : String.raw(...args).trim()
	const maker = new Function(`	return ${js}`)
	const result = maker()
	return result
}

JS.void = (...args) => {
	const js = args.length == 1? args[0].trim() : String.raw(...args).trim()
	const maker = new Function(`	${js}`)
	const result = maker()
	return result
}

function Code(...args) {
	const code = String.raw(...args)
	const lines = code.split("\n")
	if (lines.length <= 1) return lines[0]
	let depth = 0
	for (let i = 0; i < lines[1].length; i++) {
		const c = lines[1][i]
		if (c == "	") depth++
		else break
	}
	const newLines = lines.map((line, l) => {
		if (l == 0) return ""
		else return line.slice(depth)		
	})
	const newCode = newLines.slice(1).join("\n")
	return newCode
}