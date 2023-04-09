// createFormPopup.ts
import styles from './formPopupStyles.module.css';

export function createFormPopup(title: string, submitCallback: (values: any) => void) {
    // 創建彈出視窗
    const formPopup = document.createElement('div');
    formPopup.className = styles['form-popup'];

    // 創建標題
    const titleLabel = document.createElement('h2');
    titleLabel.textContent = title;
    formPopup.appendChild(titleLabel);

    // 創建表單
    const form = document.createElement('form');
    formPopup.appendChild(form);
    form.className = styles.form;

    // 創建名稱輸入框
    const nameLabel = document.createElement('label');
    nameLabel.textContent = '名稱(name)';
    form.appendChild(nameLabel);
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = styles.input;
    form.appendChild(nameInput);

    // 創建位置選擇
    const positionLabel = document.createElement('label');
    positionLabel.textContent = '位置(position)';
    form.appendChild(positionLabel);
    const positionSelect = document.createElement('select');
    positionSelect.className = styles.input;
    const positionStartOption = document.createElement('option');
    positionStartOption.value = 'start';
    positionStartOption.textContent = 'start';
    const positionEndOption = document.createElement('option');
    positionEndOption.value = 'end';
    positionEndOption.textContent = 'end';
    positionSelect.appendChild(positionStartOption);
    positionSelect.appendChild(positionEndOption);
    form.appendChild(positionSelect);

    // 創建是否自動輸入選擇
    const autoEnterLabel = document.createElement('label');
    autoEnterLabel.textContent = '是否自動輸入(AutoEnter)';
    form.appendChild(autoEnterLabel);
    const autoEnterInput = document.createElement('input');
    autoEnterInput.type = 'checkbox';
    form.appendChild(autoEnterInput);

    // 創建內容輸入框
    const contentLabel = document.createElement('label');
    contentLabel.textContent = '內容(content)';
    form.appendChild(contentLabel);
    const contentTextarea = document.createElement('textarea');
    contentTextarea.className = `${styles.input} ${styles['textarea-input']}`;
    form.appendChild(contentTextarea);

    // 創建提交按鈕
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = '提交';
    form.appendChild(submitButton);

    // 提交表單時的處理
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const values = {
            name: nameInput.value,
            position: positionSelect.value,
            autoEnter: autoEnterInput.checked,
            content: contentTextarea.value,
        };
        console.log('values', values);

        submitCallback(values);
        document.body.removeChild(formPopup);
    });

    // 點擊彈窗外的地方關閉彈窗
    formPopup.addEventListener('click', (event) => {
        if (event.target === formPopup) {
            document.body.removeChild(formPopup);
        }
    });

    // 將彈出視窗加入頁面中
    document.body.appendChild(formPopup);
}