//carelessly constructed by davidsover d:
{
	let globalGridLoadState = {arr: [], y: -1};
	
	function loadWorldGridFromArray(arr, y){
		if (arr != undefined){
			globalGridLoadState = {arr: arr, y: y};
		} else{
			arr = globalGridLoadState.arr;
			y = globalGridLoadState.y;
		}
		
		if (y == -1 || y == undefined){
			y = 0;
			globalGridLoadState.y = y;
		}
		
		let didDrop = false;
		for (let i in arr[y]){
			dropAtomCall(arr[y][i][0], y, arr[y][i][1]);
			
			didDrop = true;
		}
		
		globalGridLoadState.y++;
		
		if (globalGridLoadState.y < arr.length){
			let timeoutLength = (didDrop) ? 50 : 1;
			
			setTimeout(loadWorldGridFromArray, timeoutLength);
		}
	}
	
	function saveWorldGridAsArray(){
		let arr = [];
		
		for (let i in world.grid){
			arr[i] = [];
			for (let j in world.grid[i]){
				for (let k in world.grid[i][j]){
					if (world.grid[i][j][k].atom.visible){
						arr[i].push([Number(j), Number(k)]);
					}
				}
			}
		}
		return arr;
	}
	
	function saveWorldGridToInput(isBottomOnly){
		if (isBottomOnly){
			document.getElementById("saveId").value = "[" + JSON.stringify(saveWorldGridAsArray()[0]) + "]";
		} else{
			document.getElementById("saveId").value = JSON.stringify(saveWorldGridAsArray());
		}
	}
	
	
	function copyWorldGridSave(){
		navigator.clipboard.writeText(document.getElementById("saveId").value);
	}
	
	
	function loadWorldGrid(){
		let arr = JSON.parse(document.getElementById("loadId").value); //parse never went wrong in the history of humanity
		
		loadWorldGridFromArray(arr);
	}
}