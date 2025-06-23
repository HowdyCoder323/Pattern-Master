
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import NeuralNetworkViz from "./NeuralNetworkViz";
import GameTimer from "./GameTimer";
import PatternDisplay from "./PatternDisplay";
import AnswerInput from "./AnswerInput";
import AITrainingPanel from "./AITrainingPanel";
import AIProcessingScreen from "./AIProcessingScreen";
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

  // Timer effect
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

  // Reset timer for each new pattern
  useEffect(() => {
    if (gamePhase === 'patterns' && !showResult && !isProcessingAnswer) {
      setTimeLeft(10);
      setIsTimerActive(true);
    }
  }, [currentPattern, gamePhase, showResult, isProcessingAnswer]);

  // AI drift effect
  useEffect(() => {
    if (gamePhase === 'patterns' && !isProcessingAnswer) {
      setIsTraining(true);
      
      const driftInterval = setInterval(() => {
        setErrorRate(prev => {
          const newRate = Math.min(1, prev + 0.04 + (0.06 * (1 - learningRate)));
          
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
    
    setWrongAnswers(prev => [...prev, patterns[currentPattern].answer]);
    setUserAnswers(prev => [...prev, -1]);
    
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
    // Compute necessary variables for AI simulation
    const userCorrectCount = correctAnswers.length;
    const userTotalAnswered = patterns.length;
    const userAccuracy = userCorrectCount / userTotalAnswered;
    
    // Calculate AI efficiency based on user's training
    const learningEfficiency = learningRate / (1 + errorRate);
    const baseAIAccuracy = Math.max(0.1, Math.min(0.95, userAccuracy * learningEfficiency));
    
    // Generate 25 AI test patterns
    const aiTestPatterns = generatePatterns(25);
    const aiAnswers: number[] = [];
    let aiCorrectCount = 0;
    
    // Simulate AI answering each question with influenced randomness
    for (let i = 0; i < 25; i++) {
      // Update progress
      await new Promise(resolve => setTimeout(resolve, 400));
      setAiProgress(((i + 1) / 25) * 100);
      
      const correctAnswer = aiTestPatterns[i].answer;
      
      // Generate AI's answer based on efficiency
      const shouldBeCorrect = Math.random() < baseAIAccuracy;
      
      let aiAnswer: number;
      if (shouldBeCorrect) {
        // AI gets it right
        aiAnswer = correctAnswer;
        aiCorrectCount++;
      } else {
        // AI gets it wrong - generate a plausible wrong answer
        const variance = Math.max(1, Math.abs(correctAnswer * 0.3));
        const randomOffset = (Math.random() - 0.5) * variance * 2;
        aiAnswer = Math.round(correctAnswer + randomOffset);
        
        // Ensure it's actually wrong
        if (aiAnswer === correctAnswer) {
          aiAnswer = correctAnswer + (Math.random() > 0.5 ? 1 : -1);
        }
      }
      
      aiAnswers.push(aiAnswer);
    }

    setIsTraining(false);

    const userScore = (userCorrectCount / userTotalAnswered) * 100;
    const aiScore = (aiCorrectCount / 25) * 100;

    // Enhanced results with AI simulation data
    onGameEnd({
      userAnswers,
      correctAnswers: patterns.map(p => p.answer),
      userScore,
      aiScore,
      aiCorrect: aiCorrectCount,
      userAccuracy,
      learningRate,
      errorRate,
      wrongAnswers: wrongAnswers.length,
      timeouts: userAnswers.filter(a => a === -1).length,
      // AI simulation results
      aiTestPatterns,
      aiAnswers,
      aiTotalQuestions: 25,
      learningEfficiency,
      baseAIAccuracy
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
        <AIProcessingScreen 
          aiProgress={aiProgress}
          learningRate={learningRate}
          errorRate={errorRate}
        />
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
                <GameTimer timeLeft={timeLeft} />
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
            <>
              <PatternDisplay
                pattern={patterns[currentPattern]}
                showResult={showResult}
                isCorrect={isCorrect}
                userAnswer={userAnswers[userAnswers.length - 1]}
              />

              {!showResult && (
                <AnswerInput
                  userAnswer={userAnswer}
                  onAnswerChange={setUserAnswer}
                  onSubmit={handleSubmit}
                  isProcessingAnswer={isProcessingAnswer}
                />
              )}
            </>
          )}

          <AITrainingPanel
            learningRate={learningRate}
            errorRate={errorRate}
            onLearnFastClick={handleLearnFastClick}
          />
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
