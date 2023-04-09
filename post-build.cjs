const fs = require('fs');
const path = require('path');
const tampermonkeyHeader = fs.readFileSync('./src/config.tampermonkeyHeader', 'utf8');

const outputPath = path.resolve(__dirname, 'dist', 'ChatGPT_input_helper.user.js');

fs.readFile(outputPath, 'utf8', (err, data) => {
  if (err) {
    console.error('讀取檔案失敗:', err);
    return;
  }

  const modifiedContent = tampermonkeyHeader + "\n\n" + data;
  fs.writeFile(outputPath, modifiedContent, 'utf8', (writeErr) => {
    if (writeErr) {
      console.error('寫入檔案失敗:', writeErr);
    } else {
      console.log('油猴標頭已成功新增至 bundle.js');
    }
  });
});
