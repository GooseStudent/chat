export class Login {
    constructor(onJoin) {
        this.onJoin = onJoin;
        this.element = null;
        this.errorEl = null;
        this.inputEl = null;
        this.buttonEl = null;
        this.render();
    }

    render() {
        this.element = document.createElement('div');
        this.element.className = 'login-screen';

        this.element.innerHTML = `
            <div class="logo">💬</div>
            <h1>Выберите псевдоним</h1>
            <div class="input-group">
                <div class="error" id="login-error"></div>
                <input type="text" id="name-input" placeholder="Введите имя..." maxlength="20" autofocus>
                <button id="join-btn">Продолжить</button>
            </div>
        `;

        this.errorEl = this.element.querySelector('#login-error');
        this.inputEl = this.element.querySelector('#name-input');
        this.buttonEl = this.element.querySelector('#join-btn');

        this.inputEl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleJoin();
        });

        this.buttonEl.addEventListener('click', () => this.handleJoin());

        setTimeout(() => this.inputEl.focus(), 100);
    }

    handleJoin() {
        const name = this.inputEl.value.trim();
        if (!name) {
            this.showError('Введите псевдоним');
            return;
        }
        this.hideError();
        this.onJoin(name);
    }

    showError(message) {
        this.errorEl.textContent = `${message}`;
        this.errorEl.style.display = 'block';
    }

    hideError() {
        this.errorEl.style.display = 'none';
    }

    mount(container) {
        container.append(this.element);
    }

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}