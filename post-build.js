const fs = require('fs');
const path = require('path');

const outputPath = path.resolve(__dirname, 'dist', 'bundle.js');
const tampermonkeyHeader = `// ==UserScript==
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
`;

fs.readFile(outputPath, 'utf8', (err, data) => {
  if (err) {
    console.error('讀取檔案失敗:', err);
    return;
  }

  const modifiedContent = tampermonkeyHeader + data;
  fs.writeFile(outputPath, modifiedContent, 'utf8', (writeErr) => {
    if (writeErr) {
      console.error('寫入檔案失敗:', writeErr);
    } else {
      console.log('油猴標頭已成功新增至 bundle.js');
    }
  });
});
