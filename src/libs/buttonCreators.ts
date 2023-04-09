import { Customization } from "../types/index";
import styles from "./buttonStyles.module.css";
import { insertCustomize } from "./insertCustomize";

// 創建主按鈕
export const createMainButton = (buttonText: string): HTMLButtonElement => {
    const mainButton = document.createElement("button");
    mainButton.innerText = buttonText;
    mainButton.classList.add(styles.mainButton);
    mainButton.style.width = "86%";
    return mainButton;
};

// 創建設定按鈕
export const createSettingButton = (): HTMLButtonElement => {
    const settingButton = document.createElement("button");
    settingButton.innerText = "⚙️";
    settingButton.classList.add(styles.settingButton);
    settingButton.style.width = "14%";
    settingButton.id = "settingButton";
    return settingButton;
};



// 創建選項
const createMenuItem = (element: any, customize: Customization[]) => {
    const menuItem = document.createElement("button");
    menuItem.innerText = element.name;
    menuItem.id = element.name;
    menuItem.classList.add(styles.menuButton);
    menuItem.addEventListener("click", (event) => {
        insertCustomize(customize, (event.target as HTMLElement).id);
    });

    return menuItem;
};

// 創建選單(包含多個選項)
export const createMenu = (containerNode: any, customize: Customization[]) => {
    const menu = document.createElement("div");
    menu.id = "helper_menu";
    menu.classList.add(styles.menu);
    menu.style.display = "none";
    menu.style.width = `${containerNode.offsetWidth}px`;

    customize.forEach((element: any) => {
        const menuItem = createMenuItem(element, customize);
        menu.appendChild(menuItem);
    });

    return menu;
};
