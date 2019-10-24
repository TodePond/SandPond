TodeSplat`

input @ () => true
input _ ({space}) => space != undefined && space.atom == undefined
input # ({space, args}) => space != undefined && space.atom != undefined
input . ({space}) => space != undefined
input x ({space}) => space == undefined
input ! ({failure}) => failure != true
input ? ({success}) => success == true

output @ ({space, self}) => Space.setAtom(space, self)
output _ ({space}) => Space.setAtom(space, undefined)
output . () => {}

`