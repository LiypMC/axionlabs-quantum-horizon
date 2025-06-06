
// Simplified animation utilities for better performance

export const triggerPulseAnimation = (theme: string) => {
  // Minimal animation to avoid performance issues
  const elements = document.querySelectorAll('.animated-background-pulse');
  elements.forEach(el => {
    if (el instanceof HTMLElement) {
      el.style.opacity = '0.8';
      setTimeout(() => {
        el.style.opacity = '1';
      }, 150);
    }
  });
};

export const createParticleExplosion = (x: number, y: number, count = 8) => {
  // Reduced particle count for better performance
  let container = document.getElementById('particle-explosion-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'particle-explosion-container';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '50';
    document.body.appendChild(container);
  }

  // Create fewer, simpler particles
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    const size = Math.random() * 6 + 3;
    const randomX = Math.random() * 100 - 50;
    const randomY = Math.random() * 100 - 50;
    
    particle.style.position = 'absolute';
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.borderRadius = '50%';
    particle.style.backgroundColor = '#007ACC';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.opacity = '0.8';
    particle.style.pointerEvents = 'none';
    particle.style.transition = 'all 0.5s ease-out';
    
    container.appendChild(particle);
    
    // Animate particle
    requestAnimationFrame(() => {
      particle.style.transform = `translate(${randomX}px, ${randomY}px) scale(0)`;
      particle.style.opacity = '0';
    });
    
    // Clean up faster
    setTimeout(() => {
      if (container && container.contains(particle)) {
        container.removeChild(particle);
      }
    }, 600);
  }
};
