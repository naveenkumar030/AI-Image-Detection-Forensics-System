import React, { useEffect, useRef } from "react";

export default function OrbitalParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle setup
    const particleCount = 45;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.8,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.2,
        baseAlpha: Math.random() * 0.4 + 0.15,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        isOrange: Math.random() > 0.45,
      });
    }

    // Orbital center (soft gravitational point in top right / center)
    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle orbital rings in terracotta and stone
      const centerX = width * 0.75;
      const centerY = height * 0.35;
      angle += 0.0015;

      ctx.save();
      ctx.strokeStyle = "rgba(193, 95, 60, 0.08)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, 300, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = "rgba(177, 173, 161, 0.15)";
      ctx.beginPath();
      ctx.arc(centerX, centerY, 520, 0, Math.PI * 2);
      ctx.stroke();

      // Slow orbital tracer dot
      const orbX = centerX + Math.cos(angle) * 300;
      const orbY = centerY + Math.sin(angle) * 300;
      const grad = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, 12);
      grad.addColorStop(0, "rgba(193, 95, 60, 0.7)");
      grad.addColorStop(1, "rgba(193, 95, 60, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(orbX, orbY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Render floating particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.005;
        const currentAlpha = Math.max(0.1, Math.min(0.8, p.alpha));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (p.isOrange) {
          ctx.fillStyle = `rgba(193, 95, 60, ${currentAlpha * 0.7})`;
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = `rgba(177, 173, 161, ${currentAlpha * 0.6})`;
          ctx.shadowBlur = 0;
        }

        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Subtle ambient terracotta glow spots */}
      <div className="ambient-glow bg-[#c15f3c] w-[500px] h-[500px] -top-40 -left-20 opacity-[0.06]" />
      <div className="ambient-glow bg-[#b1ada1] w-[600px] h-[600px] top-1/3 -right-60 opacity-[0.08]" />
      <div className="ambient-glow bg-[#c15f3c] w-[350px] h-[350px] bottom-10 left-1/3 opacity-[0.04]" />
    </div>
  );
}
