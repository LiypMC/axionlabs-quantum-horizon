
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from './ThemeProvider';

const FloatingCube = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: false, // Disabled for performance
      powerPreference: 'high-performance'
    });
    
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(1); // Force 1x pixel ratio for better performance
    containerRef.current.appendChild(renderer.domElement);
    
    // Camera setup
    camera.position.z = 5;
    
    // Lighting - simplified
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x0095ff, 0.8);
    pointLight.position.set(5, 3, 5);
    scene.add(pointLight);
    
    // Create the cube
    const cubeSize = 1.2;
    const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMaterial = new THREE.MeshBasicMaterial({ // Changed to BasicMaterial for performance
      color: theme === 'dark' ? 0x002244 : 0x0066cc,
      transparent: true,
      opacity: 0.9,
      wireframe: false
    });
    
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    scene.add(cube);
    
    // Create wireframe on top of the cube
    const wireframeGeometry = new THREE.EdgesGeometry(cubeGeometry);
    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: 0x00bfff,
      transparent: true,
      opacity: 0.7
    });
    
    const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
    cube.add(wireframe);
    
    // Create floating particles around the cube (reduced count)
    const particleCount = 20; // Reduced from 50
    
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = cubeSize * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      particlePositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i3 + 2] = radius * Math.cos(phi);
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x00bfff,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    });
    
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);
    
    // Mouse interaction with throttling
    let mouseX = 0;
    let mouseY = 0;
    
    let lastMouseMoveTime = 0;
    const handleMouseMove = (e: MouseEvent) => {
      // Throttle mouse events
      const now = Date.now();
      if (now - lastMouseMoveTime < 50) return; // Only process every 50ms
      lastMouseMoveTime = now;
      
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      
      if (
        e.clientX >= rect.left && 
        e.clientX <= rect.right && 
        e.clientY >= rect.top && 
        e.clientY <= rect.bottom
      ) {
        mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * -2;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Handle window resize with debouncing
    let resizeTimeout: number;
    const handleResize = () => {
      if (!containerRef.current) return;
      
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      }, 250);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation with frame limiting
    let lastFrameTime = 0;
    const targetFPS = 30; // Cap at 30 FPS
    const frameInterval = 1000 / targetFPS;
    
    const animate = (currentTime: number) => {
      const animationId = requestAnimationFrame(animate);
      
      // Frame limiting
      const elapsed = currentTime - lastFrameTime;
      if (elapsed < frameInterval) return;
      
      lastFrameTime = currentTime - (elapsed % frameInterval);
      
      // Rotate cube (slower rotation)
      cube.rotation.x += 0.003;
      cube.rotation.y += 0.005;
      
      // Have cube respond to mouse position - less responsive for better performance
      cube.rotation.x += (mouseY * 0.05 - cube.rotation.x) * 0.01;
      cube.rotation.y += (mouseX * 0.05 - cube.rotation.y) * 0.01;
      
      // Rotate particle system - less frequently
      if (Math.random() < 0.5) {
        particleSystem.rotation.x += 0.001;
        particleSystem.rotation.y += 0.002;
      }
      
      // Point light orbiting - less frequent updates
      if (Math.random() < 0.3) {
        const time = Date.now() * 0.0005;
        pointLight.position.x = Math.sin(time * 0.7) * 3;
        pointLight.position.y = Math.cos(time * 0.5) * 3;
        pointLight.position.z = Math.cos(time * 0.3) * 3;
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
      
      // Clean up THREE.js resources
      cube.geometry.dispose();
      (cube.material as THREE.Material).dispose();
      wireframeGeometry.dispose();
      (wireframeMaterial as THREE.Material).dispose();
      particleGeometry.dispose();
      (particleMaterial as THREE.Material).dispose();
      
      scene.remove(cube);
      scene.remove(particleSystem);
      
      renderer.dispose();
      
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [theme]);
  
  return (
    <div 
      ref={containerRef} 
      className="w-full h-64 relative" 
    />
  );
};

export default FloatingCube;
