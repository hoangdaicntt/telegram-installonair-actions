import { AxiosResponse } from 'axios';
export declare class TelegramService {
    private readonly token;
    private readonly chatId;
    private readonly baseUrl;
    constructor(token: string, chatId: string);
    sendMessage(title: string, message: string, imageUrl?: string): Promise<AxiosResponse>;
    private sendTextMessage;
    private sendPhoto;
    private formatMessage;
}
//# sourceMappingURL=telegramService.d.ts.map