// rollup.config.js
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';


export default {
    input: 'src/main.ts', // 您的 TypeScript 檔案的路徑
    output: {
        file: 'dist/bundle.js', // 打包後的檔案路徑
        format: 'umd', // 使用通用模組定義 (UMD) 格式，兼容多種環境
        name: 'MyTampermonkeyScript' // 為 UMD 模組指定名稱
    },
    plugins: [
        postcss({
            inject: true, // 將 CSS 注入到 JavaScript bundle 中
            minimize: true, // 最小化 CSS（移除空白和註釋）
        }),
        typescript({
            tsconfig: 'tsconfig.json', // 您的 TypeScript 設定檔案路徑
        }),
    ],
};
