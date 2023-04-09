import { createFormPopup } from './createFormPopup';
import styles from './setCustomizeBtn.module.css';


export function setCustomizeBtn(customize: any) {
    // 找到 settingButton 元素
    const settingButton = document.getElementById('settingButton') as HTMLElement;
    let newPosition: any;
    let newAutoEnter: any;
    // 當點擊 settingButton 時觸發事件
    settingButton.addEventListener('click', () => {
        // 創建彈出視窗
        const popup = document.createElement('div');
        popup.classList.add(styles.popup);

        // 創建新增按鈕
        const addButton = document.createElement('button');
        addButton.textContent = '新增(add)';
        addButton.classList.add(styles['add-button']);
        // 當點擊 addButton 時觸發事件
        addButton.addEventListener('click', () => {
            // 使用 createFormPopup 函數
            createFormPopup({
                title: '新增',
                mode: 'add',
                onSubmit: (values) => {
                    const newItem = {
                        name: values.name,
                        position: values.position,
                        autoEnter: values.autoEnter,
                        content: values.content,
                    };
                    customize.push(newItem);
                    renderTable();
                },
            });
        });
        popup.appendChild(addButton);

        // 創建編輯按鈕
        const editButton = document.createElement('button');
        editButton.textContent = '編輯(edit)';
        editButton.classList.add(styles['edit-button']);
        editButton.addEventListener('click', () => {
            // 編輯一個 item
            const index = prompt('請輸入要編輯的編號(edit index)') as string;
            if (index && Number(index) >= 1 && index <= customize.length) {
                const item = customize[Number(index) - 1];

                createFormPopup({
                    title: '編輯',
                    mode: 'edit',
                    initialValues: {
                        name: item.name,
                        position: item.position,
                        autoEnter: item.autoEnter,
                        content: item.content,
                    },
                    onSubmit: (newValues) => {
                        item.name = newValues.name;
                        item.position = newValues.position;
                        item.autoEnter = newValues.autoEnter;
                        item.content = newValues.content;

                        // 重新渲染表格
                        renderTable();
                    },
                });
            } else {
                alert('輸入的編號不合法');
            }
        });
        popup.appendChild(editButton);

        // 創建刪除按鈕
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '刪除(delete)';
        deleteButton.classList.add(styles['delete-button']);
        deleteButton.addEventListener('click', () => {
            // 刪除一個 item
            const index = prompt('請輸入要刪除的編號(delete index)');
            if (index && Number(index) >= 1 && index <= customize.length) {
                customize.splice(Number(index) - 1, 1);
                renderTable();
            } else {
                alert('輸入的編號不合法 (invalid index)');
            }
        });
        popup.appendChild(deleteButton);

        // 創建關閉按鈕
        const closeButton = document.createElement('button');
        closeButton.textContent = '儲存並離開(save&exit)';
        closeButton.classList.add(styles['close-button']);
        closeButton.addEventListener('click', () => {
            console.log(customize);
            // 儲存修改後的 customize 資料
            GM_setValue('customizeData', customize);

            // // 重寫一次 helper_menu
            // const helper_menu = document.getElementById('helper_menu');
            // const menu = createMenu(helper_menu);
            // helper_menu.replaceWith(menu);

            // 上面的做不出來
            // 所以只好重新整理頁面
            location.reload();

            document.body.removeChild(popup);
        });
        popup.appendChild(closeButton);

        // 創建表格
        const table = document.createElement('table');
        popup.appendChild(table);

        // 創建表頭
        const thead = document.createElement('thead');
        const tr = document.createElement('tr');
        const th1 = document.createElement('th');
        const th2 = document.createElement('th');
        const th3 = document.createElement('th');
        const th4 = document.createElement('th');
        const th5 = document.createElement('th');
        th1.textContent = '編號(index)';
        th2.textContent = '名稱(name)';
        th3.textContent = '位置(position)';
        th4.textContent = '自動輸入(autoEnter)？';
        th5.textContent = '內容(content)';
        tr.appendChild(th1);
        tr.appendChild(th2);
        tr.appendChild(th3);
        tr.appendChild(th4);
        tr.appendChild(th5);
        thead.appendChild(tr);
        table.appendChild(thead);

        // 創建表身
        const tbody = document.createElement('tbody');
        table.appendChild(tbody);

        // 渲染表格
        function renderTable() {
            // 先清空表格內容
            tbody.innerHTML = '';

            // 重新渲染表格
            customize.forEach((item: any, index: any) => {
                const tr = document.createElement('tr');
                const td1 = document.createElement('td');
                const td2 = document.createElement('td');
                const td3 = document.createElement('td');
                const td4 = document.createElement('td');
                const td5 = document.createElement('td');
                td1.textContent = index + 1;
                td2.textContent = item.name;
                td3.textContent = item.position;
                td4.textContent = item.autoEnter;
                td5.textContent = item.content;
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);
                tr.appendChild(td5);
                tbody.appendChild(tr);
            });
        }

        // 渲染初始表格
        renderTable();

        // 點擊彈窗外的地方關閉彈窗
        popup.addEventListener('click', (event) => {
            if (event.target === popup) {
                document.body.removeChild(popup);
            }
        });

        // 將彈出視窗加入頁面中
        document.body.appendChild(popup);
    });
}