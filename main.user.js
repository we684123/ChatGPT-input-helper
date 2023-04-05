// ==UserScript==
// @name         ChatGPT-input-helper
// @name:zh-TW   ChatGPT-input-helper 快速輸入常用咒文
// @namespace    https://github.com/we684123/ChatGPT-input-helper
// @version      0.0.3
// @author       we684123
// @description  Help organize commonly used spells quickly
// @description:zh-TW  幫助快速組織常用咒文
// @license      MIT
// @icon         https://chat.openai.com/favicon.ico
// @match        https://chat.openai.com/chat
// @match        https://chat.openai.com/chat/*
// @match        https://chat.openai.com/chat?*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @run-at       document-end
// ==/UserScript==


// 定義常用咒文
let customize

// 定義初始化咒文
let init_customize = [
    {
        name: '繁體中文初始化', // 按鈕的顯示名稱
        position: 'start', // start = 最前面 , end = 最後面
        autoEnter: true, // 是否自動按下 Enter
        content: [ // 要被放入輸入框的文字
            `以下問答請使用繁體中文，並使用台灣用語。\n`,
        ].join("")
    }, {
        name: '請繼續', // 按鈕的顯示名稱
        position: 'start', // start = 最前面 , end = 最後面
        autoEnter: true, // 是否自動按下 Enter
        content: [ // 要被放入輸入框的文字
            `請繼續`,
        ].join("")
    }, {
        name: '請從""繼續', // 按鈕的顯示名稱
        position: 'start', // start = 最前面 , end = 最後面
        autoEnter: false, // 是否自動按下 Enter
        content: [ // 要被放入輸入框的文字
            `請從""繼續`,
        ].join("")
    }
];

// 定義雜七雜八
const HELPER_MENU_TEST = 'input helper'; // 按鈕文字
const CONTAINER_CLASS = 'helper_textcontainer'; // 按鈕用容器
const MAIN_BUTTON_CLASS = 'main_button'; // 選單按鈕
const SETTING_BUTTON_CLASS = 'setting_button'; // 控制按鈕
const MENU_CLASS = 'main_menu'; // 選單

const NAV_SELECTOR = 'nav.flex.h-full.flex-1.flex-col.space-y-1.p-2'; // 左邊選單的定位(整體)
const NAV_MENU = 'nav > div.overflow-y-auto'; // 左邊選單的定位(上層)
const TEXT_INPUTBOX_POSITION = 'textarea.m-0'; // 輸入框的定位
const SUBMIT_BUTTON_POSITION = 'button.absolute'; // 送出按鈕的定位
const INPUT_EVENT = new Event('input', { bubbles: true }); // 模擬輸入於輸入框的事件


