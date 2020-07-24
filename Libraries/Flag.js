
const Flag = (n) => n ** 2

Flag.and = (a, b) => a | b
Flag.has = (flags, flag) => (flags & flag) > 0

