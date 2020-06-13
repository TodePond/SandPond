/*========//
// String //
//========*/
Reflect.defineProperty(String.prototype, "map", {
	value(...args) {
		const array = this.split("")
		const mappedArray = array.map(...args)
		const mappedString = mappedArray.join("")
		return mappedString
	},
})

Reflect.defineProperty(String.prototype, "filter", {
	value(...args) {
		const array = this.split("")
		const filteredArray = array.filter(...args)
		const filteredString = filteredArray.join("")
		return filteredString
	},
})