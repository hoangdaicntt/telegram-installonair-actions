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
        const response = await uploadService.upload(url, forms, fileForms);
        return {
            success: response.status === 200,
            statusCode: response.status,
            data: response.data
        };
    }

    formatSuccessMessage(data: any): string {
        return `
Install: ${data?.data?.link || ''}
AppName: ${data?.data?.appName || ''}
ExpiryDate: ${data?.data?.expiryDate || ''}`;
    }

    getImageUrl(data: any): string {
        return data?.data?.image || '';
    }
}
