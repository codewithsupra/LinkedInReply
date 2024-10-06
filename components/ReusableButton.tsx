import React from "react";

interface ActionButtonProps {
  label: string;
  icon: string; 
  onClick: () => void; 
  isLoading?: boolean; 
  disabled?: boolean; 
  className?: string; 
}

const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  icon,
  onClick,
  isLoading = false, 
  disabled = false, 
  className = "", 
}) => {
  return (
    <button
      className={`max-w-[190px] max-h-[53px] px-5 py-2 rounded-lg mb-2 inline-flex items-center justify-center ${className}`}
      onClick={onClick}
      disabled={disabled || isLoading} 
      aria-label={label} 
    >
      {isLoading ? (
        "Loading..." 
      ) : (
        <>
          <img src={icon} alt={`${label} Icon`} className="w-6 h-6 mr-2" />
          {label}
        </>
      )}
    </button>
  );
};

export default ActionButton;
