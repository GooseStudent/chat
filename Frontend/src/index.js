import './styles.css';
import { Login } from './js/Login.js';
import { Chat } from './js/Chat.js';

const API_URL = 'https://chat-backend.onrender.com';
const WS_URL = 'wss://chat-backend.onrender.com';

let currentUser = null;
let ws = null;
let chat = null;
let login = null;

const container = document.getElementById('app');

function showLogin() {
    if (login) login.destroy();
    login = new Login((name) => handleJoin(name));
    login.mount(container);
}

async function handleJoin(name) {
    try {
        const response = await fetch(`${API_URL}/new-user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });

        const data = await response.json();

        if (data.status === 'error') {
            login.showError(data.message);
            return;
        }

        currentUser = data.user;
        startChat();

    } catch (error) {
        login.showError('Не удалось подключиться к серверу');
    }
}

function startChat() {
    login.destroy();
    login = null;

    chat = new Chat(
        currentUser,
        (text) => handleSendMessage(text),
        () => handleExit()
    );
    chat.mount(container);

    connectWebSocket();
}

function connectWebSocket() {
    ws = new WebSocket(WS_URL);

    ws.onopen = () => {
        console.log('WebSocket подключен');
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (Array.isArray(data)) {
            chat.updateUsers(data);
            return;
        }

        if (data.type === 'send') {
            chat.addMessage(data);
        }
    };

    ws.onerror = () => {
        chat.addSystemMessage('Ошибка соединения');
    };

    ws.onclose = () => {
        chat.addSystemMessage('Соединение потеряно');
    };
}

function handleSendMessage(text) {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
        chat.addSystemMessage('Нет соединения с сервером');
        return;
    }

    ws.send(JSON.stringify({
        type: 'send',
        message: text,
        user: currentUser,
        time: new Date().toLocaleTimeString()
    }));
}

function handleExit() {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: 'exit',
            user: currentUser
        }));
        ws.close();
    }

    if (chat) {
        chat.destroy();
        chat = null;
    }
    currentUser = null;
    ws = null;

    showLogin();
}

window.addEventListener('beforeunload', () => {
    if (ws && ws.readyState === WebSocket.OPEN && currentUser) {
        ws.send(JSON.stringify({
            type: 'exit',
            user: currentUser
        }));
    }
});

showLogin();