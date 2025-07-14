import React, { useEffect, useRef } from 'react';

// Particle system for enhanced visual effects
export const ParticleSystem = ({ theme }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = [];

    // Initialize particles
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: theme === 'dark' ? '#60a5fa' : '#2563eb'
      });
    }

    particlesRef.current = particles;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();

        // Draw connections
        particles.forEach(other => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = particle.color + Math.floor((1 - distance / 100) * 0.1 * 255).toString(16).padStart(2, '0');
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.3 }}
    />
  );
};

// Enhanced gradient backgrounds
export const GradientBackground = ({ theme }) => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Primary gradient */}
      <div className={`absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-blue-600 to-purple-600' 
          : 'bg-gradient-to-br from-blue-400 to-indigo-400'
      } animate-pulse`}></div>
      
      {/* Secondary gradient */}
      <div className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-20 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-purple-600 to-pink-600' 
          : 'bg-gradient-to-br from-purple-400 to-pink-400'
      } animate-pulse`} style={{ animationDelay: '2s' }}></div>
      
      {/* Tertiary gradient */}
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full opacity-10 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-green-600 to-teal-600' 
          : 'bg-gradient-to-br from-green-400 to-teal-400'
      } animate-pulse`} style={{ animationDelay: '4s' }}></div>
    </div>
  );
};

// Floating elements for visual interest
export const FloatingElements = ({ theme }) => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Floating shapes */}
      <div className={`absolute top-20 left-20 w-4 h-4 ${
        theme === 'dark' ? 'bg-blue-400' : 'bg-blue-500'
      } rounded-full opacity-30 animate-float`}></div>
      
      <div className={`absolute top-40 right-32 w-3 h-3 ${
        theme === 'dark' ? 'bg-purple-400' : 'bg-purple-500'
      } rounded-full opacity-40 animate-float`} style={{ animationDelay: '1s' }}></div>
      
      <div className={`absolute bottom-32 left-40 w-5 h-5 ${
        theme === 'dark' ? 'bg-indigo-400' : 'bg-indigo-500'
      } rounded-full opacity-20 animate-float`} style={{ animationDelay: '2.5s' }}></div>
      
      <div className={`absolute bottom-20 right-20 w-2 h-2 ${
        theme === 'dark' ? 'bg-teal-400' : 'bg-teal-500'
      } rounded-full opacity-50 animate-float`} style={{ animationDelay: '3.5s' }}></div>
    </div>
  );
};

// Enhanced result display with animations
export const EnhancedResultDisplay = ({ result, theme }) => {
  return (
    <div className={`p-6 rounded-xl transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-blue-900/50 to-purple-900/50 border border-blue-800' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200'
    }`}>
      <h3 className="text-sm font-semibold mb-2 text-center">Time to Reach Goal</h3>
      <div className="text-center">
        <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-1">
          {result.years}y {result.remainingMonths}m
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          ≈ {result.months} months
        </div>
        
        {/* Progress indicator */}
        <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${Math.min((result.months / 360) * 100, 100)}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Progress to 30-year timeline
        </div>
      </div>
    </div>
  );
};

// Enhanced slider component
export const EnhancedSlider = ({ value, onChange, min, max, step, label, color, theme }) => {
  return (
    <div className="control-item">
      <label className="block text-sm font-semibold mb-2 flex justify-between">
        {label}
        <span className={`font-bold ${color}`}>{value}{label.includes('%') ? '%' : ''}</span>
      </label>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
        />
        <div 
          className="absolute top-0 left-0 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg pointer-events-none"
          style={{ width: `${((value - min) / (max - min)) * 100}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{min}{label.includes('%') ? '%' : ''}</span>
        <span>{max}{label.includes('%') ? '%' : ''}</span>
      </div>
    </div>
  );
};