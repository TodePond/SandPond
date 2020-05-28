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
