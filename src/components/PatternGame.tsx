
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, ArrowRight, Zap, AlertTriangle } from "lucide-react";
import NeuralNetworkViz from "./NeuralNetworkViz";

interface Pattern {
  sequence: number[];
  answer: number;
  rule: string;
}

interface PatternGameProps {
  onGameEnd: (results: any) => void;
}

const PatternGame = ({ onGameEnd }: PatternGameProps) => {
  const [currentPattern, setCurrentPattern] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gamePhase, setGamePhase] = useState<'patterns' | 'ai-solving'>('patterns');
  const [aiProgress, setAiProgress] = useState(0);
  
  // New state for interactive controls
  const [learningRate, setLearningRate] = useState(0.5);
  const [errorRate, setErrorRate] = useState(0.5);
  const [isTraining, setIsTraining] = useState(false);

  const patterns: Pattern[] = [
    { sequence: [2, 4, 6, 8], answer: 10, rule: "Add 2" },
    { sequence: [1, 4, 9, 16], answer: 25, rule: "Perfect squares" },
    { sequence: [3, 6, 12, 24], answer: 48, rule: "Multiply by 2" },
    { sequence: [1, 1, 2, 3, 5], answer: 8, rule: "Fibonacci" },
    { sequence: [10, 9, 7, 4], answer: 0, rule: "Subtract increasing numbers" }
  ];

  useEffect(() => {
    if (gamePhase === 'patterns') {
      setIsTraining(true);
    }
  }, [gamePhase, currentPattern]);

  const handleLearningRateClick = () => {
    setLearningRate(Math.min(1, learningRate + 0.1));
    setErrorRate(Math.max(0, errorRate - 0.05));
  };

  const handleErrorRateClick = () => {
    setErrorRate(Math.min(1, errorRate + 0.1));
    setLearningRate(Math.max(0, learningRate - 0.05));
  };

  const handleSubmit = () => {
    const answer = parseInt(userAnswer);
    const correct = answer === patterns[currentPattern].answer;
    
    setIsCorrect(correct);
    setShowResult(true);
    setUserAnswers([...userAnswers, answer]);

    setTimeout(() => {
      if (currentPattern < patterns.length - 1) {
        setCurrentPattern(currentPattern + 1);
        setUserAnswer("");
        setShowResult(false);
      } else {
        setGamePhase('ai-solving');
        simulateAISolving();
      }
    }, 2000);
  };

  const simulateAISolving = async () => {
    // Calculate user accuracy
    const correctAnswers = userAnswers.filter((answer, index) => 
      answer === patterns[index].answer
    ).length + (isCorrect ? 1 : 0);
    
    const userAccuracy = correctAnswers / patterns.length;
    
    // AI accuracy is now influenced by learning rate vs error rate balance
    const learningEfficiency = learningRate / (1 + errorRate);
    const aiAccuracy = Math.max(0.1, userAccuracy * learningEfficiency * 0.9 + Math.random() * 0.2);
    
    // Simulate AI solving 10 problems
    for (let i = 0; i <= 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 400));
      setAiProgress((i / 10) * 100);
    }

    setIsTraining(false);

    // Generate AI results
    const aiCorrect = Math.round(Math.min(10, Math.max(0, aiAccuracy * 10)));
    const userScore = (correctAnswers / patterns.length) * 100;
    const aiScore = (aiCorrect / 10) * 100;

    onGameEnd({
      userAnswers,
      correctAnswers: patterns.map(p => p.answer),
      userScore,
      aiScore,
      aiCorrect,
      userAccuracy,
      learningRate,
      errorRate
    });
  };

  if (gamePhase === 'ai-solving') {
    return (
      <>
        <NeuralNetworkViz 
          learningRate={learningRate} 
          errorRate={errorRate} 
          isTraining={true}
          accuracy={learningRate / (1 + errorRate)}
        />
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
          
          <Card className="p-8 max-w-md w-full text-center bg-gray-900/90 backdrop-blur-sm border-2 border-cyan-400 retro-glow relative z-10">
            <h2 className="text-3xl font-bold text-cyan-400 mb-6 font-mono">🤖 AI COMPUTING...</h2>
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full mx-auto mb-4 animate-pulse retro-glow"></div>
              <p className="text-cyan-300 mb-4 font-mono">Training neural pathways...</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 mb-4">
              <Progress value={aiProgress} className="mb-2 h-3" />
              <p className="text-sm text-cyan-400 font-mono">Problem {Math.floor(aiProgress / 10) + 1} of 10</p>
            </div>
            <div className="flex justify-between text-xs text-cyan-300 font-mono">
              <span>Learning Rate: {Math.round(learningRate * 100)}%</span>
              <span>Error Rate: {Math.round(errorRate * 100)}%</span>
            </div>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <NeuralNetworkViz 
        learningRate={learningRate} 
        errorRate={errorRate} 
        isTraining={isTraining}
        accuracy={learningRate / (1 + errorRate)}
      />
      
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        
        <Card className="p-8 max-w-2xl w-full bg-gray-900/90 backdrop-blur-sm border-2 border-cyan-400 retro-glow relative z-10">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-bold text-cyan-400 font-mono">🧩 PATTERN {currentPattern + 1}/{patterns.length}</h2>
              <div className="text-sm text-cyan-300 font-mono bg-gray-800 px-3 py-1 rounded-full">
                ✅ {userAnswers.length} SOLVED
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-2 mb-4">
              <Progress value={((currentPattern) / patterns.length) * 100} className="h-4" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-pink-400 mb-6 font-mono">🔍 WHAT'S THE NEXT NUMBER?</h3>
            
            <div className="flex items-center justify-center gap-4 mb-8 flex-wrap">
              {patterns[currentPattern].sequence.map((num, index) => (
                <div key={index} className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center font-bold text-2xl text-black retro-glow border-2 border-white/30">
                  {num}
                </div>
              ))}
              <ArrowRight className="text-cyan-400" size={32} />
              <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center font-bold text-3xl text-cyan-400 border-2 border-dashed border-cyan-400">
                ?
              </div>
            </div>

            {showResult && (
              <div className={`mb-6 p-6 rounded-xl border-2 ${
                isCorrect 
                  ? 'bg-green-900/50 text-green-300 border-green-400' 
                  : 'bg-red-900/50 text-red-300 border-red-400'
              } retro-glow`}>
                <div className="flex items-center justify-center gap-3 mb-3">
                  {isCorrect ? <CheckCircle size={24} /> : <XCircle size={24} />}
                  <span className="font-bold text-xl font-mono">
                    {isCorrect ? '🎉 CORRECT!' : '❌ INCORRECT'}
                  </span>
                </div>
                <p className="font-mono">
                  Answer: {patterns[currentPattern].answer} ({patterns[currentPattern].rule})
                </p>
              </div>
            )}

            {!showResult && (
              <div className="space-y-6">
                <Input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Enter your answer"
                  className="text-center text-2xl font-bold bg-gray-800 border-2 border-cyan-400 text-cyan-300 font-mono h-16 retro-glow"
                  onKeyPress={(e) => e.key === 'Enter' && userAnswer && handleSubmit()}
                />
                <Button
                  onClick={handleSubmit}
                  disabled={!userAnswer}
                  className="w-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 hover:from-cyan-500 hover:via-purple-600 hover:to-pink-600 text-black font-bold text-xl py-6 font-mono retro-glow border-2 border-white/30"
                >
                  🚀 SUBMIT ANSWER
                </Button>
              </div>
            )}
          </div>

          {/* Interactive AI Training Controls */}
          <div className="mt-8 bg-gray-800/50 rounded-xl p-6 border-2 border-purple-400">
            <h3 className="text-lg font-bold text-purple-400 mb-4 font-mono text-center">⚡ AI TRAINING CONTROLS</h3>
            <p className="text-xs text-cyan-300 mb-4 font-mono text-center">
              Click rapidly while solving! Balance learning vs errors!
            </p>
            
            <div className="flex gap-4">
              <button
                onClick={handleLearningRateClick}
                className="flex-1 bg-gradient-to-r from-green-500 to-cyan-500 text-black font-bold py-4 px-6 rounded-xl font-mono text-lg hover:scale-105 transform transition-all duration-200 retro-glow border-2 border-white/30"
              >
                <Zap className="inline mr-2" size={20} />
                LEARN FAST
                <div className="text-sm mt-1">{Math.round(learningRate * 100)}%</div>
              </button>
              
              <button
                onClick={handleErrorRateClick}
                className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 text-black font-bold py-4 px-6 rounded-xl font-mono text-lg hover:scale-105 transform transition-all duration-200 retro-glow border-2 border-white/30"
              >
                <AlertTriangle className="inline mr-2" size={20} />
                MAKE ERRORS
                <div className="text-sm mt-1">{Math.round(errorRate * 100)}%</div>
              </button>
            </div>
            
            <div className="mt-4 text-center">
              <div className="text-sm text-cyan-300 font-mono">
                AI Efficiency: {Math.round((learningRate / (1 + errorRate)) * 100)}%
              </div>
            </div>
          </div>
        </Card>

        <style jsx>{`
          .retro-glow {
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
          }
        `}</style>
      </div>
    </>
  );
};

export default PatternGame;
