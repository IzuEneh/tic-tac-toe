const PlayerFactory = (marker, displayControl) => {
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
		// console.table(board);
	};

	const checkRows = (marker) => {
		for (let i = 0; i < 3; i++) {
			const row = board[i];
			if (row[0] === marker && row[0] === row[1] && row[1] === row[2]) {
				return true;
			}
		}
		return false;
	};

	const checkCols = (marker) => {
		for (let i = 0; i < 3; i++) {
			if (
				board[0][i] === marker &&
				board[0][i] === board[1][i] &&
				board[2][i] === board[1][i]
			) {
				return true;
			}
		}
		return false;
	};

	const checkDiag = (marker) => {
		if (
			board[0][0] === marker &&
			board[1][1] === board[0][0] &&
			board[2][2] === board[1][1]
		) {
			return true;
		}

		if (
			board[0][2] === marker &&
			board[1][1] === board[0][2] &&
			board[2][0] === board[1][1]
		) {
			return true;
		}

		return false;
	};

	const checkWinner = (marker) => {
		return checkRows(marker) || checkCols(marker) || checkDiag(marker);
	};

	return { play, checkWinner };
})();

const Game = ((gameBoard) => {
	let currentMarker = "X";
	const checkWinner = (marker) => {
		/* check for winner logic */
	};

	const restart = (gameboard) => {
		/* Restart game logic */
	};

	const getCurrentMarker = () => {
		return currentMarker;
	};

	const placeMarker = (i, j) => {
		gameBoard.play(currentMarker, i, j);
		isWinner = gameBoard.checkWinner(currentMarker);
		if (isWinner) {
			console.log(currentMarker + " IS the winner");
		}
	};

	return { checkWinner, restart, getCurrentMarker, placeMarker };
})(Gameboard);

const DisplayControl = ((gameControl) => {
	const gameSpace = document.querySelector(".content");
	const gameBoard = document.createElement("div");
	createBoard();

	function placeMarker(e) {
		[i, j] = getCoordinates(e);
		gameControl.placeMarker(i, j);
		e.target.textContent = gameControl.getCurrentMarker();
	}

	const clearBoard = () => {};

	function createBoard() {
		gameBoard.classList.add(["game-board"]);
		const rows = createNElements(3, "div", ["row"]);
		rows.forEach((row) => {
			const cells = createNElements(3, "div", ["cell"]);
			cells.forEach((cell) => {
				cell.addEventListener("click", placeMarker);
				row.appendChild(cell);
			});
			gameBoard.appendChild(row);
		});
		gameSpace.appendChild(gameBoard);
	}

	function createNElements(n, element, classes) {
		const result = [];
		for (let i = 0; i < n; i++) {
			const el = document.createElement(element);
			el.classList.add(classes);
			el.setAttribute("data-index", i);
			result.push(el);
		}
		return result;
	}

	function getCoordinates(e) {
		const cell = e.target;
		const row = cell.parentNode;
		return [row.dataset.index, cell.dataset.index];
	}

	return { clearBoard };
})(Game);
