export class UserList {
    constructor() {
        this.element = null;
        this.users = [];
        this.render();
    }

    render() {
        this.element = document.createElement('div');
        this.element.className = 'users-bar';
        this.update([]);
    }

    update(users) {
        this.users = users;
        
        let html = `<span class="label">Онлайн (${users.length}):</span>`;
        
        users.forEach(user => {
            const initial = user.name.charAt(0).toUpperCase();
            html += `
                <span class="user-badge">
                    <span class="dot"></span>
                    ${user.name}
                </span>
            `;
        });

        this.element.innerHTML = html;
    }

    getElement() {
        return this.element;
    }
}