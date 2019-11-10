TodeSplat`

input @ () => true
input * () => true
input . ({space}) => space != undefined
input x ({space}) => space == undefined
input _ ({space}) => space != undefined && space.atom == undefined
input # ({space}) => space != undefined && space.atom != undefined
input ? ({success}) => success == true
input ! ({success}) => success != false
input ^ ({score, threshold}) => score >= threshold

output @ ({space, self}) => SPACE.setAtom(space, self)
output _ ({space}) => SPACE.setAtom(space, undefined)
output . () => {}

`