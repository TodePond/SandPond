TodeSplat`

given . (space) => space
keep .

given @ (self, atom) => self == atom
change @ (self) => self

given # (atom) => atom
keep #

given _ (space, atom) => space && !atom
change _ () => undefined

given x (space) => !space
keep x



`