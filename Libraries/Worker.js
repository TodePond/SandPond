//========//
// Worker //
//========//
{

	const _Worker = Worker

	Worker = function(...args) {
		const worker = new _Worker(...args)
		worker.onmessage = e => {
			const {eventName, detail} = e.data
			const event = new CustomEvent(eventName, {detail})
			worker.dispatchEvent(event)
		}
		
		const proxy = new Proxy(worker, {
			get(_, propertyName) {
			
				if (propertyName in worker) {
					const property = worker[propertyName]
					if (typeof property == "function") return property.bind(worker)
					else return property
				}
				
				return (...args) => {
					worker.postMessage({functionName: propertyName, args})
				}
			},
			set(_, propertyName, value) {
				if (propertyName in worker) {
					return worker[propertyName] = value
				}
			}
		})
		return proxy
	}
	
	onmessage = ({data: {functionName, args = []}}) => {
		const func = this[functionName]
		if (typeof func != "function") throw new Error(`Could not find worker function: ${functionName}`)
		this[functionName](...args)
	}
	
	sendEvent = (eventName, detail) => {
		return postMessage({eventName, detail})
	}
	
}