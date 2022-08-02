<img align="right" height="100" src="http://todepond.com/IMG/SandPond@0.25x.png">

# SandPond
SandPond is an engine for cells that follow spatial rules.<br>
It's heavily inspired by Dave Ackley's [T2 Tile Project](https://t2tile.com/).

**For more info, check out the [SandPond Saga](https://youtube.com/c/TodePond) video series.**

## Rules
Atoms follow simple rules, like this one:
```
@ => _
_    @
```
The `@` represents the atom.<br>
The `_` represents an empty space.<br>
So... the rule makes the atom fall down if there's an empty space below it.<br>

## Try it out
Try it out at [www.sandpond.cool](http://www.sandpond.cool).<br>
Or [download](https://github.com/l2wilson94/SandPond/archive/main.zip) it and open `index.html` in a browser.<br>

## Make your own element
Elements are written in the [SpaceTode](https://github.com/l2wilson94/SpaceTode) language.<br>
To learn SpaceTode, check out the [documentation](https://l2wilson94.gitbook.io/spacetode).<br>
Or look at the examples in the [Elements](https://github.com/l2wilson94/SandPond/tree/main/Source/Elements) folder.
