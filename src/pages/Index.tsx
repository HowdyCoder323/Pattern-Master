
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {gameState === 'menu' && (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="text-center max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Pattern Predictor Pro
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Train an AI by solving pattern sequences. Your accuracy determines how well the AI performs on 10 math problems!
              </p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">How it works</h2>
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">1</div>
                  <p className="text-gray-700">You'll see a sequence of numbers following a pattern</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">2</div>
                  <p className="text-gray-700">Predict the next number in the sequence</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">3</div>
                  <p className="text-gray-700">The AI learns from your accuracy and solves 10 problems</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">4</div>
                  <p className="text-gray-700">Both you and the AI get scored based on performance!</p>
                </div>
              </div>
            </div>

            <button
              onClick={startGame}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Start Training
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
    </div>
  );
};

export default Index;
