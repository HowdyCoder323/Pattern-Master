
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";

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

  const patterns: Pattern[] = [
    { sequence: [2, 4, 6, 8], answer: 10, rule: "Add 2" },
    { sequence: [1, 4, 9, 16], answer: 25, rule: "Perfect squares" },
    { sequence: [3, 6, 12, 24], answer: 48, rule: "Multiply by 2" },
    { sequence: [1, 1, 2, 3, 5], answer: 8, rule: "Fibonacci" },
    { sequence: [10, 9, 7, 4], answer: 0, rule: "Subtract increasing numbers" }
  ];

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
        // Start AI solving phase
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
    
    // AI accuracy is proportional to user accuracy
    const aiAccuracy = Math.max(0.1, userAccuracy * 0.9 + Math.random() * 0.2);
    
    // Simulate AI solving 10 problems
    for (let i = 0; i <= 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setAiProgress((i / 10) * 100);
    }

    // Generate AI results
    const aiCorrect = Math.round(aiAccuracy * 10);
    const userScore = (correctAnswers / patterns.length) * 100;
    const aiScore = (aiCorrect / 10) * 100;

    onGameEnd({
      userAnswers,
      correctAnswers: patterns.map(p => p.answer),
      userScore,
      aiScore,
      aiCorrect,
      userAccuracy
    });
  };

  if (gamePhase === 'ai-solving') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="p-8 max-w-md w-full text-center bg-white/70 backdrop-blur-sm border-white/20">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">AI is Learning...</h2>
          <div className="mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 animate-pulse"></div>
            <p className="text-gray-600 mb-4">Training the AI based on your performance</p>
          </div>
          <Progress value={aiProgress} className="mb-4" />
          <p className="text-sm text-gray-500">Solving problem {Math.floor(aiProgress / 10) + 1} of 10</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="p-8 max-w-lg w-full bg-white/70 backdrop-blur-sm border-white/20">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Pattern {currentPattern + 1} of {patterns.length}</h2>
            <div className="text-sm text-gray-500">
              {userAnswers.length} completed
            </div>
          </div>
          <Progress value={((currentPattern) / patterns.length) * 100} className="mb-4" />
        </div>

        <div className="text-center mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">What's the next number?</h3>
          
          <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
            {patterns[currentPattern].sequence.map((num, index) => (
              <div key={index} className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center font-semibold text-blue-800">
                {num}
              </div>
            ))}
            <ArrowRight className="text-gray-400" size={20} />
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center font-semibold text-gray-400 border-2 border-dashed">
              ?
            </div>
          </div>

          {showResult && (
            <div className={`mb-4 p-4 rounded-lg ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <div className="flex items-center justify-center gap-2 mb-2">
                {isCorrect ? <CheckCircle size={20} /> : <XCircle size={20} />}
                <span className="font-semibold">
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </span>
              </div>
              <p className="text-sm">
                Answer: {patterns[currentPattern].answer} ({patterns[currentPattern].rule})
              </p>
            </div>
          )}

          {!showResult && (
            <div className="space-y-4">
              <Input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter your answer"
                className="text-center text-lg"
                onKeyPress={(e) => e.key === 'Enter' && userAnswer && handleSubmit()}
              />
              <Button
                onClick={handleSubmit}
                disabled={!userAnswer}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Submit Answer
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PatternGame;
