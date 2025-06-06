
// Simplified animations for dark mode only

export const triggerPulseAnimation = () => {
  // Simple pulse animation for dark mode
  const elements = document.querySelectorAll('.animated-background-pulse');
  elements.forEach(el => {
    if (el instanceof HTMLElement) {
      el.style.opacity = '0.95';
      setTimeout(() => {
        el.style.opacity = '1';
      }, 50);
    }
  });
};

export const createParticleExplosion = (x: number, y: number, count = 6) => {
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

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    const size = Math.random() * 4 + 2;
    const randomX = Math.random() * 60 - 30;
    const randomY = Math.random() * 60 - 30;
    
    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background-color: #8B5CF6;
      left: ${x}px;
      top: ${y}px;
      opacity: 0.8;
      pointer-events: none;
      transform: translate(${randomX}px, ${randomY}px) scale(0);
      transition: all 0.3s ease-out;
    `;
    
    container.appendChild(particle);
    
    setTimeout(() => {
      if (container && container.contains(particle)) {
        container.removeChild(particle);
      }
    }, 350);
  }
};
