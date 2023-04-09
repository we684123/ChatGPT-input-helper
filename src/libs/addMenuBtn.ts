import {
    createMainButton,
    createSettingButton,
    createMenu,
} from "./buttonCreators";
import { bindElementContainer } from "../utils/bindElementContainer";

import { config } from "../config";
import { Customization } from "../types/index";


// addMenuBtn 函數用於新增包含主按鈕和設定按鈕的選單按鈕
export function addMenuBtnWrapper(containerNode: HTMLElement,
    customize: Customization[],
    buttonText = "Click Me" // 主按鈕的文字，預設值為 "Click Me"
) {
    // 創建主按鈕和設定按鈕
    const mainButton = createMainButton(buttonText);
    const settingButton = createSettingButton();

    // 將主按鈕和設定按鈕組合在一個容器中
    const assButton = bindElementContainer([settingButton, mainButton], config.CONTAINER_CLASS);

    // 根據客製化選單項目創建選單
    const menu = createMenu(containerNode, customize);

    // 當滑鼠移到按鈕上時，顯示選單
    assButton.addEventListener("mouseenter", () => {
        menu.style.display = "block";
    });

    // 創建按鈕包裹器，並將組合按鈕和選單加入其中
    const buttonWrapper = document.createElement("div");
    buttonWrapper.style.width = `${containerNode.offsetWidth}px`;
    buttonWrapper.appendChild(assButton);
    buttonWrapper.appendChild(menu);

    // 將按鈕包裹器加入到容器節點中
    containerNode.appendChild(buttonWrapper);

    // 當滑鼠離開按鈕包裹器時，隱藏選單
    buttonWrapper.addEventListener("mouseleave", () => {
        setTimeout(() => {
            menu.style.display = "none";
        }, 300);
    });

    console.log("已新增按鈕");
}
