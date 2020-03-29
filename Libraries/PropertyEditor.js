/*===================//
// PropertyEditor.js //
//===================*/
{

	const CACHE_SYMBOL = Symbol("CustomPropertyEditors")
	const DEFAULT_DESCRIPTOR = {
		value: undefined,
		get: (self, propertyName) => self._[propertyName].value,
		set: (v, self, propertyName) => self._[propertyName].value = v,
		type: Any,
		writable: true,
		enumerable: true,
		configurable: true,
		typeCheck: o=> true,
	}
	
	const BLANK_DESCRIPTOR = {
		value: undefined,
		get: undefined,
		set: undefined,
		type: undefined,
		writable: undefined,
		enumerable: undefined,
		configurable: true,
		typeCheck: undefined,
	}
	
	const __SYMBOL = Symbol("_")
	
	Reflect.defineProperty(Object.prototype, "_", {
		set(v) { this[__SYMBOL] = v },
		get() {
			if (this[__SYMBOL] !== undefined) return this[__SYMBOL]
			return new Proxy(this, {
				get: forceGetEditor,
				set: forceSetEditor,
			})
		},
		has() {
			return this[__SYMBOL] == undefined
		}
	})
	
	const forceGetEditor = (object, propertyName) => {
		const cache = forceGetCache(object)
		const editor = cache[propertyName]
		if (editor == undefined) return new PropertyEditor(object, propertyName)
		return editor
	}
	
	const forceSetEditor = (object, propertyName, descriptor) => {
		const editor = forceGetEditor(object, propertyName)
		editor.readDescriptor(descriptor)
		editor.update()
	}
	
	const forceGetCache = (object) => {
		const cache = getCache(object)
		if (cache == undefined) return createCache(object)
		return cache
	}
	
	const getCache = (object) => {
		return object[CACHE_SYMBOL]
	}
	
	const createCache = (object) => {
		Reflect.defineProperty(object, CACHE_SYMBOL, {value: {}})
		return getCache(object)
	}
	
	const is = (object, type) => {
		return Object.prototype.is.apply(object, [type])
	}

	class PropertyEditor {
	
		constructor(object, propertyName) {
			
			this.object = object
			this.propertyName = propertyName
			this.createCache()
			
			const descriptor = Reflect.getOwnPropertyDescriptor(object, propertyName) || BLANK_DESCRIPTOR
			if (!descriptor.configurable) throw new Error (`[PropertyEditor] Couldn't edit property "${propertyName}" because it is not configurable.`)
			
			this.readDescriptor(descriptor)
			this.update()
		}
		
		update() {
			const descriptor = this.createDescriptor()
			Reflect.defineProperty(this.object, this.propertyName, descriptor)
			this.checkType()
		}
		
		readDescriptor({value, get, set, type, writable, enumerable, configurable, typeCheck}) {
			this._value = value
			this._get = get
			this._set = set
			this._type = type
			this._writable = writable
			this._enumerable = enumerable
			this._configurable = configurable
			this._typeCheck = typeCheck
		}
		
		createDescriptor() {
			const descriptor = {}
			
			let get   = this._get
			let set   = this._set
			let value = this._value
			let type  = this._type
			let writable     = this._writable
			let enumerable   = this._enumerable
			let configurable = this._configurable
			let typeCheck    = this._typeCheck
			
			if (get   == undefined) get   = DEFAULT_DESCRIPTOR.get
			if (set   == undefined) set   = DEFAULT_DESCRIPTOR.set
			if (value == undefined) value = DEFAULT_DESCRIPTOR.value
			if (type  == undefined) type  = DEFAULT_DESCRIPTOR.type
			if (writable     == undefined) writable     = DEFAULT_DESCRIPTOR.writable
			if (enumerable   == undefined) enumerable   = DEFAULT_DESCRIPTOR.enumerable
			if (configurable == undefined) configurable = DEFAULT_DESCRIPTOR.configurable
			if (typeCheck    == undefined) typeCheck    = DEFAULT_DESCRIPTOR.typeCheck
			
			if (this._get || this._set || this._typeCheck || this._type) {
				const self = this
				descriptor.get = function() {
					let result = get.apply(this, [this, self.propertyName])
					if (!is(result, type)) throw new TypeError (`Property "${self.propertyName}" failed custom type check.`)
					if (!typeCheck(result)) throw new TypeError (`Property "${self.propertyName}" failed custom type check.`)
					return result
				}
				
				descriptor.set = function(v) {
					set.apply(this, [v, this, self.propertyName])
					self.object[self.propertyName] //force a type-check
				}
			}
			else {
				descriptor.value    = value
				descriptor.writable = writable
			}
			
			descriptor.enumerable   = enumerable
			descriptor.configurable = configurable
			
			return descriptor
		}
		
		checkType() {
			// Get property to check type
			this.object[this.propertyName]
			return true
		}
		
		createCache() {
			const cache = forceGetCache(this.object)
			cache[this.propertyName] = this
			return cache
		}
		
		// Accessors
		set get(v) {
			this._get = v
			this.update()
		}
		
		get get() {
			return this._get
		}
		
		set set(v) {
			this._set = v
			this.update()
		}
		
		get set() {
			return this._set
		}
		
		set value(v) {
			this._value = v
			this.update()
		}
		
		get value() {
			return this._value
		}
		
		set type(v) {
			this._type = v
			this.update()
		}
		
		get type() {
			return this._type
		}
		
		set writable(v) {
			this._writable = v
			this.update()
		}
		
		get writable() {
			return this._writable
		}
		
		set typeCheck(v) {
			this._typeCheck = v
			this.update()
		}
		
		get typeCheck() {
			return this._typeCheck
		}
	}
	
	Reflect.defineProperty(Object.prototype, "has", {
		value(propertyName) {
			return propertyName in this
		}
	})
	
}