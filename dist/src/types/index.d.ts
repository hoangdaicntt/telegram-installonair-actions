export interface TelegramConfig {
    token: string;
    chatId: string;
}
export interface InstallOnAirUploadResult {
    success: boolean;
    statusCode: number;
    data?: any;
    error?: string;
}
export interface LoadlyIOUploadResult {
    success: boolean;
    statusCode: number;
    data?: any;
    error?: string;
}
export interface InstallOnAirAppData {
    link?: string;
    appName?: string;
    expiryDate?: string;
    image?: string;
}
export interface InstallOnAirResponse {
    data?: {
        data?: InstallOnAirAppData;
    };
}
export interface ActionOutput {
    url?: string;
    method: ActionMethod;
    statusCode?: number;
    data?: any;
    message?: string;
}
export type ActionMethod = 'send-only' | 'installonair-build' | 'loadlyio-build' | 'all';
export interface FormDataMap extends Map<string, string> {
}
export interface FileFormDataMap extends Map<string, string> {
}
//# sourceMappingURL=index.d.ts.map