SpaceTode`

element TwoTwoTwoTwoOne {
	emissive "rgb(255, 0,0)"
	colour "rgb(255, 100, 100)"
	category "Stream"
	symbol 2 TwoTwoTwoTwoTwo

	keep W () => {
		const currentTime = performance.now()
		if (!window.lastTime) {
			window.lastTime = currentTime
			return
		}
		const deltaTime = currentTime - window.lastTime
		if (deltaTime < 200) {
			return
		}
		window.lastTime = currentTime
		const wordIndex = window.wordIndex || 0
		const word = words[wordIndex]
		window.wordIndex = (wordIndex + 1) % words.length
		for (let i = 0; i < 4; i++) {
			const letter = word[i]
			const coordinates = convertLetterIntoCoordinates(letter)
			for (const coordinate of coordinates) {
				const [x, y] = coordinate
				const space = WORLD.selectSpace(world, -10 + x + i*7, 10 - y, 18)
				SPACE.setAtom(space, new Pixel())
			}
		}
	}

	maybe(0.5) {
		@ => _
		_    @

		@ => _
		2    @

		action @ => W

		@ => 2
	}
	
}

element Pixel {
	colour "black"	

	keep C (space, self) => {
		const FADE_AMOUNT = 2
		self.colour.r = Math.min(255, self.colour.r + FADE_AMOUNT)
		self.colour.g = Math.min(255, self.colour.g + FADE_AMOUNT)
		self.colour.b = Math.min(255, self.colour.b + FADE_AMOUNT)
		self.emissive.r = Math.min(255, self.emissive.r + FADE_AMOUNT)
		self.emissive.g = Math.min(255, self.emissive.g + FADE_AMOUNT)
		self.emissive.b = Math.min(255, self.emissive.b + FADE_AMOUNT)
		SPACE.update(space)
	}

	action @ => C

	pov(right) {
		@_ => _@
	}

	maybe(0.01) {
		@ => _
	}
}

element TwoTwoTwoTwoTwo {
	emissive "rgb(0, 0, 255)"
	colour "rgb(100, 100, 255)"

	symbol 1 TwoTwoTwoTwoOne

	maybe(0.5) {
		_    @
		@ => _

		@    _
		1 => @

		@ => 1
	}
}
`;

