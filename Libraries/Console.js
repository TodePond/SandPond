const print = console.log.bind(console)
const dir = console.dir.bind(console)

{
	let i = 0
	function print9(message) {
		if (i >= 9) return
		print(message)
		i++
	}
	
	const D_SYMBOL = Symbol("d")
	Reflect.defineProperty(Object.prototype, "d", {
		set(v) { this[D_SYMBOL] = v },
		get() {
			if (this[D_SYMBOL] !== undefined) return this[D_SYMBOL]
			print(this.valueOf())
			return this.valueOf()
		},
	})
	
	const DIR_SYMBOL = Symbol("dir")
	Reflect.defineProperty(Object.prototype, "dir", {
		set(v) { this[DIR_SYMBOL] = v },
		get() {
			if (this[DIR_SYMBOL] !== undefined) return this[DIR_SYMBOL]
			console.dir(this.valueOf())
			return this.valueOf()
		},
	})
	
	Reflect.defineProperty(Symbol.prototype, "toDescription", {
		value() {
			return this.toString().slice(7, -1)
		},
	})
	
}