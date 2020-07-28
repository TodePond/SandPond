SpaceTode`

origin @
change @ (self) => self

symbol _ Empty
symbol x Void

given . (element) => element !== Void
keep .

given # (element) => element !== Empty && element !== Void

given $ (element, Self) => element === Self
change $ (Self) => new Self()

given ? (element) => element !== Void
select ? (atom) => atom
change ? (selected) => selected

`
