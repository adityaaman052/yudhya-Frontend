import React from "react";

const Button = ({ children, className, ...props }) => {
  return (
    <button
      className={`px-4 py-2 flex items-center gap-2 text-white rounded-lg transition-all 
        bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 
        ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
