import {LoadlyIOUploadResult, FileFormDataMap} from '../types';
import {UploadService} from './uploadService';

export class LoadlyIOService {
    private readonly baseUrl: string = 'https://api.loadly.io/apiv2/app/upload';

    async uploadFile(
        fileForms: FileFormDataMap,
        uploadService: UploadService,
        apiKey: string
    ): Promise<LoadlyIOUploadResult> {
        try {
            // Create forms with API key
            const forms = new Map<string, string>();
            forms.set('_api_key', apiKey);

            const response = await uploadService.upload(this.baseUrl, forms, fileForms);
            return {
                success: true,
                statusCode: response.status,
                data: response.data
            };
        } catch (error: any) {
            console.error('LoadlyIO upload failed:', error.message);
            return {
                success: false,
                statusCode: error.response?.status || 500,
                error: error.message
            };
        }
    }

    formatSuccessMessage(data: any): string {
        // LoadlyIO response structure may vary, adjust based on actual API response
        const appInfo = data || {};
        return `
📱 LoadlyIO Upload Success!
App ID: ${appInfo?.data?.buildIdentifier || 'N/A'}
Download Link: https://i.loadly.io/${appInfo?.data?.buildShortcutUrl || 'N/A'}
Status: ${appInfo.status || 'Uploaded'}`;
    }

    getImageUrl(data: any): string {
        return data?.data?.buildQRCodeURL || '';
    }
}
