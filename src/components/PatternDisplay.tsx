
import { ArrowRight, CheckCircle, XCircle } from "lucide-react";

interface Pattern {
  sequence: number[];
  answer: number;
  rule: string;
}

interface PatternDisplayProps {
  pattern: Pattern;
  showResult: boolean;
  isCorrect: boolean;
  userAnswer: number;
}

const PatternDisplay = ({ pattern, showResult, isCorrect, userAnswer }: PatternDisplayProps) => {
  return (
    <div className="text-center mb-8">
      <h3 className="text-2xl font-bold text-pink-400 mb-6 font-mono">🔍 WHAT'S THE NEXT NUMBER?</h3>
      
      <div className="flex items-center justify-center gap-4 mb-8 flex-wrap">
        {pattern.sequence.map((num, index) => (
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
              {isCorrect ? '🎉 CORRECT!' : userAnswer === -1 ? '⏰ TIME UP!' : '❌ INCORRECT'}
            </span>
          </div>
          <p className="font-mono">
            Answer: {pattern.answer} ({pattern.rule})
          </p>
        </div>
      )}
    </div>
  );
};

export default PatternDisplay;
