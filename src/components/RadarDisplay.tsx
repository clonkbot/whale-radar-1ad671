import { useEffect, useState, useMemo } from 'react';
import type { Transaction } from '../App';

type RadarDisplayProps = {
  transactions: Transaction[];
  pingActive: boolean;
};

type Blip = {
  id: string;
  x: number;
  y: number;
  size: number;
  type: Transaction['type'];
  age: number;
};

export function RadarDisplay({ transactions, pingActive }: RadarDisplayProps) {
  const [rotation, setRotation] = useState(0);
  const [blips, setBlips] = useState<Blip[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      const newBlips = transactions.slice(0, 12).map((tx, i) => {
        const angle = (i * 30 + Math.random() * 20) * (Math.PI / 180);
        const distance = 20 + Math.random() * 70;
        return {
          id: tx.id,
          x: 50 + Math.cos(angle) * distance * 0.4,
          y: 50 + Math.sin(angle) * distance * 0.4,
          size: Math.min(Math.max(tx.usdValue / 100000, 4), 16),
          type: tx.type,
          age: i,
        };
      });
      setBlips(newBlips);
    }
  }, [transactions]);

  const blipColors = useMemo(() => ({
    buy: '#00ffd5',
    sell: '#ff3366',
    unusual: '#ffb800',
    exchange: '#8b5cf6',
  }), []);

  return (
    <div className="radar-container">
      <div className="radar-title">DEEP SCAN</div>
      <div className="radar-display">
        <svg viewBox="0 0 100 100" className="radar-svg">
          {/* Radar rings */}
          {[20, 35, 50, 65, 80].map((r, i) => (
            <circle
              key={i}
              cx="50"
              cy="50"
              r={r * 0.45}
              fill="none"
              stroke="rgba(0, 255, 213, 0.15)"
              strokeWidth="0.3"
              className="radar-ring"
            />
          ))}

          {/* Cross lines */}
          <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(0, 255, 213, 0.1)" strokeWidth="0.3" />
          <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(0, 255, 213, 0.1)" strokeWidth="0.3" />
          <line x1="15" y1="15" x2="85" y2="85" stroke="rgba(0, 255, 213, 0.05)" strokeWidth="0.3" />
          <line x1="85" y1="15" x2="15" y2="85" stroke="rgba(0, 255, 213, 0.05)" strokeWidth="0.3" />

          {/* Sweep line */}
          <defs>
            <linearGradient id="sweepGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(0, 255, 213, 0)" />
              <stop offset="100%" stopColor="rgba(0, 255, 213, 0.6)" />
            </linearGradient>
          </defs>
          <g transform={`rotate(${rotation} 50 50)`}>
            <path
              d="M50,50 L50,5 A45,45 0 0,1 89,30 Z"
              fill="url(#sweepGradient)"
              className="radar-sweep-cone"
            />
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="5"
              stroke="#00ffd5"
              strokeWidth="0.5"
              className="sweep-line"
            />
          </g>

          {/* Blips */}
          {blips.map((blip) => (
            <g key={blip.id}>
              <circle
                cx={blip.x}
                cy={blip.y}
                r={blip.size * 0.15}
                fill={blipColors[blip.type]}
                className={`blip blip-${blip.type}`}
                style={{ opacity: 1 - blip.age * 0.06 }}
              />
              <circle
                cx={blip.x}
                cy={blip.y}
                r={blip.size * 0.25}
                fill="none"
                stroke={blipColors[blip.type]}
                strokeWidth="0.2"
                className="blip-ring"
                style={{ opacity: 0.5 - blip.age * 0.03 }}
              />
            </g>
          ))}

          {/* Center point */}
          <circle cx="50" cy="50" r="2" fill="#00ffd5" className="center-point" />
          <circle cx="50" cy="50" r="3.5" fill="none" stroke="#00ffd5" strokeWidth="0.3" />
        </svg>

        {/* Ping effect */}
        {pingActive && (
          <div className="ping-effect">
            <div className="ping-ring ping-ring-1" />
            <div className="ping-ring ping-ring-2" />
            <div className="ping-ring ping-ring-3" />
          </div>
        )}
      </div>

      <div className="radar-legend">
        <div className="legend-item">
          <span className="legend-dot buy" />
          <span>BUYS</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot sell" />
          <span>SELLS</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot unusual" />
          <span>UNUSUAL</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot exchange" />
          <span>EXCHANGE</span>
        </div>
      </div>
    </div>
  );
}
