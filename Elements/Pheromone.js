TodeSplat`


element Pheromone {

	colour "pink"
	emissive "purple"
	opacity 0.3

	hidden true
	property distance 0
	
	output m ({space, self}) => {
		SPACE.setAtom(space, undefined)
		self.distance++
	}
	
	rule 0.001 { @ => _ }
	rule xyz { @_ => m@ }
	
}




`