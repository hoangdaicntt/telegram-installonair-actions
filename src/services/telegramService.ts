import axios, {AxiosResponse} from 'axios';
import {TelegramConfig} from '../types';

export class TelegramService {
    private readonly token: string;
    private readonly chatId: string;
    private readonly baseUrl: string;

    constructor(token: string, chatId: string) {
        this.token = token;
        this.chatId = chatId;
        this.baseUrl = `https://api.telegram.org/bot${token}`;
    }

    async sendMessage(title: string, message: string, imageUrl: string = ''): Promise<AxiosResponse> {
        const text = this.formatMessage(title, message);

        if (imageUrl) {
            return await this.sendPhoto(text, imageUrl);
        } else {
            return await this.sendTextMessage(text);
        }
    }

    private async sendTextMessage(text: string): Promise<AxiosResponse> {
        return axios.post(`${this.baseUrl}/sendMessage`, {
            parse_mode: 'HTML',
            chat_id: this.chatId,
            text: text
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).catch(reason => reason.response);
    }

    private async sendPhoto(caption: string, photoUrl: string): Promise<AxiosResponse> {
        return axios.post(`${this.baseUrl}/sendPhoto`, {
            chat_id: this.chatId,
            photo: photoUrl,
            caption: caption
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).catch(reason => reason.response);
    }

    private formatMessage(title: string, message: string): string {
        return `Build: ${title}
${message}
Created at: ${new Date().toString()}`.split('  ').join('');
    }
}
