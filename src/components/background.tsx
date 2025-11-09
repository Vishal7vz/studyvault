"use client";
import React, { useEffect, useRef } from "react";

function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let raf: number | null = null;
    let cleanup: (() => void) | null = null;
    let mounted = true;

    (async () => {
      try {
        const THREE: any = await import("three");
        if (!mounted || !containerRef.current) return;

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.domElement.style.position = "absolute";
        renderer.domElement.style.inset = "0";
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        renderer.domElement.style.pointerEvents = "none";
        containerRef.current.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
        camera.position.z = 50;

        const geometry = new THREE.SphereGeometry(20, 32, 32);
        const wire = new THREE.WireframeGeometry(geometry);
        const material = new THREE.LineBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.25 });
        const sphere = new THREE.LineSegments(wire, material);
        sphere.position.set(0, 0, -40);
        scene.add(sphere);

        const particles = new THREE.BufferGeometry();
        const count = 300;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
          positions[i * 3] = (Math.random() - 0.5) * 200;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
          positions[i * 3 + 2] = -60 - Math.random() * 60;
        }
        particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        const pMaterial = new THREE.PointsMaterial({ color: 0x475569, size: 1.5, transparent: true, opacity: 0.3 });
        const points = new THREE.Points(particles, pMaterial);
        scene.add(points);

        const onResize = () => {
          if (!containerRef.current) return;
          const w = containerRef.current.clientWidth;
          const h = containerRef.current.clientHeight;
          renderer.setSize(w, h);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        };
        window.addEventListener("resize", onResize);

        const animate = () => {
          sphere.rotation.y += 0.0015;
          sphere.rotation.x += 0.001;
          points.rotation.y -= 0.0005;
          renderer.render(scene, camera);
          raf = requestAnimationFrame(animate);
        };
        animate();

        cleanup = () => {
          if (raf) cancelAnimationFrame(raf);
          window.removeEventListener("resize", onResize);
          renderer.dispose();
          if (renderer.domElement.parentElement) {
            renderer.domElement.parentElement.removeChild(renderer.domElement);
          }
        };
      } catch (e) {
        // three might not be installed yet; fail silently
      }
    })();

    return () => {
      mounted = false;
      if (cleanup) cleanup();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none" />;
}

export default function Background({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-white relative overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "linear-gradient(120deg, #d5c5ff 0%, #a7f3d0 50%, #f0f0f0 100%)",
        }}
      />
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "white",
          backgroundImage: `
            linear-gradient(to right, rgba(71,85,105,0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(71,85,105,0.3) 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, rgba(139,92,246,0.25) 0%, rgba(139,92,246,0.1) 40%, transparent 80%)
          `,
          backgroundSize: "32px 32px, 32px 32px, 100% 100%",
        }}
      />
      <ThreeBackground />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
