import React, { useRef, useEffect } from 'react';

interface Ripple {
  x: number;
  y: number;
  radius: number;
  alpha: number;
}

export function WaterBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let ripples: Ripple[] = [];
    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleClick = (e: MouseEvent) => {
      // Spawn a new ripple spreading outwards
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        alpha: 0.8
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Draw fluid cursor glow (representing light bouncing off water)
      const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 400);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.15)'); // Blue-ish water glow
      gradient.addColorStop(0.5, 'rgba(249, 115, 22, 0.05)'); // Subtle orange reflection
      gradient.addColorStop(1, 'rgba(15, 23, 42, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw and update ripples
      for (let i = 0; i < ripples.length; i++) {
        const r = ripples[i];
        
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${r.alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Second inner ripple for depth
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius * 0.7, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(59, 130, 246, ${r.alpha * 0.5})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        r.radius += 4; // Expansion speed
        r.alpha -= 0.015; // Fade speed

        if (r.alpha <= 0) {
          ripples.splice(i, 1);
          i--;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="interactive-water-bg"
    />
  );
}
