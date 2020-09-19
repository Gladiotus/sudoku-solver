var SolverController = (function () {
	// Solver Controller
	var board;
	var cellCheck = function (value, y, x) {
		let gridX, gridY;
		for (let i = 0; i < 9; i++) {
			// Search row for value
			if (board[y][i] === value) return false;
		}
		for (let i = 0; i < 9; i++) {
			// Search column for value
			if (board[i][x] === value) return false;
		}
		gridX = Math.floor(x / 3) * 3;
		gridY = Math.floor(y / 3) * 3;
		for (let i = 0; i < 3; i++) {
			// Search square for value
			for (let n = 0; n < 3; n++) {
				if (board[gridY + i][gridX + n] === value) return false;
			}
		}
		return true;
	};
	var solveBoard = function () {
		// option to add a function to display the solving process
		for (let y = 0; y < 9; y++) {
			for (let x = 0; x < 9; x++) {
				if (board[y][x] === 0) {
					for (let n = 1; n < 10; n++) {
						if (cellCheck(n, y, x)) {
							board[y][x] = n;
							if (solveBoard()) {
								return true;
							} else {
								board[y][x] = 0;
							}
						}
					}
					return false;
				}
			}
		}
		return true;
	};
	return {
		isValidInput: function (puzzle) {
			// option to add function to show the faulty value in the board => index of y * 9 + x
			var tempItem;
			for (let y = 0; y < 9; y++) {
				for (let x = 0; x < 9; x++) {
					if (puzzle[y][x] !== 0) {
						tempItem = puzzle[y][x];
						puzzle[y][x] = 0;
						console.log(puzzle[y][x], y, x);
						if (!cellCheck(tempItem, y, x)) {
							return false;
						} else {
							puzzle[y][x] = tempItem;
						}
					}
				}
			}
			return true;
		},
		solver: function () {
			return solveBoard(board);
		},
		getBoard: function () {
			return board;
		},
		setBoard: function (b) {
			board = b;
		},
	};
})();

var UIController = (function () {
	// UI Controller
	var generateNewArray = function () {
		// Generate empty board array
		var newArray = [];
		for (let i = 0; i < 9; i++) {
			newArray.push([]);
			for (let j = 0; j < 9; j++) {
				newArray[i].push(0);
			}
		}
		return newArray;
	};
	return {
		boardConvert: function () {
			// Convert the ui board into the solver board
			let inputArray, newArray, count;
			count = 0;
			inputArray = $(".cell");
			newArray = generateNewArray();
			for (let i = 0; i < 9; i++) {
				for (let j = 0; j < 9; j++) {
					if (inputArray[count].value) {
						newArray[i][j] = parseInt(inputArray[count].value);
					}
					count++;
				}
			}
			return newArray;
		},
		displayBoard: function (board) {
			let inputArray, count;
			count = 0;
			inputArray = $(".cell");
			for (let i = 0; i < 9; i++) {
				for (let j = 0; j < 9; j++) {
					if (board[i][j]) {
						inputArray[count].value = board[i][j];
					}
					count++;
				}
			}
		},
		noSolution: function () {
			$(".alert").text("No solution");
			$(".alert").css("display", "block");
		},
		notValidPuzzle: function () {
			$(".alert").text("Not a valid puzzle");
			$(".alert").css("display", "block");
		},
	};
})();

var MasterController = (function (solveCtrl, UICtrl) {
	// Master Controller
	var submitBtn;
	submitBtn = $(".submit");
	var setupEventListeners = function () {
		submitBtn.on("click", function () {
			var puzzle = UICtrl.boardConvert();
			$(".alert").css("display", "none");
			solveCtrl.setBoard(puzzle);
			if (solveCtrl.isValidInput(puzzle)) {
				if (solveCtrl.solver()) {
					UICtrl.displayBoard(solveCtrl.getBoard());
				} else {
					UICtrl.noSolution();
				}
			} else {
				UICtrl.notValidPuzzle();
			}
		});
	};
	return {
		init: function () {
			var board = [
				// Predefined board
				[0, 0, 1, 6, 0, 7, 0, 0, 0],
				[6, 0, 0, 8, 0, 0, 2, 5, 7],
				[8, 0, 0, 0, 9, 0, 6, 0, 3],
				[4, 0, 0, 0, 0, 0, 8, 3, 2],
				[0, 1, 0, 0, 6, 9, 0, 0, 0],
				[0, 0, 0, 0, 4, 0, 0, 0, 6],
				[9, 0, 0, 0, 0, 1, 0, 7, 8],
				[0, 8, 5, 0, 0, 0, 0, 0, 9],
				[3, 0, 4, 0, 0, 0, 0, 6, 1],
			];
			UICtrl.displayBoard(board);
			setupEventListeners();
		},
	};
})(SolverController, UIController);

MasterController.init();
