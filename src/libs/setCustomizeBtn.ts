import { dxPopup, dxPopupOptions } from 'devextreme/ui/popup';
import { dxDataGrid } from 'devextreme/ui/data_grid';

export function setCustomizeBtn(customize: any) {
    const settingButton = document.getElementById("settingButton") as HTMLElement;
    settingButton.addEventListener("click", () => {
        // 創建彈出窗口
        const popupOptions: dxPopupOptions = {
            visible: true,
            width: "80%",
            height: "60%",
            showTitle: false,
            onContentReady: function (e) {
                // 創建按鈕
                const buttons = document.createElement("div");
                buttons.style.display = "flex";
                buttons.style.justifyContent = "space-between";
                buttons.style.padding = "10px";

                const addButton = document.createElement("button");
                addButton.textContent = "新增(add)";
                addButton.addEventListener("click", () => {
                    // 新增一個 item
                    // ...
                });
                buttons.appendChild(addButton);

                // 添加其他按鈕: editButton, deleteButton, closeButton

                e.component.content().append(buttons);

                // 創建表格
                const table = document.createElement("div");
                e.component.content().append(table);

                new dxDataGrid(table, {
                    dataSource: customize,
                    columns: [
                        { dataField: "name", caption: "名稱(name)" },
                        { dataField: "position", caption: "位置(position)" },
                        { dataField: "autoEnter", caption: "自動輸入(autoEnter)？", dataType: "boolean" },
                        { dataField: "content", caption: "內容(content)" }
                    ]
                });
            }
        };
        const popup = new dxPopup(document.createElement('div'), popupOptions).instance;

        // 將彈出窗口附加到文檔主體
        document.body.appendChild(popup.element());
    });

}
