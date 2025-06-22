import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, ArrowRight, Zap, AlertTriangle, Clock } from "lucide-react";
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
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gamePhase, setGamePhase] = useState<'patterns' | 'ai-solving'>('patterns');
  const [aiProgress, setAiProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [isProcessingAnswer, setIsProcessingAnswer] = useState(false);
  
  const [learningRate, setLearningRate] = useState(0.2);
  const [errorRate, setErrorRate] = useState(0.8);
  const [isTraining, setIsTraining] = useState(false);

  // Generate patterns when component mounts
  useEffect(() => {
    setPatterns(generatePatterns(5));
  }, []);

  // Timer effect - simplified to prevent race conditions
  useEffect(() => {
    if (!isTimerActive || showResult || gamePhase !== 'patterns' || isProcessingAnswer) return;
    
    if (timeLeft <= 0) {
      handleTimeUp();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, isTimerActive, showResult, gamePhase, isProcessingAnswer]);

  // Reset timer for each new pattern - only when not processing
  useEffect(() => {
    if (gamePhase === 'patterns' && !showResult && !isProcessingAnswer) {
      setTimeLeft(10);
      setIsTimerActive(true);
    }
  }, [currentPattern, gamePhase, showResult, isProcessingAnswer]);

  // AI drift effect with game ending when drift reaches maximum
  useEffect(() => {
    if (gamePhase === 'patterns' && !isProcessingAnswer) {
      setIsTraining(true);
      
      const driftInterval = setInterval(() => {
        setErrorRate(prev => {
          const newRate = Math.min(1, prev + 0.04 + (0.06 * (1 - learningRate)));
          
          // End game if AI drift reaches maximum (error rate >= 1)
          if (newRate >= 1) {
            endGameDueToDrift();
            return 1;
          }
          
          return newRate;
        });
        
        setLearningRate(prev => {
          const decaySpeed = 0.02 + (0.03 * (1 - prev));
          return Math.max(0, prev - decaySpeed);
        });
      }, 300);

      return () => clearInterval(driftInterval);
    }
  }, [gamePhase, currentPattern, learningRate, isProcessingAnswer]);

  const endGameDueToDrift = () => {
    if (isProcessingAnswer) return;
    setIsProcessingAnswer(true);
    setIsTimerActive(false);
    setGamePhase('ai-solving');
    simulateAISolving();
  };

  const handleTimeUp = () => {
    if (isProcessingAnswer) return;
    
    console.log('Timer ran out for question', currentPattern + 1);
    setIsProcessingAnswer(true);
    setIsTimerActive(false);
    
    // Count as wrong answer - timeout
    setWrongAnswers(prev => [...prev, patterns[currentPattern].answer]);
    setUserAnswers(prev => [...prev, -1]); // -1 indicates timeout
    
    setShowResult(true);
    setIsCorrect(false);

    setTimeout(() => {
      if (currentPattern < patterns.length - 1) {
        console.log('Moving to next question after timeout');
        setCurrentPattern(prev => prev + 1);
        setUserAnswer("");
        setShowResult(false);
        setIsProcessingAnswer(false);
      } else {
        console.log('Game ending after timeout on last question');
        setGamePhase('ai-solving');
        simulateAISolving();
      }
    }, 2000);
  };

  const handleLearnFastClick = () => {
    setLearningRate(prev => Math.min(1, prev + 0.12));
    setErrorRate(prev => Math.max(0, prev - 0.08));
  };

  const handleSubmit = () => {
    if (isProcessingAnswer) return;
    
    console.log('Submitting answer for question', currentPattern + 1);
    setIsProcessingAnswer(true);
    
    const answer = parseInt(userAnswer);
    const correct = answer === patterns[currentPattern].answer;
    
    setIsCorrect(correct);
    setShowResult(true);
    setIsTimerActive(false);
    
    if (correct) {
      setCorrectAnswers(prev => [...prev, answer]);
    } else {
      setWrongAnswers(prev => [...prev, answer]);
    }
    
    setUserAnswers(prev => [...prev, answer]);

    setTimeout(() => {
      if (currentPattern < patterns.length - 1) {
        console.log('Moving to next question after submit');
        setCurrentPattern(prev => prev + 1);
        setUserAnswer("");
        setShowResult(false);
        setIsProcessingAnswer(false);
      } else {
        console.log('Game ending after submit on last question');
        setGamePhase('ai-solving');
        simulateAISolving();
      }
    }, 2000);
  };

  const simulateAISolving = async () => {
    const userAccuracy = correctAnswers.length / patterns.length;
    const learningEfficiency = learningRate / (1 + errorRate);
    const aiAccuracy = Math.max(0.1, userAccuracy * learningEfficiency * 0.9 + Math.random() * 0.2);
    
    for (let i = 0; i <= 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 400));
      setAiProgress((i / 10) * 100);
    }

    setIsTraining(false);

    const aiCorrect = Math.round(Math.min(10, Math.max(0, aiAccuracy * 10)));
    const userScore = (correctAnswers.length / patterns.length) * 100;
    const aiScore = (aiCorrect / 10) * 100;

    onGameEnd({
      userAnswers,
      correctAnswers: patterns.map(p => p.answer),
      userScore,
      aiScore,
      aiCorrect,
      userAccuracy,
      learningRate,
      errorRate,
      wrongAnswers: wrongAnswers.length,
      timeouts: userAnswers.filter(a => a === -1).length
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
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full font-mono text-sm ${
                  timeLeft <= 3 ? 'bg-red-900 text-red-300 border border-red-500' : 
                  timeLeft <= 5 ? 'bg-yellow-900 text-yellow-300 border border-yellow-500' :
                  'bg-gray-800 text-cyan-300'
                }`}>
                  <Clock size={16} />
                  <span className="font-bold">{timeLeft}s</span>
                </div>
                <div className="text-sm text-cyan-300 font-mono bg-gray-800 px-3 py-1 rounded-full">
                  ✅ {correctAnswers.length} SOLVED
                </div>
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
                      {isCorrect ? '🎉 CORRECT!' : userAnswers[userAnswers.length - 1] === -1 ? '⏰ TIME UP!' : '❌ INCORRECT'}
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
                    onKeyPress={(e) => e.key === 'Enter' && userAnswer && !isProcessingAnswer && handleSubmit()}
                    disabled={isProcessingAnswer}
                  />
                  <Button
                    onClick={handleSubmit}
                    disabled={!userAnswer || isProcessingAnswer}
                    className="w-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 hover:from-cyan-500 hover:via-purple-600 hover:to-pink-600 text-black font-bold text-xl py-6 font-mono retro-glow border-2 border-white/30"
                  >
                    🚀 SUBMIT ANSWER
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* AI Training Controls */}
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
                onClick={handleLearnFastClick}
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
