let board;
let score = 0;
let rows = 4;
let columns = 4;

let startX = 0;
let startY = 0;

document.addEventListener('touchstart', (e) => {
	startX = e.touches[0].clientX;
	startY = e.touches[0].clientY;
})

function setGame(){
	board = [
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		];

	for (let r = 0; r < rows; r++) {
		for(let c = 0; c < columns; c++){
			let tile = document.createElement("div");

			tile.id = r.toString() + "-" + c.toString();

			let num = board[r][c]

			updateTile(tile, num);

			document.getElementById("board").append(tile);
		}
	}

	setTwo();
	setTwo()
}

function updateTile(tile, num){
	tile.innerText = "";

	tile.classList.value = "";

	tile.classList.add("tile");

	if(num > 0){
		tile.innerText = num.toString();

		if(num <= 4096){
			tile.classList.add("x" + num.toString());
		} else {
			tile.classList.add("x8192");
		}
	}
}

window.onload = function(){
	setGame();	
}

document.addEventListener('touchmove', (e) => {

    if(!e.target.className.includes("tile")){
        return
    }

    e.preventDefault(); 
}, { passive: false }); 

document.addEventListener('touchend', (e) => {
	if (!e.target.className.includes("tile")) {
        return;
    }

    let diffX = startX - e.changedTouches[0].clientX;
    let diffY = startY - e.changedTouches[0].clientY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 0) {
            slideLeft(); t
            setTwo(); 
        } else {
            slideRight(); 
            setTwo(); 
        }
    } else {
        // Vertical swipe
        if (diffY > 0) {
            slideUp(); 
            setTwo(); 
        } else {
            slideDown(); 
            setTwo(); 
        }
    }

    document.getElementById("score").innerText = score;
        
    checkWin();

    if (hasLost()) {
        setTimeout(() => {
	        alert("Game Over! You have lost the game. Game will restart");
	        restartGame();
	        alert("Click any key to restart");
        }, 100); 
    }

})


function handleSlide(e){
	if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)){
		e.preventDefault();

		if(e.code == "ArrowLeft"){
			slideLeft();
			setTwo();
		} else if (e.code == "ArrowRight"){
			slideRight();
			setTwo();
		} else if (e.code == "ArrowUp"){
			slideUp();
			setTwo();
		} else if (e.code == "ArrowDown"){
			slideDown();
			setTwo();
		}

		document.getElementById("score").innerText = score;
	}

	checkWin();

    // Call hasLost() to check for game over conditions
    if (hasLost()) {
        // Use setTimeout to delay the alert
        setTimeout(() => {
            alert("Game Over! You have lost the game. Game will restart");
            restartGame();
            alert("Click any arrow key to restart");
            // You may want to reset the game or perform other actions when the user loses.
        }, 100); // Adjust the delay time (in milliseconds) as needed

    }
}

document.addEventListener("keydown", handleSlide);

let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

function checkWin(){
	for (let r = 0; r < rows; r++){
		for (let c = 0; c < columns; c++){
			if(board[r][c] == 2048 && is2048Exist == false){
				alert("You win! You got 2048!");
				is2048Exist = true;
			} else if(board[r][c] == 4096 && is4096Exist == false){
				alert("You are unstoppable at 4096!");
				is4096Exist = true;
			} else if(board[r][c] == 8192 && is8192Exist == false){
				alert("Victory! You have reached 8192!");
				is8192Exist = true;
			}
		}
	}
}


function hasLost() {
    // Check if the board is full
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 0) {
                // Found an empty tile, user has not lost
                return false;
            }

            const currentTile = board[r][c];

            // Check adjacent cells (up, down, left, right)
            if (
                r > 0 && board[r - 1][c] === currentTile ||
                r < rows - 1 && board[r + 1][c] === currentTile ||
                c > 0 && board[r][c - 1] === currentTile ||
                c < columns - 1 && board[r][c + 1] === currentTile
            ) {
                // Found adjacent cells with the same value, user has not lost
                return false;
            }
        }
    }

    // No possible moves left or empty tiles, user has lost
    return true;
}


// RestartGame by replacing all values into zero.
function restartGame(){
    // Iterate in the board and 
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            board[r][c] = 0;    // change all values to 0
        }
    }
    score = 0;  
    setTwo()    // new tile   
}

function filterZero(row){
	return row.filter(num => num != 0);
}

function slide(row){
	row = filterZero(row);

	for (let i = 0; i < row.length - 1; i++){
		if (row[i] == row[i + 1]){
			row[i] *= 2;
			row[i + 1] = 0;
			score += row[i];
		}
	}

	row = filterZero(row)

	while(row.length < columns){
		row.push(0);
	}

	return row;
}


function slideLeft(){
    // console.log("You pressed left")

    for(let r = 0; r < rows; r++){
    	let row = board[r];

    	let originalRow = row.slice(); // store the array in a new variable

    	row = slide(row);
    	board[r] = row;

    	for (let c = 0; c < columns; c++){
    		let tile = document.getElementById(r.toString() + "-" + c.toString());
    		let num = board[r][c];
    		updateTile(tile, num);

    		if (originalRow[c] !== num && num !== 0) {  
    		    tile.style.animation = "slide-from-right 0.3s";
    		    setTimeout(() => {
    		        tile.style.animation = "";
    		    }, 300);
    		}
    	}
    }
}

