// library.ts
export function addElementToPage(selector: string, element: HTMLElement): void {
  const target = document.querySelector(selector);
  if (target) {
    target.appendChild(element);
  } else {
    console.error("目標元素未找到，請確認選擇器是否正確");
  }
}
