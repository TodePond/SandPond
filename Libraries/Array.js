/*=======//
// Array //
//=======*/
Reflect.defineProperty(Array.prototype, "last", {
	get() {
		return this[this.length-1]
	},
})

Reflect.defineProperty(Array.prototype, "first", {
	get() {
		return this[0]
	},
})

Reflect.defineProperty(Array.prototype, "reversed", {
	get() {
		const reversed = []
		for (let i = this.length-1; i >= 0; i--) {
			reversed.push(this[i])
		}
		return reversed
	},
})

Reflect.defineProperty(Array.prototype, "uniques", {
	get() { return [...new Set(this)] },
})

Reflect.defineProperty(Array.prototype, "shuffled", {
	get() {
		return [...this].sort(() => Math.random() - 0.5)
	},
})

Reflect.defineProperty(Array.prototype, "pull", {
	value(value) {
		const index = this.indexOf(value)
		if (index > -1) this.splice(index, 1)
	},
})

// Returns the id of the value in the array
Reflect.defineProperty(Array.prototype, "pushUnique", {
	value(...args) {
		if (args.length == 0) return undefined
		if (args.length == 1) { 
			const value = args[0]
			const id = this.indexOf(value)
			if (id !== -1) return id
			return this.push(value) - 1
		}
		return args.map(arg => this.pushUnique(arg))
	},
})

Reflect.defineProperty(Array.prototype, "trimmed", {
	get() {
		if (this.length == 0) return [...this]
		const lastIndex = this.length-1
		if (this[lastIndex] == undefined) {
			const trimmed = this.slice(0, lastIndex)
			return trimmed.trim()
		}
		return [...this]
	}
})

Reflect.defineProperty(Array.prototype, "trim", {
	value() {
		if (this.length == 0) return this
		const lastIndex = this.length-1
		if (this[lastIndex] == undefined) {
			this.splice(-1, 1)
			return this.trim()
		}
		return this
	}
})

Reflect.defineProperty(Array.prototype, "repeated", {
	value(n) {
		const array = []
		for (let i = 0; i < n; i++) {
			array.push(...this)
		}
		return array
	}
})

Reflect.defineProperty(Array.prototype, "without", {
	value(value) {
		const array = []
		for (const v of this) {
			if (v !== value) array.push(v)
		}
		return array
	},
})

Number.prototype.to = function(target) {
	const number = this.valueOf()
	const array = []
	let iterator = 1
	let i = number
	
	if (number <= target) {
		while (i <= target) {
			array.push(i)
			i = i + 1
		}
	} else {
		while (target <= i) {
			array.push(i)
			i = i - 1
		}
	}
	return array
}

/*========//
// Object //
//========*/
// Breaks too much stuff
/*Reflect.defineProperty(Object.prototype, "map", {
	value(...args) {
		const array = Object.values(this)
		const mappedArray = array.map(...args)
		return mappedArray
	},
})*/