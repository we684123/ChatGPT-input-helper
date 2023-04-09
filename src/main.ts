import sentinel from "./utils/sentinel";
import { onloadSafe } from "./utils/utils";

import { addMenuBtnWrapper } from "./libs/addMenuBtn";
import { setCustomizeBtn } from "./libs/setCustomizeBtn";

import { config } from "./config";
import "./style.css";

main();

function main() {
  // 頁面載入完成後執行
  onloadSafe(() => {
    // 監聽 nav 元素
    console.log("=====監聽 nav 元素=====");

    // 定義常用咒文
    let customize: any;

    sentinel.on("nav", (nav: any) => {
      console.log("===== trigger sentinel.on nav =====");

      // 讀取 customize 設定
      let GM_customize = GM_getValue("customizeData", customize);
      // 如果 user 已經有設定了就用 user 的，沒有就用預設值
      if (GM_customize) {
        customize = GM_customize;
      } else {
        customize = config.init_customize;
        GM_setValue("customizeData", customize);
      }

      //找不到就新增
      const container = document.getElementById("helper_menu");
      if (!container) {
        // 獲得目標元素
        const aimsNode = document.querySelector(config.NAV_MENU) as HTMLElement;
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
          addMenuBtnWrapper(container, customize, config.HELPER_MENU_TEXT);
          // 設定 "設定按鈕"的點擊事件
          setCustomizeBtn(customize);
        }
      }
    });
  });
}
