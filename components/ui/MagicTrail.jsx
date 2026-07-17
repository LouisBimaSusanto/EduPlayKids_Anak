"use client";

import { useEffect, useRef } from "react";

export function MagicTrail() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        // Sparkle size
        this.size = Math.random() * 8 + 2;
        // Float upwards and outwards
        this.speedX = Math.random() * 4 - 2;
        this.speedY = Math.random() * -3 - 1;
        // Golden, magical teal, and pink colors
        const colors = [
          "rgba(255, 215, 0, 1)",   // Gold
          "rgba(0, 229, 200, 1)",   // Teal
          "rgba(255, 105, 180, 1)"  // Hot Pink
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.015;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = Math.random() * 0.2 - 0.1;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
        this.size *= 0.95;
        this.rotation += this.rotationSpeed;
      }
      
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.life;
        
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        
        // Draw a star shape
        ctx.fillStyle = this.color;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          ctx.lineTo(Math.cos((18 + i * 72) / 180 * Math.PI) * this.size,
                     -Math.sin((18 + i * 72) / 180 * Math.PI) * this.size);
          ctx.lineTo(Math.cos((54 + i * 72) / 180 * Math.PI) * (this.size / 2),
                     -Math.sin((54 + i * 72) / 180 * Math.PI) * (this.size / 2));
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    const handlePointerMove = (e) => {
      const pointerX = e.clientX || (e.touches && e.touches[0].clientX);
      const pointerY = e.clientY || (e.touches && e.touches[0].clientY);
      
      if (pointerX !== undefined && pointerY !== undefined) {
        const spawnCount = Math.floor(Math.random() * 3) + 3;
        for (let i = 0; i < spawnCount; i++) {
          particles.push(new Particle(pointerX, pointerY));
        }
        if (!animationFrameId) animate();
      }
    };

    const handlePointerDown = (e) => {
      const pointerX = e.clientX || (e.touches && e.touches[0].clientX);
      const pointerY = e.clientY || (e.touches && e.touches[0].clientY);
      
      if (pointerX !== undefined && pointerY !== undefined) {
        // Massive Explosion! 40 particles blasting outward
        for (let i = 0; i < 40; i++) {
          const p = new Particle(pointerX, pointerY);
          // Overwrite speed for explosion burst
          const angle = Math.random() * Math.PI * 2;
          const power = Math.random() * 10 + 5;
          p.speedX = Math.cos(angle) * power;
          p.speedY = Math.sin(angle) * power;
          p.size = Math.random() * 12 + 4; // Bigger stars
          p.decay = Math.random() * 0.03 + 0.02; // Fade slightly faster
          particles.push(p);
        }
        if (!animationFrameId) animate();
      }
    };

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("touchmove", handlePointerMove);
    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("touchstart", handlePointerDown);
    
    // Periodically spawn particles at the active node (simulate it glowing/emitting magic)
    // We'll just let the cursor do the work for now to keep performance high.

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (particles.length === 0) {
        animationFrameId = null;
        return;
      }
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw();
        if (p.life <= 0) particles.splice(i, 1);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("touchstart", handlePointerDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-300" />;
}
