import { useState } from "react";
import { Plus, Minus, RotateCcw, Settings, Menu } from "lucide-react";

export default function MTGLifeCounter() {
  const [gameStarted, setGameStarted] = useState(false);
  const [numPlayers, setNumPlayers] = useState(2);
  const [startingLife, setStartingLife] = useState(20);
  const [players, setPlayers] = useState([]);

  const startGame = () => {
    const newPlayers = Array.from({ length: numPlayers }, (_, i) => ({
      id: i + 1,
      life: startingLife,
      name: `Player ${i + 1}`,
    }));
    setPlayers(newPlayers);
    setGameStarted(true);
  };

  const updateLife = (id, amount) => {
    setPlayers(
      players.map((p) =>
        p.id === id ? { ...p, life: Math.max(0, p.life + amount) } : p
      )
    );
  };

  const resetGame = () => {
    setPlayers(players.map((p) => ({ ...p, life: startingLife })));
  };

  const backToSetup = () => {
    setGameStarted(false);
    setPlayers([]);
  };

  const getPlayerColor = (index) => {
    const colors = [
      "#FFD700", // Yellow/Gold
      "#FF1493", // Pink/Magenta
      "#E0A0FF", // Light Purple
      "#4169E1", // Blue
    ];
    return colors[index % colors.length];
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white border-opacity-20 max-w-md w-full">
          <h1 className="text-4xl font-bold text-white text-center mb-8">
            Game Setup
          </h1>

          <div className="mb-8">
            <label className="block text-white text-lg font-semibold mb-3">
              Number of Players
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[2, 3, 4].map((num) => (
                <button
                  key={num}
                  onClick={() => setNumPlayers(num)}
                  className={`py-4 rounded-xl text-xl font-bold transition-all ${
                    numPlayers === num
                      ? "bg-purple-600 text-white scale-105"
                      : "bg-white bg-opacity-20 text-gray-300 hover:bg-opacity-30"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-white text-lg font-semibold mb-3">
              Starting Life Total
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[20, 25, 30, 40].map((life) => (
                <button
                  key={life}
                  onClick={() => setStartingLife(life)}
                  className={`py-4 rounded-xl text-xl font-bold transition-all ${
                    startingLife === life
                      ? "bg-green-600 text-white scale-105"
                      : "bg-white bg-opacity-20 text-gray-300 hover:bg-opacity-30"
                  }`}
                >
                  {life}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl text-xl font-bold transition-all shadow-lg"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-black relative">
      <style>{`
        .game-grid {
          height: 100vh;
          width: 100vw;
          display: grid;
          gap: 2px;
          background: #000;
        }

        /* 2 Player Layout */
        .grid-two-player {
          grid-template-rows: 1fr 1fr;
        }

        .grid-two-player .player-card:first-child {
          transform: rotate(180deg);
        }

        /* 3 Player Layout */
        @media (min-width: 640px) {
          .grid-three-player {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
          }

          .grid-three-player .player-card:first-child {
            grid-column: 1 / 2;
            grid-row: 1 / 3;
          }

          .grid-three-player .player-card:nth-child(2) {
            grid-column: 2 / 3;
            grid-row: 1 / 2;
            transform: rotate(180deg);
          }

          .grid-three-player .player-card:nth-child(3) {
            grid-column: 2 / 3;
            grid-row: 2 / 3;
          }
        }

        @media (max-width: 639px) {
          .grid-three-player {
            grid-template-rows: 1fr 1fr 1fr;
          }
          
          .grid-three-player .player-card:first-child {
            transform: rotate(180deg);
          }
        }

        /* 4 Player Layout */
        .grid-four-player {
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr;
        }

        .grid-four-player .player-card:nth-child(1),
        .grid-four-player .player-card:nth-child(2) {
          transform: rotate(180deg);
        }

        .player-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          position: relative;
        }

        .life-display {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
        }

        .button-grid {
          width: 100%;
          max-width: 400px;
        }

        .increment-btn {
          font-size: 2rem;
          font-weight: bold;
          padding: 0.75rem;
          border-radius: 0.5rem;
          transition: all 0.15s;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .increment-btn:active {
          transform: scale(0.95);
        }

        .menu-button {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 50;
          background: #1a1a1a;
          border: 3px solid #333;
          border-radius: 50%;
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        }

        .menu-button:hover {
          background: #2a2a2a;
          border-color: #444;
        }
      `}</style>

      <button onClick={backToSetup} className="menu-button" title="Menu">
        <Menu size={28} color="#fff" />
      </button>

      <div
        className={`game-grid ${
          numPlayers === 2
            ? "grid-two-player"
            : numPlayers === 3
            ? "grid-three-player"
            : "grid-four-player"
        }`}
      >
        {players.map((player, index) => (
          <div
            key={player.id}
            className="player-card"
            style={{ backgroundColor: getPlayerColor(index) }}
          >
            <div className="w-full flex justify-between items-center mb-2">
              <button className="text-black text-opacity-30 text-2xl font-bold">
                -
              </button>
              <span className="text-black text-opacity-40 text-sm font-semibold">
                {player.name}
              </span>
              <button className="text-black text-opacity-30 text-2xl font-bold">
                +
              </button>
            </div>

            <div className="life-display">
              <div className="relative mb-4">
                <div
                  className="text-9xl font-black text-black leading-none"
                  style={{
                    textShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  }}
                >
                  {player.life}
                </div>
              </div>
            </div>

            <div className="button-grid grid grid-cols-2 gap-3 w-full">
              <button
                onClick={() => updateLife(player.id, -1)}
                className="increment-btn"
                style={{
                  backgroundColor: "rgba(0,0,0,0.2)",
                  color: "#000",
                }}
              >
                -
              </button>
              <button
                onClick={() => updateLife(player.id, 1)}
                className="increment-btn"
                style={{
                  backgroundColor: "rgba(0,0,0,0.2)",
                  color: "#000",
                }}
              >
                +
              </button>
            </div>

            <div className="w-full flex justify-center gap-4 mt-3 text-black text-opacity-30">
              <button className="text-2xl">⚡</button>
              <button className="text-2xl">☠</button>
              <button className="text-2xl">⚔</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
