const GameBoard = function () {
    const row = 3;
    const column = 3;
    let board = [];

    // Creating the board
    for (let i = 0; i < row; i++) {
        board[i] = [];
        for (let j = 0; j < column; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    // Print current board state
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
    };

    // Check if row or column have the same player's token
    const checkRowColumn = (playerRow, playerColumn) => {
        let countRow = 0, countColumn = 0;
        let playerChoice = board[playerRow][playerColumn].getValue();
        for (let i = 0; i < 3; i++) {
            if (board[playerRow][i].getValue() === playerChoice) countRow++;
            if (board[i][playerColumn].getValue() === playerChoice) countColumn++;
        }
        return countRow === 3 || countColumn === 3;
    };

    // Check diagonals for win condition
    const checkDiagonal = (playerRow, playerColumn) => {
        let playerChoice = board[playerRow][playerColumn].getValue();
        let mainDiagonal = board[0][0].getValue() === playerChoice &&
                           board[1][1].getValue() === playerChoice &&
                           board[2][2].getValue() === playerChoice;
        let antiDiagonal = board[0][2].getValue() === playerChoice &&
                           board[1][1].getValue() === playerChoice &&
                           board[2][0].getValue() === playerChoice;
        return mainDiagonal || antiDiagonal;
    };

    const gameWon = (playerRow, playerColumn) => {
        return checkRowColumn(playerRow, playerColumn) || checkDiagonal(playerRow, playerColumn);
    };

    const gameDraw = () => {
        return board.flat().every(cell => cell.getValue() !== '_');
    };

    const playerToken = (playerRow, playerColumn, token) => {
        if (board[playerRow][playerColumn].getValue() === '_') {
            board[playerRow][playerColumn].addToken(token);
            return true;
        }
        return false;
    };

    return { getBoard, printBoard, playerToken, gameWon, gameDraw };
};

const Cell = function () {
    let value = '_';
  
    // Set a player's token in this cell
    const addToken = (player) => {
        value = player;
    };
  
    const getValue = () => value;
  
    return { addToken, getValue };
};

const GameController = function (playerOneName = "Player One", playerTwoName = "Player Two") {
    const board = GameBoard();
    let players = [
        { name: playerOneName, token: null, score: 0 },
        { name: playerTwoName, token: null, score: 0 }
    ];

    

    const getPlayerToken = () => {
        let playerOneToken = prompt("Which token would you want to choose? (X / O)").toUpperCase();
        let playerTwoToken = (playerOneToken === 'X') ? 'O' : 'X';
        players[0].token = playerOneToken;
        players[1].token = playerTwoToken;
    }

    let activePlayer = players[0];

    const getPlayerScore = (player) => player.score;

    const switchPlayerTurn = () => {
        activePlayer = (activePlayer === players[0]) ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const playTurn = (playerRow, playerColumn, getActivePlayer().token) => {
        if (!board.playerToken(playerRow, playerColumn, getActivePlayer().token)) {
            console.log("Cell already taken! Try again.");
            return;
        }
    };

    const playRound = () => {
        // Get row and column as numbers
        playTurn(playerRow, pla);
        
        // Attempt to place token; if invalid (cell already taken), prompt again
        
        
        if (board.gameWon(playerRow, playerColumn)) {
            board.printBoard();
            console.log(`${getActivePlayer().name} wins this round!`);
            getActivePlayer().score++;
            return;
        } else if (board.gameDraw()) {
            board.printBoard();
            console.log("Round was a draw!");
            return;
        } else {
            switchPlayerTurn();
            printNewRound();
            playRound();
        }
    };

    const playGame = () => {
        getPlayerToken();
        playRound();
        if (getPlayerScore(players[0]) === 3) {
            console.log(`${players[0].name} won the game!`);
            return;
        } else if (getPlayerScore(players[1]) === 3) {
            console.log(`${players[1].name} won the game!`);
            return;
        } else {
            // Optionally, you might want to start a new round if no one has reached 3 wins
            getPlayerToken();
            playRound();
        }
    };

    return { playGame, playerTurn };
};

// Instantiate and start the game
const gameController = GameController();
gameController.playGame();
