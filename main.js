(function (window, document) {
    "use strict";

    var ticTacToe = document.querySelector(".tic-tac-toe"); // Main game display.
    var gridDisplay = document.querySelectorAll(".tic-tac-toe div");

    var playAgainOption = document.querySelector(".play-again-option");
    var instructions = document.querySelector(".instructions");

    var symbolIdentifiers = document.querySelectorAll(".symbol-identifier");

    // used to prevent grid from being modified when game isn't being played.
    var gameInProgress = false;

    var player = {
        name: "Player 1",
        symbol: ""
    };

    // Up to data representation grid of the tic tac toe grid.
    var grid = [
        ["","",""],
        ["","",""],
        ["","",""],
    ];

    // List of preprogrammed rows that make up the entire grid.
    // These rows are used when evaluating grid for win, lose, or draw.
    var rows = [
        // Diagonal row 1
        [{ x: 0, y: 0 },{ x: 1, y: 1 },{ x: 2, y: 2 }],
        // Diagonal row 2
        [{ x: 2, y: 0 },{ x: 1, y: 1 },{ x: 0, y: 2 }],
        // Horizontal row 1
        [{ x: 0, y: 0 },{ x: 1, y: 0 },{ x: 2, y: 0 }],
        // Horizontal row 2
        [{ x: 0, y: 1 },{ x: 1, y: 1 },{ x: 2, y: 1 }],
        // Horizontal row 3
        [{ x: 0, y: 2 },{ x: 1, y: 2 },{ x: 2, y: 2 }],
        // Vertical row 1
        [{ x: 0, y: 0 },{ x: 0, y: 1 },{ x: 0, y: 2 }],
        // Vertical row 2
        [{ x: 1, y: 0 },{ x: 1, y: 1 },{ x: 1, y: 2 }],
        // Vertical row 3
        [{ x: 2, y: 0 },{ x: 2, y: 1 },{ x: 2, y: 2 }]
    ];

    // AI that plays against the user.
    var AI = {
        name: "AI",
        symbol: "",
        // Pass in a reference to the 2D array representing the grid.
        init: function (gridData, sym) {
            this.grid = gridData;
            this.symbol = sym;
            return true;
        },

        // AI's turn to move. Evaluate grid and find a move to make.
        // Returns the coordinates of the move.
        move: function (rows) {
            // if the middle block is unoccupied, occupy it.
            if (grid[1][1] === "") {
                return { x: 1, y: 1 };
            }

            // if two blocks are filled in a row with AI's symbol
            for (var row of rows) {
                var pos1 = grid[row[0].x][row[0].y];
                var pos2 = grid[row[1].x][row[1].y];
                var pos3 = grid[row[2].x][row[2].y];

                if (pos1 !== "" && pos1 === this.symbol) {
                    if  (pos1 === pos2 && pos3 === "") {
                        return {x: row[2].x, y: row[2].y};
                    }
                } else if (pos2 !== "" && pos2 === this.symbol) {
                    if (pos2 === pos3 && pos1 === "") {
                        return {x: row[0].x, y: row[0].y};
                    }
                } else if (pos3 !== "" && pos3 === this.symbol) {
                    if (pos1 === pos3 && pos2 === "") {
                        return {x: row[1].x, y: row[1].y};
                    }
                }

            }

            // if two blocks are filled in a row with opponent's symbol
            for (var row of rows) {
                var pos1 = grid[row[0].x][row[0].y];
                var pos2 = grid[row[1].x][row[1].y];
                var pos3 = grid[row[2].x][row[2].y];

                if (pos1 === pos3 && pos1 !== "" && pos1 !== this.symbol && pos2 === "" && this.name === "AI") {
                    return {x: row[1].x, y: row[1].y};
                }

                if (pos1 !== "" && pos1 !== this.symbol) {
                    if  (pos1 === pos2 && pos3 === "") {
                        return {x: row[2].x, y: row[2].y};
                    }
                } else if (pos2 !== "" && pos2 !== this.symbol) {
                    if (pos2 === pos3 && pos1 === "") {
                        return {x: row[0].x, y: row[0].y};
                    }
                } else if (pos3 !== "" && pos3 !== this.symbol) {
                    if (pos1 === pos3 && pos2 === "") {
                        return {x: row[1].x, y: row[1].y};
                    }
                }

            }

            // Find all unoccupied spaces in grid and store their coordinates in an array.
            var possibleMoves = []; // Used to hold all possible moves.

            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    // If a block is occupied by the opponents symbol.
                    // Find an open space next to it and store the open space's coordinates.
                    if (grid[i][j] !== "" && grid[i][j] !== this.symbol) {
                        if (i-1 > -1) {
                            if (j-1 > -1 && grid[i-1][j-1] === "") {
                                possibleMoves.push({ x: i-1, y: j-1 });
                            } else if (j+1 < 3 && grid[i-1][j+1] === "") {
                                possibleMoves.push({ x: i-1, y: j+1 });
                            } else if (grid[i-1][j] === "") {
                                possibleMoves.push({ x: i-1, y: j });
                            }
                        } else if (i+1 < 3) {
                            if (j-1 > -1 && grid[i+1][j-1] === "") {
                                possibleMoves.push({ x: i+1, y: j-1 });
                            } else if (j+1 < 3 && grid[i+1][j+1] === "") {
                                possibleMoves.push({ x: i+1, y: j+1 });
                            } else if (grid[i+1][j] === "") {
                                possibleMoves.push({ x: i+1, y: j });
                            }
                        } else {
                            if (j-1 > -1 && grid[i][j-1] === "") {
                                possibleMoves.push({ x: i, y: j-1 });
                            } else if (j+1 < 3 && grid[i][j+1] === "") {
                                possibleMoves.push({ x: i, y: j+1 });
                            }
                        }
                    }
                }
            }
            
            // If a corner is unoccupied AI will occupy it.
            for (var coordinate of possibleMoves) {
                // If a coordinate is a corner. Occupy it.
                if (coordinate.x === 0 && coordinate.y === 0
                    || coordinate.x === 0 && coordinate.y === 2
                    || coordinate.x === 2 && coordinate.y === 0
                    || coordinate.x === 2 && coordinate.y === 2) {
                    return coordinate;
                }
            }

            // If all corners were occupied choose the first one found.
            if (possibleMoves.length > 0) {
                return possibleMoves[0];
            }

            // There are no more moves.
            return null;
            
        }
    };

    // Add game logic to each html elements representing a block in the game.
    gridDisplay.forEach((element, index, array) => {
        element.onclick = function () {

            // If user clicks on an already occupied block. Ignore
            if (element.innerText !== "" || player.symbol === "") {
                return false;
            }

            // Do nothing when grid is disabled.
            if (ticTacToe.classList.contains("disabled")) {
                return;
            }

            // Update grid and display
            element.innerText = player.symbol;
            var x = element.attributes[0].textContent.charAt(0);
            var y = element.attributes[0].textContent.charAt(2);
            grid[x][y] = player.symbol;

            var gridStat = evaluateGridState(grid, player.symbol, rows);
            
            if (gridStat === "win") {
                win(player.name);
                return true;
            } 

            if (gameInProgress) {

                var aiMove = AI.move(rows);
                //console.log(aiMove);
                if (aiMove) {
                    grid[aiMove.x][aiMove.y] = AI.symbol;
                    document.querySelector("div[data-id='" + aiMove.x + " " + aiMove.y + "']").innerText = AI.symbol;
                }

                // Check Whether AI wins or draws(loses). If neither game continues.
                if (evaluateGridState(grid, AI.symbol, rows) === "draw") {
                    draw();
                } else if (evaluateGridState(grid, AI.symbol, rows) === "win") {
                    win(AI.name);
                }

            }
        };
    });

    // Set logic on the two symbols that allow user to choose their symbol.
    symbolIdentifiers.forEach((element, index, array) => {
        element.onclick = function (e) {
            // If user hasn't selected a symbol yet. Allow to select one.
            if (player.symbol === "") {
                var sym = element.attributes[0].textContent;

                if (sym === "x") {
                    player.symbol = sym;
                    AI.init(grid, "o");
                } else {
                    player.symbol = "o";
                    AI.init(grid, "x");
                }

                gameInProgress = true;
                ticTacToe.classList.remove("disabled");
                instructions.innerText = "Start...";
            } else {
                e.preventDefault();
            }
        };
    });


    // functions to handle the outcomes of games.
    // Used to modify the UI and reset the game.
    function win(name) {
        ticTacToe.classList.add("disabled");
        playAgainOption.style.display = "block";
        instructions.innerText = name + " Wins!";
    }

    function draw() {
        ticTacToe.classList.add("disabled");
        playAgainOption.style.display = "block";
        instructions.innerText = "Draw";
    }

    window.resetTicTacToe = function reset() {
        gridDisplay = document.querySelectorAll(".tic-tac-toe div");
        gameInProgress = false;

        player.symbol = "";
        AI.symbol = "";
        
        grid = [
            ["","",""],
            ["","",""],
            ["","",""],
        ];

        gridDisplay.forEach((element) => {
            element.innerText = "";
        });

        ticTacToe.classList.add("disabled");
        instructions.innerText = "Choose your symbol.";
        playAgainOption.style.display = "none";
    }

    // Param: grid, 2D array representation of the grid.
    // Param: symbol, Current player's symbol.
    // Used to determine whether game wins or draws.
    // Returns 'win' or 'draw'. Applicable to user
    function evaluateGridState(grid, symbol, rows) {
        // if row is filled with user's symbol
        for (var row of rows) {
            var pos1 = grid[row[0].x][row[0].y];
            var pos2 = grid[row[1].x][row[1].y];
            var pos3 = grid[row[2].x][row[2].y];
            //console.log(pos1, pos2, pos3);
            if (pos1 === pos2
                && pos1 === pos3
                && pos1 !== ""
                && pos1 === symbol) {
                return "win";
            }

        }

        // Look for open positions if some are found game continues.
        for (var row of grid) {
            for (var piece of row) {
                if (piece === "") {
                    return null;
                }
            }
        }

        // If there are no more moves and neither user has won.
        // Game is a draw.
        return "draw";
    }

})(window, document);