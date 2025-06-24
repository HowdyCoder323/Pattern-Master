
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface AIProcessingScreenProps {
  aiProgress: number;
  learningRate: number;
  errorRate: number;
  onQuestionAnswered?: (questionIndex: number, answer: number, correct: number, isCorrect: boolean) => void;
}

interface AIQuestion {
  sequence: number[];
  answer: number;
  rule: string;
}

const AIProcessingScreen = ({ aiProgress, learningRate, errorRate, onQuestionAnswered }: AIProcessingScreenProps) => {
  const currentProblem = Math.floor(aiProgress / 4) + 1;
  const [currentQuestion, setCurrentQuestion] = useState<AIQuestion | null>(null);
  const [aiAnswer, setAiAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [confidence, setConfidence] = useState(0.5);
  const [isThinking, setIsThinking] = useState(false);

  // Generate a new question when progress changes
  useEffect(() => {
    if (aiProgress > 0 && aiProgress < 100) {
      generateNewQuestion();
    }
  }, [Math.floor(aiProgress / 4)]);

  const generateNewQuestion = () => {
    setShowResult(false);
    setIsThinking(true);
    setAiAnswer(null);
    
    // Generate a simple pattern question
    const patterns = [
      // Arithmetic sequences
      () => {
        const start = Math.floor(Math.random() * 10) + 1;
        const diff = Math.floor(Math.random() * 5) + 1;
        const sequence = [start, start + diff, start + 2*diff, start + 3*diff];
        return {
          sequence,
          answer: start + 4*diff,
          rule: `Add ${diff}`
        };
      },
      // Geometric sequences
      () => {
        const start = Math.floor(Math.random() * 3) + 2;
        const mult = 2;
        const sequence = [start, start * mult, start * mult * mult, start * mult * mult * mult];
        return {
          sequence,
          answer: start * mult * mult * mult * mult,
          rule: `Multiply by ${mult}`
        };
      },
      // Square sequences
      () => {
        const start = Math.floor(Math.random() * 3) + 1;
        const sequence = [start*start, (start+1)*(start+1), (start+2)*(start+2), (start+3)*(start+3)];
        return {
          sequence,
          answer: (start+4)*(start+4),
          rule: "Perfect squares"
        };
      }
    ];

    const pattern = patterns[Math.floor(Math.random() * patterns.length)]();
    setCurrentQuestion(pattern);

    // Calculate AI confidence based on learning efficiency
    const learningEfficiency = learningRate / (1 + errorRate);
    const baseConfidence = Math.max(0.2, Math.min(0.95, learningEfficiency));
    const confidenceVariation = (Math.random() - 0.5) * 0.3;
    const finalConfidence = Math.max(0.1, Math.min(0.98, baseConfidence + confidenceVariation));
    setConfidence(finalConfidence);

    // Simulate AI thinking time
    setTimeout(() => {
      setIsThinking(false);
      simulateAIAnswer(pattern, finalConfidence);
    }, 1500 + Math.random() * 1000);
  };

  const simulateAIAnswer = (question: AIQuestion, confidence: number) => {
    const shouldBeCorrect = Math.random() < confidence;
    let answer: number;
    let correct: boolean;

    if (shouldBeCorrect) {
      answer = question.answer;
      correct = true;
    } else {
      // Generate a plausible wrong answer
      const variance = Math.max(1, Math.abs(question.answer * 0.3));
      const randomOffset = (Math.random() - 0.5) * variance * 2;
      answer = Math.round(question.answer + randomOffset);
      
      // Ensure it's actually wrong
      if (answer === question.answer) {
        answer = question.answer + (Math.random() > 0.5 ? 1 : -1);
      }
      correct = false;
    }

    setAiAnswer(answer);
    setIsCorrect(correct);
    setShowResult(true);

    // Notify parent component
    if (onQuestionAnswered) {
      onQuestionAnswered(currentProblem - 1, answer, question.answer, correct);
    }

    // Auto-advance after showing result
    setTimeout(() => {
      if (aiProgress < 100) {
        setShowResult(false);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      
      <Card className="p-8 max-w-2xl w-full text-center bg-gray-900/90 backdrop-blur-sm border-2 border-cyan-400 retro-glow relative z-10">
        <h2 className="text-3xl font-bold text-cyan-400 mb-6 font-mono">🤖 AI SOLVING PATTERNS...</h2>
        
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full mx-auto mb-4 animate-pulse retro-glow"></div>
        </div>

        <div className="bg-gray-800 rounded-lg p-3 mb-6">
          <Progress value={aiProgress} className="mb-2 h-3" />
          <p className="text-sm text-cyan-400 font-mono">Problem {Math.min(currentProblem, 25)} of 25</p>
        </div>

        {/* AI Question Display */}
        {currentQuestion && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-pink-400 mb-4 font-mono">🔍 AI ANALYZING PATTERN</h3>
            
            <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
              {currentQuestion.sequence.map((num, index) => (
                <div key={index} className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center font-bold text-lg text-black retro-glow border-2 border-white/30">
                  {num}
                </div>
              ))}
              <ArrowRight className="text-cyan-400" size={24} />
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center font-bold text-xl text-cyan-400 border-2 border-dashed border-cyan-400">
                ?
              </div>
            </div>

            {/* AI Answer Area */}
            <div className="bg-gray-800/50 rounded-xl p-6 border-2 border-purple-400">
              {isThinking ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full"></div>
                  <span className="text-purple-300 font-mono">Neural networks processing...</span>
                </div>
              ) : aiAnswer !== null ? (
                <div>
                  <div 
                    className={`w-16 h-16 rounded-lg flex items-center justify-center font-bold text-2xl mx-auto mb-4 transition-all duration-500 ${
                      showResult 
                        ? isCorrect 
                          ? 'bg-green-500 text-black' 
                          : 'bg-red-500 text-white'
                        : 'bg-purple-500 text-black'
                    }`}
                    style={{
                      boxShadow: `0 0 ${confidence * 40}px rgba(147, 51, 234, ${confidence * 0.8})`,
                      filter: `brightness(${0.8 + confidence * 0.6})`
                    }}
                  >
                    {aiAnswer}
                  </div>
                  
                  <div className="text-sm text-purple-300 font-mono mb-2">
                    AI Confidence: {Math.round(confidence * 100)}%
                  </div>

                  {showResult && (
                    <div className={`p-4 rounded-lg border-2 ${
                      isCorrect 
                        ? 'bg-green-900/50 text-green-300 border-green-400' 
                        : 'bg-red-900/50 text-red-300 border-red-400'
                    }`}>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        {isCorrect ? <CheckCircle size={20} /> : <XCircle size={20} />}
                        <span className="font-bold font-mono">
                          {isCorrect ? 'CORRECT!' : 'INCORRECT'}
                        </span>
                      </div>
                      <p className="text-xs font-mono">
                        Answer: {currentQuestion.answer} ({currentQuestion.rule})
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-purple-300 font-mono">Initializing neural pathways...</div>
              )}
            </div>
          </div>
        )}

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
