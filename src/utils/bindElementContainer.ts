export const bindElementContainer = <T extends HTMLElement>(
  elements: T[],
  containerClass?: string
): HTMLDivElement => {
  const container = document.createElement("div");

  if (containerClass) {
    container.classList.add(containerClass);
  }

  elements.forEach((element) => {
    container.appendChild(element);
  });

  return container;
};
