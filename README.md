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

## Getting Started
Just download it and open `index.html` in a browser.

## Make your own element
1. Write some TodeSplat using the `TodeSplat` function.
2. Add your TodeSplat function or file to `index.html` in the same place as the other elements.

To learn more, check out the [TodeSplat Tutorial](https://github.com/l2wilson94/Sandboys/wiki/TodeSplat-Tutorial).<br>
Or check out the examples in the [Elements](https://github.com/l2wilson94/Sandboys/tree/master/Elements) folder.

## To-Do
* Fix mobile and touchscreen controls.
* Make the dropper place atoms on top of other atoms if it is being blocked.
* Put menu items into categories.
* Move functions to their appropriate files.
* Flip the z-axis.
* Implement a symmetry option that transforms a rule to all symmetries, instead of just choosing one randomly. ⏳ Implemented in one way, but I'm going to re-do it a different way 10.10.19
* Reduce scope of World object.
* Reduce scope of AtomType.
* Rename certain things to match T2Tile. eg: "neighbours" to "event window"✔️, "atomType" to "element", "axes" to "symmetries".
* Try separating colour and visibility into different attributes.
* Implement a Universe class that combines separate Worlds together.
* Implement demon horde sort.
* Add panning to camera controls.
* Try making different Worlds resolve rules in different web workers.
* Let the user change the opacity of different elements on the fly. Highlight elements that you hover over in the menu.
* Allow different size atoms.
* ADD VR SUPPORT.

## Done
* Fix 3D elements not working in 2D mode. ✔️ 12.10.19
* Add menu for changing mode. ✔️ 12.10.19
* Allow mode selection via URL parameters. ✔️ 12.10.19
* Added 2D Mode. ✔️ 12.10.19
* Randomise the order that spaces process in. ✔️ 12.10.19
* Implement randomness of selecting a rule. ✔️ Implemented as syntax sugar 11.10.19
* Give menu items names. ✔️ 11.10.19
* Fix Splat UI for rules that use the z-axis and negative coordinates. ❌ Replaced with source code viewer 11.10.19
* Clean up TodeSplat syntax. ✔️ globals and "chance" label helped this 11.10.19
* Add a loading screen. ✔️ 10.10.19
* Reduce scope of Atom object. ✔️ 10.10.19
* Invert how axes work to match T2Tile project. ✔️ 10.10.19
* Implement Conway's game of life in 2D and 3D. ❌ I tried it and it was rubbish because the randomness of the machine stopped it working 09.10.19
* Support custom output arguments. ✔️ 09.10.19
* Support multi-line functions in TodeSplat. ✔️ 09.10.19
* Implement TodeSPLAT language. ✔️ Needs more work 08.10.19
* Implement Res and DReg. ✔️ 02.10.19
* Implement custom Input and Output class. ✔️ 01.10.19
* Change event window from a 3x3x3 grid into three intersecting 5x5 planes. ✔️ 30.09.19
* Move event window code into its own file. ✔️ 30.09.19
