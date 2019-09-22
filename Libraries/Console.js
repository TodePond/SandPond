const print = console.log.bind(console)

Reflect.defineProperty(Object.prototype, "d", {
	get() {
		print(this.valueOf())
		return this.valueOf()
	}
})