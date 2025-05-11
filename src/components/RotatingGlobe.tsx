
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from './ThemeProvider';

const RotatingGlobe = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(1); // Force 1x pixel ratio for performance
    containerRef.current.appendChild(renderer.domElement);
    
    // Camera setup
    camera.position.z = 4;
    
    // Lighting - simplified
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(theme === 'dark' ? 0x0095ff : 0x007ACC, 0.8);
    pointLight.position.set(5, 3, 5);
    scene.add(pointLight);
    
    // Create the globe - reduced geometry complexity
    const globeRadius = 1.5;
    const globeGeometry = new THREE.SphereGeometry(globeRadius, 32, 32); // Reduced segments
    
    // Material with glow
    const globeMaterial = new THREE.MeshPhongMaterial({
      color: theme === 'dark' ? 0x222730 : 0xf0f4f8,
      emissive: theme === 'dark' ? 0x0a1929 : 0xe1eeff,
      transparent: true,
      opacity: 0.9,
      shininess: 50
    });
    
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);
    
    // Create grid lines - fewer segments
    const gridLines = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.SphereGeometry(globeRadius * 1.001, 24, 12)),
      new THREE.LineBasicMaterial({ 
        color: theme === 'dark' ? 0x0066cc : 0x007ACC,
        transparent: true,
        opacity: 0.3
      })
    );
    scene.add(gridLines);
    
    // Add fewer hotspots
    const hotspotCount = 6; // Reduced from 12
    const hotspots: THREE.Mesh[] = [];
    
    for (let i = 0; i < hotspotCount; i++) {
      // Create a small sphere
      const hotspotGeometry = new THREE.SphereGeometry(0.03, 8, 8); // Reduced complexity
      const hotspotMaterial = new THREE.MeshBasicMaterial({
        color: 0x00bfff,
        transparent: true,
        opacity: 0.8
      });
      
      const hotspot = new THREE.Mesh(hotspotGeometry, hotspotMaterial);
      
      // Position on the globe surface
      const phi = Math.acos(-1 + (2 * i) / hotspotCount);
      const theta = Math.sqrt(hotspotCount * Math.PI) * phi;
      
      hotspot.position.x = globeRadius * Math.cos(theta) * Math.sin(phi);
      hotspot.position.y = globeRadius * Math.sin(theta) * Math.sin(phi);
      hotspot.position.z = globeRadius * Math.cos(phi);
      
      // Add to scene and track
      scene.add(hotspot);
      hotspots.push(hotspot);
      
      // Store animation settings
      (hotspot as any).pulseRate = 0.5 + Math.random() * 0.5;
      (hotspot as any).phase = Math.random() * Math.PI * 2;
    }
    
    // Fewer connection lines
    const connectionLines: THREE.Line[] = [];
    
    for (let i = 0; i < 4; i++) { // Reduced from 8
      const start = hotspots[i];
      const end = hotspots[(i + 1) % hotspotCount];
      
      const points = [];
      points.push(start.position.clone());
      points.push(end.position.clone());
      
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0x00bfff,
        transparent: true,
        opacity: 0.4
      });
      
      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);
      connectionLines.push(line);
    }
    
    // Mouse interaction - with performance optimizations
    let isDragging = false;
    let previousMousePosition = {
      x: 0,
      y: 0
    };
    let rotationVelocity = {
      x: 0.001, // Reduced from 0.002
      y: 0.0005  // Reduced from 0.001
    };
    
    const handleMouseDown = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      
      if (
        e.clientX >= rect.left && 
        e.clientX <= rect.right && 
        e.clientY >= rect.top && 
        e.clientY <= rect.bottom
      ) {
        isDragging = true;
        previousMousePosition = {
          x: e.clientX,
          y: e.clientY
        };
      }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y
      };
      
      rotationVelocity = {
        x: 0,
        y: 0
      };
      
      globe.rotation.y += deltaMove.x * 0.005;
      globe.rotation.x += deltaMove.y * 0.005;
      gridLines.rotation.y = globe.rotation.y;
      gridLines.rotation.x = globe.rotation.x;
      
      previousMousePosition = {
        x: e.clientX,
        y: e.clientY
      };
    };
    
    const handleMouseUp = () => {
      isDragging = false;
      rotationVelocity = {
        x: 0.001, // Reduced
        y: 0.0005  // Reduced
      };
    };
    
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Handle window resize - with debouncing
    let resizeTimeout: number;
    const handleResize = () => {
      if (!containerRef.current) return;
      
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      }, 250); // Debounce resize events
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation with frame limiting
    let lastFrameTime = 0;
    const targetFPS = 30; // Limit to 30 FPS
    const frameInterval = 1000 / targetFPS;
    
    const animate = (currentTime: number) => {
      const animationId = requestAnimationFrame(animate);
      
      // Limit framerate
      const elapsed = currentTime - lastFrameTime;
      if (elapsed < frameInterval) return;
      
      lastFrameTime = currentTime - (elapsed % frameInterval);
      
      if (!isDragging) {
        globe.rotation.y += rotationVelocity.y;
        globe.rotation.x += rotationVelocity.x;
        gridLines.rotation.y = globe.rotation.y;
        gridLines.rotation.x = globe.rotation.x;
      }
      
      // Update hotspots less frequently
      if (Math.random() < 0.5) { // Only update ~50% of frames
        hotspots.forEach((hotspot) => {
          // Match globe rotation
          hotspot.position.applyEuler(new THREE.Euler(0, rotationVelocity.y, 0));
          
          // Animate pulsing hotspots - simpler calculation
          const scale = 1 + 0.3 * Math.sin(Date.now() * 0.001 * (hotspot as any).pulseRate);
          hotspot.scale.set(scale, scale, scale);
        });
      }
      
      // Update connection lines to follow hotspots - less frequently
      if (Math.random() < 0.3) { // Only update ~30% of frames
        connectionLines.forEach((line, index) => {
          const positions = (line.geometry.attributes.position as THREE.BufferAttribute).array;
          const startIndex = index;
          const endIndex = (index + 1) % hotspotCount;
          
          positions[0] = hotspots[startIndex].position.x;
          positions[1] = hotspots[startIndex].position.y;
          positions[2] = hotspots[startIndex].position.z;
          
          positions[3] = hotspots[endIndex].position.x;
          positions[4] = hotspots[endIndex].position.y;
          positions[5] = hotspots[endIndex].position.z;
          
          (line.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
        });
      }
      
      renderer.render(scene, camera);
    };
    
    animate(0);
    
    // Cleanup function
    return () => {
      cancelAnimationFrame((animate as any).animationId);
      
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      
      // Clean up THREE.js resources
      globe.geometry.dispose();
      (globe.material as THREE.Material).dispose();
      
      gridLines.geometry.dispose();
      (gridLines.material as THREE.Material).dispose();
      
      hotspots.forEach(hotspot => {
        hotspot.geometry.dispose();
        (hotspot.material as THREE.Material).dispose();
      });
      
      connectionLines.forEach(line => {
        line.geometry.dispose();
        (line.material as THREE.Material).dispose();
      });
      
      scene.remove(globe);
      scene.remove(gridLines);
      hotspots.forEach(hotspot => scene.remove(hotspot));
      connectionLines.forEach(line => scene.remove(line));
      
      renderer.dispose();
      
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [theme]);
  
  return (
    <div 
      ref={containerRef} 
      className="w-full h-64 sm:h-80 md:h-80 lg:h-80 xl:h-96 relative" 
    />
  );
};

export default RotatingGlobe;
