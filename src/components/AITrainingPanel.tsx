
import { Zap, AlertTriangle } from "lucide-react";

interface AITrainingPanelProps {
  learningRate: number;
  errorRate: number;
  onLearnFastClick: () => void;
}

const AITrainingPanel = ({ learningRate, errorRate, onLearnFastClick }: AITrainingPanelProps) => {
  return (
    <div className="mt-8 bg-gray-800/50 rounded-xl p-6 border-2 border-purple-400">
      <h3 className="text-lg font-bold text-purple-400 mb-4 font-mono text-center">⚡ AI TRAINING BALANCE</h3>
      <p className="text-xs text-cyan-300 mb-4 font-mono text-center">
        ⚠️ AI DRIFTS FAST toward errors! Keep clicking LEARN FAST! 🔥
      </p>
      
      <div className="relative">
        <div className="w-full h-16 bg-gray-700 rounded-xl border-2 border-gray-600 relative overflow-hidden">
          <div 
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-cyan-500 transition-all duration-300"
            style={{ width: `${(learningRate / (learningRate + errorRate)) * 100}%` }}
          />
          <div 
            className="absolute right-0 top-0 h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300"
            style={{ width: `${(errorRate / (learningRate + errorRate)) * 100}%` }}
          />
          <div className="absolute left-1/2 top-0 h-full w-0.5 bg-white/50 transform -translate-x-0.5" />
        </div>
        
        <button
          onClick={onLearnFastClick}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-green-500 to-cyan-500 text-black font-bold py-2 px-4 rounded-lg font-mono text-sm hover:scale-110 transition-all duration-200 retro-glow border-2 border-white/30 z-10"
        >
          <Zap className="inline mr-1" size={16} />
          LEARN FAST
        </button>
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-black font-bold py-2 px-4 rounded-lg font-mono text-sm border-2 border-white/30 opacity-75">
          <AlertTriangle className="inline mr-1" size={16} />
          AI DRIFT
        </div>
      </div>
      
      <div className="mt-4 flex justify-between text-xs text-cyan-300 font-mono">
        <span>Learning: {Math.round(learningRate * 100)}%</span>
        <span>AI Efficiency: {Math.round((learningRate / (1 + errorRate)) * 100)}%</span>
        <span>Errors: {Math.round(errorRate * 100)}%</span>
      </div>
      
      {errorRate >= 0.9 && (
        <div className="mt-2 text-center text-red-400 font-mono text-sm animate-pulse">
          🚨 AI CRITICAL DRIFT! GAME ENDING SOON! 🚨
        </div>
      )}
    </div>
  );
};

export default AITrainingPanel;
