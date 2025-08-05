import { FormDataMap, ActionOutput } from '../types';
/**
 * Convert JSON string to Map
 */
export declare function jsonToMap(jsonStr: string): FormDataMap;
/**
 * Create default forms for InstallOnAir upload
 */
export declare function createDefaultForms(token: string, userId: string): string;
/**
 * Create file forms map from file path
 */
export declare function createFileFormsFromPath(filePath: string): FormDataMap;
/**
 * Create file forms map from file path for LoadlyIO
 */
export declare function createLoadlyIOFileFormsFromPath(filePath: string): FormDataMap;
/**
 * Create output object for action result
 */
export declare function createOutputObject(method: any, url?: string, statusCode?: number, data?: any, message?: string): ActionOutput;
/**
 * Get file type from path
 */
export declare function getFileType(filePath: string): 'apk' | 'ipa' | 'unknown';
//# sourceMappingURL=helpers.d.ts.map