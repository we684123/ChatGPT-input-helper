// 原程式碼：https://github.com/muicss/sentineljs
// 改成 TypeScript 版本
// 然後套用 [chatgpt-exporter](https://github.com/pionxzh/chatgpt-exporter) 的修改

declare global {
  interface CSSRule {
    _id?: string;
  }
}

const sentinel = (() => {
  const isArray = Array.isArray;

  let selectorToAnimationMap: { [key: string]: string } = {};
  let animationCallbacks: {
    [key: string]: Array<(target: HTMLElement) => void>;
  } = {};
  let styleEl: HTMLStyleElement | undefined;
  let styleSheet: CSSStyleSheet | undefined;
  let cssRules: CSSRuleList | undefined;

  return {
    // `on` 方法用於添加 CSS 選擇器的監聽器。
    // cssSelectors: 一個字符串或字符串數組，包含要監聽的 CSS 選擇器。
    // callback: 用於處理觸發的事件的回調函數。
    on: function (
      cssSelectors: string | string[],
      callback: (target: HTMLElement) => void
    ) {
      // 如果沒有提供回調函數，則直接返回。
      if (!callback) return;

      // 如果 `styleEl` 未定義，創建一個新的 `style` 標籤並將其添加到文檔的 `head` 中。
      // 還會為 `animationstart` 事件添加事件監聽器。
      if (!styleEl) {
        const doc = document;
        const head = doc.head;

        doc.addEventListener(
          "animationstart",
          function (ev: AnimationEvent) {
            const callbacks = animationCallbacks[ev.animationName];

            if (!callbacks) return;

            ev.stopImmediatePropagation();

            for (const cb of callbacks) {
              cb(ev.target as HTMLElement);
            }
          },
          true
        );

        styleEl = doc.createElement("style");
        // head.insertBefore(styleEl, head.firstChild); // 這個是原版的，改用下面的
        head.append(styleEl); // 感謝 chatgpt-exporter 搞好久 (┬┬﹏┬┬)
        styleSheet = styleEl.sheet as CSSStyleSheet;
        cssRules = styleSheet.cssRules;
      }

      // 根據提供的選擇器創建一個新的動畫。
      const selectors = isArray(cssSelectors) ? cssSelectors : [cssSelectors];

      selectors.forEach((selector) => {
        // 獲取或創建動畫 ID。
        let animId = selectorToAnimationMap[selector];

        if (!animId) {
          const isCustomName = selector[0] == "!";

          selectorToAnimationMap[selector] = animId = isCustomName
            ? selector.slice(1)
            : "sentinel-" + Math.random().toString(16).slice(2);

          // 創建新的 keyframes 規則。
          const keyframeRule =
            cssRules![
            styleSheet!.insertRule(
              "@keyframes " +
              animId +
              "{from{transform:none;}to{transform:none;}}",
              cssRules!.length
            )
            ];
          keyframeRule._id = selector;

          // 如果選擇器不是自定義名稱，則為其創建對應的CSS 規則。
          if (!isCustomName) {
            const selectorRule =
              cssRules![
              styleSheet!.insertRule(
                selector +
                "{animation-duration:0.0001s;animation-name:" +
                animId +
                ";}",
                cssRules!.length
              )
              ];
            selectorRule._id = selector;
          }
          selectorToAnimationMap[selector] = animId;
        }

        // 將回調函數添加到動畫回調列表中。
        animationCallbacks[animId] = animationCallbacks[animId] || [];
        animationCallbacks[animId].push(callback);
      });
    },

    // `off` 方法用於移除 CSS 選擇器的監聽器。
    // cssSelectors: 一個字符串或字符串數組，包含要停止監聽的 CSS 選擇器。
    // callback: 可選的回調函數。如果提供，則僅移除與之匹配的監聽器。
    off: function (
      cssSelectors: string | string[],
      callback?: (target: HTMLElement) => void
    ) {
      // 將提供的選擇器轉換為數組形式。
      const selectors = isArray(cssSelectors) ? cssSelectors : [cssSelectors];

      // 遍歷選擇器，移除對應的監聽器。
      selectors.forEach((selector) => {
        const animId = selectorToAnimationMap[selector];
        if (!animId) return;

        const callbacks = animationCallbacks[animId];
        if (!callbacks) return;

        // 如果提供了回調函數，則僅移除與之匹配的監聽器。
        if (callback) {
          const index = callbacks.indexOf(callback);
          if (index !== -1) {
            callbacks.splice(index, 1);
          }
        } else {
          delete animationCallbacks[animId];
        }

        // 如果該選擇器沒有任何回調函數，則從選擇器映射和 CSS 規則中移除它。
        if (callbacks.length === 0) {
          delete selectorToAnimationMap[selector];
          const rulesToDelete: CSSRule[] = [];
          for (let i = 0, len = cssRules!.length; i < len; i++) {
            const rule = cssRules![i];
            if (rule._id === selector) {
              rulesToDelete.push(rule);
            }
          }

          rulesToDelete.forEach((rule) => {
            const index = Array.prototype.indexOf.call(cssRules, rule);
            if (index !== -1) {
              styleSheet!.deleteRule(index);
            }
          });
        }
      });
    }
  };
})();

export default sentinel;