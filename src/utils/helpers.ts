import { FormDataMap, ActionOutput, ActionMethod } from '../types';
import * as path from 'path';

/**
 * Convert object to Map
 */
function objToStrMap(obj: Record<string, string>): Map<string, string> {
    const strMap = new Map<string, string>();
    for (const key of Object.keys(obj)) {
        const value = obj[key];
        if (value !== undefined) {
            strMap.set(key, value);
        }
    }
    return strMap;
}

/**
 * Convert JSON string to Map
 */
export function jsonToMap(jsonStr: string): FormDataMap {
    console.log('Converting JSON to Map:', jsonStr);
    try {
        return objToStrMap(JSON.parse(jsonStr));
    } catch (error) {
        console.error('Failed to parse JSON:', (error as Error).message);
        return new Map();
    }
}

/**
 * Create default forms for InstallOnAir upload
 */
export function createDefaultForms(token: string, userId: string): string {
    return JSON.stringify({
        "_token": token,
        "ajax": 1,
        "user_id": userId || "",
        "submitBtn": ""
    });
}

/**
 * Create file forms map from file path
 */
export function createFileFormsFromPath(filePath: string): FormDataMap {
    const fileExtension = path.extname(filePath).toLowerCase();
    const fieldName = fileExtension === '.apk' ? 'apkfile' : 'ipafile';

    const fileFormsJson = JSON.stringify({
        [fieldName]: filePath
    });

    return jsonToMap(fileFormsJson);
}

/**
 * Create file forms map from file path for LoadlyIO
 */
export function createLoadlyIOFileFormsFromPath(filePath: string): FormDataMap {
    const fileFormsJson = JSON.stringify({
        'file': filePath
    });

    return jsonToMap(fileFormsJson);
}

/**
 * Create output object for action result
 */
export function createOutputObject(method: ActionMethod, url?: string, statusCode?: number, data?: any, message?: string): ActionOutput {
    return {
        method,
        url,
        statusCode,
        data,
        message
    };
}

/**
 * Get file type from path
 */
export function getFileType(filePath: string): 'apk' | 'ipa' | 'unknown' {
    const extension = path.extname(filePath).toLowerCase();
    if (extension === '.apk') return 'apk';
    if (extension === '.ipa') return 'ipa';
    return 'unknown';
}
