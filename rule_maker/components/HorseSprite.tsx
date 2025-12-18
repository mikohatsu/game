import React from 'react';

interface HorseSpriteProps {
  color: string;
  isMoving: boolean;
  scale?: number;
  animationSpeed?: number; // Multiplier for animation speed
}

export const HorseSprite: React.FC<HorseSpriteProps> = ({ color, isMoving, scale = 1, animationSpeed = 1 }) => {
  // Faster animation for realism. Default duration 0.4s for a full gallop cycle.
  const duration = Math.max(0.1, 0.45 / (animationSpeed || 1));
  const playState = isMoving ? 'running' : 'paused';

  return (
    <div 
      className="relative overflow-visible"
      style={{ 
        transform: `scale(${scale})`,
        width: '80px',
        height: '60px'
      }}
    >
      {/* Dust Effect (Behind legs) */}
      {isMoving && (
        <div className="absolute -left-4 top-10 w-8 h-8 opacity-60">
           <div className="absolute w-2 h-2 bg-[#d7ccc8] rounded-full animate-ping" style={{ animationDuration: '0.4s', animationDelay: '0s' }}></div>
           <div className="absolute top-2 left-2 w-3 h-3 bg-[#a1887f] rounded-full animate-ping" style={{ animationDuration: '0.5s', animationDelay: '0.1s' }}></div>
           <div className="absolute top-[-5px] left-4 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDuration: '0.3s', animationDelay: '0.2s' }}></div>
        </div>
      )}

      <svg viewBox="0 0 100 80" className="w-full h-full overflow-visible">
        <g stroke="black" strokeWidth="1.5" fill={color}>
          
          {/* Back Leg (Left - Far) */}
          <g className="origin-top" style={{ transformOrigin: '20px 45px', animation: `leg-back-far ${duration}s linear infinite`, animationPlayState: playState }}>
            <path d="M 20 45 L 10 60 L 15 75" fill="none" strokeWidth="2.5" stroke="#333" /> 
            <circle cx="15" cy="75" r="1.5" fill="black" /> {/* Hoof */}
          </g>

          {/* Front Leg (Left - Far) */}
          <g className="origin-top" style={{ transformOrigin: '70px 45px', animation: `leg-front-far ${duration}s linear infinite`, animationPlayState: playState }}>
            <path d="M 70 45 L 75 60 L 65 75" fill="none" strokeWidth="2.5" stroke="#333" />
            <circle cx="65" cy="75" r="1.5" fill="black" />
          </g>

          {/* Tail */}
          <path d="M 10 30 Q 0 35 5 50" fill="none" strokeWidth="3" className="origin-top" 
                style={{ transformOrigin: '10px 30px', animation: `tail-wag ${duration}s ease-in-out infinite`, animationPlayState: playState }} />

          {/* Body Group (Bobs up and down) */}
          <g style={{ animation: `body-gallop ${duration}s ease-in-out infinite`, animationPlayState: playState }}>
            
            {/* Main Body */}
            <path d="
              M 15 35 
              Q 15 25 35 25 
              L 65 25 
              Q 80 25 80 40 
              L 75 50 
              L 25 50 
              Z" 
            />

            {/* Neck & Head Group */}
            <g style={{ transformOrigin: '70px 30px', animation: `head-bob ${duration}s ease-in-out infinite`, animationPlayState: playState }}>
              {/* Neck */}
              <path d="M 65 25 L 80 10 L 85 25 L 70 35 Z" />
              {/* Head */}
              <path d="M 80 10 L 95 12 L 98 22 L 88 28 L 82 22 Z" />
              {/* Mane */}
              <path d="M 65 25 Q 70 15 80 10" fill="none" stroke="black" strokeWidth="4" />
              {/* Ear */}
              <path d="M 82 10 L 84 2 L 88 10 Z" fill={color} />
              {/* Eye */}
              <circle cx="90" cy="18" r="1" fill="white" />
              <circle cx="90.5" cy="18" r="0.5" fill="black" />
            </g>
          </g>

          {/* Back Leg (Right - Near) */}
          <g className="origin-top" style={{ transformOrigin: '25px 45px', animation: `leg-back-near ${duration}s linear infinite`, animationPlayState: playState }}>
             <path d="M 25 45 L 35 55 L 25 75" fill="none" strokeWidth="3" />
             <path d="M 25 45 Q 35 55 25 75 L 20 75 L 25 45" stroke="none" /> {/* Thigh fill */}
             <circle cx="25" cy="75" r="2" fill="black" />
          </g>

          {/* Front Leg (Right - Near) */}
          <g className="origin-top" style={{ transformOrigin: '75px 45px', animation: `leg-front-near ${duration}s linear infinite`, animationPlayState: playState }}>
             <path d="M 75 45 L 85 60 L 90 70" fill="none" strokeWidth="3" />
             <circle cx="90" cy="70" r="2" fill="black" />
          </g>

        </g>
      </svg>
      
      <style>{`
        /* Galloping Body Motion */
        @keyframes body-gallop {
          0% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-3px) rotate(-2deg); }
          50% { transform: translateY(-5px) rotate(0deg); }
          75% { transform: translateY(-2px) rotate(2deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }

        /* Head Counter-motion */
        @keyframes head-bob {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(5deg); }
          100% { transform: rotate(0deg); }
        }

        /* Tail */
        @keyframes tail-wag {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(20deg); }
          100% { transform: rotate(0deg); }
        }

        /* Legs - complex rotary gallop approximation */
        @keyframes leg-back-near {
          0% { transform: rotate(-30deg); } /* Kick back */
          30% { transform: rotate(40deg); } /* Recover */
          60% { transform: rotate(20deg); } /* Reach */
          100% { transform: rotate(-30deg); }
        }
        @keyframes leg-back-far {
          0% { transform: rotate(-10deg); }
          30% { transform: rotate(30deg); }
          60% { transform: rotate(50deg); }
          100% { transform: rotate(-10deg); }
        }

        @keyframes leg-front-near {
          0% { transform: rotate(45deg); } /* Reach */
          40% { transform: rotate(-20deg); } /* Pull */
          70% { transform: rotate(-40deg); } /* Tuck */
          100% { transform: rotate(45deg); }
        }
        @keyframes leg-front-far {
          0% { transform: rotate(20deg); }
          40% { transform: rotate(-30deg); }
          70% { transform: rotate(-10deg); }
          100% { transform: rotate(20deg); }
        }
      `}</style>
    </div>
  );
};
