
import { Clock } from "lucide-react";

interface GameTimerProps {
  timeLeft: number;
}

const GameTimer = ({ timeLeft }: GameTimerProps) => {
  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full font-mono text-sm ${
      timeLeft <= 3 ? 'bg-red-900 text-red-300 border border-red-500' : 
      timeLeft <= 5 ? 'bg-yellow-900 text-yellow-300 border border-yellow-500' :
      'bg-gray-800 text-cyan-300'
    }`}>
      <Clock size={16} />
      <span className="font-bold">{timeLeft}s</span>
    </div>
  );
};

export default GameTimer;
