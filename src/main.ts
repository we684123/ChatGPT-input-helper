// main.ts
import { addElementToPage } from "./library";
import "./style.css";

const customElement = document.createElement("div");
customElement.className = "custom-element";
customElement.innerText = "這是新增的自訂元素";

// 加入元素到指定位置
addElementToPage(
  "nav > div.overflow-y-auto",
  customElement
);
