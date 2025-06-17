
import { useState } from "react";
import PatternGame from "@/components/PatternGame";
import GameResults from "@/components/GameResults";

const Index = () => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'results'>('menu');
  const [gameData, setGameData] = useState<any>(null);

  const startGame = () => {
    setGameState('playing');
  };

  const endGame = (results: any) => {
    setGameData(results);
    setGameState('results');
  };

  const resetGame = () => {
    setGameState('menu');
    setGameData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Retro grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      
      {gameState === 'menu' && (
        <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 font-mono tracking-wider drop-shadow-lg">
                🤖 PATTERN MASTER 🧠
              </h1>
              <p className="text-xl text-cyan-300 leading-relaxed font-mono pixel-text">
                Train your AI buddy by solving number patterns! 🎮✨
              </p>
            </div>
            
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border-2 border-cyan-400 mb-8 retro-glow">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4 font-mono">🎯 MISSION BRIEFING</h2>
              <div className="space-y-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 text-black rounded-lg flex items-center justify-center text-sm font-bold mt-0.5 retro-glow">1</div>
                  <p className="text-cyan-200 font-mono">🧩 Solve number pattern puzzles</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 text-black rounded-lg flex items-center justify-center text-sm font-bold mt-0.5 retro-glow">2</div>
                  <p className="text-cyan-200 font-mono">⚡ Control AI learning speed with buttons</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-cyan-400 text-black rounded-lg flex items-center justify-center text-sm font-bold mt-0.5 retro-glow">3</div>
                  <p className="text-cyan-200 font-mono">👀 Watch your AI train in real-time</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 text-black rounded-lg flex items-center justify-center text-sm font-bold mt-0.5 retro-glow">4</div>
                  <p className="text-cyan-200 font-mono">🏆 Get scored based on your training skills!</p>
                </div>
              </div>
            </div>

            <button
              onClick={startGame}
              className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-black px-12 py-6 rounded-2xl text-2xl font-bold hover:scale-110 transform transition-all duration-300 retro-glow font-mono tracking-wider shadow-2xl border-2 border-white/30"
            >
              🚀 START MISSION
            </button>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <PatternGame onGameEnd={endGame} />
      )}

      {gameState === 'results' && (
        <GameResults data={gameData} onRestart={resetGame} />
      )}
      
      <style jsx>{`
        .retro-glow {
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.3), inset 0 0 20px rgba(0, 255, 255, 0.1);
        }
        .pixel-text {
          text-shadow: 2px 2px 0px rgba(0, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Index;
