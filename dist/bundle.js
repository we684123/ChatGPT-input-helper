// ==UserScript==
// @name         ChatGPT-input-helper2
// @name:zh-TW   ChatGPT-input-helper2 快速輸入常用咒文
// @namespace    https://github.com/we684123/ChatGPT-input-helper2
// @version      0.0.4
// @author       we684123
// @description  Help organize commonly used spells quickly
// @description:zh-TW  幫助快速組織常用咒文
// @license      MIT
// @icon         https://chat.openai.com/favicon.ico
// @match        https://chat.openai.com/chat
// @match        https://chat.openai.com/chat/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @run-at       document-end
// ==/UserScript==

(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
})((function () { 'use strict';

  const sentinel = (() => {
      const isArray = Array.isArray;
      let selectorToAnimationMap = {};
      let animationCallbacks = {};
      let styleEl;
      let styleSheet;
      let cssRules;
      return {
          // `on` 方法用於添加 CSS 選擇器的監聽器。
          // cssSelectors: 一個字符串或字符串數組，包含要監聽的 CSS 選擇器。
          // callback: 用於處理觸發的事件的回調函數。
          on: function (cssSelectors, callback) {
              // 如果沒有提供回調函數，則直接返回。
              if (!callback)
                  return;
              // 如果 `styleEl` 未定義，創建一個新的 `style` 標籤並將其添加到文檔的 `head` 中。
              // 還會為 `animationstart` 事件添加事件監聽器。
              if (!styleEl) {
                  const doc = document;
                  const head = doc.head;
                  doc.addEventListener("animationstart", function (ev) {
                      const callbacks = animationCallbacks[ev.animationName];
                      if (!callbacks)
                          return;
                      ev.stopImmediatePropagation();
                      for (const cb of callbacks) {
                          cb(ev.target);
                      }
                  }, true);
                  styleEl = doc.createElement("style");
                  // head.insertBefore(styleEl, head.firstChild); // 這個是原版的，改用下面的
                  head.append(styleEl); // 感謝 chatgpt-exporter 搞好久 (┬┬﹏┬┬)
                  styleSheet = styleEl.sheet;
                  cssRules = styleSheet.cssRules;
              }
              // 根據提供的選擇器創建一個新的動畫。
              const selectors = isArray(cssSelectors) ? cssSelectors : [cssSelectors];
              selectors.forEach((selector) => {
                  // 獲取或創建動畫 ID。
                  let animIds = selectorToAnimationMap[selector];
                  if (!animIds) {
                      const isCustomName = selector[0] == "!";
                      const animId = isCustomName
                          ? selector.slice(1)
                          : "sentinel-" + Math.random().toString(16).slice(2);
                      // 創建新的 keyframes 規則。
                      const keyframeRule = cssRules[styleSheet.insertRule("@keyframes " +
                          animId +
                          "{from{transform:none;}to{transform:none;}}", cssRules.length)];
                      keyframeRule._id = selector;
                      // 如果選擇器不是自定義名稱，則為其創建對應的CSS 規則。
                      if (!isCustomName) {
                          const selectorRule = cssRules[styleSheet.insertRule(selector + "{animation-duration:0.0001s;animation-name:" + animId + ";}", cssRules.length)];
                          selectorRule._id = selector;
                      }
                      animIds = [animId];
                      selectorToAnimationMap[selector] = animIds;
                  }
                  // 遍歷動畫 ID，將回調函數添加到動畫回調列表中。
                  animIds.forEach((animId) => {
                      animationCallbacks[animId] = animationCallbacks[animId] || [];
                      animationCallbacks[animId].push(callback);
                  });
              });
          },
          // `off` 方法用於移除 CSS 選擇器的監聽器。
          // cssSelectors: 一個字符串或字符串數組，包含要停止監聽的 CSS 選擇器。
          // callback: 可選的回調函數。如果提供，則僅移除與之匹配的監聽器。
          off: function (cssSelectors, callback) {
              // 將提供的選擇器轉換為數組形式。
              const selectors = isArray(cssSelectors) ? cssSelectors : [cssSelectors];
              // 遍歷選擇器，移除對應的監聽器。
              selectors.forEach((selector) => {
                  const animIds = selectorToAnimationMap[selector];
                  if (!animIds)
                      return;
                  animIds.forEach((animId) => {
                      const callbacks = animationCallbacks[animId];
                      if (!callbacks)
                          return;
                      // 如果提供了回調函數，則僅移除與之匹配的監聽器。
                      if (callback) {
                          const index = callbacks.indexOf(callback);
                          if (index !== -1) {
                              callbacks.splice(index, 1);
                          }
                      }
                      else {
                          delete animationCallbacks[animId];
                      }
                      // 如果該選擇器沒有任何回調函數，則從選擇器映射和 CSS 規則中移除它。
                      if (callbacks.length === 0) {
                          delete selectorToAnimationMap[selector];
                          const rulesToDelete = [];
                          for (let i = 0, len = cssRules.length; i < len; i++) {
                              const rule = cssRules[i];
                              if (rule._id === selector) {
                                  rulesToDelete.push(rule);
                              }
                          }
                          rulesToDelete.forEach((rule) => {
                              const index = Array.prototype.indexOf.call(cssRules, rule);
                              if (index !== -1) {
                                  styleSheet.deleteRule(index);
                              }
                          });
                      }
                  });
              });
          }
      };
  })();

  function onloadSafe(fn) {
      if (document.readyState === "complete") {
          fn();
      }
      else {
          window.addEventListener("load", fn);
      }
  }

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css_248z$1 = ".buttonStyles-module_container__l-r9Y{align-items:center;border:1px solid #fff;border-radius:5px;box-sizing:border-box;display:flex;justify-content:center;position:relative;width:100%}.buttonStyles-module_mainButton__b08pW{border:1px solid #fff;border-radius:5px;margin:0 auto;width:85%}.buttonStyles-module_mainButton__b08pW,.buttonStyles-module_settingButton__-opQi{background-color:#525252;box-sizing:border-box;color:#fff;cursor:pointer;font-size:14px;padding:8px 12px}.buttonStyles-module_settingButton__-opQi{border:none;border-radius:5px;width:15%}.buttonStyles-module_menu__aeYDY{background-color:#2b2c2f;border:1px solid #fff;border-radius:15px;display:none;left:100%;position:absolute;top:0;width:100%;z-index:1}.buttonStyles-module_menu__aeYDY button{background-color:#2b2c2f;border:1px solid #fff;border-radius:5px;color:#fff;cursor:pointer;display:block;font-size:14px;height:100%;padding:8px 12px;width:100%}";
  styleInject(css_248z$1);

  // library.ts
  const config = {
      name: "aims-helper",
      init_customize: [
          {
              name: '繁體中文初始化',
              position: 'start',
              autoEnter: true,
              content: [
                  `以下問答請使用繁體中文，並使用台灣用語。\n`,
              ].join("")
          }, {
              name: '請繼續',
              position: 'start',
              autoEnter: true,
              content: [
                  `請繼續`,
              ].join("")
          }, {
              name: '請從""繼續',
              position: 'start',
              autoEnter: false,
              content: [
                  `請從""繼續`,
              ].join("")
          }
      ],
      // ↓ 左邊選單的定位(上層)
      NAV_MENU: 'nav > div.overflow-y-auto',
      // ↓ 輸入框的定位
      TEXT_INPUTBOX_POSITION: 'textarea.m-0',
      // ↓ 送出按鈕的定位
      SUBMIT_BUTTON_POSITION: 'button.absolute',
      // ↓ 選單按鈕
      MAIN_BUTTON_CLASS: 'main_button',
      // ↓ 控制按鈕
      SETTING_BUTTON_CLASS: 'setting_button',
      // ↓ 選單
      MENU_CLASS: 'main_menu',
      // ↓ 按鈕文字
      HELPER_MENU_TEXT: 'input helper',
      // ↓ 按鈕用容器
      CONTAINER_CLASS: 'helper_textcontainer',
      // ↓ 模擬輸入於輸入框的事件
      INPUT_EVENT: new Event('input', { bubbles: true }),
  };

  const createMainButton = (buttonText) => {
      const mainButton = document.createElement("button");
      mainButton.innerText = buttonText;
      mainButton.classList.add(config.MAIN_BUTTON_CLASS);
      mainButton.style.width = "85%";
      return mainButton;
  };
  const createSettingButton = () => {
      const settingButton = document.createElement("button");
      settingButton.innerText = "⚙️";
      settingButton.classList.add(config.MAIN_BUTTON_CLASS);
      settingButton.style.width = "15%";
      settingButton.id = "settingButton";
      return settingButton;
  };
  const createButtonContainer = (mainButton, settingButton) => {
      const buttonContainer = document.createElement("div");
      buttonContainer.classList.add(config.CONTAINER_CLASS);
      buttonContainer.appendChild(settingButton);
      buttonContainer.appendChild(mainButton);
      return buttonContainer;
  };
  const insertCustomize = (customize, name) => {
      // customize = 設定的object
      // name = 觸發按鈕的名稱
      console.log('insertCustomize 開始執行');
      const textInputbox = document.querySelector(config.TEXT_INPUTBOX_POSITION);
      const submitButton = document.querySelector(config.SUBMIT_BUTTON_POSITION);
      const item = customize.find((i) => i.name === name);
      if (item) {
          console.log(`已找到名稱為 ${name} 的元素`);
          // start = 最前面 , end = 最後面
          // 有想要出游標定位，之後再說
          // 例如 `請從 "" 繼續輸出` 就希望定在 "" 之間
          if (item.position === 'start') {
              textInputbox.value = item.content + textInputbox.value;
          }
          else {
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
      }
      else {
          console.error(`找不到名稱為 ${name} 的元素`);
      }
  };
  const createMenuItem = (element, customize) => {
      const menuItem = document.createElement("button");
      menuItem.innerText = element.name;
      menuItem.id = element.name;
      menuItem.addEventListener("click", (event) => {
          console.log("按鈕資訊：", event.target);
          insertCustomize(customize, event.target.id);
      });
      return menuItem;
  };
  const createMenu = (containerNode, customize) => {
      const menu = document.createElement('div');
      menu.id = 'helper_menu';
      menu.classList.add(config.MENU_CLASS);
      menu.style.display = 'none';
      menu.style.width = `${containerNode.offsetWidth}px`;
      customize.forEach((element) => {
          const menuItem = createMenuItem(element, customize);
          menu.appendChild(menuItem);
      });
      return menu;
  };

  const addMenuBtn = (containerNode, customize, buttonText = "Click Me") => {
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

  function showPopup(customize) {
      // 找到 settingButton 元素
      const settingButton = document.getElementById('settingButton');
      let newPosition;
      let newAutoEnter;
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
              if (index && Number(index) >= 1 && index <= customize.length) {
                  const item = customize[Number(index) - 1];
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
                      newAutoEnter = prompt('請輸入新的 AutoEnter (只能輸入 y 或 n)', item.autoEnter ? 'y' : 'n');
                  } while (newAutoEnter !== null && newAutoEnter !== 'y' && newAutoEnter !== 'n');
                  if (newAutoEnter !== null) {
                      if (newAutoEnter === 'y') {
                          item.autoEnter = true;
                      }
                      else {
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
              }
              else {
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
              if (index && Number(index) >= 1 && index <= customize.length) {
                  customize.splice(Number(index) - 1, 1);
                  renderTable();
              }
              else {
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

  var css_248z = ".custom-element{background-color:#f9f9f9;border:1px solid #ccc;border-radius:4px;color:#333;font-size:14px;padding:10px}";
  styleInject(css_248z);

  main();
  function main() {
      // 頁面載入完成後執行
      onloadSafe(() => {
          // 監聽 nav 元素
          console.log("=====監聽 nav 元素=====");
          // 定義常用咒文
          let customize;
          sentinel.on("nav", (nav) => {
              console.log("===== trigger sentinel.on nav =====");
              const container = document.getElementById("helper_menu");
              let GM_customize = GM_getValue("customizeData", customize); // 讀取 customize 設定
              if (GM_customize) {
                  customize = GM_customize;
              }
              else {
                  customize = config.init_customize;
                  GM_setValue("customizeData", customize);
              }
              //找不到就新增
              if (!container) {
                  // 獲得目標元素
                  const aimsNode = document.querySelector(config.NAV_MENU);
                  // 新增一個容器
                  const container = document.createElement("div");
                  container.classList.add(config.CONTAINER_CLASS);
                  container.id = "helper_menu";
                  if (aimsNode) {
                      // 設定 container 寬度為父元素寬度
                      container.style.width = `${aimsNode.offsetWidth}px`; // 設定 container 寬度為父元素寬度
                      // 將容器元素插入到目標元素後面
                      aimsNode.parentNode?.insertBefore(container, aimsNode.nextSibling);
                      // 新增一個按鈕元素
                      addMenuBtn(container, customize, config.HELPER_MENU_TEXT);
                      showPopup(customize);
                  }
              }
          });
      });
  }

}));
