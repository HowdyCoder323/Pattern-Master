
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, User, Bot, RefreshCw } from "lucide-react";

interface GameResultsProps {
  data: {
    userAnswers: number[];
    correctAnswers: number[];
    userScore: number;
    aiScore: number;
    aiCorrect: number;
    userAccuracy: number;
  };
  onRestart: () => void;
}

const GameResults = ({ data, onRestart }: GameResultsProps) => {
  const { userScore, aiScore, aiCorrect, userAccuracy } = data;

  const getPerformanceMessage = () => {
    if (userScore >= 80) return "Excellent! Your AI is well-trained!";
    if (userScore >= 60) return "Good job! Your AI learned well!";
    if (userScore >= 40) return "Not bad! Your AI is getting there!";
    return "Your AI needs more training!";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="p-8 max-w-2xl w-full bg-white/70 backdrop-blur-sm border-white/20">
        <div className="text-center mb-8">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Training Complete!</h2>
          <p className="text-lg text-gray-600">{getPerformanceMessage()}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* User Results */}
          <div className="bg-white/50 rounded-xl p-6 border border-white/30">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-800">Your Performance</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Score</span>
                  <span className={`text-2xl font-bold ${getScoreColor(userScore)}`}>
                    {Math.round(userScore)}%
                  </span>
                </div>
                <Progress value={userScore} className="h-3" />
              </div>
              
              <div className="text-sm text-gray-600">
                <p>Accuracy: {Math.round(userAccuracy * 100)}%</p>
                <p>Patterns solved correctly: {data.userAnswers.filter((answer, index) => 
                  answer === data.correctAnswers[index]
                ).length}/5</p>
              </div>
            </div>
          </div>

          {/* AI Results */}
          <div className="bg-white/50 rounded-xl p-6 border border-white/30">
            <div className="flex items-center gap-3 mb-4">
              <Bot className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-semibold text-gray-800">AI Performance</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Score</span>
                  <span className={`text-2xl font-bold ${getScoreColor(aiScore)}`}>
                    {Math.round(aiScore)}%
                  </span>
                </div>
                <Progress value={aiScore} className="h-3" />
              </div>
              
              <div className="text-sm text-gray-600">
                <p>Problems solved correctly: {aiCorrect}/10</p>
                <p>Trained on your {Math.round(userAccuracy * 100)}% accuracy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pattern Review */}
        <div className="bg-white/50 rounded-xl p-6 border border-white/30 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pattern Review</h3>
          <div className="space-y-2 text-sm">
            {data.userAnswers.map((answer, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                <span className="text-gray-600">Pattern {index + 1}</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-800">Your: {answer}</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-800">Correct: {data.correctAnswers[index]}</span>
                  <div className={`w-3 h-3 rounded-full ${
                    answer === data.correctAnswers[index] ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Button
            onClick={onRestart}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Train Again
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default GameResults;
