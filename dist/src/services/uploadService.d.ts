import { AxiosResponse } from 'axios';
import { FormDataMap, FileFormDataMap } from '../types';
export declare class UploadService {
    private readonly maxContentLength;
    upload(url: string, forms: FormDataMap, fileForms: FileFormDataMap): Promise<AxiosResponse>;
    private buildForm;
    private getFormHeaders;
}
//# sourceMappingURL=uploadService.d.ts.map