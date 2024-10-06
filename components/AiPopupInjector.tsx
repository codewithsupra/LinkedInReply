import { createRoot, Root } from "react-dom/client";
import AiButton from "./AiIcon";
import AIPopup from "./AIGeneratorPopup";

const addAIButtonToLinkedIn = () => {
  const popupDiv = document.createElement("div");
  const iconDiv = document.createElement("div");
  iconDiv.id = "ai-icon";

  let popupRoot: Root | null = null;
  let iconRoot: Root | null = null;
  let isPopupDisplayed = false;
  let iconClicked = false;

  const appendAiButton = () => {
    const messageField = document.querySelector<HTMLDivElement>(
      "div.msg-form__contenteditable"
    );

    if (messageField && !document.getElementById("ai-icon")) {
      messageField.parentNode?.appendChild(iconDiv);

      if (!iconRoot) {
        iconRoot = createRoot(iconDiv);
        iconRoot.render(
          <AiButton onMouseDown={handleIconMouseDown} onClick={handleIconClick} />
        );
      }

      messageField.addEventListener("focus", showIconOnFocus);
      messageField.addEventListener("blur", hideIconOnBlur);
    }
  };

  const showIconOnFocus = () => {
    iconDiv.style.display = "block";
  };

  const hideIconOnBlur = () => {
    setTimeout(() => {
      if (!isPopupDisplayed && !iconClicked) {
        iconDiv.style.display = "none";
      }
      iconClicked = false; 
    }, 100);
  };

  const handleIconMouseDown = () => {
    iconClicked = true;
  };

  const handleIconClick = () => {
    if (!isPopupDisplayed) {
      isPopupDisplayed = true;
      document.body.appendChild(popupDiv);
      popupRoot = createRoot(popupDiv);

      const managePopupState = () => {
        isPopupDisplayed = false;
        popupRoot?.unmount(); 
        document.body.removeChild(popupDiv); 
        iconDiv.style.display = "block"; 
      };

      popupRoot.render(<AIPopup closePopup={managePopupState} />);
      iconDiv.style.display = "none"; 
    }
  };

  const debouncedAppendAIButton = debounce(appendAiButton, 300);

  const observer = new MutationObserver(debouncedAppendAIButton);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  appendAiButton();

  return () => {
    observer.disconnect();
    popupRoot?.unmount();
    iconRoot?.unmount();
    popupDiv.remove();
    iconDiv.remove();
  };
};

const debounce = (func: () => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(func, delay);
  };
};

export default addAIButtonToLinkedIn;
