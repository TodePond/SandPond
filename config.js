//===========//
// Constants //
//===========//
const urlParams = new URLSearchParams(window.location.search)

const DOF_MODE = urlParams.has("dof")
const SHADOW_MODE = urlParams.has("shadow")
const SMALL_MODE = urlParams.has("small") || !urlParams.has("big")
const MASSIVE_MODE = urlParams.has("massive")
const D2_MODE = urlParams.has("2d")
const D1_MODE = urlParams.has("1d")
const VR_MODE = urlParams.has("vr")
const TINY_MODE = urlParams.has("tiny")
const LONG_MODE = urlParams.has("long")
const PURE_RANDOM_MODE = urlParams.has("pure")
const SHUFFLE_MODE = urlParams.has("shuffle")
const FIRING_MODE = urlParams.has("firing")
const MEDIUM_MODE = urlParams.has("medium")
const RIDICULOUS_MODE = urlParams.has("ridiculous")

const DEFAULT_RANDOMNESS_MODE = "track"
const RANDOM = SHUFFLE_MODE? "shuffle" : (PURE_RANDOM_MODE? "pure" : (FIRING_MODE? "firing" : DEFAULT_RANDOMNESS_MODE))

const FLOOR_TYPE = urlParams.has("nofloor")? "nofloor" : "floor"

let MAX_X = (SMALL_MODE? 30 : 50) * (D1_MODE? 2 : 1) * (D2_MODE? 5 : 1)
let MAX_Z = D1_MODE? 0 : (D2_MODE? 0 : MAX_X)
let MAX_Y = D1_MODE? 0 : (SMALL_MODE? 30 : 40) * (D2_MODE? 8 : 1)

if (TINY_MODE) {
	MAX_X = Math.floor(MAX_X * 0.6)
	MAX_Z = Math.floor(MAX_Z * 0.6)
	MAX_Y = Math.floor(MAX_Y * 0.7)
}

if (MASSIVE_MODE) {
	MAX_X = Math.floor(MAX_X * 2.5)
	MAX_Z = Math.floor(MAX_Z * 2.5)
	MAX_Y = Math.floor(MAX_Y * 1.5)
}

if (RIDICULOUS_MODE) {
	MAX_X = Math.floor(MAX_X * 3.0)
	MAX_Z = Math.floor(MAX_Z * 3.0)
	MAX_Y = Math.floor(MAX_Y * 1.5)
}

if (LONG_MODE) {
	MAX_X = Math.floor(MAX_X * 1.3)
	MAX_Z = Math.floor(MAX_Z * 1)
	MAX_Y = Math.floor(MAX_Y * 0.75)
}

if (MEDIUM_MODE) {
	MAX_X = 40 * (D1_MODE? 2 : 1) * (D2_MODE? 5 : 1)
	MAX_Y = 35 * (D2_MODE? 8 : 1)
	MAX_Z = D1_MODE? 0 : (D2_MODE? 0 : MAX_X)
}

let SIZE = SMALL_MODE? "small" : "big"
if (TINY_MODE) SIZE = "tiny"
else if (MASSIVE_MODE) SIZE = "massive"
else if (MEDIUM_MODE) SIZE = "medium"


const SHAPE = LONG_MODE? "long" : "cube"

const MIN_X = -MAX_X
const MIN_Z = -MAX_Z
const MIN_Y = 0

const WORLD_WIDTH = MAX_X * 2 + 1
const WORLD_DEPTH = MAX_Z * 2 + 1
const WORLD_HEIGHT = MAX_Y

const WORLD_AREA = {
	x: [MIN_X, MAX_X],
	y: [MIN_Y, MAX_Y],
	z: [MIN_Z, MAX_Z],
}


const ATOM_SIZE = 0.01
const ATOM_SCALE = 1.0

const CAMERA_START_X = 0
let CAMERA_START_Y = (D2_MODE? WORLD_HEIGHT/2 : (SMALL_MODE? 85 : 140)) * ATOM_SIZE
let CAMERA_START_Z = (SMALL_MODE? 125 : 200) * (D2_MODE? 2 : 1) * ATOM_SIZE

if (MEDIUM_MODE) {
	CAMERA_START_Y = CAMERA_START_Y * 1.25
	CAMERA_START_Z = CAMERA_START_Z * 1.25
}

if (MASSIVE_MODE) {
	CAMERA_START_Y = CAMERA_START_Y * 2.25
	CAMERA_START_Z = CAMERA_START_Z * 2.25
}

if (TINY_MODE) {
	CAMERA_START_Y = CAMERA_START_Y * 0.65
	CAMERA_START_Z = CAMERA_START_Z * 0.7
}

if (D2_MODE) {
	//CAMERA_START_Y = CAMERA_START_Y * 2.8
	CAMERA_START_Z = CAMERA_START_Z * 2.25
}

const CAMERA_SPEED = 2

//window.history.replaceState({}, "", window.location.pathname)

let SPEED_MOD = urlParams.get("speed")
if (SPEED_MOD === null) SPEED_MOD = "0.1"
SPEED_MOD = parseFloat(SPEED_MOD)