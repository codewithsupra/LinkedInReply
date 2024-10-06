import React, { useState, useCallback, useEffect } from "react";
import ActionButton from "./ReusableButton";
import { fetchAIResponse } from "../tools/aiResponseFetcher";
import generateSymbol from "../public/icon/Generate.svg";
import insertSymbol from "../public/icon/Insert.svg";
import reGenerateSymbol from "../public/icon/Regenerate.svg";

interface AIPopupProps {
  closePopup: () => void; // Function to manage popup closing
}

const AIPopup: React.FC<AIPopupProps> = ({ closePopup }) => {
  const [promptText, setPromptText] = useState<string>(""); 
  const [generatedResponse, setGeneratedResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [topPosition, setTopPosition] = useState<string>("450px"); // Initial position of the modal

  const handleGenerateResponse = useCallback(async () => {
    if (!promptText) return; 
    setLoading(true);
    setErrorMessage("");
    try {
      const result = await fetchAIResponse(promptText); 
      setGeneratedResponse(result); 
      setTopPosition("330px"); // Adjust top position after generating response
    } catch (err: any) {
      console.error("AI response generation failed:", err);
      setErrorMessage("An error occurred while generating the response."); 
    } finally {
      setLoading(false); 
    }
  }, [promptText]);

  // Insert the AI response into the LinkedIn message input
  const handleInsertResponse = () => {
    const textInput = document.querySelector("div.msg-form__contenteditable p");
    const inputWrapper = document.querySelector("div.msg-form__contenteditable");
    const placeholder = document.querySelector("div.msg-form__placeholder");

    if (textInput && inputWrapper && placeholder) {
      textInput.innerHTML = generatedResponse; 
      inputWrapper.setAttribute("aria-label", "");
      placeholder.setAttribute("aria-hidden", "false");
      placeholder.setAttribute("data-placeholder", "");
      placeholder.textContent = "";

      setPromptText("");
      setGeneratedResponse("");
      closePopup();
    } else {
      console.error("Missing elements:", { textInput, inputWrapper, placeholder });
    }
  };

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(""), 3000); 
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={closePopup} 
      role="dialog"
      aria-labelledby="ai-popup"
    >
      <div
        className="absolute w-[500px] overflow-hidden bg-white shadow-lg p-4 gap-4 rounded-xl z-50"
        style={{ top: topPosition, right: "310px" }}  // Dynamically adjust the top position
        onClick={(e) => e.stopPropagation()} 
      >
        <h2 id="ai-popup" className="sr-only">
          AI Response Generator
        </h2>
        {errorMessage && <div className="text-red-600">{errorMessage}</div>}
        
        {generatedResponse && (
          <div className="mt-4">
            <div className="w-full flex justify-end">
              <div className="max-w-[75%] p-2 mb-6 bg-[#dfe1e7] rounded-xl text-[#666d80] text-2xl leading-9">
                {promptText}
              </div>
            </div>
            <div className="max-w-[75%] p-2 bg-blue-100 rounded-xl text-[#666d80] text-2xl leading-9 mb-6">
              {generatedResponse}
            </div>
          </div>
        )}

        <input
          className="w-full max-w-[818px] max-h-[61px] p-3 rounded-lg mb-4 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Your Prompt"
          value={generatedResponse ? "" : promptText} 
          onChange={(e) => setPromptText(e.target.value)} 
          aria-label="User Prompt"
        />

        <div className="flex justify-end gap-4">
          {generatedResponse ? (
            <>
              <ActionButton
                label="Insert"
                icon={insertSymbol}
                onClick={handleInsertResponse} 
                className="custom-button max-w-[129px] bg-white text-[#666d80]"
              />
              <ActionButton
                label="Regenerate"
                icon={reGenerateSymbol}
                onClick={handleGenerateResponse} 
                isLoading={loading}
                className="bg-blue-500 text-white"
              />
            </>
          ) : (
            <ActionButton
              label="Generate"
              icon={generateSymbol}
              onClick={handleGenerateResponse} 
              isLoading={loading}
              disabled={!promptText} 
              className="bg-blue-500 text-white"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AIPopup;
