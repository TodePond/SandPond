

const worker = new Worker("fizzbuzz.js")

worker.startingNumber = 10
worker.on.result(e => print(e.number))
worker.start()


