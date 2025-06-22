
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AnswerInputProps {
  userAnswer: string;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
  isProcessingAnswer: boolean;
}

const AnswerInput = ({ userAnswer, onAnswerChange, onSubmit, isProcessingAnswer }: AnswerInputProps) => {
  return (
    <div className="space-y-6">
      <Input
        type="number"
        value={userAnswer}
        onChange={(e) => onAnswerChange(e.target.value)}
        placeholder="Enter your answer"
        className="text-center text-2xl font-bold bg-gray-800 border-2 border-cyan-400 text-cyan-300 font-mono h-16 retro-glow"
        onKeyPress={(e) => e.key === 'Enter' && userAnswer && !isProcessingAnswer && onSubmit()}
        disabled={isProcessingAnswer}
      />
      <Button
        onClick={onSubmit}
        disabled={!userAnswer || isProcessingAnswer}
        className="w-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 hover:from-cyan-500 hover:via-purple-600 hover:to-pink-600 text-black font-bold text-xl py-6 font-mono retro-glow border-2 border-white/30"
      >
        🚀 SUBMIT ANSWER
      </Button>
    </div>
  );
};

export default AnswerInput;
