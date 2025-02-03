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

const GameController = function (existingPlayers = null) {
    const board = GameBoard();

    let players = existingPlayers || [ // Keep scores if passed, otherwise create new players
        { name: "Player One", token: null, score: 0 },
        { name: "Player Two", token: null, score: 0 }
    ];

   
    let playerOneToken = prompt("Which token would you want to choose? (X / O)").toUpperCase();
    let playerTwoToken = (playerOneToken === 'X') ? 'O' : 'X';
    players[0].token = playerOneToken;
    players[1].token = playerTwoToken;
    

    let activePlayer = players[0];

    const getPlayers = () => players; // Add this function to get players

    const switchPlayerTurn = () => {
        activePlayer = (activePlayer === players[0]) ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const playRound = (playerRow, playerColumn) => {
        playerRow = parseInt(playerRow, 10);
        playerColumn = parseInt(playerColumn, 10);
        
        if (!board.playerToken(playerRow, playerColumn, getActivePlayer().token)) {
            console.log("Cell already taken! Try again.");
            return false;
        }
        
        if (board.gameWon(playerRow, playerColumn)) {
            board.printBoard();
            console.log(`${getActivePlayer().name} wins this round!`);
            getActivePlayer().score++;
        } else if (board.gameDraw()) {
            board.printBoard();
            console.log("Game was a draw!");
        } else {
            switchPlayerTurn();
        }
        return true;
    };

    return { 
        playRound,
        getBoard: board.getBoard,
        getActivePlayer,
        getPlayers,  // New function to get players (to persist scores)
        gameWon: board.gameWon,
        gameDraw: board.gameDraw
    };
};


// Instantiate and start the game
const ScreenController = function () {
    let game = GameController();
    
    const boardEle = document.querySelectorAll(".board-ele");
    const heading = document.querySelector(".container h1");
    const player1Score = document.querySelector(".player-1 p");
    const player2Score = document.querySelector(".player-2 p");
    const startBtn = document.querySelector(".start");
    const restartBtn = document.querySelector(".restart");

    startBtn.addEventListener("click", addListnersToBoardEle);
    restartBtn.addEventListener("click", fullResetGame);

    function addListnersToBoardEle () {
        boardEle.forEach((ele, index) => {
            ele.dataset.row = Math.floor(index / 3);
            ele.dataset.column = index % 3;
            ele.addEventListener("click", playersMove);
            heading.textContent = "Player 1 Move";
            restartBtn.classList.remove("hide");
            startBtn.classList.add("hide");
        });
    }

    function playersMove(e) {
        const row = parseInt(e.target.dataset.row, 10);
        const col = parseInt(e.target.dataset.column, 10);
        
        const activePlayer = game.getActivePlayer();
    
        if (game.playRound(row, col)) {
            e.target.textContent = activePlayer.token; 
    
            if (game.gameWon(row, col)) {
                heading.textContent = `${activePlayer.name} Won!!!`;
                if (activePlayer.name == "Player One") {
                    player1Score.textContent = `${activePlayer.score}`;
                } else {
                    player2Score.textContent = `${activePlayer.score}`;
                }
                disableBoard();
                setTimeout(restartGame, 2000); 
            } 
            else if (game.gameDraw()) {
                heading.textContent = "It's a Draw!!!";
                disableBoard();
                setTimeout(restartGame, 2000); 
            } 
            else {
                heading.textContent = `${game.getActivePlayer().name} Move`;
            }
        }
    }
    

    function disableBoard() {
        boardEle.forEach(ele => ele.removeEventListener("click", playersMove));
    }

    function fullResetGame() {
        boardEle.forEach(ele => {
            ele.textContent = "";
            ele.addEventListener("click", playersMove);
        });
    
        // Fully reset game and scores
        game = GameController(); // Create a new game instance without passing players
        player1Score.textContent = "0"; // Reset UI scores
        player2Score.textContent = "0";
        heading.textContent = "Player 1 Move";
    }
    

    function restartGame() {
        boardEle.forEach(ele => {
            ele.textContent = "";
            ele.addEventListener("click", playersMove);
        });
    
        // Reset only the game board but keep the scores
        game = GameController(game.getPlayers()); // Pass players so scores persist
        heading.textContent = `${game.getActivePlayer().name} Move`;
    }
    
}

ScreenController();


