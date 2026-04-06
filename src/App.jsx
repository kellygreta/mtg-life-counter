import { useState } from "react";
import { Menu, X, RotateCcw, Settings } from "lucide-react";

// Constants
const PLAYER_COLORS = [
  "#21CEE1", // Teal
  "#FF6B6B", // Coral Red
  "#B3E2CD", // Mint
  "#F4CAE4", // Pink
];
const PLAYER_OPTIONS = [2, 3, 4];
const LIFE_TOTAL_OPTIONS = [20, 25, 30, 40];

// Utility function
const createPlayers = (count, startingLife) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    life: startingLife,
    name: `Player ${i + 1}`,
    poison: 0,
    energy: 0,
    commanderDamage: 0,
  }));

export default function MTGLifeCounter() {
  const [gameStarted, setGameStarted] = useState(false);
  const [numPlayers, setNumPlayers] = useState(2);
  const [startingLife, setStartingLife] = useState(20);
  const [players, setPlayers] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const startGame = () => {
    setPlayers(createPlayers(numPlayers, startingLife));
    setGameStarted(true);
  };

  const updateLife = (id, amount) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, life: Math.max(0, p.life + amount) } : p,
      ),
    );
  };

  const updateCounter = (id, counterType, amount) => {
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const newValue = Math.max(0, p[counterType] + amount);
        return { ...p, [counterType]: newValue };
      }),
    );
  };

  const resetGame = () => {
    setPlayers(createPlayers(numPlayers, startingLife));
    setMenuOpen(false);
  };

  const backToSetup = () => {
    setGameStarted(false);
    setPlayers([]);
    setMenuOpen(false);
  };

  if (!gameStarted) {
    return (
      <SetupScreen
        numPlayers={numPlayers}
        setNumPlayers={setNumPlayers}
        startingLife={startingLife}
        setStartingLife={setStartingLife}
        onStart={startGame}
      />
    );
  }

  return (
    <GameBoard
      players={players}
      numPlayers={numPlayers}
      onUpdateLife={updateLife}
      onUpdateCounter={updateCounter}
      onReset={resetGame}
      onBackToSetup={backToSetup}
      menuOpen={menuOpen}
      setMenuOpen={setMenuOpen}
    />
  );
}

// Setup Screen Component
function SetupScreen({
  numPlayers,
  setNumPlayers,
  startingLife,
  setStartingLife,
  onStart,
}) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-10 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-slate-700/50 w-full max-w-lg my-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
            ✨ MTG Life Counter ✨
          </h1>
          <p className="text-slate-400 text-sm">Track your battles in style</p>
        </div>

        <OptionSelector
          label="Number of Players"
          options={PLAYER_OPTIONS}
          selected={numPlayers}
          onSelect={setNumPlayers}
          gridCols="grid-cols-3"
          activeColor="from-cyan-500 to-blue-600"
        />

        <OptionSelector
          label="Starting Life Total"
          options={LIFE_TOTAL_OPTIONS}
          selected={startingLife}
          onSelect={setStartingLife}
          gridCols="grid-cols-2"
          activeColor="from-emerald-500 to-teal-600"
        />

        <button
          onClick={onStart}
          className="w-full py-4  bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-2xl text-xl font-bold transition-all shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105 hover:shadow-2xl"
        >
          ⚔️ Start Game
        </button>
      </div>
    </div>
  );
}

