export const getOrCreateElementById = (
  {id, innerText, elementTypeArg}:
  {id: string, innerText?: string, elementTypeArg?: string}
): HTMLElement => {
    let element = document.getElementById(id);
    if (!element) {
      const elementType = elementTypeArg || "div";
      element = document.createElement(elementType);
      element.id = id
    }
    if (innerText !== undefined) {
      element.innerText = innerText;
    }
    return element;
};

export const getOrCreateButton = (
  { id, textContent, onclick, disabled }:
  {
    id: string,
    textContent?: string,
    onclick?: () => void,
    parentDiv?: HTMLElement,
    disabled?: boolean,
  }
): HTMLButtonElement => {
  const newButton = getOrCreateElementById({id, elementTypeArg: "button"}) as HTMLButtonElement;
  if (textContent) {
    newButton.textContent = textContent;
  }
  if (onclick) {
    newButton.onclick = onclick;
  }

  newButton.disabled = !!disabled;

  return newButton;
};

export const roundValue = (value: number, sigFigs: number = 2): number => {
  const multiplier = 10**sigFigs;
  return Math.round(value * multiplier) / multiplier;
}
