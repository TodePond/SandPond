//========//
// Random //
//========//
{
	
	function getRandomIntSlow(min, max) {
		const rando = Math.random() * max
		const int = Math.floor(rando)
		return int
	}
	
	function shuffleArray(array) {
		return array.sort(() => Math.random() - 0.5)
	}
		
}