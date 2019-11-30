
function JS(...args) {
	const js = args.length == 1? args[0].trim() : String.raw(...args).trim()
	const maker = new Function(`return ${js}`)
	const result = maker()
	return result
}
