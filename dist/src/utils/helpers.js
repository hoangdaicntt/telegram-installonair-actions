"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonToMap = jsonToMap;
exports.createDefaultForms = createDefaultForms;
exports.createFileFormsFromPath = createFileFormsFromPath;
exports.createLoadlyIOFileFormsFromPath = createLoadlyIOFileFormsFromPath;
exports.createOutputObject = createOutputObject;
exports.getFileType = getFileType;
const path = __importStar(require("path"));
/**
 * Convert object to Map
 */
function objToStrMap(obj) {
    const strMap = new Map();
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
function jsonToMap(jsonStr) {
    try {
        return objToStrMap(JSON.parse(jsonStr));
    }
    catch (error) {
        console.error('Failed to parse JSON:', error.message);
        return new Map();
    }
}
/**
 * Create default forms for InstallOnAir upload
 */
function createDefaultForms(token, userId) {
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
function createFileFormsFromPath(filePath) {
    const fileExtension = path.extname(filePath).toLowerCase();
    const fieldName = 'ipafile';
    const fileFormsJson = JSON.stringify({
        [fieldName]: filePath
    });
    return jsonToMap(fileFormsJson);
}
/**
 * Create file forms map from file path for LoadlyIO
 */
function createLoadlyIOFileFormsFromPath(filePath) {
    const fileFormsJson = JSON.stringify({
        'file': filePath
    });
    return jsonToMap(fileFormsJson);
}
/**
 * Create output object for action result
 */
function createOutputObject(method, url, statusCode, data, message) {
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
function getFileType(filePath) {
    const extension = path.extname(filePath).toLowerCase();
    if (extension === '.apk')
        return 'apk';
    if (extension === '.ipa')
        return 'ipa';
    return 'unknown';
}
//# sourceMappingURL=helpers.js.map