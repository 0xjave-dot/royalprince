import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function FloatingFabricCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      return; // Do not render or animate if reduced motion is preferred
    }

    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 500;

    // Setup scene, camera, renderer
    const scene = new THREE.Scene();
    
    // Transparent background
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create particles (200 fabric swatches)
    const particleCount = 200;
    const particles: {
      mesh: THREE.Mesh;
      speedY: number;
      rotSpeedX: number;
      rotSpeedY: number;
      rotSpeedZ: number;
      initialY: number;
      maxY: number;
      fadeHeight: number;
    }[] = [];

    const colors = [
      new THREE.Color('#6B1F2A'), // Burgundy
      new THREE.Color('#C9A84C'), // Gold
    ];

    const geometries = [
      new THREE.PlaneGeometry(0.6, 0.8),
      new THREE.PlaneGeometry(0.8, 0.6),
      new THREE.PlaneGeometry(0.5, 0.5),
    ];

    for (let i = 0; i < particleCount; i++) {
      const geom = geometries[Math.floor(Math.random() * geometries.length)];
      const color = colors[Math.random() > 0.5 ? 0 : 1];
      
      const mat = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.15 + Math.random() * 0.4,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(geom, mat);
      
      // Random coordinates in a 3D box
      mesh.position.x = (Math.random() - 0.5) * 35;
      mesh.position.y = (Math.random() - 0.5) * 30;
      mesh.position.z = (Math.random() - 0.5) * 15;

      // Random initial rotations
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      mesh.rotation.z = Math.random() * Math.PI;

      scene.add(mesh);

      particles.push({
        mesh: mesh,
        speedY: 0.02 + Math.random() * 0.05,
        rotSpeedX: (Math.random() - 0.5) * 0.015,
        rotSpeedY: (Math.random() - 0.5) * 0.015,
        rotSpeedZ: (Math.random() - 0.5) * 0.015,
        initialY: -15,
        maxY: 15,
        fadeHeight: 5, // Y coordinate where it starts fading to 0 opacity
      });
    }

    // Animation flag
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        p.mesh.position.y += p.speedY;
        
        // Gentle rotations
        p.mesh.rotation.x += p.rotSpeedX;
        p.mesh.rotation.y += p.rotSpeedY;
        p.mesh.rotation.z += p.rotSpeedZ;

        // Dynamic fading as it gets higher
        const currentY = p.mesh.position.y;
        const mat = p.mesh.material as THREE.MeshBasicMaterial;

        if (currentY > p.fadeHeight) {
          // Fades linearly as it approaches maxY
          const ratio = Math.max(0, 1 - (currentY - p.fadeHeight) / (p.maxY - p.fadeHeight));
          mat.opacity = ratio * 0.45;
        }

        // Reset if past maximum vertical limit
        if (p.mesh.position.y > p.maxY) {
          p.mesh.position.y = p.initialY;
          p.mesh.position.x = (Math.random() - 0.5) * 35;
          p.mesh.position.z = (Math.random() - 0.5) * 15;
          mat.opacity = 0.15 + Math.random() * 0.4;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle viewport resize
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // Initial check
    handleResize();

    // Cleanups
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      
      // Dispose materials and geometries
      particles.forEach(p => {
        p.mesh.geometry.dispose();
        if (Array.isArray(p.mesh.material)) {
          p.mesh.material.forEach(m => m.dispose());
        } else {
          p.mesh.material.dispose();
        }
      });

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