function slideRight() {
    // console.log("You pressed right")

	// iterate through each row
	for(let r = 0; r < rows; r++){
	    let row = board[r]

	    let originalRow = row.slice();
	    
	    row.reverse(); // reverse the array(since it is sliding to the right) before removing the zeroes  row = [0, 2, 2, 2] -> row = [2, 2, 2, 0]
	    row = slide(row); // modify the array -> [4, 2, 0, 0]
	    row.reverse(); // reverse the array -> [0, 0, 2, 4]
	    board[r] = row;

	    // Update the id of the tile
	    for(let c = 0; c < columns; c++){
	        let tile = document.getElementById(r.toString() + "-" + c.toString());
	        let num = board[r][c];
	        updateTile(tile, num)

    		if (originalRow[c] !== num && num !== 0) {   
                tile.style.animation = "slide-from-left 0.3s";
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }
	    }
	}
}

function slideUp() {
    // console.log("You pressed up")

	for(let c = 0; c < columns; c++) {
	    let row = [board[0][c], board[1][c], board[2][c], board[3][c]] 

	    let originalRow = row.slice();

	    row = slide(row);

	    let changedIndices = [];
        for (let r = 0; r < columns; r++) { 
            if (originalRow[r] !== row[r]) {
                changedIndices.push(r);
            }
        }

	    // Update the id of the tile
	    for(let r = 0; r < columns; r++){
	        board[r][c] = row[r]
	        let tile = document.getElementById(r.toString() + "-" + c.toString());
	        let num = board[r][c];
	        updateTile(tile, num)

            if (changedIndices.includes(r) && num !== 0) {
                tile.style.animation = "slide-from-bottom 0.3s";
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }
	    }
	}
}

function slideDown() {
    // console.log("You pressed down")

    for(let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]] 

        let originalRow = row.slice();

        row.reverse();  
        row = slide(row);
        row.reverse();   

        // Check which tiles have changed in this column
        let changedIndices = [];
        for (let r = 0; r < columns; r++) {

            if (originalRow[r] !== row[r]) {
                changedIndices.push(r);
            }
        }   // [0, 2, 3]
        
        // Update the id of the tile
        for(let r = 0; r < columns; r++){
            board[r][c] = row[r]
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num)

            if (changedIndices.includes(r) && num !== 0) {

                tile.style.animation = "slide-from-top 0.3s";
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }
        }
    }
}

// Returns a boolean
function hasEmptyTile(){
    // Iterate through the board
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            // Check if current tile == 0, if yes return true
            if(board[r][c] == 0){
                return true
            }
        }
    }
    // Return false if no tile == 0
    return false;
}

function setTwo(){
	if(!hasEmptyTile()){
		return;
	}

	let found = false;

	while(!found){
		let r = Math.floor(Math.random() * rows);
		let c = Math.floor(Math.random() * columns);

		if(board[r][c] === 0){
			board[r][c] = 2;
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			tile.innerText = "2";
			tile.classList.add("x2");

			found = true;
		}
	}
}

document.addEventListener("click", (event) => {
	if(event.target.id != "change-button"){
		return
	}

	tile02 = document.getElementById("02")
    tile04 = document.getElementById("04")
    tile08 = document.getElementById("08")
    tile16 = document.getElementById("16")
    tile32 = document.getElementById("32")
    tile64 = document.getElementById("64")
    tile128 = document.getElementById("128")
    tile256 = document.getElementById("256")
    tile512 = document.getElementById("512")
    tile1024 = document.getElementById("1024")
    tile2048 = document.getElementById("2048")
    tile4096 = document.getElementById("4096")
    tile8192 = document.getElementById("8192")

    if(tile02.value != ''){
    	document.document.style.setProperty("--background-image-url-02", "url('" + tile02.value + "')");
    }
    if(tile04.value != ''){
        document.documentElement.style.setProperty("--background-image-url-04", "url('" + tile04.value + "')");
    }
    if(tile08.value != ''){
        document.documentElement.style.setProperty("--background-image-url-08", "url('" + tile08.value + "')");
    }
    if(tile16.value != ''){
        document.documentElement.style.setProperty("--background-image-url-16", "url('" + tile16.value + "')");
    }
    if(tile32.value != ''){
        document.documentElement.style.setProperty("--background-image-url-32", "url('" + tile32.value + "')");
    }
    if(tile64.value != ''){
        document.documentElement.style.setProperty("--background-image-url-64", "url('" + tile64.value + "')");
    }
    if(tile128.value != ''){
        document.documentElement.style.setProperty("--background-image-url-128", "url('" + tile128.value + "')");
    }
    if(tile256.value != ''){
        document.documentElement.style.setProperty("--background-image-url-256", "url('" + tile256.value + "')");
    }
    if(tile512.value != ''){
        document.documentElement.style.setProperty("--background-image-url-512", "url('" + tile512.value + "')");
    }
    if(tile1024.value != ''){
        document.documentElement.style.setProperty("--background-image-url-1024", "url('" + tile1024.value + "')");
    }
    if(tile2048.value != ''){
        document.documentElement.style.setProperty("--background-image-url-2048", "url('" + tile2048.value + "')");
    }
    if(tile4096.value != ''){
        document.documentElement.style.setProperty("--background-image-url-4096", "url('" + tile4096.value + "')");
    }
    if(tile8192.value != ''){
        document.documentElement.style.setProperty("--background-image-url-8192", "url('" + tile8192.value + "')");
    }
})