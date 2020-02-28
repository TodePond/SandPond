Reflect.defineProperty(Object.prototype, "is", {
	value(type) {
		if (type instanceof Type) return type.check(this)
		try   { return this instanceof type }
		catch { return false }
	}
})

Reflect.defineProperty(Object.prototype, "as", {
	value(type) {
		if (type instanceof Type) return type.convert(this)
		try {
			return type(this)
		} 
		catch {}
	}
})

Reflect.defineProperty(Object.prototype, "and", {
	value(type2) {
		const type1 = this
		return new Type ({
			name: `${type1.name} and ${type2.name}`,
			check: (v) => v.is(type1) && v.is(type2),
			convert: (v) => v.as(type1).as(type2),
			depth: Math.max(getTypeDepth(type1), getTypeDepth(type2)) + 1,
		})
	}
})

Reflect.defineProperty(Object.prototype, "or", {
	value(type2) {
		const type1 = this
		return new Type ({
			name: `${type1.name} or ${type2.name}`,
			check: (v) => v.is(type1) || v.is(type2),
			convert: (v) => {
				try   { return v.as(type1).as(type2)}
				catch { 
					try   { return v.as(type1) }
					catch { return v.as(type2) }
				}
			},
			depth: Math.min(getTypeDepth(type1), getTypeDepth(type2)) - 0.01,
		})
	},
	writable: true,
})

class Type {
	constructor({name, check, convert, depth = 2}) {
		this.name = name
		this.check = check
		this.convert = convert
		this.depth = depth
	}
}

const Any = new Type({
	name: "Any",
	check: (a) => true,
	depth: -1,
})

const Int = new Type({
	name: "Int",
	check: (n) => n % 1 == 0,
	convert: (n) => parseInt(n),
})

const Even = new Type({
	name: "Even",
	check: (n) => n % 2 == 0,
})

const Odd = new Type({
	name: "Odd",
	check: (n) => n % 2 != 0,
})

const Positive = new Type({
	name: "Positive",
	check: (n) => n >= 0,
	convert: (n) => Math.abs(n),
})

const UInt = Int.and(Positive)

const UpperCase = new Type({
	name: "UpperCase",
	check: (s) => s == s.as(UpperCase),
	convert: (s) => s.toUpperCase(),
})

const LowerCase = new Type({
	name: "LowerCase",
	check: (s) => s == s.as(LowerCase),
	convert: (s) => s.toLowerCase(),
})

const WhiteSpace = new Type({
	name: "WhiteSpace",
	check: (s) => /^[ |	]*$/.test(s),
})

const Capitalised = new Type({
	name: "Capitalised",
	check: s => s[0] == s[0].as(UpperCase),
	convert: s => s.slice(0, 1).as(UpperCase) + s.slice(1),
})

const ObjectLiteral = new Type({
	name: "ObjectLiteral",
	check: o => o.constructor == Object,
})

const Primitive = new Type({
	name: "Primitive",
	check: p => p.is(Number) || p.is(String) || p.is(RegExp) || p.is(Symbol),
})
