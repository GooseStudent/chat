import { Message } from './Message.js';
import { UserList } from './UserList.js';

export class Chat {
    constructor(currentUser, onSend, onExit) {
        this.currentUser = currentUser;
        this.onSend = onSend;
        this.onExit = onExit;
        this.messages = [];
        this.element = null;
        this.messagesContainer = null;
        this.inputEl = null;
        this.sendBtn = null;
        this.userList = new UserList();
        this.render();
    }

    render() {
        this.element = document.createElement('div');
        this.element.className = 'chat-screen';

        const header = document.createElement('div');
        header.className = 'chat-header';
        const initial = this.currentUser.name.charAt(0).toUpperCase();
        header.innerHTML = `
            <div class="user-info">
                <div class="avatar">${initial}</div>
                <div>
                    <div class="user-name">${this.currentUser.name}</div>
                </div>
            </div>
            <div>
                <span class="online-count" id="online-count">Онлайн: 0</span>
                <button class="exit-btn" id="exit-btn">Выйти</button>
            </div>
        `;

        this.messagesContainer = document.createElement('div');
        this.messagesContainer.className = 'messages-container';

        const systemMsg = document.createElement('div');
        systemMsg.className = 'system-message';
        systemMsg.textContent = 'Вы вошли в чат!';
        this.messagesContainer.append(systemMsg);

        const inputArea = document.createElement('div');
        inputArea.className = 'input-area';
        inputArea.innerHTML = `
            <input type="text" id="message-input" placeholder="Введите сообщение..." maxlength="500">
            <button id="send-btn">Отправить</button>
        `;

        this.inputEl = inputArea.querySelector('#message-input');
        this.sendBtn = inputArea.querySelector('#send-btn');

        this.element.append(header);
        this.element.append(this.userList.getElement());
        this.element.append(this.messagesContainer);
        this.element.append(inputArea);

        this.inputEl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSend();
        });

        this.sendBtn.addEventListener('click', () => this.handleSend());

        const exitBtn = header.querySelector('#exit-btn');
        exitBtn.addEventListener('click', () => {
            if (confirm('Точно выйти?')) {
                this.onExit();
            }
        });

        setTimeout(() => this.inputEl.focus(), 100);
    }

    handleSend() {
        const text = this.inputEl.value.trim();
        if (!text) return;
        
        this.onSend(text);
        this.inputEl.value = '';
        this.inputEl.focus();
    }

    updateUsers(users) {
        this.userList.update(users);
        const countEl = this.element.querySelector('#online-count');
        if (countEl) {
            countEl.textContent = `Онлайн: ${users.length}`;
        }
    }

    addMessage(data) {
        const msg = new Message(data, this.currentUser.id);
        this.messagesContainer.append(msg.getElement());
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    addSystemMessage(text) {
        const div = document.createElement('div');
        div.className = 'system-message';
        div.textContent = text;
        this.messagesContainer.append(div);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    mount(container) {
        container.append(this.element);
    }

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.remove(this.element);
        }
    }

    focusInput() {
        if (this.inputEl) {
            this.inputEl.focus();
        }
    }
}