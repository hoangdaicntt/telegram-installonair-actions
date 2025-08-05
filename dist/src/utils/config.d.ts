import { ActionMethod } from "../types";
export declare class ActionConfig {
    readonly method: string | ActionMethod;
    readonly filePath: string;
    readonly messageTitle: string;
    readonly telegramToken: string;
    readonly telegramUid: string;
    readonly installonairUserId: string;
    readonly loadlyIoToken: string;
    constructor();
    private getInput;
    validate(): string[];
    hasValidTelegramConfig(): boolean;
    getInstallOnAirUrl(): string;
    getLoadlyIOUrl(): string;
}
//# sourceMappingURL=config.d.ts.map