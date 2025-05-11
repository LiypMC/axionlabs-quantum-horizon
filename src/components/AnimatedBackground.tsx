
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useTheme } from './ThemeProvider';

interface AnimatedBackgroundProps {
  className?: string;
}

const AnimatedBackground = ({ className }: AnimatedBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: false, // Disable antialiasing for performance
      powerPreference: 'high-performance'
    });
    
    renderer.setPixelRatio(1); // Force 1x pixel ratio for better performance
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);
    
    // Camera position
    camera.position.z = 20;
    
    // Lighting - simplified
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
    
    // Reduced particle count
    const particleCount = 50; // Reduced from 100
    const particles: THREE.Mesh[] = [];
    const group = new THREE.Group();
    
    // Generate particles - optimize geometry reuse
    const geometries = [
      new THREE.IcosahedronGeometry(0.2, 0),
      new THREE.IcosahedronGeometry(0.3, 0)
    ];
    
    // Generate particles with shared geometries
    for (let i = 0; i < particleCount; i++) {
      const geometry = geometries[i % geometries.length];
      
      // Use different materials based on theme
      const material = new THREE.MeshBasicMaterial({ // Changed to BasicMaterial (faster)
        color: theme === 'dark' ? 0x0095ff : 0x007ACC,
        transparent: true,
        opacity: Math.random() * 0.5 + 0.5,
      });
      
      const particle = new THREE.Mesh(geometry, material);
      
      // Distribute particles in space
      particle.position.x = Math.random() * 40 - 20;
      particle.position.y = Math.random() * 40 - 20;
      particle.position.z = Math.random() * 40 - 20;
      
      // Store initial position for animation
      (particle as any).originalPosition = {
        x: particle.position.x,
        y: particle.position.y,
        z: particle.position.z
      };
      
      group.add(particle);
      particles.push(particle);
    }
    
    scene.add(group);
    
    // Handle mouse movement - with throttling
    const mouse = new THREE.Vector2();
    const mouseTarget = new THREE.Vector2();
    
    let lastMouseMoveTime = 0;
    const handleMouseMove = (event: MouseEvent) => {
      // Throttle mouse events
      const now = Date.now();
      if (now - lastMouseMoveTime < 50) return;
      lastMouseMoveTime = now;
      
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Smoothly update the target
      mouseTarget.x = mouse.x;
      mouseTarget.y = mouse.y;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Handle window resize - with debouncing
    let resizeTimeout: number;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }, 250); // Debounce resize events
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation with frame limiting
    let lastFrameTime = 0;
    const targetFPS = 30; // Cap at 30 FPS
    const frameInterval = 1000 / targetFPS;
    
    const animate = (currentTime: number) => {
      const animationId = requestAnimationFrame(animate);
      
      // Limit framerate
      const elapsed = currentTime - lastFrameTime;
      if (elapsed < frameInterval) return;
      
      lastFrameTime = currentTime - (elapsed % frameInterval);
      
      // Slower rotation for better performance
      group.rotation.x += 0.0002;
      group.rotation.y += 0.0003;
      
      // Only update particles on some frames
      if (Math.random() < 0.5) {
        particles.forEach((particle, index) => {
          const originalPosition = (particle as any).originalPosition;
          
          // Calculate influence based on mouse position - less frequent updates
          if (index % 3 === 0) { // Only update 1/3 of particles each frame
            const factor = index % 2 === 0 ? 1 : -1;
            particle.position.x = originalPosition.x + mouseTarget.x * factor * 2;
            particle.position.y = originalPosition.y + mouseTarget.y * factor * 2;
          }
          
          // Simplified rotation - less frequent
          if (index % 2 === 0) {
            particle.rotation.x += 0.01;
            particle.rotation.y += 0.01;
          }
        });
      }
      
      renderer.render(scene, camera);
      
      // Store animation ID for cleanup
      (animate as any).animationId = animationId;
    };
    
    animate(0);
    
    // Cleanup function
    return () => {
      cancelAnimationFrame((animate as any).animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      // Dispose of resources
      geometries.forEach(geometry => geometry.dispose());
      particles.forEach(particle => {
        (particle.material as THREE.Material).dispose();
      });
      
      renderer.dispose();
      
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [theme]);
  
  return (
    <div 
      ref={containerRef} 
      className={`absolute inset-0 overflow-hidden -z-10 pointer-events-none ${className || ''}`}
    />
  );
};

export default AnimatedBackground;
