import { config } from "../config";


export const addMenuBtn = (containerNode: any, customize: any, buttonText = 'Click Me') => {
    const buttonStyles: any = {
        [`.${config.CONTAINER_CLASS}`]: {
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            border: '1px solid #fff',
            borderRadius: '5px',
            width: '100%',
            boxSizing: 'border-box',
        },
        [`.${config.MAIN_BUTTON_CLASS}`]: {
            padding: '8px 12px',
            fontSize: '14px',
            color: '#fff',
            border: '1px solid #fff',
            backgroundColor: '#525252',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '85%',
            boxSizing: 'border-box',
            margin: '0 auto', // 水平置中
        },
        [`.${config.SETTING_BUTTON_CLASS}`]: {
            padding: '8px 12px',
            fontSize: '14px',
            color: '#fff',
            backgroundColor: '#525252',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '15%',
            boxSizing: 'border-box',
        },
        [`.${config.MENU_CLASS}`]: {
            display: 'none',
            position: 'absolute',
            left: '100%',
            top: 0,
            zIndex: 1,
            width: '100%',
            backgroundColor: '#2b2c2f', // 新增背景色設定
            border: '1px solid #fff', // 新增邊框設定
            borderRadius: '15px', // 新增圓角設定
        },
        [`.${config.MENU_CLASS} button`]: {
            display: 'block',
            width: '100%',
            height: '100%',
            padding: '8px 12px',
            fontSize: '14px',
            color: '#fff',
            backgroundColor: '#2b2c2f',
            border: '1px solid #fff',
            borderRadius: '5px', // 圓角
            cursor: 'pointer',
        },
    };

    const createMainButton = () => {
        const mainButton = document.createElement('button');
        mainButton.innerText = buttonText;
        mainButton.classList.add(config.MAIN_BUTTON_CLASS);
        mainButton.style.width = '85%';
        return mainButton;
    };

    const createSettingButton = () => {
        const settingButton = document.createElement('button');
        settingButton.innerText = '⚙️';
        settingButton.classList.add(config.MAIN_BUTTON_CLASS);
        settingButton.style.width = '15%';
        settingButton.id = 'settingButton';
        return settingButton;
    };

    const createButtonContainer = () => {
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add(config.CONTAINER_CLASS);

        const mainButton = createMainButton();
        const settingButton = createSettingButton()

        buttonContainer.appendChild(settingButton);
        buttonContainer.appendChild(mainButton);
        return buttonContainer;
    };
    const insertCustomize = (customize: any, name: string) => {
        // customize = 設定的object
        // name = 觸發按鈕的名稱

        console.log('insertCustomize 開始執行');
        const textInputbox = document.querySelector(config.TEXT_INPUTBOX_POSITION) as HTMLInputElement;
        const submitButton = document.querySelector(config.SUBMIT_BUTTON_POSITION) as HTMLInputElement;
        const item = customize.find(i => i.name === name);

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
            textInputbox.dispatchEvent(INPUT_EVENT);
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

    const createMenuItem = (element: any) => {
        const menuItem = document.createElement('button');
        menuItem.innerText = element.name;
        menuItem.id = element.name;
        menuItem.addEventListener('click', (event) => {
            console.log('按鈕資訊：', event.target);
            insertCustomize(customize, event.target.id);
        });

        return menuItem;
    };
    const createMenu = (containerNode: any) => {
        const menu = document.createElement('div');
        menu.id = 'helper_menu';
        menu.classList.add(config.MENU_CLASS);
        menu.style.display = 'none';
        menu.style.width = `${containerNode.offsetWidth}px`

        customize.forEach(element: any => {
            const menuItem = createMenuItem(element);
            menu.appendChild(menuItem);
        });

        return menu;
    };


    const style = document.createElement('style');
    style.type = 'text/css';
    let cssText = '';
    for (let selector in buttonStyles) {
        cssText += selector + ' {\n';
        for (let property in buttonStyles[selector]) {
            cssText += `  ${property}: ${buttonStyles[selector][property]};\n`;
        }
        cssText += '}\n';
    }
    style.innerHTML = cssText;

    const assButton = createButtonContainer()
    const menu = createMenu(containerNode);

    // 滑鼠移入按鈕時，顯示選單
    assButton.addEventListener('mouseenter', () => {
        menu.style.display = 'block';
    });

    // 用 buttonWrapper 把 button 跟 menu 包起來，才能達到 hover 效果
    const buttonWrapper = document.createElement('div');
    buttonWrapper.style.width = `${containerNode.offsetWidth}px`;
    buttonWrapper.appendChild(assButton);
    buttonWrapper.appendChild(menu);

    containerNode.appendChild(buttonWrapper);
    containerNode.appendChild(style);

    // 滑鼠移出 buttonWrapper 時，隱藏選單
    buttonWrapper.addEventListener('mouseleave', () => {
        menu.style.display = 'none';
    });
    console.log('已新增按鈕');
};