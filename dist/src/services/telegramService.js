"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramService = void 0;
const axios_1 = __importDefault(require("axios"));
class TelegramService {
    constructor(token, chatId) {
        this.token = token;
        this.chatId = chatId;
        this.baseUrl = `https://api.telegram.org/bot${token}`;
    }
    async sendMessage(title, message, imageUrl = '') {
        const text = this.formatMessage(title, message);
        if (imageUrl) {
            return await this.sendPhoto(text, imageUrl);
        }
        else {
            return await this.sendTextMessage(text);
        }
    }
    async sendTextMessage(text) {
        return axios_1.default.post(`${this.baseUrl}/sendMessage`, {
            parse_mode: 'HTML',
            chat_id: this.chatId,
            text: text
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).catch(reason => reason.response);
    }
    async sendPhoto(caption, photoUrl) {
        return axios_1.default.post(`${this.baseUrl}/sendPhoto`, {
            chat_id: this.chatId,
            photo: photoUrl,
            caption: caption
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).catch(reason => reason.response);
    }
    formatMessage(title, message) {
        return `Build: ${title}
${message}
Created at: ${new Date().toString()}`.split('  ').join('');
    }
}
exports.TelegramService = TelegramService;
//# sourceMappingURL=telegramService.js.map