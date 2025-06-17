
import { useEffect, useState } from "react";

interface NeuralNetworkVizProps {
  learningRate: number;
  errorRate: number;
  isTraining: boolean;
  accuracy: number;
}

const NeuralNetworkViz = ({ learningRate, errorRate, isTraining, accuracy }: NeuralNetworkVizProps) => {
  const [connections, setConnections] = useState<Array<{ active: boolean; strength: number }>>([]);
  const [neurons, setNeurons] = useState<Array<{ active: boolean; pulse: boolean }>>([]);

  useEffect(() => {
    // Initialize network
    const connectionCount = 12;
    const neuronCount = 9;
    
    setConnections(Array(connectionCount).fill(null).map(() => ({ 
      active: false, 
      strength: Math.random() 
    })));
    
    setNeurons(Array(neuronCount).fill(null).map(() => ({ 
      active: false, 
      pulse: false 
    })));
  }, []);

  useEffect(() => {
    if (!isTraining) return;

    const interval = setInterval(() => {
      // Update connections based on learning rate and error
      setConnections(prev => prev.map(conn => ({
        ...conn,
        active: Math.random() < learningRate * 0.8,
        strength: Math.max(0.1, Math.min(1, conn.strength + (learningRate - errorRate) * 0.1))
      })));

      // Update neurons
      setNeurons(prev => prev.map(neuron => ({
        active: Math.random() < learningRate * 0.6,
        pulse: Math.random() < 0.3
      })));
    }, 200);

    return () => clearInterval(interval);
  }, [isTraining, learningRate, errorRate]);

  return (
    <div className="fixed top-4 right-4 w-48 h-32 bg-gray-900/90 border-2 border-cyan-400 rounded-lg p-2 retro-glow z-50">
      <div className="text-xs text-cyan-400 font-mono mb-1 text-center">🧠 AI BRAIN</div>
      <div className="text-xs text-cyan-300 font-mono mb-2 text-center">
        ACC: {Math.round(accuracy * 100)}%
      </div>
      
      <div className="relative w-full h-20">
        {/* Input layer */}
        <div className="absolute left-1 top-0 flex flex-col justify-around h-full">
          {neurons.slice(0, 3).map((neuron, i) => (
            <div
              key={`input-${i}`}
              className={`w-3 h-3 rounded-full border-2 transition-all duration-200 ${
                neuron.active 
                  ? 'bg-cyan-400 border-cyan-400 shadow-[0_0_8px_rgba(0,255,255,0.8)]' 
                  : 'bg-gray-700 border-gray-500'
              } ${neuron.pulse ? 'animate-pulse' : ''}`}
            />
          ))}
        </div>

        {/* Hidden layer */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-0 flex flex-col justify-around h-full">
          {neurons.slice(3, 6).map((neuron, i) => (
            <div
              key={`hidden-${i}`}
              className={`w-3 h-3 rounded-full border-2 transition-all duration-200 ${
                neuron.active 
                  ? 'bg-purple-400 border-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]' 
                  : 'bg-gray-700 border-gray-500'
              } ${neuron.pulse ? 'animate-pulse' : ''}`}
            />
          ))}
        </div>

        {/* Output layer */}
        <div className="absolute right-1 top-0 flex flex-col justify-around h-full">
          {neurons.slice(6, 9).map((neuron, i) => (
            <div
              key={`output-${i}`}
              className={`w-3 h-3 rounded-full border-2 transition-all duration-200 ${
                neuron.active 
                  ? 'bg-pink-400 border-pink-400 shadow-[0_0_8px_rgba(244,114,182,0.8)]' 
                  : 'bg-gray-700 border-gray-500'
              } ${neuron.pulse ? 'animate-pulse' : ''}`}
            />
          ))}
        </div>

        {/* Connections */}
        <svg className="absolute inset-0 w-full h-full">
          {connections.slice(0, 6).map((conn, i) => {
            const inputY = 10 + (i % 3) * 25;
            const hiddenY = 10 + Math.floor(i / 3) * 25;
            return (
              <line
                key={`input-hidden-${i}`}
                x1="16"
                y1={inputY}
                x2="80"
                y2={hiddenY}
                stroke={conn.active ? "#00ffff" : "#374151"}
                strokeWidth={conn.strength * 2}
                className="transition-all duration-200"
                style={{
                  filter: conn.active ? "drop-shadow(0 0 3px #00ffff)" : "none"
                }}
              />
            );
          })}
          {connections.slice(6, 12).map((conn, i) => {
            const hiddenY = 10 + (i % 3) * 25;
            const outputY = 10 + Math.floor(i / 3) * 25;
            return (
              <line
                key={`hidden-output-${i}`}
                x1="96"
                y1={hiddenY}
                x2="160"
                y2={outputY}
                stroke={conn.active ? "#a855f7" : "#374151"}
                strokeWidth={conn.strength * 2}
                className="transition-all duration-200"
                style={{
                  filter: conn.active ? "drop-shadow(0 0 3px #a855f7)" : "none"
                }}
              />
            );
          })}
        </svg>
      </div>
      
      <div className="flex justify-between text-xs text-cyan-300 font-mono mt-1">
        <span>LR: {Math.round(learningRate * 100)}%</span>
        <span>ER: {Math.round(errorRate * 100)}%</span>
      </div>

      <style>{`
        .retro-glow {
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default NeuralNetworkViz;
