
let startingNumber = 0

function start() {
	main(startingNumber)

}

function main(i) {
	const message = i.match (
		MultipleOf(3), "Fizz",
		MultipleOf(5), "Buzz",
		MultipleOf(5).and(MultipleOf(3)), "Fizzbuzz",
		Any, i,
	)
	Event.result(message)
	main(i + 1)
}
