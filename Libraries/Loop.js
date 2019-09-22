//======//
// Loop //
//======//
function repeat(number, func) {
	for (let i = 0; i < number; i++) {
		func(i)
	}
}

Number.prototype[Symbol.iterator] = function*() {
	if (this == 0) yield 0
	if (this > 0) {
		for (let i = 0; i <= this; i++) {
			yield i
		}
	}
	else {
		for (let i = 0; i >= this; i--) {
			yield i
		}
	}
}

Object.prototype[Symbol.iterator] = function*() {
	for (const propertyName in this) {
		yield this[propertyName]
	}
}