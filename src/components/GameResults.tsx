
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, User, Bot, RefreshCw, Zap, AlertTriangle } from "lucide-react";

interface GameResultsProps {
  data: {
    userAnswers: number[];
    correctAnswers: number[];
    userScore: number;
    aiScore: number;
    aiCorrect: number;
    userAccuracy: number;
    learningRate?: number;
    errorRate?: number;
  };
  onRestart: () => void;
}

const GameResults = ({ data, onRestart }: GameResultsProps) => {
  const { userScore, aiScore, aiCorrect, userAccuracy, learningRate = 0.5, errorRate = 0.5 } = data;

  const getPerformanceMessage = () => {
    if (aiScore >= 90) return "🎉 LEGENDARY! Your AI is a GENIUS!";
    if (aiScore >= 80) return "⭐ AWESOME! Your AI learned well!";
    if (aiScore >= 60) return "👍 GOOD JOB! Your AI is getting there!";
    return "🤔 Your AI needs more training!";
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 80) return "text-cyan-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      
      <Card className="p-8 max-w-4xl w-full bg-gray-900/90 backdrop-blur-sm border-2 border-cyan-400 retro-glow relative z-10">
        <div className="text-center mb-8">
          <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4 retro-glow" />
          <h2 className="text-4xl font-bold text-cyan-400 mb-4 font-mono">🎮 MISSION COMPLETE!</h2>
          <p className="text-2xl text-pink-400 font-mono">{getPerformanceMessage()}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* User Results */}
          <div className="bg-gray-800/50 rounded-xl p-6 border-2 border-cyan-400 retro-glow">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-8 h-8 text-cyan-400" />
              <h3 className="text-2xl font-bold text-cyan-400 font-mono">👤 YOUR STATS</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-cyan-300 font-mono">Score</span>
                  <span className={`text-3xl font-bold ${getScoreColor(userScore)} font-mono`}>
                    {Math.round(userScore)}%
                  </span>
                </div>
                <div className="bg-gray-700 rounded-lg p-2">
                  <Progress value={userScore} className="h-4" />
                </div>
              </div>
              
              <div className="text-sm text-cyan-300 font-mono space-y-2">
                <p>🎯 Accuracy: {Math.round(userAccuracy * 100)}%</p>
                <p>✅ Patterns solved: {data.userAnswers.filter((answer, index) => 
                  answer === data.correctAnswers[index]
                ).length}/5</p>
              </div>
            </div>
          </div>

          {/* AI Results */}
          <div className="bg-gray-800/50 rounded-xl p-6 border-2 border-purple-400 retro-glow">
            <div className="flex items-center gap-3 mb-6">
              <Bot className="w-8 h-8 text-purple-400" />
              <h3 className="text-2xl font-bold text-purple-400 font-mono">🤖 AI STATS</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-purple-300 font-mono">Score</span>
                  <span className={`text-3xl font-bold ${getScoreColor(aiScore)} font-mono`}>
                    {Math.round(aiScore)}%
                  </span>
                </div>
                <div className="bg-gray-700 rounded-lg p-2">
                  <Progress value={aiScore} className="h-4" />
                </div>
              </div>
              
              <div className="text-sm text-purple-300 font-mono space-y-2">
                <p>🧮 Problems solved: {aiCorrect}/25</p>
                <p>📚 Trained on your {Math.round(userAccuracy * 100)}% accuracy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Training Controls Summary */}
        <div className="bg-gray-800/50 rounded-xl p-6 border-2 border-pink-400 mb-6 retro-glow">
          <h3 className="text-xl font-bold text-pink-400 mb-4 font-mono text-center">⚡ TRAINING EFFICIENCY</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-700/50 rounded-lg p-4 border border-green-400">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="text-green-400" size={20} />
                <span className="text-green-400 font-mono font-bold">Learning Rate</span>
              </div>
              <div className="text-2xl font-bold text-green-300 font-mono">{Math.round(learningRate * 100)}%</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4 border border-red-400">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="text-red-400" size={20} />
                <span className="text-red-400 font-mono font-bold">Error Rate</span>
              </div>
              <div className="text-2xl font-bold text-red-300 font-mono">{Math.round(errorRate * 100)}%</div>
            </div>
          </div>
          <div className="text-center mt-4">
            <div className="text-lg text-cyan-300 font-mono">
              Final AI Efficiency: {Math.round((learningRate / (1 + errorRate)) * 100)}%
            </div>
          </div>
        </div>

        {/* Pattern Review */}
        <div className="bg-gray-800/50 rounded-xl p-6 border-2 border-yellow-400 mb-8 retro-glow">
          <h3 className="text-xl font-bold text-yellow-400 mb-4 font-mono">📊 PATTERN REVIEW</h3>
          <div className="space-y-3">
            {data.userAnswers.map((answer, index) => (
              <div key={index} className="flex justify-between items-center py-3 px-4 bg-gray-700/50 rounded-lg border border-gray-600">
                <span className="text-cyan-300 font-mono font-bold">Pattern {index + 1}</span>
                <div className="flex items-center gap-4">
                  <span className="text-cyan-200 font-mono">You: {answer}</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-cyan-200 font-mono">Correct: {data.correctAnswers[index]}</span>
                  <div className={`w-4 h-4 rounded-full ${
                    answer === data.correctAnswers[index] ? 'bg-green-500' : 'bg-red-500'
                  } retro-glow`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Button
            onClick={onRestart}
            className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 hover:from-cyan-500 hover:via-purple-600 hover:to-pink-600 text-black px-12 py-6 text-xl font-bold font-mono retro-glow border-2 border-white/30"
          >
            <RefreshCw className="w-6 h-6 mr-3" />
            🚀 TRAIN AGAIN
          </Button>
        </div>

        <style>{`
          .retro-glow {
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
          }
        `}</style>
      </Card>
    </div>
  );
};

export default GameResults;
