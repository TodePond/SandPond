//carelessly constructed by davidsover d:
{
	let globalGridLoadState = {arr: {}, y: -1};
	
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
		
		let highestY = 0;
		
		let didDrop = false;
		for (let element in arr){
			for (let i in arr[element][y]){
				dropAtomCall(arr[element][y][i][0], y, arr[element][y][i][1], element);
				
				didDrop = true;
			}
			
			if (highestY < arr[element].length - 1){
				highestY = arr[element].length - 1;
			}
		}
		
		globalGridLoadState.y++;
		
		if (globalGridLoadState.y <= highestY){
			let timeoutLength = (didDrop) ? 50 : 1;
			
			setTimeout(loadWorldGridFromArray, timeoutLength);
		}
	}
	
	function saveWorldGridAsArray(isElementless){
		let elements = {};
		
		let arr = [];
		
		for (let i in world.grid){
			arr[i] = [];
			for (let j in world.grid[i]){
				for (let k in world.grid[i][j]){
					if (world.grid[i][j][k].atom.visible){
						arr[i].push([Number(j), Number(k)]);
						
						let elementName = world.grid[i][j][k].atom.element.name;
						
						if (elements[elementName] == undefined){
							elements[elementName] = [];
						}
						
						if (elements[elementName][i] == undefined){
							elements[elementName][i] = [];
						}
						
						elements[elementName][i].push([Number(j), Number(k)]);
					}
				}
			}
		}
		return (isElementless) ? arr : elements;
	}
	
	function saveWorldGridToInput(){
		document.getElementById("saveId").value = JSON.stringify(saveWorldGridAsArray());
	}
	
	
	function copyWorldGridSave(){
		navigator.clipboard.writeText(document.getElementById("saveId").value);
	}
	
	
	function loadWorldGrid(){
		let arr = JSON.parse(document.getElementById("loadId").value); //parse never went wrong in the history of humanity
		
		loadWorldGridFromArray(arr);
	}
}