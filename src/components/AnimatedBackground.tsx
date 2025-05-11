
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
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);
    
    // Camera position
    camera.position.z = 20;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);
    
    // Particles
    const particleCount = 100;
    const particles: THREE.Mesh[] = [];
    const group = new THREE.Group();
    
    // Generate particles
    for (let i = 0; i < particleCount; i++) {
      const geometry = new THREE.IcosahedronGeometry(Math.random() * 0.2 + 0.1, 0);
      
      // Use different materials based on theme
      const material = new THREE.MeshPhongMaterial({
        color: theme === 'dark' ? 0x0095ff : 0x007ACC,
        emissive: theme === 'dark' ? 0x0033cc : 0x002288,
        transparent: true,
        opacity: Math.random() * 0.5 + 0.5,
        flatShading: true
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
    
    // Handle mouse movement
    const mouse = new THREE.Vector2();
    const mouseTarget = new THREE.Vector2();
    
    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Smoothly update the target
      mouseTarget.x = mouse.x;
      mouseTarget.y = mouse.y;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate entire particle group
      group.rotation.x += 0.0005;
      group.rotation.y += 0.0007;
      
      // Update particles based on mouse position
      particles.forEach((particle, index) => {
        const originalPosition = (particle as any).originalPosition;
        
        // Calculate influence based on mouse position
        const factor = index % 2 === 0 ? 1 : -1;
        particle.position.x = originalPosition.x + mouseTarget.x * factor * 2;
        particle.position.y = originalPosition.y + mouseTarget.y * factor * 2;
        
        // Individual particle rotation
        particle.rotation.x += 0.01;
        particle.rotation.y += 0.01;
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      // Dispose of resources
      particles.forEach(particle => {
        particle.geometry.dispose();
        (particle.material as THREE.Material).dispose();
      });
      
      renderer.dispose();
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
