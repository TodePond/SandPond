importScripts("../../Libraries/WorkerInternal.js")
importScripts("../../Libraries/Async.js")

shuffle = (array) => {
	postMessage(array.sort(() => Math.random() - 0.5))
	requestAnimationFrame(() => shuffle(array))
}

