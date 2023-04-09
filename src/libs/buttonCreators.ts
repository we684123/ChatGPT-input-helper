import { config } from "../config";
import { Customization } from "../types/index";

// 創建主按鈕
export const createMainButton = (buttonText: string): HTMLButtonElement => {
    const mainButton = document.createElement("button");
    mainButton.innerText = buttonText;
    mainButton.classList.add(config.MAIN_BUTTON_CLASS);
    mainButton.style.width = "85%";
    return mainButton;
};

// 創建設定按鈕
export const createSettingButton = (): HTMLButtonElement => {
    const settingButton = document.createElement("button");
    settingButton.innerText = "⚙️";
    settingButton.classList.add(config.MAIN_BUTTON_CLASS);
    settingButton.style.width = "15%";
    settingButton.id = "settingButton";
    return settingButton;
};


// 將自定義內容插入到輸入框中
export const insertCustomize = (customize: any, name: string) => {
    const textInputbox = document.querySelector(config.TEXT_INPUTBOX_POSITION) as HTMLTextAreaElement;
    const submitButton = document.querySelector(config.SUBMIT_BUTTON_POSITION) as HTMLButtonElement;
    const item = customize.find((i: any) => i.name === name);

    if (item) {
        if (item.position === 'start') {
            textInputbox.value = item.content + textInputbox.value;
        } else {
            textInputbox.value += item.content;
        }

        textInputbox.dispatchEvent(config.INPUT_EVENT);
        textInputbox.focus();

        if (item.autoEnter) {
            submitButton.click();
        }
    } else {
        console.error(`找不到名稱為 ${name} 的元素`);
    }
};

// 創建選單項目
const createMenuItem = (element: any, customize: Customization[]) => {
    const menuItem = document.createElement("button");
    menuItem.innerText = element.name;
    menuItem.id = element.name;
    menuItem.addEventListener("click", (event) => {
        insertCustomize(customize, (event.target as HTMLElement).id);
    });

    return menuItem;
};

// 創建選單，包含多個選單項目
export const createMenu = (containerNode: any, customize: Customization[]) => {
    const menu = document.createElement("div");
    menu.id = "helper_menu";
    menu.classList.add(config.MENU_CLASS);
    menu.style.display = "none";
    menu.style.width = `${containerNode.offsetWidth}px`;

    customize.forEach((element: any) => {
        const menuItem = createMenuItem(element, customize);
        menu.appendChild(menuItem);
    });

    return menu;
};
