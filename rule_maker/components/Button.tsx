import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "font-display tracking-wide transition-all duration-100 active:translate-y-1 active:shadow-none border-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0 shadow-[4px_4px_0px_rgba(0,0,0,0.5)]";
  
  const variants = {
    primary: "bg-slate-800 text-white border-slate-900 hover:bg-slate-700",
    secondary: "bg-[#f3f0e6] text-black border-[#2a2a2a] hover:bg-white",
    danger: "bg-[#8b0000] text-[#ffcccc] border-[#4a0000] hover:bg-[#a00000]",
    gold: "bg-[#d4af37] text-black border-[#8a6e0d] hover:bg-[#ebd375]"
  };

  const sizes = {
    sm: "px-3 py-1 text-xs",
    md: "px-6 py-2 text-sm",
    lg: "px-8 py-3 text-xl"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};