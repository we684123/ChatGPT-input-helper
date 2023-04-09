import { config } from "../config";
import { Customization } from "../types/index";

// 將自定義內容插入到輸入框中
export const insertCustomize = (customize: Customization[], name: string) => {
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