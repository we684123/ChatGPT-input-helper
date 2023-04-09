import { config } from "../config";
import { Customization } from "../types/index";

export const createMainButton = (buttonText: string): HTMLButtonElement => {
    const mainButton = document.createElement("button");
    mainButton.innerText = buttonText;
    mainButton.classList.add(config.MAIN_BUTTON_CLASS);
    mainButton.style.width = "85%";
    return mainButton;
};

export const createSettingButton = (): HTMLButtonElement => {
    const settingButton = document.createElement("button");
    settingButton.innerText = "⚙️";
    settingButton.classList.add(config.MAIN_BUTTON_CLASS);
    settingButton.style.width = "15%";
    settingButton.id = "settingButton";
    return settingButton;
};

export const createButtonContainer = (
    mainButton: HTMLButtonElement,
    settingButton: HTMLButtonElement
): HTMLDivElement => {
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add(config.CONTAINER_CLASS);

    buttonContainer.appendChild(settingButton);
    buttonContainer.appendChild(mainButton);
    return buttonContainer;
};

export const insertCustomize = (customize: any, name: string) => {
    // customize = 設定的object
    // name = 觸發按鈕的名稱

    console.log('insertCustomize 開始執行');
    const textInputbox = document.querySelector(config.TEXT_INPUTBOX_POSITION) as HTMLTextAreaElement;
    const submitButton = document.querySelector(config.SUBMIT_BUTTON_POSITION) as HTMLButtonElement;
    const item = customize.find((i: any) => i.name === name);

    if (item) {
        console.log(`已找到名稱為 ${name} 的元素`);

        // start = 最前面 , end = 最後面
        // 有想要出游標定位，之後再說
        // 例如 `請從 "" 繼續輸出` 就希望定在 "" 之間
        if (item.position === 'start') {
            textInputbox.value = item.content + textInputbox.value;
        } else {
            textInputbox.value += item.content;
        }

        // 模擬，讓對話框可以自動更新高度
        textInputbox.dispatchEvent(config.INPUT_EVENT);
        textInputbox.focus();

        console.log(`textInputbox.value =\n${textInputbox.value}`);

        // 如果需要，自動按下 Enter
        if (item.autoEnter) {
            console.log('autoEnter (O)');
            submitButton.click();
        }

        console.log('====== insertCustomize 結束 ======');
    } else {
        console.error(`找不到名稱為 ${name} 的元素`);
    }
};


const createMenuItem = (element: any, customize: Customization[]) => {
    const menuItem = document.createElement("button");
    menuItem.innerText = element.name;
    menuItem.id = element.name;
    menuItem.addEventListener("click", (event) => {
        console.log("按鈕資訊：", event.target);
        insertCustomize(customize, (event.target as HTMLElement).id);
    });

    return menuItem;
};


export const createMenu = (containerNode: any, customize: Customization[]) => {
    const menu = document.createElement('div');
    menu.id = 'helper_menu';
    menu.classList.add(config.MENU_CLASS);
    menu.style.display = 'none';
    menu.style.width = `${containerNode.offsetWidth}px`

    customize.forEach((element: any) => {
        const menuItem = createMenuItem(element, customize);
        menu.appendChild(menuItem);
    });

    return menu;
};