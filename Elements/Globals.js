SpaceTode`

origin @
change @ (self) => self

symbol _ Empty
symbol x Void

given . (element) => element !== Void
keep .

given # (element) => element !== Empty && element !== Void

`
