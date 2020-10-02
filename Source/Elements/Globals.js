SpaceTode`

origin @
change @ (self) => self

given ! (origin, self) => origin.atom !== self

symbol _ Empty
symbol x Void
symbol * Void

given . (element) => element !== Void
keep .

given # (element) => element !== Empty && element !== Void
keep #

given $ (element, Self) => element === Self
change $ (Self) => new Self()

given ? (element) => element !== Void
select ? (atom) => atom
change ? (selected) => selected

check < (self) => self.continue === false
check > (self) => self.continue === true
keep < (self) => self.continue = false
keep > (self) => self.continue = true

`
