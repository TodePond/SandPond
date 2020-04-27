//================//
// WorkerInternal //
//================//
// Worker interprets incoming instructions
onmessage = ({data: {name, args = []}}) => this[name](...args)
