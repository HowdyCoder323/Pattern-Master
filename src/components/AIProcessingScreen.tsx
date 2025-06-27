
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { generatePattern } from "@/utils/patternGenerator";

interface AIProcessingScreenProps {
  aiProgress: number;
  learningRate: number;
  errorRate: number;
}

const AIProcessingScreen = ({ aiProgress, learningRate, errorRate }: AIProcessingScreenProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [currentPattern, setCurrentPattern] = useState<any>(null);
  const [aiAnswer, setAiAnswer] = useState<number | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const aiEfficiency = learningRate / (1 + errorRate);

  useEffect(() => {
    const questionNumber = Math.floor(aiProgress) + 1;
    if (questionNumber !== currentQuestion && questionNumber <= 100) {
      setCurrentQuestion(questionNumber);
      
      // Generate new pattern for AI to solve
      const pattern = generatePattern();
      setCurrentPattern(pattern);
      setIsProcessing(true);
      setAiAnswer(null);
      
      // Calculate AI confidence based on efficiency
      const baseConfidence = aiEfficiency * 0.8 + Math.random() * 0.2;
      const finalConfidence = Math.max(0.1, Math.min(0.95, baseConfidence));
      setConfidence(finalConfidence);

      // AI "thinks" for a moment
      setTimeout(() => {
        const willAnswerCorrectly = Math.random() < finalConfidence;
        let answer;
        
        if (willAnswerCorrectly) {
          answer = pattern.answer;
        } else {
          // Generate plausible wrong answer
          const wrongAnswers = [
            pattern.answer + Math.floor(Math.random() * 5) + 1,
            pattern.answer - Math.floor(Math.random() * 3) - 1,
            Math.floor(pattern.answer * (0.8 + Math.random() * 0.4)),
            pattern.answer + Math.floor(Math.random() * 10) - 5
          ];
          answer = wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];
        }
        
        setAiAnswer(answer);
        setIsProcessing(false);
      }, 200 + Math.random() * 300);
    }
  }, [aiProgress, currentQuestion, aiEfficiency]);

  const getConfidenceColor = () => {
    if (confidence > 0.8) return "from-green-400 to-green-600";
    if (confidence > 0.6) return "from-yellow-400 to-yellow-600";
    if (confidence > 0.4) return "from-orange-400 to-orange-600";
    return "from-red-400 to-red-600";
  };

  const getConfidenceGlow = () => {
    const intensity = confidence * 30;
    if (confidence > 0.8) return `0 0 ${intensity}px rgba(34, 197, 94, ${confidence})`;
    if (confidence > 0.6) return `0 0 ${intensity}px rgba(234, 179, 8, ${confidence})`;
    if (confidence > 0.4) return `0 0 ${intensity}px rgba(249, 115, 22, ${confidence})`;
    return `0 0 ${intensity}px rgba(239, 68, 68, ${confidence})`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      
      <Card className="p-8 max-w-4xl w-full text-center bg-gray-900/90 backdrop-blur-sm border-2 border-cyan-400 retro-glow relative z-10">
        <h2 className="text-3xl font-bold text-cyan-400 mb-6 font-mono">🤖 AI SOLVING PATTERNS...</h2>
        
        <div className="grid md:grid-cols-2 gap-8 mb-6">
          {/* AI Progress */}
          <div className="bg-gray-800/50 rounded-xl p-6 border-2 border-purple-400">
            <h3 className="text-xl font-bold text-purple-400 mb-4 font-mono">🧮 PROCESSING</h3>
            <div className="bg-gray-800 rounded-lg p-3 mb-4">
              <Progress value={aiProgress} className="mb-2 h-3" />
              <p className="text-sm text-cyan-400 font-mono">Question {Math.floor(aiProgress)} of 100</p>
            </div>
            <div className="flex justify-between text-xs text-cyan-300 font-mono">
              <span>Efficiency: {Math.round(aiEfficiency * 100)}%</span>
              <span>Confidence: {Math.round(confidence * 100)}%</span>
            </div>
          </div>

          {/* Current Question */}
          <div className="bg-gray-800/50 rounded-xl p-6 border-2 border-cyan-400">
            <h3 className="text-xl font-bold text-cyan-400 mb-4 font-mono">🧩 CURRENT PATTERN</h3>
            {currentPattern && (
              <div className="space-y-4">
                <div className="flex justify-center gap-2 mb-4">
                  {currentPattern.sequence.map((num: number, idx: number) => (
                    <div key={idx} className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-cyan-300 font-mono font-bold">
                      {num}
                    </div>
                  ))}
                  <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center text-gray-400 font-mono font-bold">
                    ?
                  </div>
                </div>
                
                {/* AI Answer with Confidence Glow */}
                <div className="relative">
                  <div 
                    className={`w-20 h-20 bg-gradient-to-r ${getConfidenceColor()} rounded-full mx-auto flex items-center justify-center text-black font-mono font-bold text-xl transition-all duration-300`}
                    style={{ 
                      boxShadow: getConfidenceGlow(),
                      opacity: isProcessing ? 0.5 : 1 
                    }}
                  >
                    {isProcessing ? "..." : aiAnswer}
                  </div>
                  <p className="text-xs text-gray-400 mt-2 font-mono">
                    {isProcessing ? "THINKING..." : 
                     aiAnswer === currentPattern.answer ? "✅ CORRECT" : "❌ INCORRECT"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Stats */}
        <div className="bg-gray-800/50 rounded-xl p-6 border-2 border-pink-400 mb-6">
          <h3 className="text-xl font-bold text-pink-400 mb-4 font-mono">⚡ AI PERFORMANCE</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-300 font-mono">{Math.round(learningRate * 100)}%</div>
              <div className="text-sm text-green-400 font-mono">Learning Rate</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-300 font-mono">{Math.round(errorRate * 100)}%</div>
              <div className="text-sm text-red-400 font-mono">Error Rate</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-cyan-300 font-mono">{Math.round(aiEfficiency * 100)}%</div>
              <div className="text-sm text-cyan-400 font-mono">Efficiency</div>
            </div>
          </div>
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

export default AIProcessingScreen;
