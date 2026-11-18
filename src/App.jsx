
import { useReducer, useEffect } from "react";
import "./App.css";

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const initialState = {
  board: Array(9).fill(null),
  currentPlayer: "X",
  winner: null,
  draw: false,
};

function calculateWinner(board) {
  for (const line of winningLines) {
    const [a, b, c] = line;

    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return board[a];
    }
  }

  return null;
}

function gameReducer(state, action) {
  switch (action.type) {
    case "MAKE_MOVE": {
      const { index } = action;

      if (
        state.board[index] ||
        state.winner ||
        state.draw ||
        state.currentPlayer !== "X"
      ) {
        return state;
      }

      const newBoard = [...state.board];
      newBoard[index] = "X";

      const winner = calculateWinner(newBoard);
      const draw = !winner && newBoard.every(Boolean);

      return {
        board: newBoard,
        currentPlayer: "O",
        winner,
        draw,
      };
    }

    case "COMPUTER_MOVE": {
      if (
        state.currentPlayer !== "O" ||
        state.winner ||
        state.draw
      ) {
        return state;
      }

      const { index } = action;

      if (state.board[index] !== null) {
        return state;
      }

      const newBoard = [...state.board];
      newBoard[index] = "O";

      const winner = calculateWinner(newBoard);
      const draw = !winner && newBoard.every(Boolean);

      return {
        board: newBoard,
        currentPlayer: "X",
        winner,
        draw,
      };
    }

    case "RESET":
      return {
        ...initialState,
        board: [...initialState.board],
      };

    default:
      return state;
  }
}

function App() {
  const [game, dispatch] = useReducer(
    gameReducer,
    initialState
  );

  // Computer opponent
  useEffect(() => {
    if (
      game.currentPlayer === "O" &&
      !game.winner &&
      !game.draw
    ) {
      const timer = setTimeout(() => {
        const emptySquares = game.board
          .map((square, index) =>
            square === null ? index : null
          )
          .filter((index) => index !== null);

        if (emptySquares.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * emptySquares.length
          );

          dispatch({
            type: "COMPUTER_MOVE",
            index: emptySquares[randomIndex],
          });
        }
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [
    game.currentPlayer,
    game.board,
    game.winner,
    game.draw,
  ]);

  function handleSquareClick(index) {
    dispatch({
      type: "MAKE_MOVE",
      index,
    });
  }

  function handleRestart() {
    dispatch({
      type: "RESET",
    });
  }

  let status;

  if (game.winner) {
    status = `Winner: ${game.winner}`;
  } else if (game.draw) {
    status = "Draw!";
  } else if (game.currentPlayer === "O") {
    status = "Computer is thinking...";
  } else {
    status = "Your turn: X";
  }

  return (
    <main className="game-container">
      <div className="game-card">

        <p className="eyebrow">THE CLASSIC GAME</p>

        <h1>Tic Tac Toe</h1>

        <p className="subtitle">
          You are X. Computer is O.
        </p>

        <div className="status" aria-live="polite">
          {status}
        </div>

        <div className="board">
          {game.board.map((square, index) => (
            <button
              key={index}
              className={`square ${
                square ? `square-${square}` : ""
              }`}
              onClick={() => handleSquareClick(index)}
              disabled={
                Boolean(square) ||
                game.currentPlayer !== "X" ||
                game.winner ||
                game.draw
              }
              aria-label={`Square ${index + 1}`}
            >
              {square}
            </button>
          ))}
        </div>

        <p className="game-instruction">
          Play against the computer!
        </p>

        <button
          className="restart-button"
          onClick={handleRestart}
        >
          Restart Game
        </button>

      </div>
    </main>
  );
}

export default App;
