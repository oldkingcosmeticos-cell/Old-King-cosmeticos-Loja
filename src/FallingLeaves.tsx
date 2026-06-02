import React from 'react';

const leaves = Array.from({ length: 20 }).map((_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  animationDuration: `${Math.random() * 5 + 10}s`, // entre 10 e 15 segundos
  animationDelay: `-${Math.random() * 10}s`, // delay negativo para que já comecem na tela
  size: Math.random() * 25 + 30, // 30px a 55px (MAIORES)
  color: ['#FF8C00', '#FF4500', '#FFA500', '#E9C176'][Math.floor(Math.random() * 4)], // Cores mais vivas (Laranja escuro, Vermelho-laranja, Laranja, Dourado)
  rotation: Math.random() * 360,
  swayDuration: `${Math.random() * 3 + 2}s` // duração do balanço horizontal
}));

export const FallingLeaves = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-80">
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
              viewBox="0 0 512 512"
              style={{
                fill: leaf.color,
                transform: `rotate(${leaf.rotation}deg)`,
                opacity: Math.random() * 0.3 + 0.7 // Mais opacas e vivas
              }}
            >
              <path d="M497.503,213.882l-25.239-9.566c-2.902-1.25-47.361-21.538-47.361-88.714l-0.012-34.895l-27.958,20.896c-10.267,7.673-38.883,26.071-61.815,30.511L255.852,0l-79.269,132.114c-22.932-4.438-51.546-22.836-61.802-30.502L86.8,80.626v34.976c0,67.171-44.454,87.464-47.361,88.714L14.195,213.882l22.656,15.659c25.467,17.601,40.785,45.748,40.785,75.753v97.986l33.279-22.257c23.08-15.438,51.875-23.755,81.164-23.755h127.842c29.289,0,58.084,8.317,81.164,23.755l33.279,22.257v-97.986c0-30.005,15.318-58.152,40.785-75.753L497.503,213.882z" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
};
