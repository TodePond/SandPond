# Sandboys
Sandboys are little atoms that follow simple rules.<br>
It's inspired by the [T2Tile project](https://t2tile.org/) and [SPLAT](https://github.com/DaveAckley/SPLAT).

I post daily updates [here](https://www.instagram.com/todepond/).

## Rules
Sandboys follow simple rules, like this one:
```
@ => _
_    @
```
It makes an atom fall down if there's an empty space below it.<br>
PS: This example has a locked y-axis.

## Getting Started
Just download it and open index.html in a browser.

## Make your own element
1. Write some TodeSplat using the TodeSplat function (check out the examples in the `Elements` folder).
2. Add your TodeSplat function or file to `index.html`.

## To-Do
* Reduce scope of Atom object.
* Reduce scope of World object.
* Reduce scope of AtomType.
* Rename certain things to match T2Tile??? eg: "neighbours" to "event window"✔️, "atomType" to "element", "axes" to "symmetries".
* Try separating colour and visibility into different attributes.
* Implement a Universe class that combines separate Worlds together.
* Implement Conway's game of life in 2D and 3D.
* Implement demon horde sort.
* Add panning to camera controls.
* Fix Splat UI for rules that use the z-axis and negative coordinates.
* Try making different Worlds resolve rules in different web workers.
* Randomise the order that spaces process in.
* Let the user change the opacity of different elements on the fly.
* Allow different size atoms.
* ADD VR SUPPORT.

## Done
* Implement TodeSPLAT language. ✔️ 08.10.19 Needs more work 
* Implement Res and DReg. ✔️ 02.10.19
* Implement randomness of selecting a rule. ❌ Covered by custom inputs and outputs. 01.10.19
* Implement custom Input and Output class. ✔️ 01.10.19
* Change event window from a 3x3x3 grid into three intersecting 5x5 planes. ✔️ 30.09.19
* Move event window code into its own file. ✔️ 30.09.19
