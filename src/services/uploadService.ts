import axios, { AxiosResponse } from 'axios';
import FormData from 'form-data';
import * as fs from 'fs';
import { promisify } from 'util';
import { FormDataMap, FileFormDataMap } from '../types';

export class UploadService {
    private readonly maxContentLength: number = Infinity;

    async upload(url: string, forms: FormDataMap, fileForms: FileFormDataMap): Promise<AxiosResponse> {
        const form = this.buildForm(forms, fileForms);
        const headers = await this.getFormHeaders(form);
        return axios.post(url, form, {
            headers: headers,
            maxContentLength: this.maxContentLength
        }).catch(reason => reason.response);
    }

    private buildForm(forms: FormDataMap, fileForms: FileFormDataMap): FormData {
        const form = new FormData();

        // Add regular form fields
        for (const [key, value] of forms) {
            form.append(key, value);
        }

        // Add file fields
        for (const [key, value] of fileForms) {
            form.append(key, fs.createReadStream(value));
        }
        return form;
    }

    private async getFormHeaders(form: FormData): Promise<Record<string, string | number>> {
        const getLen = promisify(form.getLength).bind(form);
        const len = await getLen();

        return {
            ...form.getHeaders(),
            'Content-Length': len
        };
    }
}
