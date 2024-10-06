import React from "react";
import assistantIcon from "../public/icon/MagicIcon.svg"; 

interface AiButtonProps {
  onClick: () => void; 
  onMouseDown?: () => void; 
}

const AiButton: React.FC<AiButtonProps> = ({ onClick, onMouseDown }) => (
  <div
    className="absolute right-0 bottom-0 cursor-pointer text-white p-1 rounded inline-flex items-center"
    onClick={onClick}
    aria-label="AI Assistant"
    onMouseDown={onMouseDown}
  >
    <img src={assistantIcon} alt="AI Assistant Icon" className="w-[32px] h-[32px]" />
  </div>
);

export default AiButton;

