importScripts("../../Libraries/WorkerInternal.js")

shuffle = (array) => {
	postMessage(array.sort(() => Math.random() - 0.5))
	requestAnimationFrame(shuffle(array))
}

