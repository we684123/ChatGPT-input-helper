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

  // library.ts
  function addElementToPage(selector, element) {
      var target = document.querySelector(selector);
      if (target) {
          target.appendChild(element);
      }
      else {
          console.error("目標元素未找到，請確認選擇器是否正確");
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

  // main.ts
  var customElement = document.createElement("div");
  customElement.className = "custom-element";
  customElement.innerText = "這是新增的自訂元素";
  // 加入元素到指定位置
  addElementToPage("nav > div.overflow-y-auto", customElement);

}));
