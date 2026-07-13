"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function FirefliesBackground() {
  const [fireflies, setFireflies] = useState([]);

  useEffect(() => {
    // Generate 40 random fireflies
    const flies = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      y: Math.random() * 100, // percentage
      size: Math.random() * 8 + 4, // 4px to 12px
      duration: Math.random() * 10 + 10, // 10s to 20s
      delay: Math.random() * 5,
    }));
    setFireflies(flies);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {fireflies.map((fly) => (
        <motion.div
          key={fly.id}
          initial={{ 
            x: `${fly.x}vw`, 
            y: `${fly.y + 20}vh`, 
            opacity: 0 
          }}
          animate={{
            y: [`${fly.y + 20}vh`, `${fly.y - 20}vh`],
            x: [`${fly.x}vw`, `${fly.x + (Math.random() * 10 - 5)}vw`],
            opacity: [0, 0.8, 1, 0.8, 0],
            scale: [0.5, 1.2, 0.8, 1]
          }}
          transition={{
            duration: fly.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: fly.delay,
          }}
          className="absolute rounded-full bg-[#00E5C8] mix-blend-screen"
          style={{
            width: fly.size,
            height: fly.size,
            boxShadow: `0 0 ${fly.size * 2}px ${fly.size / 2}px rgba(0, 229, 200, 0.8)`
          }}
        />
      ))}
    </div>
  );
}