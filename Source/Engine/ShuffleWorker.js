importScripts("https://habitat.todepond.cool/Build/WorkerInternal.js")
importScripts("https://habitat.todepond.cool/Build/Async.js")

shuffle = (array) => {
	postMessage(array.sort(() => Math.random() - 0.5))
	requestAnimationFrame(() => shuffle(array))
}

