function wait(duration) {
	return new Promise (resolve => setTimeout(resolve, duration))
}

async function all(...promises) {
	return await Promise.all(promises)
}
