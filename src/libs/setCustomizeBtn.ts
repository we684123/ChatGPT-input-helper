export function setCustomizeBtn(customize: any) {
    // 找到 settingButton 元素
    const settingButton = document.getElementById('settingButton') as HTMLElement;
    let newPosition: any;
    let newAutoEnter: any;
    // 當點擊 settingButton 時觸發事件
    settingButton.addEventListener('click', () => {
        // 創建彈出視窗
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.background = '#525467';
        popup.style.border = '1px solid black';
        popup.style.padding = '30px';
        popup.style.width = '80%';
        popup.style.maxWidth = '800px';
        popup.style.height = '60%';
        popup.style.maxHeight = '1200px';

        popup.style.zIndex = '9999';

        // 創建新增按鈕
        const addButton = document.createElement('button');
        addButton.textContent = '新增(add)';
        addButton.style.margin = '10px';
        addButton.style.border = '2px solid #ffffff';
        addButton.addEventListener('click', () => {
            // 新增一個 item
            const newItem = {
                name: '',
                position: '',
                content: ''
            };
            customize.push(newItem);
            renderTable();
        });
        popup.appendChild(addButton);

        // 創建編輯按鈕
        const editButton = document.createElement('button');
        editButton.textContent = '編輯(edit)';
        editButton.style.margin = '10px';
        editButton.style.border = '2px solid #ffffff';
        editButton.addEventListener('click', () => {
            // 編輯一個 item
            const index = prompt('請輸入要編輯的編號(edit index)') as string;
            if (index && Number(index) >= 1 && index <= customize.length) {
                const item = customize[Number(index) - 1];

                // 編輯 name
                const newName = prompt('請輸入新的 name', item.name);
                if (newName !== null) {
                    item.name = newName;
                }

                // 編輯 position
                do {
                    newPosition = prompt('請輸入新的 position (只能輸入 start 或 end)', item.position) as string;
                } while (newPosition !== null && newPosition !== 'start' && newPosition !== 'end');
                if (newPosition !== null) {
                    item.position = newPosition;
                }

                // 編輯 position
                do {
                    newAutoEnter = prompt('請輸入新的 AutoEnter (只能輸入 y 或 n)', item.autoEnter ? 'y' : 'n');
                } while (newAutoEnter !== null && newAutoEnter !== 'y' && newAutoEnter !== 'n');
                if (newAutoEnter !== null) {
                    if (newAutoEnter === 'y') {
                        item.autoEnter = true;
                    } else {
                        item.autoEnter = false;
                    }
                }

                // 編輯 content
                // const textarea = document.createElement('textarea');
                // textarea.value = item.content;
                // textarea.style.width = '100%';
                // textarea.style.height = '100px';
                const newContent = prompt('請輸入新的 content', item.content);
                if (newContent !== null) {
                    item.content = newContent;
                }

                // 重新渲染表格
                renderTable();
            } else {
                alert('輸入的編號不合法');
            }
        });
        popup.appendChild(editButton);

        // 創建刪除按鈕
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '刪除(delete)';
        deleteButton.style.margin = '10px';
        deleteButton.style.border = '2px solid #ffffff';
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
        closeButton.style.position = 'absolute';
        closeButton.style.top = '5px';
        closeButton.style.right = '5px';
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