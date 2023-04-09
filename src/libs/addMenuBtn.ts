import { Customization } from "../types/index";
import "./buttonStyles.module.css";
import {
    createMainButton,
    createSettingButton,
    createButtonContainer,
    createMenu,
} from "./buttonCreators";

export const addMenuBtn = (
    containerNode: HTMLElement,
    customize: Customization[],
    buttonText = "Click Me"
) => {
    const mainButton = createMainButton(buttonText);
    const settingButton = createSettingButton();
    const assButton = createButtonContainer(mainButton, settingButton);
    const menu = createMenu(containerNode, customize);

    assButton.addEventListener("mouseenter", () => {
        menu.style.display = "block";
    });

    const buttonWrapper = document.createElement("div");
    buttonWrapper.style.width = `${containerNode.offsetWidth}px`;
    buttonWrapper.appendChild(assButton);
    buttonWrapper.appendChild(menu);

    containerNode.appendChild(buttonWrapper);

    buttonWrapper.addEventListener("mouseleave", () => {
        menu.style.display = "none";
    });
    console.log("已新增按鈕");
};