const alphabet = {
  A: [
    // @prettier-ignore
    "..#..",
    ".#.#.",
    "#####",
    "#...#",
    "#...#",
  ],
  B: [
    // @prettier-ignore
    "####.",
    "#...#",
    "####.",
    "#...#",
    "####.",
  ],
  C: [
    // @prettier-ignore
    ".###.",
    "#....",
    "#....",
    "#....",
    ".###.",
  ],
  D: [
    // @prettier-ignore
    "####.",
    "#...#",
    "#...#",
    "#...#",
    "####.",
  ],
  E: [
    // @prettier-ignore
    "#####",
    "#....",
    "####.",
    "#....",
    "#####",
  ],
  F: [
    // @prettier-ignore
    "#####",
    "#....",
    "####.",
    "#....",
    "#....",
  ],
  G: [
    // @prettier-ignore
    ".###.",
    "#....",
    "#.###",
    "#...#",
    ".###.",
  ],
  H: [
    // @prettier-ignore
    "#...#",
    "#...#",
    "#####",
    "#...#",
    "#...#",
  ],
  I: [
    // @prettier-ignore
    "#####",
    "..#..",
    "..#..",
    "..#..",
    "#####",
  ],
  J: [
    // @prettier-ignore
    "..###",
    "...#.",
    "...#.",
    "#..#.",
    ".##..",
  ],
  K: [
    // @prettier-ignore
    "#..#.",
    "#.#..",
    "##...",
    "#.#..",
    "#..#.",
  ],
  L: [
    // @prettier-ignore
    "#....",
    "#....",
    "#....",
    "#....",
    "#####",
  ],
  M: [
    // @prettier-ignore
    "#...#",
    "##.##",
    "#.#.#",
    "#...#",
    "#...#",
  ],
  N: [
    // @prettier-ignore
    "#...#",
    "##..#",
    "#.#.#",
    "#..##",
    "#...#",
  ],
  O: [
    // @prettier-ignore
    ".###.",
    "#...#",
    "#...#",
    "#...#",
    ".###.",
  ],
  P: [
    // @prettier-ignore
    "####.",
    "#...#",
    "####.",
    "#....",
    "#....",
  ],
  Q: [
    // @prettier-ignore
    ".###.",
    "#...#",
    "#...#",
    "#.##.",
    ".##.#",
  ],
  R: [
    // @prettier-ignore
    "####.",
    "#...#",
    "####.",
    "#.#..",
    "#..#.",
  ],
  S: [
    // @prettier-ignore
    ".###.",
    "#....",
    ".###.",
    "...#.",
    "###..",
  ],
  T: [
    // @prettier-ignore
    "#####",
    "..#..",
    "..#..",
    "..#..",
    "..#..",
  ],
  U: [
    // @prettier-ignore
    "#...#",
    "#...#",
    "#...#",
    "#...#",
    ".###.",
  ],
  V: [
    // @prettier-ignore
    "#...#",
    "#...#",
    "#...#",
    ".#.#.",
    "..#..",
  ],
  W: [
    // @prettier-ignore
    "#...#",
    "#...#",
    "#.#.#",
    "##.##",
    "#...#",
  ],
  X: [
    // @prettier-ignore
    "#...#",
    ".#.#.",
    "..#..",
    ".#.#.",
    "#...#",
  ],
  Y: [
    // @prettier-ignore
    "#...#",
    "#...#",
    ".###.",
    "..#..",
    "..#..",
  ],
  Z: [
    // @prettier-ignore
    "#####",
    "...#.",
    "..#..",
    ".#...",
    "#####",
  ],
};

// console.log(Object.values(alphabet).length);

function convertLetterIntoCoordinates(letter) {
  const letterArray = alphabet[letter];
  const coordinates = [];
  for (let y = 0; y < letterArray.length; y++) {
    for (let x = 0; x < letterArray[y].length; x++) {
      if (letterArray[y][x] === "#") {
        coordinates.push([x, y]);
      }
    }
  }
  return coordinates;
}

// console.log(convertLetterIntoCoordinates("Z"));

