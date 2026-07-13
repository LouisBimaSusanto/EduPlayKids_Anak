"use client";

import { useAudio } from "@/hooks/useAudio";
import { cn } from "@/lib/utils";

export function BouncyButton({ 
  children, 
  onClick, 
  variant = "primary", 
  size = "lg",
  className,
  sound = "bloop",
  ...props 
}) {
  const { playSound } = useAudio();

  const handleInteraction = (e) => {
    playSound(sound);
    if (onClick) onClick(e);
  };

  // The base styles apply the top highlight (inset shadow) and the drop shadow.
  // When active (pressed), the inset shadow shrinks and the drop shadow reduces, mimicking the button being pushed in.
  const baseStyles = "relative font-bold transition-all duration-100 ease-out select-none text-center inline-flex items-center justify-center shadow-[inset_0px_6px_0px_rgba(255,255,255,0.4),_0px_12px_20px_rgba(0,0,0,0.15)] active:shadow-[inset_0px_2px_0px_rgba(255,255,255,0.4),_0px_4px_10px_rgba(0,0,0,0.15)]";
  
  const sizeStyles = {
    lg: "px-8 py-6 text-2xl rounded-[2rem]",
    md: "px-6 py-4 text-xl rounded-3xl",
    icon: "p-4 rounded-full",
  };

  // We use extreme border-bottom thickness (12px) to create the 3D 'side' of the button.
  // When pressed (active), the border shrinks to 4px and the button translates down by 8px to fill the space.
  const variants = {
    primary: "bg-primary text-[#6B4D00] border-b-[12px] border-[#CC9300] active:border-b-[4px] active:translate-y-[8px]",
    secondary: "bg-secondary text-[#004D66] border-b-[12px] border-[#0096B8] active:border-b-[4px] active:translate-y-[8px]",
    success: "bg-success text-[#004D33] border-b-[12px] border-[#00A36E] active:border-b-[4px] active:translate-y-[8px]",
    error: "bg-error text-white border-b-[12px] border-[#CC484C] active:border-b-[4px] active:translate-y-[8px]",
    outline: "bg-white text-gray-700 border-[3px] border-gray-200 border-b-[12px] border-b-gray-300 active:border-b-[4px] active:translate-y-[8px]",
  };

  return (
    <button
      className={cn(baseStyles, sizeStyles[size], variants[variant], className)}
      onPointerDown={handleInteraction}
      {...props}
    >
      {children}
    </button>
  );
}
