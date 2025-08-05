"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstallOnAirService = void 0;
const axios_1 = __importDefault(require("axios"));
const hd_html_parser_1 = __importDefault(require("hd-html-parser"));
class InstallOnAirService {
    constructor() {
        this.baseUrl = 'https://www.installonair.com/';
    }
    async getToken() {
        try {
            const response = await axios_1.default.get(this.baseUrl);
            const html = response.data;
            const dom = await (0, hd_html_parser_1.default)(html);
            const token = dom?.querySelector?.('input[name="_token"]')?.getAttribute?.('value');
            return token || '';
        }
        catch (error) {
            console.error('Failed to get InstallOnAir token:', error.message);
            return '';
        }
    }
    async uploadFile(url, forms, fileForms, uploadService) {
        const response = await uploadService.upload(url, forms, fileForms);
        return {
            success: response.status === 200,
            statusCode: response.status,
            data: response.data
        };
    }
    formatSuccessMessage(data) {
        return `
Install: ${data?.data?.link || ''}
AppName: ${data?.data?.appName || ''}
ExpiryDate: ${data?.data?.expiryDate || ''}`;
    }
    getImageUrl(data) {
        return data?.data?.image || '';
    }
}
exports.InstallOnAirService = InstallOnAirService;
//# sourceMappingURL=installOnAirService.js.map