const wordsString = `ABET
ABLE
ABLY
ABUT
ACAI
ACED
ACES
ACHE
ACHY
ACID
ACME
ACNE
ACRE
ACTS
ADDS
AEON
AFAR
AFRO
AGED
AGES
AGOG
AHEM
AIDE
AILS
AIMS
AIRS
AIRY
AJAR
AKIN
ALAS
ALLY
ALMS
ALOE
ALSO
ALTO
ALUM
AMEN
AMID
AMMO
AMOK
AMPS
ANDS
ANEW
ANKH
ANON
ANTI
ANTS
APES
APEX
APPS
AQUA
ARCH
ARCS
AREA
ARIA
ARID
ARKS
ARMS
ARMY
ARSE
ARTS
ARTY
ASHY
ASKS
ATOM
ATOP
AUNT
AURA
AUTO
AVID
AVOW
AWAY
AWED
AWES
AWLS
AWRY
AXED
AXES
AXIS
AXLE
BABA
BABE
BABY
BACH
BACK
BADS
BAGS
BAIL
BAIT
BAKE
BALD
BALE
BALK
BALL
BALM
BAND
BANE
BANG
BANK
BANS
BARB
BARD
BARE
BARF
BARK
BARN
BARS
BASE
BASH
BASK
BASS
BAST
BATH
BATS
BAUD
BAWL
BAYS
BEAD
BEAK
BEAM
BEAN
BEAR
BEAT
BEAU
BECK
BEDS
BEEF
BEEN
BEEP
BEER
BEES
BEET
BEGS
BELL
BELT
BEND
BENT
BERG
BERM
BEST
BETA
BETS
BEVY
BEYS
BIAS
BIBS
BIDE
BIDS
BIFF
BIKE
BILE
BILK
BILL
BIND
BIOS
BIRD
BITE
BITS
BLAB
BLAH
BLEB
BLED
BLEW
BLIP
BLOB
BLOC
BLOG
BLOT
BLOW
BLUE
BLUR
BOAR
BOAS
BOAT
BOBS
BODE
BODS
BODY
BOGS
BOGY
BOIL
BOLA
BOLD
BOLO
BOLT
BOMB
BOND
BONE
BONG
BONK
BONY
BOOK
BOOM
BOON
BOOR
BOOS
BOOT
BORE
BORN
BOSS
BOTH
BOTS
BOUT
BOWL
BOWS
BOXY
BOYO
BOYS
BOZO
BRAG
BRAN
BRAS
BRAT
BRAY
BRED
BREW
BRIE
BRIG
BRIM
BRIS
BRIT
BROS
BROW
BUCK
BUDS
BUFF
BUGS
BULB
BULK
BULL
BUMP
BUMS
BUND
BUNG
BUNK
BUNS
BUNT
BUOY
BURB
BURG
BURL
BURN
BURP
BURR
BURY
BUSH
BUSK
BUST
BUSY
BUTT
BUYS
BUZZ
BYES
BYTE
CABS
CAFE
CAFF
CAGE
CAKE
CALF
CALL
CALM
CAME
CAMO
CAMP
CANE
CANS
CAPE
CAPO
CAPS
CARB
CARD
CARE
CARP
CARS
CART
CASE
CASH
CASK
CAST
CATS
CAVE
CAWS
CAYS
CEDE
CELL
CELS
CELT
CENT
CESS
CHAD
CHAI
CHAP
CHAR
CHAT
CHEF
CHEW
CHIC
CHIN
CHIP
CHIT
CHOP
CHOW
CHUB
CHUG
CHUM
CIAO
CITE
CITY
CLAD
CLAM
CLAN
CLAP
CLAW
CLAY
CLEF
CLIP
CLOD
CLOG
CLOP
CLOT
CLUB
CLUE
COAL
COAT
COAX
COBS
COCA
COCO
CODA
CODE
CODS
COED
COGS
COIL
COIN
COKE
COLA
COLD
COLE
COLT
COMA
COMB
COME
COMP
CONE
CONS
COOK
COOL
COOP
COOS
COPE
COPS
COPY
CORD
CORE
CORK
CORN
COST
COSY
COTS
COUP
COVE
COWL
COWS
COZY
CRAB
CRAG
CRAM
CRAP
CRAW
CREW
CRIB
CRIT
CROC
CROP
CROW
CRUD
CRUX
CUBE
CUBS
CUDS
CUED
CUES
CUFF
CULL
CULT
CUPS
CURB
CURD
CURE
CURL
CURT
CUSP
CUSS
CUTE
CUTS
CYAN
CYST
CZAR
DABS
DADA
DADS
DAFT
DAME
DAMN
DAMP
DAMS
DANK
DARE
DARK
DARN
DART
DASH
DATA
DATE
DAWN
DAYS
DAZE
DEAD
DEAF
DEAL
DEAN
DEAR
DEBT
DECK
DEED
DEEM
DEEP
DEER
DEFT
DEFY
DELI
DELL
DELT
DEMO
DENS
DENT
DERM
DESK
DEWS
DEWY
DIAL
DICE
DIED
DIES
DIET
DIGS
DILL
DIME
DIMS
DINE
DING
DINK
DINO
DINT
DIPS
DIRE
DIRT
DISC
DISH
DISK
DISS
DIVA
DIVE
DOCK
DOCS
DODO
DOER
DOES
DOFF
DOGS
DOJO
DOLE
DOLL
DOLT
DOME
DONE
DONG
DOOM
DOOR
DOPE
DORK
DORM
DORY
DOSE
DOTE
DOTH
DOTS
DOUR
DOVE
DOWN
DOXY
DOZE
DOZY
DRAB
DRAG
DRAM
DRAW
DRAY
DREW
DRIP
DROP
DRUG
DRUM
DRYS
DUAL
DUBS
DUCK
DUCT
DUDE
DUDS
DUEL
DUES
DUET
DUFF
DUKE
DULL
DULY
DUMB
DUMP
DUNE
DUNG
DUNK
DUNS
DUOS
DUPE
DUSK
DUST
DUTY
DYAD
DYED
DYER
DYES
EACH
EARL
EARN
EARS
EASE
EAST
EASY
EATS
EAVE
EBBS
ECHO
EDDY
EDGE
EDGY
EDIT
EELS
EGGS
EGGY
EGOS
ELKS
ELMS
ELSE
EMIT
EMMY
EMUS
ENDS
ENVY
EONS
EPEE
EPIC
ERAS
ERRS
ETCH
EURO
EVEN
EVER
EVES
EVIL
EWES
EXAM
EXEC
EXIT
EXON
EXPO
EYED
EYES
FABS
FACE
FACT
FADE
FADS
FAIL
FAIR
FAKE
FALL
FAME
FANG
FANS
FARE
FARM
FART
FAST
FATE
FATS
FAUN
FAVA
FAVE
FAWN
FAZE
FEAR
FEAT
FEED
FEEL
FEES
FEET
FELL
FELT
FEND
FENS
FERN
FESS
FEST
FETA
FETE
FEUD
FIAT
FIBS
FIFE
FIGS
FILE
FILL
FILM
FILO
FIND
FINE
FINK
FINS
FIRE
FIRM
FIRS
FISH
FIST
FITS
FIVE
FIZZ
FLAB
FLAG
FLAK
FLAM
FLAN
FLAP
FLAT
FLAW
FLAX
FLAY
FLEA
FLED
FLEE
FLEW
FLEX
FLIP
FLIT
FLOC
FLOE
FLOG
FLOP
FLOW
FLUB
FLUE
FLUS
FLUX
FOAL
FOAM
FOBS
FOCI
FOES
FOGS
FOGY
FOIL
FOLD
FOLK
FOND
FONT
FOOD
FOOL
FOOT
FOPS
FORD
FORE
FORK
FORM
FORT
FOUL
FOUR
FOWL
FOXY
FRAG
FRAT
FRAY
FREE
FRET
FRIG
FROG
FROM
FUEL
FUCK
FUGU
FULL
FUME
FUND
FUNK
FURL
FURS
FURY
FUSE
FUSS
FUTZ
FUZZ
GAFF
GAGS
GAIN
GAIT
GALA
GALE
GALL
GALS
GAME
GANG
GAPE
GAPS
GARB
GASH
GASP
GATE
GAVE
GAWK
GAYS
GAZE
GEAR
GEEK
GEES
GELS
GEMS
GENE
GENS
GENT
GERM
GETS
GHAT
GHEE
GIFT
GIGS
GILD
GILL
GILT
GINS
GIRD
GIRL
GIST
GITS
GIVE
GLAD
GLAM
GLEE
GLEN
GLIB
GLOB
GLOM
GLOP
GLOW
GLUE
GLUG
GLUM
GLUT
GNAR
GNAT
GNAW
GOAD
GOAL
GOAT
GOBS
GOBY
GODS
GOER
GOES
GOLD
GOLF
GONE
GONG
GOOD
GOOF
GOON
GOOP
GOOS
GORE
GORY
GOSH
GOTH
GOUT
GOWN
GRAB
GRAD
GRAM
GRAN
GRAY
GREW
GREY
GRID
GRIM
GRIN
GRIP
GRIT
GROG
GROW
GRUB
GUFF
GULF
GULL
GULP
GUMS
GUNK
GUNS
GURU
GUSH
GUST
GUTS
GUYS
GYMS
GYRE
GYRO
HACK
HAGS
HAIL
HAIR
HALF
HALL
HALO
HALT
HAMS
HAND
HANG
HANK
HAPS
HARD
HARE
HARK
HARM
HARP
HART
HASH
HATE
HATH
HATS
HAUL
HAVE
HAWK
HAWS
HAYS
HAZE
HAZY
HEAD
HEAL
HEAP
HEAR
HEAT
HECK
HEED
HEEL
HEFT
HEIR
HELD
HELL
HELM
HELP
HEMP
HEMS
HENS
HERB
HERD
HERE
HERO
HERS
HEST
HEWN
HEWS
HICK
HIDE
HIGH
HIKE
HILL
HILT
HIND
HINT
HIPS
HIRE
HISS
HITS
HIVE
HIYA
HOAR
HOAX
HOBO
HOCK
HOED
HOES
HOGS
HOLD
HOLE
HOLO
HOLT
HOLY
HOME
HONE
HONK
HOOD
HOOF
HOOK
HOOP
HOOT
HOPE
HOPS
HORN
HOSE
HOST
HOUR
HOVE
HOWL
HUBS
HUCK
HUED
HUES
HUFF
HUGE
HUGS
HULA
HULK
HULL
HUMP
HUMS
HUNG
HUNK
HUNT
HURL
HURT
HUSH
HUSK
HUTS
HYMN
HYPE
HYPO
ICED
ICES
ICKY
ICON
IDEA
IDLE
IDLY
IDOL
IFFY
ILLS
IMPS
INCH
INFO
INKS
INKY
INNS
INTO
IONS
IOTA
IRIS
IRKS
IRON
ISLE
ISMS
ITCH
ITEM
JABS
JACK
JADE
JAIL
JAKE
JAMB
JAMS
JAPE
JARS
JAVA
JAWA
JAWS
JAYS
JAZZ
JEAN
JEEP
JEER
JEEZ
JELL
JERK
JEST
JETS
JIBE
JIBS
JIGS
JILT
JINK
JINX
JIVE
JOBS
JOCK
JOGS
JOIN
JOKE
JOLT
JOTS
JOWL
JOYS
JUDO
JUGS
JUJU
JUKE
JUMP
JUNK
JURY
JUST
JUTE
JUTS
KALE
KEEL
KEEN
KEEP
KEGS
KELP
KEPT
KETO
KEYS
KHAN
KHAT
KICK
KIDS
KILL
KILN
KILO
KILT
KIND
KING
KIPS
KISS
KITE
KITS
KIWI
KNEE
KNEW
KNIT
KNOB
KNOT
KNOW
KOAN
KOOK
KOTO
LABS
LACE
LACK
LACY
LADS
LADY
LAGS
LAID
LAIN
LAIR
LAKE
LAMA
LAMB
LAME
LAMP
LAND
LANE
LAPS
LARD
LARK
LASH
LASS
LAST
LATE
LAUD
LAVA
LAWN
LAWS
LAYS
LAZE
LAZY
LEAD
LEAF
LEAK
LEAN
LEAP
LEAS
LEEK
LEER
LEET
LEFT
LEGS
LEND
LENS
LENT
LESS
LEST
LEWD
LIAR
LIBS
LICE
LICK
LIDS
LIED
LIEN
LIER
LIES
LIEU
LIFE
LIFT
LIKE
LILT
LILY
LIMA
LIMB
LIME
LIMO
LIMP
LINE
LING
LINK
LINT
LION
LIPS
LISP
LIST
LITE
LIVE
LOAD
LOAF
LOAM
LOAN
LOBE
LOBS
LOCH
LOCK
LOCO
LODE
LOFT
LOGE
LOGO
LOGS
LOIN
LONE
LONG
LOOK
LOOM
LOON
LOOP
LOOS
LOOT
LOPS
LORD
LORE
LOSE
LOSS
LOST
LOTH
LOTS
LOUD
LOUT
LOVE
LOWS
LUBE
LUCK
LUFF
LUGS
LULL
LUMP
LUNE
LUNG
LURE
LURK
LUSH
LUST
LUTE
LUVS
LYNX
LYRE
MACE
MACH
MACK
MACS
MADE
MAGE
MAGI
MAGS
MAID
MAIL
MAIM
MAIN
MAKE
MAKI
MALE
MALL
MALT
MAMA
MANE
MANS
MANY
MAPS
MARE
MARK
MARS
MART
MASH
MASK
MASS
MAST
MATE
MATH
MATS
MAUL
MAWS
MAXI
MAYO
MAZE
MAZY
MEAD
MEAL
MEAN
MEAT
MEEK
MEET
MEGA
MELD
MELT
MEMO
MEND
MENU
MEOW
MERE
MESA
MESH
MESS
META
METE
MEWL
MEWS
MICA
MICE
MICS
MIDS
MILD
MILE
MILK
MILL
MIME
MIND
MINE
MINI
MINK
MINT
MINX
MIRE
MISO
MISS
MIST
MITE
MOAN
MOAT
MOBS
MOCK
MODE
MODS
MOJO
MOLD
MOLE
MOLT
MOMS
MONK
MONO
MOOD
MOON
MOOR
MOOS
MOOT
MOPE
MOPS
MORE
MORN
MOSH
MOSS
MOST
MOTE
MOTH
MOVE
MOWS
MUCH
MUCK
MUDS
MUFF
MUGS
MULE
MULL
MUMS
MUON
MURK
MUSE
MUSH
MUSK
MUST
MUTE
MUTT
MYTH
NAAN
NABS
NAGS
NAIL
NAME
NANA
NANS
NAPE
NAPS
NARC
NARD
NARY
NAVY
NAYS
NEAR
NEAT
NECK
NEED
NEEM
NEON
NERD
NESS
NEST
NETS
NEWS
NEWT
NEXT
NIBS
NICE
NICK
NIGH
NINE
NITE
NOBS
NODE
NODS
NOEL
NOIR
NONE
NOOK
NOON
NOPE
NORI
NORM
NOSE
NOSH
NOSY
NOTE
NOUN
NOVA
NUBS
NUDE
NUKE
NULL
NUMB
NUNS
NUTS
OAFS
OAKS
OAKY
OARS
OATH
OATS
OBEY
OBIT
OBOE
ODDS
ODES
ODOR
OGLE
OGRE
OILS
OILY
OINK
OKAY
OKRA
OLDS
OMEN
OMIT
ONCE
ONES
ONLY
ONTO
ONUS
ONYX
OOPS
OOZE
OOZY
OPAL
OPEN
OPTS
OPUS
ORAL
ORBS
ORCA
ORES
ORGY
ORZO
OUCH
OURS
OUST
OUTS
OVAL
OVEN
OVER
OVUM
OWED
OWES
OWLS
OWNS
PACE
PACK
PACT
PADS
PAGE
PAID
PAIL
PAIN
PAIR
PALE
PALL
PALM
PALP
PALS
PANE
PANG
PANS
PANT
PAPA
PAPS
PARA
PARE
PARK
PARS
PART
PASS
PAST
PATE
PATH
PATS
PAVE
PAWN
PAWS
PAYS
PEAK
PEAL
PEAR
PEAS
PEAT
PECK
PECS
PEED
PEEK
PEEL
PEEP
PEER
PEES
PEGS
PELT
PENS
PENT
PEON
PERK
PERM
PERP
PESO
PEST
PETS
PEWS
PHEW
PICK
PICS
PIED
PIER
PIES
PIGS
PIKA
PIKE
PILE
PILL
PINE
PING
PINK
PINS
PINT
PIPE
PISS
PITA
PITH
PITS
PITY
PLAN
PLAT
PLAY
PLEA
PLEB
PLED
PLEX
PLOD
PLOP
PLOT
PLOW
PLOY
PLUG
PLUM
PLUS
POCK
PODS
POEM
POET
POKE
POKY
POLE
POLL
POLO
POLY
POMP
POND
PONG
PONY
POOF
POOL
POOP
POOR
POPE
POPS
PORE
PORK
PORT
POSE
POSH
POSY
POTS
POUF
POUR
POUT
PRAM
PRAY
PREP
PREY
PREZ
PRIG
PRIM
PROB
PROD
PROF
PROG
PROM
PROP
PROS
PROW
PUBS
PUCK
PUDS
PUFF
PUGS
PUKE
PULL
PULP
PUMA
PUMP
PUNK
PUNS
PUNT
PUNY
PUPA
PUPS
PURE
PURL
PURR
PUSH
PUSS
PUTS
PUTT
PUTZ
PYRE
PYRO
QUAD
QUID
QUIP
QUIT
QUIZ
RACE
RACK
RACY
RADS
RAFT
RAGA
RAGE
RAGS
RAID
RAIL
RAIN
RAJA
RAKE
RAKU
RALE
RAMP
RAMS
RANG
RANK
RANT
RAPS
RAPT
RARE
RASH
RASP
RATE
RATH
RATS
RAVE
RAYS
RAZE
RAZZ
READ
REAL
REAM
REAP
REAR
REDO
REED
REEF
REEK
REEL
REFS
REIN
RELY
REMS
REND
RENT
REPO
REPP
REPS
REST
RIBS
RICE
RICH
RIDE
RIDS
RIFE
RIFF
RIFT
RIGS
RILE
RILL
RIME
RIMS
RIND
RING
RINK
RIOT
RIPE
RIPS
RISE
RISK
RITE
RITZ
ROAD
ROAM
ROAN
ROAR
ROBE
ROBS
ROCK
RODE
RODS
ROES
ROIL
ROLE
ROLL
ROMP
ROMS
ROOF
ROOK
ROOM
ROOS
ROOT
ROPE
ROPY
ROSE
ROSY
ROTE
ROTI
ROTO
ROTS
ROUT
ROUX
ROVE
ROWS
RUBE
RUBS
RUBY
RUCK
RUDE
RUED
RUES
RUFF
RUGS
RUIN
RULE
RUMP
RUMS
RUNE
RUNG
RUNS
RUNT
RUSE
RUSH
RUST
RUTS
SACK
SACS
SAFE
SAGA
SAGE
SAGO
SAGS
SAID
SAIL
SAKE
SAKI
SALE
SALT
SAME
SAND
SANE
SANG
SANK
SAPS
SARI
SASH
SASS
SATE
SAVE
SAWN
SAWS
SAYS
SCAB
SCAD
SCAM
SCAN
SCAR
SCAT
SCOT
SCUD
SCUM
SEAL
SEAM
SEAR
SEAS
SEAT
SECT
SEED
SEEK
SEEM
SEEN
SEEP
SEER
SEES
SELF
SELL
SEMI
SEND
SENT
SEPT
SETS
SEWN
SEWS
SHAM
SHED
SHEW
SHIM
SHIN
SHIP
SHIT
SHIV
SHOD
SHOE
SHOO
SHOP
SHOT
SHOW
SHUN
SHUT
SIBS
SICK
SIDE
SIFT
SIGH
SIGN
SILK
SILL
SILO
SILT
SINE
SING
SINK
SINS
SIPS
SIRE
SIRS
SITE
SITS
SIZE
SKEW
SKID
SKIM
SKIN
SKIP
SKIS
SKIT
SLAB
SLAG
SLAM
SLAP
SLAT
SLAW
SLAY
SLED
SLEW
SLID
SLIM
SLIP
SLIT
SLOB
SLOE
SLOG
SLOP
SLOT
SLOW
SLUG
SLUM
SMOG
SMUG
SNAG
SNAP
SNIP
SNIT
SNOB
SNOT
SNOW
SNUB
SNUG
SOAK
SOAP
SOAR
SOBA
SOBS
SOCK
SODA
SODS
SOFA
SOFT
SOIL
SOLD
SOLE
SOLO
SOME
SONG
SONS
SOON
SOOT
SOPS
SORE
SORT
SOUL
SOUP
SOUR
SOWN
SOWS
SOYA
SPAM
SPAN
SPAR
SPAS
SPAT
SPAY
SPEC
SPED
SPEW
SPIN
SPIT
SPOT
SPRY
SPUD
SPUN
SPUR
STAB
STAG
STAR
STAT
STAY
STEM
STEP
STEW
STIR
STOP
STOW
STUB
STUD
STUN
STYE
SUBS
SUCH
SUCK
SUED
SUES
SUET
SUIT
SULK
SUMO
SUMP
SUMS
SUNG
SUNK
SUNS
SUPS
SURE
SURF
SUSS
SWAB
SWAG
SWAM
SWAN
SWAP
SWAT
SWAY
SWIG
SWIM
SWUM
SYNC
TABS
TACH
TACK
TACO
TACT
TAGS
TAIL
TAKE
TALC
TALE
TALK
TALL
TAME
TAMP
TANG
TANK
TANS
TAPE
TAPS
TARE
TARN
TARO
TARP
TARS
TART
TASK
TAUT
TAXI
TEAK
TEAL
TEAM
TEAR
TEAS
TEAT
TECH
TEEM
TEEN
TEES
TEFF
TELE
TELL
TEMP
TEND
TENT
TERM
TERN
TEST
TEXT
THAN
THAT
THAW
THEE
THEM
THEN
THEY
THIN
THIS
THOU
THRU
THUD
THUG
THUS
TICK
TIDE
TIDY
TIED
TIER
TIES
TIFF
TIKI
TILE
TILL
TILT
TIME
TINE
TING
TINS
TINT
TINY
TIPS
TIRE
TITS
TOAD
TODE
TOED
TOES
TOFU
TOGA
TOIL
TOKE
TOLD
TOLE
TOLL
TOMB
TOME
TONE
TONG
TOOK
TOOL
TOON
TOOT
TOPS
TORE
TORN
TORT
TORY
TOSS
TOTE
TOTS
TOUR
TOUT
TOWN
TOWS
TOYS
TRAM
TRAP
TRAY
TREE
TREK
TREY
TRIG
TRIM
TRIO
TRIP
TROD
TROT
TSAR
TUBA
TUBE
TUBS
TUCK
TUFF
TUFT
TUGS
TUMS
TUNA
TUNE
TURD
TURF
TURK
TURN
TUSH
TUSK
TUTS
TUTU
TWEE
TWIG
TWIN
TWIT
TWOS
TYKE
TYPE
TYPO
UDON
UGLY
UMPS
UNDO
UNIT
UNTO
UPON
URGE
URNS
USED
USER
USES
VAIL
VAIN
VAMP
VANE
VANS
VARY
VASE
VAST
VATS
VEAL
VEER
VEIL
VEIN
VEND
VENT
VERB
VERT
VERY
VEST
VETO
VETS
VIAL
VIBE
VICE
VIDS
VIED
VIES
VIEW
VILE
VIMS
VINE
VINO
VISA
VISE
VITA
VIVA
VOID
VOLE
VOLT
VOTE
VOWS
WACK
WADE
WADS
WAFT
WAGE
WAGS
WAIF
WAIL
WAIT
WAKE
WALK
WALL
WAND
WANE
WANT
WARD
WARE
WARM
WARN
WARP
WARS
WART
WARY
WASH
WASP
WATT
WAVE
WAVY
WAXY
WAYS
WEAK
WEAN
WEAR
WEBS
WEDS
WEED
WEEK
WEEN
WEEP
WELL
WENT
WERE
WEST
WHAT
WHEN
WHOM
WIDE
WIFE
WILD
WILL
WILT
WIND
WINE
WING
WINS
WIPE
WIRE
WISE
WISH
WITH
WOLF
WOOD
WOOL
WORD
WORE
WORK
WORM
WORN
WRAP
YARD
YARN
YEAH
YEAR
YOGA
YOUR
ZERO
ZINC
ZONE
ZOOM`;

const words = wordsString.split("\n");
// console.log(words);
