import React from "react";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  type = "button",
  onClick,
  disabled = false,
  children,
  variant = "primary",
  className = "",
}) => {
  const baseClasses = "px-4 py-2 rounded-md font-medium transition-colors";
  const variantClasses = {
    primary: "bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-blue-300 dark:disabled:bg-blue-800",
    secondary:
      "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-500 disabled:bg-gray-200 dark:disabled:bg-gray-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
