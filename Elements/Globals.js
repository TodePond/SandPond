TodeSplat`

given . true
keep .

given @ () => true
change @ (self) => self

given # (atom) => atom
keep #

given _ (space, atom) => space && !atom
change _ () => undefined

given x (space) => !space
keep x

`