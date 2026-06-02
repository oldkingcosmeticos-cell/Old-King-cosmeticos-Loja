import React from 'react';

const leaves = Array.from({ length: 15 }).map((_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  animationDuration: `${Math.random() * 5 + 10}s`, // entre 10 e 15 segundos
  animationDelay: `-${Math.random() * 10}s`, // delay negativo para que já comecem na tela
  size: Math.random() * 10 + 15, // 15px a 25px
  color: ['#A0522D', '#D2691E', '#CD853F', '#8B4513'][Math.floor(Math.random() * 4)],
  rotation: Math.random() * 360,
  swayDuration: `${Math.random() * 3 + 2}s` // duração do balanço horizontal
}));

export const FallingLeaves = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
      {leaves.map(leaf => (
        <div
          key={leaf.id}
          className="absolute top-[-10%]"
          style={{
            left: leaf.left,
            animation: `fall ${leaf.animationDuration} linear infinite`,
            animationDelay: leaf.animationDelay,
          }}
        >
          <div
            style={{
              animation: `sway ${leaf.swayDuration} ease-in-out infinite alternate`,
              animationDelay: leaf.animationDelay,
            }}
          >
            <svg
              width={leaf.size}
              height={leaf.size}
              viewBox="0 0 24 24"
              style={{
                fill: leaf.color,
                transform: `rotate(${leaf.rotation}deg)`,
                opacity: Math.random() * 0.5 + 0.3
              }}
            >
              <path d="M17.5,3.3C15.1,1.1,11.3,0,7,0C6.6,0,6.2,0,5.8,0.1C5.4,1.8,5,4.7,5.7,7.8C6.1,9.4,7,10.9,8.4,12.2 C7.5,13.2,6.6,14,5.8,14.6C4.4,15.7,3.1,16.5,2.1,17l-1,0.5l2.1,0.9C4,18.8,5,19,6,19c1.9,0,3.8-0.7,5.5-2 c1.1-0.8,2.1-1.8,3.1-2.9C16.8,14,18.5,13.7,20,13.1c1.3-0.5,2.5-1.2,3.3-2.1c0.5-0.5,0.7-1,0.7-1.4c0-0.3-0.1-0.6-0.3-0.8 C21.8,7.3,20,5.4,17.5,3.3z M19.4,11.3c-1.1,0.4-2.4,0.7-3.8,0.7c-0.8,0-1.6-0.1-2.4-0.3c-1.3-0.3-2.6-0.7-3.8-1.4 c1.1-1.3,1.9-2.7,2.3-4.2C12.1,4.5,12.3,3.3,12.3,2.4C14.7,3.2,16.8,4.7,18.4,6.7C19.8,8.4,20,10.1,19.4,11.3z" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
};
