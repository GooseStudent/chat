export class Message {
    constructor(data, currentUserId) {
        this.data = data;
        this.currentUserId = currentUserId;
        this.element = null;
        this.render();
    }

    render() {
        const isMine = this.data.user.id === this.currentUserId;
        
        this.element = document.createElement('div');
        this.element.className = `message ${isMine ? 'message-mine' : 'message-other'}`;

        let html = '';

        if (!isMine) {
            html += `<div class="sender">${this.escapeHtml(this.data.user.name)}</div>`;
        }

        html += `<div class="text">${this.escapeHtml(this.data.message)}</div>`;

        const time = this.data.time || new Date().toLocaleTimeString();
        html += `<div class="time">${time}</div>`;

        this.element.innerHTML = html;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    getElement() {
        return this.element;
    }
}