const print = console.log.bind(console)

{
	const D_SYMBOL = Symbol("d")
	Reflect.defineProperty(Object.prototype, "d", {
		set(v) { this[D_SYMBOL] = v },
		get() {
			if (this[D_SYMBOL] !== undefined) return this[D_SYMBOL]
			print(this.valueOf())
			return this.valueOf()
		},
	})
	
}