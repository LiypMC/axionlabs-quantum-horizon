
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from './ThemeProvider';

interface ParticleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ParticleCard = ({ title, description, icon }: ParticleCardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.className = 'absolute inset-0 -z-10 rounded-xl';
    containerRef.current.appendChild(canvas);
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas, 
      alpha: true,
      antialias: true
    });
    
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Camera position
    camera.position.z = 5;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x808080, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(theme === 'dark' ? 0x0095ff : 0x007ACC, 1);
    pointLight.position.set(0, 0, 2);
    scene.add(pointLight);
    
    // Create floating particles
    const particleCount = 20;
    const particles: THREE.Mesh[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      const geometry = new THREE.SphereGeometry(0.05, 8, 8);
      const material = new THREE.MeshPhongMaterial({
        color: theme === 'dark' ? 0x0066cc : 0x007ACC,
        emissive: theme === 'dark' ? 0x001933 : 0x00305E,
        transparent: true,
        opacity: Math.random() * 0.5 + 0.2,
        shininess: 100
      });
      
      const particle = new THREE.Mesh(geometry, material);
      
      // Randomize particle positions
      particle.position.x = (Math.random() - 0.5) * 4;
      particle.position.y = (Math.random() - 0.5) * 4;
      particle.position.z = (Math.random() - 0.5) * 2;
      
      // Store original positions and individual animation properties
      (particle as any).origPos = { ...particle.position };
      (particle as any).speed = Math.random() * 0.01 + 0.005;
      (particle as any).angle = Math.random() * Math.PI * 2;
      
      scene.add(particle);
      particles.push(particle);
    }
    
    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      
      if (
        event.clientX >= rect.left && 
        event.clientX <= rect.right && 
        event.clientY >= rect.top && 
        event.clientY <= rect.bottom
      ) {
        mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      
      // Smooth mouse tracking
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;
      
      // Tilt the scene slightly based on mouse position
      scene.rotation.x = targetY * 0.3;
      scene.rotation.y = targetX * 0.3;
      
      // Animate particles
      particles.forEach((particle) => {
        (particle as any).angle += (particle as any).speed;
        
        // Orbital motion around original position
        const origPos = (particle as any).origPos;
        particle.position.x = origPos.x + Math.sin((particle as any).angle) * 0.3;
        particle.position.y = origPos.y + Math.cos((particle as any).angle) * 0.3;
        
        // Pulsing effect
        particle.scale.x = particle.scale.y = particle.scale.z = 
          1 + 0.3 * Math.sin((particle as any).angle * 3);
      });
      
      renderer.render(scene, camera);
      
      // Store animation ID for cleanup
      (animate as any).animationId = animationId;
    };
    
    animate();
    
    // Cleanup function
    return () => {
      cancelAnimationFrame((animate as any).animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      // Clean up THREE.js resources
      particles.forEach(particle => {
        scene.remove(particle);
        particle.geometry.dispose();
        (particle.material as THREE.Material).dispose();
      });
      
      scene.remove(pointLight);
      scene.remove(ambientLight);
      
      renderer.dispose();
      
      if (containerRef.current && containerRef.current.contains(canvas)) {
        containerRef.current.removeChild(canvas);
      }
    };
  }, [theme]);
  
  return (
    <div 
      ref={containerRef} 
      className="relative p-6 glass-panel h-full transition-all hover:scale-105 duration-300"
    >
      <div className="z-10 relative">
        <div className="text-axion-blue mb-4 flex justify-center">{icon}</div>
        <h3 className="heading text-xl mb-2">{title}</h3>
        <p className="text-axion-gray">{description}</p>
      </div>
    </div>
  );
};

export default ParticleCard;
