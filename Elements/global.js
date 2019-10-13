TodeSplat`

input @ (space, args) => { args.self = space.atom; return true; }
input _ (space) => space != undefined && space.atom == undefined
input # (space) => space != undefined && space.atom != undefined
input . (space) => space != undefined
input x (space) => space == undefined

output @ (space, {self}) => setSpaceAtom(space, self)
output _ (space) => setSpaceAtom(space, undefined)
output . () => {}

`