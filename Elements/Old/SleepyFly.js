TodeSplat`


element SleepyFly {

	colour "royalblue"
	emissive "darkblue"
	precise true
	//hidden true
	pour false
	category "life"
	
	data sleeping false
	
	input s ({self}) => self.sleeping
	input a ({self}) => !self.sleeping
	
	output s ({self}) => self.sleeping = true
	output a ({self}) => self.sleeping = false
	
	// Go to sleep
	rule 0.001 { @a => @s }
	
	// Wake up
	rule 0.01 { @s => @a }
	
	// Move if awake
	rule xyz { @_ => aa => _@ }
	
	// Sleep if asleep
	rule {
		@ => s => _
		_    s    @
	}
	
}




`