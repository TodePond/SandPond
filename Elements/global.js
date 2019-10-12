TodeSplat`

input @ (space, args) => args.self = space.atom
input _ (space) => space && !space.atom
input # (space) => space && space.atom
input . (space) => space
input x (space) => !space

output @ (space, {self}) => setSpaceAtom(space, self)
output _ (space) => setSpaceAtom(space, undefined)
output . () => {}

`