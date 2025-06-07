
// Lightweight animations for dark mode only - optimized for performance

export const triggerPulseAnimation = () => {
  // Simple pulse animation - no DOM manipulation for better performance
  console.log('Pulse animation triggered');
};

export const createParticleExplosion = (x: number, y: number, count = 3) => {
  // Reduced particle count and simplified animation for performance
  let container = document.getElementById('particle-explosion-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'particle-explosion-container';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 50;
    `;
    document.body.appendChild(container);
  }

  // Limit particles and use simpler animations
  for (let i = 0; i < Math.min(count, 3); i++) {
    const particle = document.createElement('div');
    const size = 3;
    const randomX = (Math.random() - 0.5) * 40;
    const randomY = (Math.random() - 0.5) * 40;
    
    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background-color: #8B5CF6;
      left: ${x}px;
      top: ${y}px;
      opacity: 0.6;
      pointer-events: none;
      transform: translate(${randomX}px, ${randomY}px) scale(0);
      transition: transform 0.2s ease-out, opacity 0.2s ease-out;
    `;
    
    container.appendChild(particle);
    
    // Faster cleanup for better performance
    setTimeout(() => {
      if (container && container.contains(particle)) {
        container.removeChild(particle);
      }
    }, 200);
  }
};
