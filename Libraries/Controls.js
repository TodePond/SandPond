//==========//
// Keyboard //
//==========//
const Keyboard = {}

on.keydown(event => {
	Keyboard[event.key] = true
})

on.keyup(event => {
	Keyboard[event.key] = false
})

{
	let d
	Reflect.defineProperty(Keyboard, "d", {
		get: o=> d,
		set: (v) => d = v,
	})
}

//========//
// Cursor //
//========//
const Mouse = {
	down: undefined,
	x: undefined,
	y: undefined,
}

on.mousedown(event => {
	if (event.buttons == 1) Mouse.down = true
})

on.mouseup(event => {
	if (event.buttons == 0) Mouse.down = false
})

on.mousemove(event => {
	Mouse.x = event.clientX
	Mouse.y = event.clientY
})