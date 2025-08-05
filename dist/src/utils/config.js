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
exports.ActionConfig = void 0;
const core = __importStar(require("@actions/core"));
const dotenv = __importStar(require("dotenv"));
// Load .env file when running locally
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}
class ActionConfig {
    constructor() {
        // Get values from environment variables (local) or GitHub Actions inputs
        this.method = this.getInput('method') || 'installonair-build';
        this.filePath = this.getInput('filePath') || '';
        this.messageTitle = this.getInput('messageTitle') || 'App Build';
        this.telegramToken = this.getInput('telegramToken') || '';
        this.telegramUid = this.getInput('telegramUid') || '';
        this.installonairUserId = this.getInput('installonairUserId') || '74613';
        this.loadlyIoToken = this.getInput('loadlyIoToken') || '';
    }
    getInput(name) {
        // Try to get from environment variables first (for local testing)
        // Convert camelCase to UPPER_SNAKE_CASE for environment variables
        const envName = name.toUpperCase();
        const envValue = process.env[envName];
        if (envValue) {
            return envValue;
        }
        // Fallback to GitHub Actions core.getInput
        try {
            return core.getInput(name);
        }
        catch {
            return '';
        }
    }
    validate() {
        const errors = [];
        if (!this.method) {
            errors.push('method is required');
        }
        if (!['send-only', 'installonair-build', 'loadlyio-build', 'all'].includes(this.method)) {
            errors.push('method must be one of: send-only, installonair-build, loadlyio-build, all');
        }
        if (!this.filePath) {
            errors.push('filePath is required');
        }
        if (this.method === 'send-only' && !this.hasValidTelegramConfig()) {
            errors.push('telegramToken and telegramUid are required for send-only method');
        }
        if ((this.method === 'installonair-build' || this.method === 'all') && !this.installonairUserId) {
            errors.push('installonairUserId is required for installonair-build method');
        }
        if ((this.method === 'loadlyio-build' || this.method === 'all') && !this.loadlyIoToken) {
            errors.push('loadlyIoToken is required for loadlyio-build method');
        }
        return errors;
    }
    hasValidTelegramConfig() {
        return !!(this.telegramToken && this.telegramUid);
    }
    getInstallOnAirUrl() {
        return 'https://fupload.installonair.com/ipafile';
    }
    getLoadlyIOUrl() {
        return 'https://api.loadly.io/upload';
    }
}
exports.ActionConfig = ActionConfig;
//# sourceMappingURL=config.js.map