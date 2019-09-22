Reflect.defineProperty(Function.prototype, "x", {
	set(arg) {
		this(arg)
	},
})

Reflect.defineProperty(Function.prototype, "o", {
	get() {
		return function(...boundArgs) {
			return (...otherArgs) => this(...boundArgs, ...otherArgs)
		}
	},
	
	set(assignments) {
		for (const propertyName in assignments) {
			const value = assignments[propertyName]
			this[propertyName] = value
		}
	},
})

Reflect.defineProperty(Object.prototype, "o", {

	get() {
		return new Proxy(this, {
			get: (target, propName) => {
				return target[propName].bind(this)
			}
		})
	},
	
	set(assignments) {
		for (const propertyName in assignments) {
			const value = assignments[propertyName]
			this[propertyName] = value
		}
	},
})

