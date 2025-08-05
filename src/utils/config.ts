import * as core from '@actions/core';
import {ActionMethod} from '../types';

export class ActionConfig {
    public readonly telegramToken: string;
    public readonly telegramUid: string;
    public readonly messageTitle: string;
    public readonly installonairUserId: string;
    public readonly loadlyIoToken: string;
    public readonly filePath: string;
    public readonly method: ActionMethod;

    constructor() {
        this.telegramToken = core.getInput('telegramToken') || '';
        this.telegramUid = core.getInput('telegramUid') || '';
        this.messageTitle = core.getInput('messageTitle') || 'App Build';
        this.installonairUserId = core.getInput('installonairUserId') || '74613';
        this.loadlyIoToken = core.getInput('loadlyIoToken') || '';
        this.filePath = core.getInput('filePath') || '';
        this.method = (core.getInput('method') || 'installonair-build') as ActionMethod;
    }

    validate(): string[] {
        const errors: string[] = [];

        // if (!this.filePath) {
        //     errors.push('filePath is required');
        // }
        //
        // if (!['send-only', 'installonair-build', 'loadlyio-build', 'all'].includes(this.method)) {
        //     errors.push('method must be one of: "send-only", "installonair-build", "loadlyio-build", "all"');
        // }
        //
        // if (this.method === 'send-only' && !this.hasValidTelegramConfig()) {
        //     errors.push('Telegram credentials are required for "send-only" method');
        // }
        //
        // if (['installonair-build', 'loadlyio-build', 'all'].includes(this.method) && !this.telegramToken && !this.telegramUid) {
        //     console.warn('Telegram credentials not provided - notifications will be skipped');
        // }

        return errors;
    }

    hasValidTelegramConfig(): boolean {
        return !!(this.telegramToken && this.telegramUid);
    }

    getInstallOnAirUrl(): string {
        return 'https://fupload.installonair.com/ipafile';
    }

    getLoadlyIOUrl(): string {
        return 'https://api.loadly.io/apiv2/app/upload';
    }
}