// 準備 function
const insertCustomize = (customize, name) => {
    // customize = 設定的object
    // name = 觸發按鈕的名稱

    console.log('insertCustomize 開始執行');
    const textInputbox = document.querySelector(TEXT_INPUTBOX_POSITION);
    const submitButton = document.querySelector(SUBMIT_BUTTON_POSITION);
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


const buttonStyles = {
    [`.${CONTAINER_CLASS}`]: {
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
    [`.${MAIN_BUTTON_CLASS}`]: {
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
    [`.${SETTING_BUTTON_CLASS}`]: {
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
    [`.${MENU_CLASS}`]: {
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
    [`.${MENU_CLASS} button`]: {
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



const createMenu = (containerNode) => {
    const menu = document.createElement('div');
    menu.id = 'helper_menu';
    menu.classList.add(MENU_CLASS);
    menu.style.display = 'none';
    menu.style.width = `${containerNode.offsetWidth}px`

    customize.forEach(element => {
        const menuItem = createMenuItem(element);
        menu.appendChild(menuItem);
    });

    return menu;
};

const createMenuItem = (element) => {
    const menuItem = document.createElement('button');
    menuItem.innerText = element.name;
    menuItem.id = element.name;
    menuItem.addEventListener('click', (event) => {
        console.log('按鈕資訊：', event.target);
        insertCustomize(customize, event.target.id);
    });

    return menuItem;
};
const addButton = (containerNode, customize, buttonText = 'Click Me') => {
    const createMainButton = () => {
        const mainButton = document.createElement('button');
        mainButton.innerText = buttonText;
        mainButton.classList.add(MAIN_BUTTON_CLASS);
        mainButton.style.width = '85%';
        return mainButton;
    };

    const createSettingButton = () => {
        const settingButton = document.createElement('button');
        settingButton.innerText = '⚙️';
        settingButton.classList.add(MAIN_BUTTON_CLASS);
        settingButton.style.width = '15%';
        settingButton.id = 'settingButton';
        return settingButton;
    };

    const createButtonContainer = () => {
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add(CONTAINER_CLASS);

        const mainButton = createMainButton();
        const settingButton = createSettingButton()

        buttonContainer.appendChild(settingButton);
        buttonContainer.appendChild(mainButton);
        return buttonContainer;
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
function showPopup() {
    // 找到 settingButton 元素
    const settingButton = document.getElementById('settingButton');

    // 當點擊 settingButton 時觸發事件
    settingButton.addEventListener('click', () => {
        // 創建彈出視窗
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.background = '#525467';
        popup.style.border = '1px solid black';
        popup.style.padding = '30px';
        popup.style.width = '80%';
        popup.style.maxWidth = '800px';
        popup.style.height = '60%';
        popup.style.maxHeight = '1200px';

        popup.style.zIndex = '9999';

        // 創建新增按鈕
        const addButton = document.createElement('button');
        addButton.textContent = '新增(add)';
        addButton.style.margin = '10px';
        addButton.style.border = '2px solid #ffffff';
        addButton.addEventListener('click', () => {
            // 新增一個 item
            const newItem = {
                name: '',
                position: '',
                content: ''
            };
            customize.push(newItem);
            renderTable();
        });
        popup.appendChild(addButton);

        // 創建編輯按鈕
        const editButton = document.createElement('button');
        editButton.textContent = '編輯(edit)';
        editButton.style.margin = '10px';
        editButton.style.border = '2px solid #ffffff';
        editButton.addEventListener('click', () => {
            // 編輯一個 item
            const index = prompt('請輸入要編輯的編號(edit index)');
            if (index && index >= 1 && index <= customize.length) {
                const item = customize[index - 1];

                // 編輯 name
                const newName = prompt('請輸入新的 name', item.name);
                if (newName !== null) {
                    item.name = newName;
                }

                // 編輯 position
                do {
                    newPosition = prompt('請輸入新的 position (只能輸入 start 或 end)', item.position);
                } while (newPosition !== null && newPosition !== 'start' && newPosition !== 'end');
                if (newPosition !== null) {
                    item.position = newPosition;
                }

                // 編輯 position
                do {
                    newAutoEnter = prompt('請輸入新的 AutoEnter (只能輸入 y 或 n)', item.autoEnter);
                } while (newAutoEnter !== null && newAutoEnter !== 'y' && newAutoEnter !== 'n');
                if (newAutoEnter !== null) {
                    if (newAutoEnter === 'y') {
                        item.autoEnter = true;
                    } else {
                        item.autoEnter = false;
                    }
                }

                // 編輯 content
                // const textarea = document.createElement('textarea');
                // textarea.value = item.content;
                // textarea.style.width = '100%';
                // textarea.style.height = '100px';
                const newContent = prompt('請輸入新的 content', item.content);
                if (newContent !== null) {
                    item.content = newContent;
                }

                // 重新渲染表格
                renderTable();
            } else {
                alert('輸入的編號不合法');
            }
        });
        popup.appendChild(editButton);

        // 創建刪除按鈕
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '刪除(delete)';
        deleteButton.style.margin = '10px';
        deleteButton.style.border = '2px solid #ffffff';
        deleteButton.addEventListener('click', () => {
            // 刪除一個 item
            const index = prompt('請輸入要刪除的編號(delete index)');
            if (index && index >= 1 && index <= customize.length) {
                customize.splice(index - 1, 1);
                renderTable();
            } else {
                alert('輸入的編號不合法 (invalid index)');
            }
        });
        popup.appendChild(deleteButton);

        // 創建關閉按鈕
        const closeButton = document.createElement('button');
        closeButton.textContent = '儲存並離開(save&exit)';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '5px';
        closeButton.style.right = '5px';
        closeButton.addEventListener('click', () => {
            console.log(customize);
            // 儲存修改後的 customize 資料
            GM_setValue('customizeData', customize);

            // // 重寫一次 helper_menu
            // const helper_menu = document.getElementById('helper_menu');
            // const menu = createMenu(helper_menu);
            // helper_menu.replaceWith(menu);

            // 上面的做不出來
            // 所以只好重新整理頁面
            location.reload();

            document.body.removeChild(popup);
        });
        popup.appendChild(closeButton);

        // 創建表格
        const table = document.createElement('table');
        popup.appendChild(table);

        // 創建表頭
        const thead = document.createElement('thead');
        const tr = document.createElement('tr');
        const th1 = document.createElement('th');
        const th2 = document.createElement('th');
        const th3 = document.createElement('th');
        const th4 = document.createElement('th');
        const th5 = document.createElement('th');
        th1.textContent = '編號(index)';
        th2.textContent = '名稱(name)';
        th3.textContent = '位置(position)';
        th4.textContent = '自動輸入(autoEnter)？';
        th5.textContent = '內容(content)';
        tr.appendChild(th1);
        tr.appendChild(th2);
        tr.appendChild(th3);
        tr.appendChild(th4);
        tr.appendChild(th5);
        thead.appendChild(tr);
        table.appendChild(thead);

        // 創建表身
        const tbody = document.createElement('tbody');
        table.appendChild(tbody);

        // 渲染表格
        function renderTable() {
            // 先清空表格內容
            tbody.innerHTML = '';

            // 重新渲染表格
            customize.forEach((item, index) => {
                const tr = document.createElement('tr');
                const td1 = document.createElement('td');
                const td2 = document.createElement('td');
                const td3 = document.createElement('td');
                const td4 = document.createElement('td');
                const td5 = document.createElement('td');
                td1.textContent = index + 1;
                td2.textContent = item.name;
                td3.textContent = item.position;
                td4.textContent = item.autoEnter;
                td5.textContent = item.content;
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);
                tr.appendChild(td5);
                tbody.appendChild(tr);
            });
        }

        // 渲染初始表格
        renderTable();

        // 點擊彈窗外的地方關閉彈窗
        popup.addEventListener('click', (event) => {
            if (event.target === popup) {
                document.body.removeChild(popup);
            }
        });

        // 將彈出視窗加入頁面中
        document.body.appendChild(popup);
    });
}


// // 失敗的監控(((
// // 現在只能用 setInterval + setTimeout 去添加按鈕
// const observeElementChanges = (trigger, selector, callback) => {
//     const triggerNode = document.querySelector(trigger);
//     const aimsNode = document.querySelector(selector);

//     if (!triggerNode) {
//         console.warn(`目標元素 ${selector} 不存在，無法監控`);
//         return;
//     }

//     const observer = new MutationObserver((mutationsList) => {
//         for (const mutation of mutationsList) {
//             if (mutation.type === 'childList') {
//                 callback(mutation, aimsNode);
//             }
//         }
//     });
//     console.log(`目標元素 ${selector} 存在，監控中`);
//     observer.observe(triggerNode, { childList: true });
// };

const main = () => {
    const container = document.getElementById('helper_menu');
    let GM_customize = GM_getValue('customizeData', customize); // 讀取 customize 數據
    if (GM_customize) {
        customize = GM_customize;
    } else {
        customize = init_customize;
        GM_setValue('customizeData', customize);
    }

    //找不到就新增
    if (!container) {
        const aimsNode = document.querySelector(NAV_MENU);
        // 新增一個容器
        const container = document.createElement('div');
        container.classList.add(CONTAINER_CLASS);
        container.id = 'helper_menu';
        container.style.width = `${aimsNode.offsetWidth}px`; // 設定 container 寬度為父元素寬度

        // 將容器元素插入到目標元素後面
        aimsNode.parentNode.insertBefore(container, aimsNode.nextSibling);

        // 新增一個按鈕元素
        addButton(container, customize, HELPER_MENU_TEST);

        showPopup()
    }
};

const checkUrl = () => {
    if (window.location.href !== checkUrl.currentUrl) {
        console.log(`網址變更為 ${window.location.href}`);
        checkUrl.currentUrl = window.location.href;
        setTimeout(main, 100);
    }
};

(() => {
    // 妥協的結果，用 setInterval + setTimeout 去添加按鈕
    // 之後一定要改好！！！
    checkUrl.currentUrl = window.location.href;
    setInterval(checkUrl, 1000);
    setTimeout(main, 2000);
    // GM_deleteValue('customizeData');
})();
