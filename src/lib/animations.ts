
// Optimized animations for better performance and smoother theme transitions

export const triggerPulseAnimation = (theme: string) => {
  // Minimal flash animation
  const elements = document.querySelectorAll('.animated-background-pulse');
  elements.forEach(el => {
    if (el instanceof HTMLElement) {
      el.style.transition = 'opacity 0.1s ease';
      el.style.opacity = '0.9';
      setTimeout(() => {
        el.style.opacity = '1';
      }, 100);
    }
  });
};

export const createParticleExplosion = (x: number, y: number, count = 6) => {
  // Reduced particle count and simplified animation
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

  // Create smaller, faster particles
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    const size = Math.random() * 4 + 2;
    const randomX = Math.random() * 80 - 40;
    const randomY = Math.random() * 80 - 40;
    
    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background-color: #8B5CF6;
      left: ${x}px;
      top: ${y}px;
      opacity: 0.7;
      pointer-events: none;
      transition: all 0.4s ease-out;
    `;
    
    container.appendChild(particle);
    
    // Animate particle with requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      particle.style.transform = `translate(${randomX}px, ${randomY}px) scale(0)`;
      particle.style.opacity = '0';
    });
    
    // Clean up quickly
    setTimeout(() => {
      if (container && container.contains(particle)) {
        container.removeChild(particle);
      }
    }, 450);
  }
};
