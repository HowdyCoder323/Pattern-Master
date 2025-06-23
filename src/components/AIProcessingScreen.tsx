
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface AIProcessingScreenProps {
  aiProgress: number;
  learningRate: number;
  errorRate: number;
}

const AIProcessingScreen = ({ aiProgress, learningRate, errorRate }: AIProcessingScreenProps) => {
  const currentProblem = Math.floor(aiProgress / 4) + 1;
  
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      
      <Card className="p-8 max-w-md w-full text-center bg-gray-900/90 backdrop-blur-sm border-2 border-cyan-400 retro-glow relative z-10">
        <h2 className="text-3xl font-bold text-cyan-400 mb-6 font-mono">🤖 AI COMPUTING...</h2>
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full mx-auto mb-4 animate-pulse retro-glow"></div>
          <p className="text-cyan-300 mb-4 font-mono">Solving pattern sequences...</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 mb-4">
          <Progress value={aiProgress} className="mb-2 h-3" />
          <p className="text-sm text-cyan-400 font-mono">Problem {Math.min(currentProblem, 25)} of 25</p>
        </div>
        <div className="flex justify-between text-xs text-cyan-300 font-mono">
          <span>Learning: {Math.round(learningRate * 100)}%</span>
          <span>Efficiency: {Math.round((learningRate / (1 + errorRate)) * 100)}%</span>
          <span>Errors: {Math.round(errorRate * 100)}%</span>
        </div>
        
        {aiProgress > 50 && (
          <div className="mt-4 text-xs text-purple-300 font-mono animate-pulse">
            🧠 Neural pathways adapting...
          </div>
        )}
      </Card>

      <style>{`
        .retro-glow {
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default AIProcessingScreen;
