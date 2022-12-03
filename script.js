const PlayerFactory = (name, marker) => {
	return { name, marker };
};

const Gameboard = (() => {
	const board = [
		["", "", ""],
		["", "", ""],
		["", "", ""],
	];

	const validSpots = new Set([
		[0, 0],
		[0, 1],
		[0, 2],
		[1, 0],
		[1, 1],
		[1, 2],
		[2, 0],
		[2, 1],
		[2, 2],
	]);

	const removeSpot = (i, j) => {
		validSpots.forEach((spot) => {
			const [row, col] = spot;
			if (row == i && col == j) {
				validSpots.delete(spot);
			}
		});
	};

	const play = (marker, i, j) => {
		board[i][j] = marker;
		removeSpot(i, j);
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

	const isDraw = () => {
		for (let i = 0; i < board.length; i++) {
			const row = board[i];
			for (let j = 0; j < row.length; j++) {
				if (row[j] === "") {
					return false;
				}
			}
		}
		return true;
	};

	const isValidSpot = (i, j) => {
		return board[i][j] === "";
	};

	const get = (i, j) => {
		return board[i][j];
	};

	const playRandomSpot = (marker) => {
		const iter = validSpots.values();
		const [i, j] = iter.next().value;
		play(marker, i, j);
	};

	return { play, checkWinner, isValidSpot, isDraw, get, playRandomSpot };
})();

const Game = ((gameBoard) => {
	let isStarted = false;
	let player1 = null;
	let player2 = null;

	const startGame = (p1Name, p2Name) => {
		console.log("game is started");
		isStarted = true;
		player1 = PlayerFactory(p1Name, "x");
		player2 = PlayerFactory(p2Name, "O");
	};

	const isValidSpot = (i, j) => {
		return gameBoard.isValidSpot(i, j);
	};

	const placeMarker = (i, j) => {
		if (!isStarted) {
			console.log("game not started");
			return;
		}
		gameBoard.play(player1.marker, +i, +j);
		gameBoard.playRandomSpot(player2.marker);
	};

	const isWinner = () => {
		if (!isStarted) {
			return;
		}
		return gameBoard.checkWinner(player1.marker);
	};

	const isDraw = () => {
		return gameBoard.isDraw();
	};

	return {
		placeMarker,
		isWinner,
		isValidSpot,
		isDraw,
		startGame,
	};
})(Gameboard);

const DisplayControl = ((gameControl, board) => {
	const gameSpace = document.querySelector(".game-space");
	const gameBoard = document.createElement("div");
	const startButton = document.querySelector("#submit");
	createBoard();
	startGame();

	function startGame() {
		startButton.addEventListener("click", (e) => {
			const p1Name = document.querySelector("#p1_name");
			const p2Name = document.querySelector("#p2_name");

			if (p1Name.value == "" || p2Name.value == "") {
				return;
			}
			gameControl.startGame(p1Name.value, p2Name.value);
			e.preventDefault();
		});
	}

	function placeMarker(e) {
		[i, j] = getCoordinates(e);
		if (!gameControl.isValidSpot(i, j)) {
			return;
		}

		gameControl.placeMarker(i, j);
		redrawBoard();

		if (gameControl.isWinner()) {
			alert(`player has won the game`);
			return;
		}

		if (gameControl.isDraw()) {
			console.log("no spaces left");
		}
	}

	function redrawBoard() {
		const rows = document.querySelectorAll(".row");
		rows.forEach((row) => {
			const rowIndex = row.dataset.index;
			row.childNodes.forEach((cell) => {
				const cellIndex = cell.dataset.index;
				cell.textContent = board.get(rowIndex, cellIndex);
			});
		});
	}

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

	return {};
})(Game, Gameboard);
