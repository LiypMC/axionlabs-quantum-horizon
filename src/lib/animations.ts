
// Simple animation utilities without anime.js dependency

export const triggerPulseAnimation = (theme: string) => {
  const elements = document.querySelectorAll('.animated-background-pulse');
  elements.forEach(el => {
    if (el instanceof HTMLElement) {
      // Add and remove a class to trigger CSS animation
      el.classList.add('pulse-animation');
      setTimeout(() => el.classList.remove('pulse-animation'), 1000);
    }
  });
  
  // Theme transition particles
  const particles = document.querySelectorAll('.theme-transition-particle');
  const color = theme === 'dark' ? '#0066cc' : '#007ACC';
  
  particles.forEach(particle => {
    if (particle instanceof HTMLElement) {
      particle.style.backgroundColor = color;
      particle.classList.add('particle-animation');
      setTimeout(() => particle.classList.remove('particle-animation'), 700);
    }
  });
};

export const createParticleExplosion = (x: number, y: number, count = 20) => {
  // Create container if it doesn't exist
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

  // Create particles using DOM elements with CSS animations
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    const size = Math.random() * 10 + 5;
    const randomX = Math.random() * 200 - 100;
    const randomY = Math.random() * 200 - 100;
    
    particle.className = 'theme-transition-particle particle-explosion';
    particle.style.position = 'absolute';
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.borderRadius = '50%';
    particle.style.backgroundColor = '#007ACC';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.transform = `translate(${randomX}px, ${randomY}px) scale(0)`;
    particle.style.opacity = '0';
    particle.style.pointerEvents = 'none';
    
    container.appendChild(particle);
    
    // Remove particle after animation completes
    setTimeout(() => {
      if (container && container.contains(particle)) {
        container.removeChild(particle);
      }
    }, 2000);
  }
};
