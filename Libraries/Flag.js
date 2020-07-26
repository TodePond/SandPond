
const Flag = (n) => n ** 2

Flag.and = (...args) => {
	if (args.length === 0) return Flag(0)
	if (args.length === 1) return args[0]
	return args[0] | Flag.and(...args.slice(1))
}
Flag.has = (flags, flag) => (flags & flag) > 0

