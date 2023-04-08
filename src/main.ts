import sentinel from "./libs/sentinel";
import { onloadSafe } from "./utils/utils";
import "./style.css";

main();

function main() {
  // 頁面載入完成後執行
  onloadSafe(() => {
    // 監聽 nav 元素
    console.log("=====監聽 nav 元素=====");

    sentinel.on("nav", (nav: any) => {
      console.log("===== sentinel.on nav =====");
      console.log("nav", nav);
      console.log("nav12321312");
    });
  });
}
