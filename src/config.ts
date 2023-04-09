// library.ts
export const config = {
  name: "aims-helper",

  init_customize: [
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

  dx_common_css_url: "https://cdn3.devexpress.com/jslib/22.2.5/css/dx.light.css",
}