// Option Selector Component
function OptionSelector({
  label,
  options,
  selected,
  onSelect,
  gridCols,
  activeColor,
}) {
  return (
    <div className="mb-6 ">
      <label className="block text-slate-300 text-basefont-bold mb-3 ">
        {label}
      </label>
      <div className={`grid ${gridCols} gap-2`}>
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onSelect(option)}
            className={`py-3 sm:py-4 rounded-2xl text-lg font-bold transition-all ${
              selected === option
                ? `bg-gradient-to-br ${activeColor} text-white scale-105 shadow-lg`
                : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:scale-105"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function GameBoard({
  players,
  numPlayers,
  onUpdateLife,
  onUpdateCounter,
  onReset,
  onBackToSetup,
  menuOpen,
  setMenuOpen,
}) {
  const gridClass =
    numPlayers === 2
      ? "grid-two-player"
      : numPlayers === 3
        ? "grid-three-player"
        : "grid-four-player";

  return (
    <div className="h-screen w-screen overflow-hidden bg-black relative">
      <GameStyles />
      <MenuButton onClick={() => setMenuOpen(true)} />
      <MenuModal
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onReset={onReset}
        onBackToSetup={onBackToSetup}
      />

      <div className={`game-grid ${gridClass}`}>
        {players.map((player, index) => (
          <PlayerCard
            key={player.id}
            player={player}
            index={index}
            onUpdateLife={onUpdateLife}
            onUpdateCounter={onUpdateCounter}
          />
        ))}
      </div>
    </div>
  );
}

// Menu Modal Component
function MenuModal({ isOpen, onClose, onReset, onBackToSetup }) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-md z-40"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-700 pointer-events-auto transform transition-all">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Game Menu
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-black transition-colors transform duration-300"
            >
              <X size={28} strokeWidth={2.5} />
            </button>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <button
              onClick={onReset}
              className="w-full py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-2xl text-base sm:text-lg font-bold transition-all shadow-lg hover:shadow-orange-500/50 flex items-center justify-center gap-2 sm:gap-3 transform hover:scale-105"
            >
              <RotateCcw size={20} />
              Reset Game
            </button>

            <button
              onClick={onBackToSetup}
              className="w-full py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-2xl text-base sm:text-lg font-bold transition-all shadow-lg hover:shadow-cyan-500/50 flex items-center justify-center gap-2 sm:gap-3 transform hover:scale-105"
            >
              <Settings size={20} />
              New Game
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 sm:py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-2xl text-base sm:text-lg font-bold transition-all transform hover:scale-105"
            >
              Continue Playing
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Game Styles Component
function GameStyles() {
  return (
    <style>{`
      .game-grid {
        height: 100vh;
        width: 100vw;
        display: grid;
        gap: 3px;
        background: #000;
      }

      .grid-two-player {
        grid-template-rows: 1fr 1fr;
      }
      .grid-two-player .player-card:first-child {
        transform: rotate(180deg);
      }

      .grid-three-player {
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
      }
      .grid-three-player .player-card:nth-child(1),
      .grid-three-player .player-card:nth-child(2) {
        transform: rotate(180deg);
      }
      .grid-three-player .player-card:nth-child(3) {
        grid-column: 1 / 3;
        grid-row: 2 / 3;
      }

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
        padding: 1rem;
        position: relative;
        transition: all 0.5s ease;
      }

      .player-card.defeated {
        background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%) !important;
        opacity: 0.7;
      }

      .increment-btn {
        font-size: 2.5rem;
        font-weight: 900;
        padding: 0.5rem;
        border-radius: 1.5rem;
        transition: all 0.2s;
        border: 3px solid rgba(0, 0, 0, 0.25);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(12px);
        color: #000;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2);
      }

      @media (min-width: 640px) {
        .increment-btn {
          padding: 1rem;
          border-radius: 1.75rem;
        }
      }

      .increment-btn:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: translateY(-3px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3),
                    inset 0 1px 0 rgba(255, 255, 255, 0.3);
        border-color: rgba(0, 0, 0, 0.35);
      }
      .increment-btn:active {
        transform: translateY(0) scale(0.95);
      }

      .menu-button {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 50;
        background: radial-gradient(circle at 30% 30%, #1e3a8a, #0f172a);
        border: 0;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 
          0 0 0 0 rgba(59, 130, 246, 0),
          0 0 20px rgba(59, 130, 246, 0.4),
          0 10px 25px rgba(0, 0, 0, 0.5),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .menu-button::before {
        content: '';
        position: absolute;
        inset: -4px;
        border-radius: 50%;
        padding: 4px;
        background: linear-gradient(135deg, #3b82f6, #06b6d4, #3b82f6);
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        opacity: 0;
        transition: opacity 0.3s;
      }
      
      .menu-button:hover::before {
        opacity: 1;
        animation: rotate-gradient 3s linear infinite;
      }

      @keyframes rotate-gradient {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
      
      .menu-button:hover {
        background: radial-gradient(circle at 30% 30%, #2563eb, #1e3a8a);
        transform: translate(-50%, -50%) scale(1.1);
        box-shadow: 
          0 0 0 8px rgba(59, 130, 246, 0.15),
          0 0 30px rgba(59, 130, 246, 0.6),
          0 0 50px rgba(6, 182, 212, 0.3),
          0 15px 35px rgba(0, 0, 0, 0.6),
          inset 0 2px 0 rgba(255, 255, 255, 0.2);
      }

      .menu-button:active {
        transform: translate(-50%, -50%) scale(1.05);
      }

      .menu-button svg {
        transition: all 0.3s;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
      }

      .menu-button:hover svg {
        filter: drop-shadow(0 0 8px rgba(59, 130, 246, 1)) drop-shadow(0 0 12px rgba(6, 182, 212, 0.8));
      }

      .counter-badge {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: rgba(10, 0, 0, 0.75);
        backdrop-filter: blur(12px);
        border-radius: 1.25rem;
        padding: 0.4rem 0.85rem;
        font-size: 0.8rem;
        font-weight: bold;
        display: flex;
        gap: 0.6rem;
        align-items: center;
        border: 2px solid rgba(255, 255, 255, 0.15);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }

      @media (min-width: 640px) {
        .counter-badge {
          top: 0.75rem;
          right: 0.75rem;
          border-radius: 1.5rem;
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
          gap: 0.75rem;
        }
      }

      .counter-item {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        color: white;
      }

      @keyframes defeated-pulse {
        0%, 100% {
          opacity: 0.6;
        }
        50% {
          opacity: 0.8;
        }
      }

      .player-card.defeated {
        animation: defeated-pulse 2s ease-in-out infinite;
      }
    `}</style>
  );
}

// Menu Button Component
function MenuButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="menu-button"
      title="Menu"
      aria-label="Open Menu"
    >
      <Menu size={36} color="#60a5fa" strokeWidth={2.5} />
    </button>
  );
}

// Player Card Component
function PlayerCard({ player, index, onUpdateLife, onUpdateCounter }) {
  const backgroundColor = PLAYER_COLORS[index % PLAYER_COLORS.length];
  const isDefeated = player.life === 0 || player.poison >= 10;

  return (
    <div
      className={`player-card ${isDefeated ? "defeated" : ""}`}
      style={{ backgroundColor: isDefeated ? undefined : backgroundColor }}
    >
      {(player.poison > 0 ||
        player.energy > 0 ||
        player.commanderDamage > 0) && <CounterBadges player={player} />}

      <LifeDisplay
        life={player.life}
        isDefeated={isDefeated}
        playerName={player.name}
      />
      <LifeControls playerId={player.id} onUpdateLife={onUpdateLife} />
      <ActionIcons
        playerId={player.id}
        player={player}
        onUpdateCounter={onUpdateCounter}
      />
    </div>
  );
}

// Counter Badges Component
function CounterBadges({ player }) {
  return (
    <div className="counter-badge">
      {player.energy > 0 && (
        <span className="counter-item">⚡ {player.energy}</span>
      )}
      {player.poison > 0 && (
        <span
          className="counter-item"
          style={{ color: player.poison >= 10 ? "#ff4444" : "white" }}
        >
          ☠ {player.poison}
        </span>
      )}
      {player.commanderDamage > 0 && (
        <span className="counter-item">⚔ {player.commanderDamage}</span>
      )}
    </div>
  );
}

// Life Display Component
function LifeDisplay({ life, isDefeated, playerName }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full">
      <div
        className="text-9xl  font-black leading-none select-none mb-2"
        style={{
          textShadow: isDefeated
            ? "0 6px 20px rgba(0,0,0,0.6)"
            : "0 8px 24px rgba(0,0,0,0.3)",
          color: isDefeated ? "#4a4a4a" : "#000",
          fontWeight: 900,
        }}
        aria-label={`Life total: ${life}`}
      >
        {life}
      </div>
      <span
        className={`text-sm sm:text-base font-bold ${isDefeated ? "text-gray-400" : "text-black text-opacity-60"}`}
      >
        {playerName} {isDefeated && "💀"}
      </span>
    </div>
  );
}

// Life Controls Component
function LifeControls({ playerId, onUpdateLife }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-md">
      <button
        onClick={() => onUpdateLife(playerId, -1)}
        className="increment-btn"
        aria-label="Decrease life by 1"
      >
        -
      </button>
      <button
        onClick={() => onUpdateLife(playerId, 1)}
        className="increment-btn"
        aria-label="Increase life by 1"
      >
        +
      </button>
    </div>
  );
}

// Action Icons Component
function ActionIcons({ playerId, player, onUpdateCounter }) {
  return (
    <div className="w-full flex justify-center gap-3  mt-3 ">
      <CounterButton
        icon="⚡"
        label="Energy"
        value={player.energy}
        onClick={(amount) => onUpdateCounter(playerId, "energy", amount)}
      />
      <CounterButton
        icon="☠"
        label="Poison"
        value={player.poison}
        onClick={(amount) => onUpdateCounter(playerId, "poison", amount)}
        danger={player.poison >= 10}
      />
      <CounterButton
        icon="⚔"
        label="Commander"
        value={player.commanderDamage}
        onClick={(amount) =>
          onUpdateCounter(playerId, "commanderDamage", amount)
        }
      />
    </div>
  );
}

// Counter Button Component
function CounterButton({ icon, label, value, onClick, danger }) {
  const [showControls, setShowControls] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowControls(!showControls)}
        className={`text-2xl sm:text-3xl transition-all ${
          value > 0
            ? "text-black text-opacity-90 scale-110 sm:scale-125 filter drop-shadow-lg"
            : "text-black text-opacity-40 hover:text-opacity-70 hover:scale-110"
        } ${danger ? "animate-pulse" : ""}`}
        aria-label={label}
        title={`${label}: ${value}`}
      >
        {icon}
      </button>

      {showControls && (
        <div className="absolute bottom-full mb-2 sm:mb-3 left-1/2 transform -translate-x-1/2 bg-slate-900 bg-opacity-95 backdrop-blur-md rounded-xl sm:rounded-2xl p-2 sm:p-3 flex gap-2 whitespace-nowrap shadow-2xl border border-slate-700 z-10">
          <button
            onClick={() => {
              onClick(-1);
            }}
            className="px-3 sm:px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all transform hover:scale-105 shadow-lg"
          >
            -
          </button>
          <span className="px-2 sm:px-3 py-2 text-white font-bold text-xs sm:text-sm bg-slate-700 rounded-lg sm:rounded-xl min-w-[1.5rem] sm:min-w-[2rem] text-center">
            {value}
          </span>
          <button
            onClick={() => {
              onClick(1);
            }}
            className="px-3 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all transform hover:scale-105 shadow-lg"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}
