import * as core from '@actions/core';
import * as dotenv from 'dotenv';
import {ActionMethod} from "../types";

// Load .env file when running locally
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

export class ActionConfig {
    public readonly method: string | ActionMethod;
    public readonly filePath: string;
    public readonly messageTitle: string;
    public readonly telegramToken: string;
    public readonly telegramUid: string;
    public readonly installonairUserId: string;
    public readonly loadlyIoToken: string;

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

    private getInput(name: string): string {
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
        } catch {
            return '';
        }
    }

    public validate(): string[] {
        const errors: string[] = [];

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

    public hasValidTelegramConfig(): boolean {
        return !!(this.telegramToken && this.telegramUid);
    }

    public getInstallOnAirUrl(): string {
        return 'https://fupload.installonair.com/ipafile';
    }

    public getLoadlyIOUrl(): string {
        return 'https://api.loadly.io/upload';
    }
}
