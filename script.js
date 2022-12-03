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
	const players = [];
	let playerIndex = 0;
	let winner = null;

	const startGame = (p1Name, p2Name) => {
		isStarted = true;
		players.push(PlayerFactory(p1Name, "x"));
		players.push(PlayerFactory(p2Name, "O"));
	};

	const restart = () => {
		isStarted = false;
		players.pop();
		players.pop();
		winner = null;
		playerIndex = 0;
	};

	const isValidSpot = (i, j) => {
		return gameBoard.isValidSpot(i, j);
	};

	const placeMarker = (i, j) => {
		if (!isStarted) {
			return;
		}

		gameBoard.play(players[playerIndex].marker, +i, +j);
		playerIndex = (playerIndex + 1) % 2;
	};

	const isWinner = () => {
		if (!isStarted) {
			return;
		}

		for (let i = 0; i < players.length; i++) {
			const player = players[i];
			if (gameBoard.checkWinner(player.marker)) {
				winner = player;
				return true;
			}
		}
	};

	const getWinner = () => {
		return winner;
	};

	const isDraw = () => {
		return gameBoard.isDraw();
	};

	const getCurrentPlayer = () => {
		return players[playerIndex];
	};

	return {
		placeMarker,
		isWinner,
		getWinner,
		isValidSpot,
		isDraw,
		startGame,
		restart,
		getCurrentPlayer,
	};
})(Gameboard);

const DisplayControl = ((gameControl, board) => {
	const gameSpace = document.querySelector(".game-space");
	const gameBoard = document.createElement("div");
	const startButton = document.querySelector("#submit");
	const restartButton = document.querySelector("#restart");
	const p1Name = document.querySelector("#p1_name");
	const p2Name = document.querySelector("#p2_name");
	const p1Container = document.querySelector("#player_1_div");
	const p2Container = document.querySelector("#player_2_div");

	let isStarted = false;
	createBoard();
	startGame();

	function displayCurrentPlayer() {
		const player = gameControl.getCurrentPlayer();

		if (player.name == p1Name.value) {
			p2Container.classList.remove("your-turn");
			const p2Indicator = p2Container.lastElementChild;
			p2Indicator.textContent = "";

			p1Container.classList.add("your-turn");
			const indicator = p1Container.lastElementChild;
			indicator.textContent = "your turn";
		} else {
			p1Container.classList.remove("your-turn");
			const p1Indicator = p1Container.lastElementChild;
			p1Indicator.textContent = "";

			p2Container.classList.add("your-turn");
			const indicator = p2Container.lastElementChild;
			indicator.textContent = "your turn";
		}
	}

	function displayWinner() {
		const winner = gameControl.getWinner();

		if (winner.name == p1Name.value) {
			p1Container.classList.remove("your-turn");
			p1Container.classList.add("winner");
			const p1Indicator = p1Container.lastElementChild;
			p1Indicator.textContent = "you won!";

			p2Container.classList.add("loser");
			const indicator = p2Container.lastElementChild;
			indicator.textContent = "you lost :(";
		} else {
			p2Container.classList.remove("your-turn");
			p2Container.classList.add("winner");
			const p2Indicator = p2Container.lastElementChild;
			p2Indicator.textContent = "you won!";

			p1Container.classList.add("loser");
			const indicator = p1Container.lastElementChild;
			indicator.textContent = "you lost :(";
		}
	}

	function clearWinner() {
		p1Container.classList.remove("winner");
		p2Container.classList.remove("loser");
		const p1Indicator = p1Container.lastElementChild;
		p1Indicator.textContent = "";

		p1Container.classList.remove("winner");
		p2Container.classList.remove("loser");
		const indicator = p2Container.lastElementChild;
		indicator.textContent = "";
	}

	function startGame() {
		startButton.addEventListener("click", (e) => {
			if (p1Name.value == "" || p2Name.value == "") {
				return;
			}
			gameControl.startGame(p1Name.value, p2Name.value);
			displayCurrentPlayer();
			isStarted = true;
			e.preventDefault();
		});

		restartButton.addEventListener("click", (e) => {
			if (!isStarted) {
				return;
			}
			gameControl.restart();
			clearBoard();
			p1Name.value = "";
			p2Name.value = "";
			clearWinner();
		});
	}

	function placeMarker(e) {
		[i, j] = getCoordinates(e);
		if (!gameControl.isValidSpot(i, j) || gameControl.isWinner()) {
			return;
		}

		gameControl.placeMarker(i, j);
		redrawBoard();

		if (gameControl.isWinner()) {
			displayWinner();
			return;
		}

		if (gameControl.isDraw()) {
			console.log("no spaces left");
		}

		displayCurrentPlayer();
	}

	function redrawBoard() {
		const it = getCells();
		let result = it.next();
		while (!result.done) {
			let cell = result.value;
			const i = cell.parentNode.dataset.index;
			const j = cell.dataset.index;

			cell.textContent = board.get(i, j);
			result = it.next();
		}
	}

	function clearBoard() {
		const it = getCells();
		let cell = it.next();
		while (!cell.done) {
			cell.value.textContent = "";
			cell = it.next();
		}
	}

	function* getCells() {
		const rows = document.querySelectorAll(".row");
		let iterationsCount = 0;
		for (let i = 0; i < rows.length; i++) {
			const row = rows[i];
			const childNodes = row.childNodes;
			for (let j = 0; j < childNodes.length; j++) {
				iterationsCount++;
				yield childNodes[j];
			}
		}
		return iterationsCount;
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
