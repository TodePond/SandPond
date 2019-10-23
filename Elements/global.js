TodeSplat`

input @ () => true
input _ ({space}) => space != undefined && space.atom == undefined
input # ({space, args}) => space != undefined && space.atom != undefined
input . ({space}) => space != undefined
input x ({space}) => space == undefined

output @ ({space, self}) => setSpaceAtom(space, self)
output _ ({space}) => setSpaceAtom(space, undefined)
output . () => {}

`