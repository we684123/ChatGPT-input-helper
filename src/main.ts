import sentinel from "./utils/sentinel";
import { onloadSafe } from "./utils/utils";
import "./style.css";

main();

function main() {
  // 頁面載入完成後執行
  onloadSafe(() => {
    // 監聽 nav 元素
    console.log("=====監聽 nav 元素=====");

    sentinel.on("nav", (nav: any) => {
      console.log("===== sentinel.on nav 1111=====");
      console.log("nav", nav);
      console.log("nav11111");
    });
    sentinel.on("nav", (nav: any) => {
      console.log("===== sentinel.on nav 2222=====");
      console.log("nav", nav);
      console.log("nav22222");
    });
  });
}
