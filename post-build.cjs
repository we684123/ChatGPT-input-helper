const fs = require('fs');
const path = require('path');

const tampermonkeyHeader = fs.readFileSync('./src/config/config.tampermonkeyHeader', 'utf8');
const outputPath = path.resolve(__dirname, 'dist', 'ChatGPT_input_helper.user.js');

fs.readFile(outputPath, 'utf8', async (err, data) => {
  if (err) {
    console.error('讀取檔案失敗:', err);
    return;
  }

  const modifiedContent = tampermonkeyHeader + "\n\n" + data;
  fs.writeFile(outputPath, modifiedContent, 'utf8', async (writeErr) => {
    if (writeErr) {
      console.error('寫入檔案失敗:', writeErr);
    } else {
      console.log('油猴標頭已成功新增至 bundle.js');

      // 使用動態導入導入clipboardy模塊
      const { default: clipboardy } = await import('clipboardy');

      // 將程式碼寫入剪貼簿
      clipboardy.writeSync(modifiedContent);
      console.log('程式碼已成功寫入剪貼簿');
    }
  });
});
