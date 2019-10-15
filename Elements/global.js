TodeSplat`

input @ (space, args) => { args.self = space.atom; return true; }
input _ (space) => space != undefined && space.atom == undefined
input # (space, args) => { if (space != undefined && space.atom != undefined) { args.atom = space.atom; return true; }}
input . (space) => space != undefined
input x (space) => space == undefined

output @ (space, {self}) => setSpaceAtom(space, self)
output _ (space) => setSpaceAtom(space, undefined)
output . () => {}

`