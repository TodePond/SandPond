TodeSplat`

given . (space) => space
keep .

given @ () => true
change @ (self) => self

given # (element) => element
keep #

given _ (space, atom) => space && !atom
change _ () => undefined

given x (space) => !space
keep x



`