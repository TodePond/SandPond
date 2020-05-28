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