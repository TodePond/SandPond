//========//
// Worker //
//========//
{

	//============================//
	// FOR USE INSIDE MAIN SCRIPT //
	//============================//
	WorkerProxy = function(...args) {
		const worker = new Worker(...args)
		const proxy = new Proxy(worker, {
			get(_, name) {
			
				// Normal Behaviour
				if (name in worker) {
					const property = worker[name]
					if (typeof property == "function") return property.bind(worker)
					else return property
				}
				
				// Custom Behaviour
				return (...args) => worker.postMessage({name, args})
				
			},
			set(_, name, value) {
				if (name in worker) {
					return worker[name] = value
				}
			}
		})
		return proxy
	}
	
}