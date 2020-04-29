/*=======//
// Array //
//=======*/
Reflect.defineProperty(Array.prototype, "last", {
	get() {
		return this[this.length-1]
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

Reflect.defineProperty(Array.prototype, "shuffled", {
	get() {
		return [...this].sort(() => Math.random() - 0.5)
	},
})

Reflect.defineProperty(Array.prototype, "first", {
	get() {
		return this[0]
	},
})

Reflect.defineProperty(Array.prototype, "pull", {
	value(value) {
		const index = this.indexOf(value)
		if (index > -1) this.splice(index, 1)
	},
})

Reflect.defineProperty(Array.prototype, "trim", {
	value() {
		const lastIndex = this.length-1
		if (this[lastIndex] == undefined) {
			const trimmed = this.slice(0, lastIndex)
			return trimmed.trim()
		}
		return this
	}
})

Reflect.defineProperty(Array.prototype, "repeat", {
	value(n) {
		const array = []
		for (let i = 0; i < n; i++) {
			array.push(...this)
		}
		return array
	}
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

/*=====//
// Set //
//=====*/
Reflect.defineProperty(Set.prototype, "first", {
	get() {
		return this.values().first
	}
})

Reflect.defineProperty(Set.prototype, "last", {
	get() {
		return this.values().last
	}
})

Reflect.defineProperty(Set.prototype, "reversed", {
	get() {
		return this.values().reversed
	}
})

Reflect.defineProperty(Set.prototype, "length", {
	get() {
		return this.size
	},
})

/*=====//
// Set //
//=====*/
Reflect.defineProperty(String.prototype, "map", {
	value(...args) {
		const array = this.split("")
		const mappedArray = array.map(...args)
		const mappedString = mappedArray.join("")
		return mappedString
	},
})