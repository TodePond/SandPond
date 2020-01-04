//======//
// Math //
//======//
Math.gcd = (...args) => {

	
	const a = args[0]
	const b = args[1]
	if (args.length == 1) return a
	if (args.length > 2) return Math.gcd(a, Math.gcd(...args.slice(1)))

	if (b == 0) return a
	else return Math.gcd(b, a%b)
}

Math.reduce = (...args) => {
	const gcd = Math.gcd(...args)
	return args.map(n => n/gcd)
}