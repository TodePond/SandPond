//==========//
// Position //
//==========//
const V = (x=0, y=0, z=0) => ({x, y, z})

Still = V(0, 0, 0)
Left = V(-1, 0, 0)
Right = V(1, 0, 0)
Up = V(0, 1, 0)
Down = V(0, -1, 0)
Forward = V(0, 0, 1)
Backward = V(0, 0, -1)
Front = V(0, 0, 1)
Back = V(0, 0, -1)
Here = V(0, 0, 0)

V.equals = (a, b) => a.x == b.x && a.y == b.y && a.z == b.z