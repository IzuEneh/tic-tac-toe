const PlayerFactory = (marker) => {
	const play = (marker) => {
		/* make a move */
	};
	return { play };
};

const Gameboard = (() => {
	const board = [
		["", "", ""],
		["", "", ""],
		["", "", ""],
	];

	const play = (marker, i, j) => {
		if (board[i][j] != "") {
			return;
		}
		board[i][j] = marker;
	};

	return { play };
})();

const Game = (() => {
	const checkWinner = (marker) => {
		/* check for winner logic */
	};

	const restart = (gameboard) => {
		/* Restart game logic */
	};

	return { checkWinner, restart };
})();

const DisplayControl = (() => {
	const gameSpace = document.querySelector(".content");
	const gameBoard = document.createElement("div");
	createBoard();

	const placeMarker = (marker, i, j) => {
		/* 
			place maker logic will need to add data index to 
			rows and cells
		*/
	};

	const clearBoard = () => {};

	function createBoard() {
		gameBoard.classList.add(["game-board"]);
		const rows = createNElements(3, "div", ["row"]);
		rows.forEach((row) => {
			const cells = createNElements(3, "div", ["cell"]);
			cells.forEach((cell) => row.appendChild(cell));
			gameBoard.appendChild(row);
		});
		gameSpace.appendChild(gameBoard);
	}

	function createNElements(n, element, classes) {
		const result = [];
		for (let i = 0; i < n; i++) {
			const el = document.createElement(element);
			el.classList.add(classes);
			result.push(el);
		}
		return result;
	}

	return { placeMarker, clearBoard };
})();
