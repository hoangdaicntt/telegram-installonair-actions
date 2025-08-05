import axios from 'axios';
import HDHtmlParser from 'hd-html-parser';
import {InstallOnAirUploadResult, InstallOnAirResponse, FormDataMap, FileFormDataMap} from '../types';
import {UploadService} from './uploadService';

export class InstallOnAirService {
    private readonly baseUrl: string = 'https://www.installonair.com/';

    async getToken(): Promise<string> {
        try {
            const response = await axios.get(this.baseUrl);
            const html: string = response.data;
            const dom = await HDHtmlParser(html);
            const token = dom?.querySelector?.('input[name="_token"]')?.getAttribute?.('value');
            return token || '';
        } catch (error) {
            console.error('Failed to get InstallOnAir token:', (error as Error).message);
            return '';
        }
    }

    async uploadFile(
        url: string,
        forms: FormDataMap,
        fileForms: FileFormDataMap,
        uploadService: UploadService
    ): Promise<InstallOnAirUploadResult> {
        try {
            const response = await uploadService.upload(url, forms, fileForms);
            return {
                success: true,
                statusCode: response.status,
                data: response.data
            };
        } catch (error: any) {
            console.error('Upload failed:', error.message);
            return {
                success: false,
                statusCode: error.response?.status || 500,
                error: error.message
            };
        }
    }

    formatSuccessMessage(data: InstallOnAirResponse): string {
        const appData = data?.data?.data || {};
        return `
Install: ${appData.link || ''}
AppName: ${appData.appName || ''}
ExpiryDate: ${appData.expiryDate || ''}`;
    }

    getImageUrl(data: InstallOnAirResponse): string {
        return data?.data?.data?.image || '';
    }
}
