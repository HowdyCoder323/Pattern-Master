import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, ArrowRight, Zap, AlertTriangle } from "lucide-react";
import NeuralNetworkViz from "./NeuralNetworkViz";
import { generatePatterns } from "@/utils/patternGenerator";

interface Pattern {
  sequence: number[];
  answer: number;
  rule: string;
}

interface PatternGameProps {
  onGameEnd: (results: any) => void;
}

const PatternGame = ({ onGameEnd }: PatternGameProps) => {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [currentPattern, setCurrentPattern] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gamePhase, setGamePhase] = useState<'patterns' | 'ai-solving'>('patterns');
  const [aiProgress, setAiProgress] = useState(0);
  
  // Updated state for more challenging training balance
  const [learningRate, setLearningRate] = useState(0.2);
  const [errorRate, setErrorRate] = useState(0.8);
  const [isTraining, setIsTraining] = useState(false);

  // Generate patterns when component mounts
  useEffect(() => {
    setPatterns(generatePatterns(5));
  }, []);

  useEffect(() => {
    if (gamePhase === 'patterns') {
      setIsTraining(true);
      
      // Much more aggressive AI drift - faster when learning rate is lower
      const driftInterval = setInterval(() => {
        setErrorRate(prev => {
          // Drift speed inversely proportional to learning rate (faster when LR is low)
          const driftSpeed = 0.04 + (0.06 * (1 - learningRate));
          return Math.min(1, prev + driftSpeed);
        });
        setLearningRate(prev => {
          // Learning rate decays faster when it's already low
          const decaySpeed = 0.02 + (0.03 * (1 - prev));
          return Math.max(0, prev - decaySpeed);
        });
      }, 300); // Faster interval for more challenging gameplay

      return () => clearInterval(driftInterval);
    }
  }, [gamePhase, currentPattern, learningRate]);

  const handleLearnFastClick = () => {
    // More modest boost to make it more challenging
    setLearningRate(prev => Math.min(1, prev + 0.12));
    setErrorRate(prev => Math.max(0, prev - 0.08));
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

          {patterns.length > 0 && (
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-pink-400 mb-6 font-mono">🔍 WHAT'S THE NEXT NUMBER?</h3>
              
              <div className="flex items-center justify-center gap-4 mb-8 flex-wrap">
                {patterns[currentPattern]?.sequence.map((num, index) => (
                  <div key={index} className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center font-bold text-2xl text-black retro-glow border-2 border-white/30">
                    {num}
                  </div>
                ))}
                <ArrowRight className="text-cyan-400" size={32} />
                <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center font-bold text-3xl text-cyan-400 border-2 border-dashed border-cyan-400">
                  ?
                </div>
              </div>

              {showResult && patterns[currentPattern] && (
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
          )}

          {/* Updated AI Training Controls with more challenging balance */}
          <div className="mt-8 bg-gray-800/50 rounded-xl p-6 border-2 border-purple-400">
            <h3 className="text-lg font-bold text-purple-400 mb-4 font-mono text-center">⚡ AI TRAINING BALANCE</h3>
            <p className="text-xs text-cyan-300 mb-4 font-mono text-center">
              ⚠️ AI DRIFTS FAST toward errors! Keep clicking LEARN FAST! 🔥
            </p>
            
            <div className="relative">
              {/* Progress bar background */}
              <div className="w-full h-16 bg-gray-700 rounded-xl border-2 border-gray-600 relative overflow-hidden">
                {/* Learning rate portion (green) */}
                <div 
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-cyan-500 transition-all duration-300"
                  style={{ width: `${(learningRate / (learningRate + errorRate)) * 100}%` }}
                />
                {/* Error rate portion (red) */}
                <div 
                  className="absolute right-0 top-0 h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300"
                  style={{ width: `${(errorRate / (learningRate + errorRate)) * 100}%` }}
                />
                
                {/* Center divider */}
                <div className="absolute left-1/2 top-0 h-full w-0.5 bg-white/50 transform -translate-x-0.5" />
              </div>
              
              {/* Left button - Learn Fast */}
              <button
                onClick={handleLearnFastClick}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-green-500 to-cyan-500 text-black font-bold py-2 px-4 rounded-lg font-mono text-sm hover:scale-110 transition-all duration-200 retro-glow border-2 border-white/30 z-10"
              >
                <Zap className="inline mr-1" size={16} />
                LEARN FAST
              </button>
              
              {/* Right side label - Make Errors (no button, just shows drift) */}
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
          </div>
        </Card>

        <style>{`
          .retro-glow {
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
          }
        `}</style>
      </div>
    </>
  );
};

export default PatternGame;
