
import anime from 'animejs';

export const triggerPulseAnimation = (theme: string) => {
  anime({
    targets: '.animated-background-pulse',
    scale: [1, 1.3, 1],
    opacity: [1, 0.8, 1],
    easing: 'easeInOutExpo',
    duration: 1000
  });
  
  const color = theme === 'dark' ? '#0066cc' : '#007ACC';
  
  anime({
    targets: '.theme-transition-particle',
    backgroundColor: color,
    scale: [1, 1.5, 1],
    easing: 'easeInOutQuad',
    delay: anime.stagger(100),
    duration: 700
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

  // Create particles
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    const size = Math.random() * 10 + 5;
    
    particle.className = 'theme-transition-particle';
    particle.style.position = 'absolute';
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.borderRadius = '50%';
    particle.style.backgroundColor = '#007ACC';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.opacity = '1';
    particle.style.pointerEvents = 'none';
    
    container.appendChild(particle);
    
    anime({
      targets: particle,
      translateX: Math.random() * 200 - 100,
      translateY: Math.random() * 200 - 100,
      opacity: 0,
      scale: [1, 0],
      easing: 'easeOutExpo',
      duration: Math.random() * 1500 + 500,
      complete: () => {
        if (container) container.removeChild(particle);
      }
    });
  }
};
