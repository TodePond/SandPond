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

const Touches = []

on.touchstart(e => {
	for (const touch of e.changedTouches) {
		const touchData = {
			x: touch.clientX,
			y: touch.clientY,
		}
		Touches[touch.identifier] = touchData
	}
})

window.on.touchmove(e => {
	for (const touch of e.changedTouches) {
		const touchData = {
			x: touch.clientX,
			y: touch.clientY,
		}
		Touches[touch.identifier] = touchData
	}
})

on.touchend(e => {
	for (const touch of e.changedTouches) {
		Touches[touch.identifier] = undefined
	}
	Touches.trim()
})

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