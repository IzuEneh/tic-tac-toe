/* 
create  factories and modules for Gamboard, Game Control, Display Control,
and players

Gameboard - 1 
Game - 1
Display control - 1
players - 2
*/

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
	const placeMarker = (marker, i, j) => {
		/* place maker logic */
	};

	const clearBoard = () => {};

	const createBoard = () => {};

	return { placeMarker, clearBoard, createBoard };
})();
