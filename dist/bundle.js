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

  // 原程式碼：https://github.com/muicss/sentineljs
  // 改成 TypeScript 版本
  // 然後套用 [chatgpt-exporter](https://github.com/pionxzh/chatgpt-exporter) 的修改
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

  var css_248z = "/* style.css */\n.custom-element {\n  border: 1px solid #ccc;\n  padding: 10px;\n  background-color: #f9f9f9;\n  border-radius: 4px;\n  font-size: 14px;\n  color: #333;\n}\n";
  styleInject(css_248z);

  main();
  function main() {
      // 頁面載入完成後執行
      onloadSafe(() => {
          // 監聽 nav 元素
          console.log("=====監聽 nav 元素=====");
          sentinel.on("nav", (nav) => {
              console.log("===== sentinel.on nav 1111=====");
              console.log("nav", nav);
              console.log("nav11111");
          });
          sentinel.on("nav", (nav) => {
              console.log("===== sentinel.on nav 2222=====");
              console.log("nav", nav);
              console.log("nav22222");
          });
      });
  }

}));
