TodeSplat`

input @ () => true
input _ ({space}) => space != undefined && space.atom == undefined
input # ({space}) => space != undefined && space.atom != undefined
input . ({space}) => space != undefined
input x ({space}) => space == undefined
input ? ({success}) => success == true
input ! ({success}) => success != false
input ^ ({score, threshold}) => score >= threshold
input * () => true

output @ ({space, self}) => Space.setAtom(space, self)
output _ ({space}) => Space.setAtom(space, undefined)
output . () => {}

`