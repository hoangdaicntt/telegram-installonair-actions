import { LoadlyIOUploadResult, FileFormDataMap } from '../types';
import { UploadService } from './uploadService';
export declare class LoadlyIOService {
    private readonly baseUrl;
    uploadFile(fileForms: FileFormDataMap, uploadService: UploadService, apiKey: string): Promise<LoadlyIOUploadResult>;
    formatSuccessMessage(data: any): string;
    getImageUrl(data: any): string;
}
//# sourceMappingURL=loadlyIOService.d.ts.map