import { InstallOnAirUploadResult, FormDataMap, FileFormDataMap } from '../types';
import { UploadService } from './uploadService';
export declare class InstallOnAirService {
    private readonly baseUrl;
    getToken(): Promise<string>;
    uploadFile(url: string, forms: FormDataMap, fileForms: FileFormDataMap, uploadService: UploadService): Promise<InstallOnAirUploadResult>;
    formatSuccessMessage(data: any): string;
    getImageUrl(data: any): string;
}
//# sourceMappingURL=installOnAirService.d.ts.map