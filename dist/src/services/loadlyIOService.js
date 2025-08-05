"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadlyIOService = void 0;
class LoadlyIOService {
    constructor() {
        this.baseUrl = 'https://api.loadly.io/apiv2/app/upload';
    }
    async uploadFile(fileForms, uploadService, apiKey) {
        try {
            // Create forms with API key
            const forms = new Map();
            forms.set('_api_key', apiKey);
            const response = await uploadService.upload(this.baseUrl, forms, fileForms);
            return {
                success: true,
                statusCode: response.status,
                data: response.data
            };
        }
        catch (error) {
            console.error('LoadlyIO upload failed:', error.message);
            return {
                success: false,
                statusCode: error.response?.status || 500,
                error: error.message
            };
        }
    }
    formatSuccessMessage(data) {
        // LoadlyIO response structure may vary, adjust based on actual API response
        const appInfo = data || {};
        return `
📱 LoadlyIO Upload Success!
App ID: ${appInfo?.data?.buildIdentifier || 'N/A'}
Download Link: https://i.loadly.io/${appInfo?.data?.buildShortcutUrl || 'N/A'}
Status: ${appInfo.status || 'Uploaded'}`;
    }
    getImageUrl(data) {
        return data?.data?.buildQRCodeURL || '';
    }
}
exports.LoadlyIOService = LoadlyIOService;
//# sourceMappingURL=loadlyIOService.js.map