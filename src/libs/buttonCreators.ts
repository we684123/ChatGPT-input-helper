import { Customization } from "../types/index";
import styles from "./buttonStyles.module.css";
import { insertCustomize } from "./insertCustomize";

// 創造主按鈕
export const createMainButton = (buttonText: string): HTMLButtonElement => {
    const mainButton = document.createElement("button");
    mainButton.innerText = buttonText;
    mainButton.classList.add(styles.mainButton);
    mainButton.style.width = "86%";
    return mainButton;
};

// 創造設定按鈕
export const createSettingButton = (): HTMLButtonElement => {
    const settingButton = document.createElement("button");
    settingButton.innerText = "⚙️";
    settingButton.classList.add(styles.settingButton);
    settingButton.style.width = "14%";
    settingButton.id = "settingButton";
    return settingButton;
};



// 創造選項
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

// 創造選單(包含多個選項)
export const createMenu = (containerNode: any, customize: Customization[]) => {
    // 創造選單
    const menu = document.createElement("div");
    menu.id = "helper_menu";
    menu.classList.add(styles.menu);
    menu.style.display = "none";
    menu.style.width = `${containerNode.offsetWidth}px`;

    // 創造選項
    customize.forEach((element: any) => {
        const menuItem = createMenuItem(element, customize);
        menu.appendChild(menuItem);
    });



    // 設定選單的高度
    const windowHeight: number = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    // const menuHeight: number = menu.offsetHeight;
    const customizeUnitHeight: number = 39;
    const menuMaxHeight: number = windowHeight - customizeUnitHeight * 2;
    const MaxCustomizeLen = Number(menuMaxHeight / customizeUnitHeight);
    let customizeLen = customize.length > MaxCustomizeLen ? MaxCustomizeLen : customize.length;


    console.log(`customize.length = ${customize.length}`);
    console.log(`CutomizeLen = ${customizeLen}`);
    console.log(`menuMaxHeight = ${menuMaxHeight}`);
    if (customizeLen > 2) {
        let offset: number = (customizeLen - 2) * customizeUnitHeight
        menu.style.top = `-${offset}px`;
        console.log(`offset = ${offset}`);
    }

    // 設定選單最大高度
    menu.style.maxHeight = `${menuMaxHeight}px`;

    return menu;
};

