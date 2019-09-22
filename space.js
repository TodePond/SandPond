//=======//
// Space //
//=======//
{

	//===========//
	// Constants //
	//===========//	
	// Bottom Layer
	//  0  1  2
	//  3  4  5
	//  6  7  8
	//
	// Middle Layer
	//  9 10 11
	// 12 13 14
	// 15 16 17
	//
	// Top Layer
	// 18 19 20
	// 21 22 23
	// 24 25 26
	NEIGHBOUR_DOWN_FORWARD_LEFT = 0
	NEIGHBOUR_DOWN_FORWARD = 1
	NEIGHBOUR_DOWN_FORWARD_RIGHT = 2
	NEIGHBOUR_DOWN_LEFT = 3
	NEIGHBOUR_DOWN = 4
	NEIGHBOUR_DOWN_RIGHT = 5
	NEIGHBOUR_DOWN_BACK_LEFT = 6
	NEIGHBOUR_DOWN_BACK = 7
	NEIGHBOUR_DOWN_BACK_RIGHT = 8
	
	NEIGHBOUR_FORWARD_LEFT = 9
	NEIGHBOUR_FORWARD = 10
	NEIGHBOUR_FORWARD_RIGHT = 11
	NEIGHBOUR_LEFT = 12
	NEIGHBOUR_ME = 13
	NEIGHBOUR_RIGHT = 14
	NEIGHBOUR_BACK_LEFT = 15
	NEIGHBOUR_BACK = 16
	NEIGHBOUR_BACK_RIGHT = 17
	
	NEIGHBOUR_UP_FORWARD_LEFT = 18
	NEIGHBOUR_UP_FORWARD = 19
	NEIGHBOUR_UP_FORWARD_RIGHT = 20
	NEIGHBOUR_UP_LEFT = 21
	NEIGHBOUR_UP = 22
	NEIGHBOUR_UP_RIGHT = 23
	NEIGHBOUR_UP_BACK_LEFT = 24
	NEIGHBOUR_UP_BACK = 25
	NEIGHBOUR_UP_BACK_RIGHT = 26
	
	getNeighbourNumber = matcher (
		[-1, -1, -1], NEIGHBOUR_DOWN_FORWARD_LEFT,
		[0, -1, -1], NEIGHBOUR_DOWN_FORWARD,
		[1, -1, -1], NEIGHBOUR_DOWN_FORWARD_RIGHT,
		[-1, -1, 0], NEIGHBOUR_DOWN_LEFT,
		[0, -1, 0], NEIGHBOUR_DOWN,
		[1, -1, 0], NEIGHBOUR_DOWN_RIGHT,
		[-1, -1, 1], NEIGHBOUR_DOWN_BACK_LEFT,
		[0, -1, 1], NEIGHBOUR_DOWN_BACK,
		[1, -1, 1], NEIGHBOUR_DOWN_BACK_RIGHT,
		
		[-1, 0, -1], NEIGHBOUR_FORWARD_LEFT,
		[0, 0, -1], NEIGHBOUR_FORWARD,
		[1, 0, -1], NEIGHBOUR_FORWARD_RIGHT,
		[-1, 0, 0], NEIGHBOUR_LEFT,
		[0, 0, 0], NEIGHBOUR_ME,
		[1, 0, 0], NEIGHBOUR_RIGHT,
		[-1, 0, 1], NEIGHBOUR_BACK_LEFT,
		[0, 0, 1], NEIGHBOUR_BACK,
		[1, 0, 1], NEIGHBOUR_BACK_RIGHT,
		
		[-1, 1, -1], NEIGHBOUR_UP_FORWARD_LEFT,
		[0, 1, -1], NEIGHBOUR_UP_FORWARD,
		[1, 1, -1], NEIGHBOUR_UP_FORWARD_RIGHT,
		[-1, 1, 0], NEIGHBOUR_UP_LEFT,
		[0, 1, 0], NEIGHBOUR_UP,
		[1, 1, 0], NEIGHBOUR_UP_RIGHT,
		[-1, 1, 1], NEIGHBOUR_UP_BACK_LEFT,
		[0, 1, 1], NEIGHBOUR_UP_BACK,
		[1, 1, 1], NEIGHBOUR_UP_BACK_RIGHT,
	)
	
	//=======//
	// Class //
	//=======//
	Space = class Space {
		constructor(world, id, x, y, z) {
			this.world = world
			this.id = id
			this.x = x
			this.y = y
			this.z = z
			this.atom = undefined
			this.createIds()
		}
		
		$Space(x, y, z) {
			return this.world.$Space(this.x + x, this.y + y, this.z + z)
		}
		
		createIds() {
			this.id0 = this.id*4 + 0
			this.id1 = this.id*4 + 1
			this.id2 = this.id*4 + 2
			this.id3 = this.id*4 + 3
			
			this.eid0 = this.id*3 + 0
			this.eid1 = this.id*3 + 1
			this.eid2 = this.id*3 + 2
		}
		
		createNeighbours() {
			this.neighbours = [
				this.$Space(-1, -1, -1),
				this.$Space(0, -1, -1),
				this.$Space(1, -1, -1),
				this.$Space(-1, -1, 0),
				this.$Space(0, -1, 0),
				this.$Space(1, -1, 0),
				this.$Space(-1, -1, 1),
				this.$Space(0, -1, 1),
				this.$Space(1, -1, 1),
			
				this.$Space(-1, 0, -1),
				this.$Space(0, 0, -1),
				this.$Space(1, 0, -1),
				this.$Space(-1, 0, 0),
				this.$Space(0, 0, 0),
				this.$Space(1, 0, 0),
				this.$Space(-1, 0, 1),
				this.$Space(0, 0, 1),
				this.$Space(1, 0, 1),
			
				this.$Space(-1, 1, -1),
				this.$Space(0, 1, -1),
				this.$Space(1, 1, -1),
				this.$Space(-1, 1, 0),
				this.$Space(0, 1, 0),
				this.$Space(1, 1, 0),
				this.$Space(-1, 1, 1),
				this.$Space(0, 1, 1),
				this.$Space(1, 1, 1),
			]
			
			//Object.freeze(this.neighbours)
		}
		
		setAtom(atom) {
			this.atom = atom
			if (atom == undefined) {
				this.world.setInstanceColour(this, false)
				return
			}
			atom.space = this
			this.world.setInstanceColour(this, atom.type.shaderColour, atom.type.shaderEmissive, atom.type.shaderOpacity)
		}
	}
	
}