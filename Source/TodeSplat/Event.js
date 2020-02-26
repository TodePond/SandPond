//=======//
// Event //
//=======//
const EVENT = {}

{
	
	EVENT.make = (space) => {
		const x = space.x | 0
		const y = space.y | 0
		const z = space.z | 0
		const siteNumber = EVENTWINDOW.getSiteNumber(x, y, z)
		
		const input = space.input
		const output = space.output
		
		//const inputFunc = CHARACTER.createInputFunc(input)
		//const outputFunc = CHARACTER.createOutputFunc(output)
		
		const event = {siteNumber, input, output}
		return event
	}
	
}