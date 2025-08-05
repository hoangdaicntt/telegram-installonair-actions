import * as core from '@actions/core';
import * as fs from 'fs';

// Import services
import {TelegramService} from './src/services/telegramService';
import {InstallOnAirService} from './src/services/installOnAirService';
import {LoadlyIOService} from './src/services/loadlyIOService';
import {UploadService} from './src/services/uploadService';

// Import utilities
import {ActionConfig} from './src/utils/config';
import {
    jsonToMap,
    createDefaultForms,
    createOutputObject,
    createFileFormsFromPath,
    createLoadlyIOFileFormsFromPath,
    getFileType
} from './src/utils/helpers';

async function main(): Promise<void> {
    try {
        // Initialize configuration
        const config = new ActionConfig();

        // Validate configuration
        const validationErrors = config.validate();
        if (validationErrors.length > 0) {
            throw new Error(`Configuration errors: ${validationErrors.join(', ')}`);
        }

        // Check if file exists
        if (!fs.existsSync(config.filePath)) {
            throw new Error(`File not found: ${config.filePath}`);
        }

        // Initialize Telegram service if credentials are provided
        let telegramService: TelegramService | null = null;
        if (config.hasValidTelegramConfig()) {
            telegramService = new TelegramService(config.telegramToken, config.telegramUid);
        }

        // Handle different methods
        switch (config.method) {
            case 'send-only':
                await handleSendOnlyMode(config, telegramService!);
                break;
            case 'installonair-build':
                await handleInstallOnAirBuildMode(config, telegramService);
                break;
            case 'loadlyio-build':
                await handleLoadlyIOBuildMode(config, telegramService);
                break;
            case 'all':
                await handleAllMode(config, telegramService);
                break;
            default:
                throw new Error(`Unsupported method: ${config.method}`);
        }

    } catch (error) {
        console.error('Action failed:', error);
        core.setFailed((error as Error).message);
    }
}

async function handleSendOnlyMode(config: ActionConfig, telegramService: TelegramService): Promise<void> {
    const fileType = getFileType(config.filePath);
    const fileName = config.filePath.split('/').pop() || 'Unknown file';

    const message = `📱 Build Ready!
File: ${fileName}
Type: ${fileType.toUpperCase()}
Path: ${config.filePath}
Status: Ready for distribution`;

    await telegramService.sendMessage(config.messageTitle, message);

    const outputObject = createOutputObject(
        config.method,
        undefined,
        200,
        {fileName, fileType, filePath: config.filePath},
        'Telegram notification sent successfully'
    );

    const outputJSON = JSON.stringify(outputObject);
    core.setOutput('output', outputJSON);
    console.log('Send-only mode completed:', JSON.stringify(outputObject, undefined, 2));
}

async function handleInstallOnAirBuildMode(config: ActionConfig, telegramService: TelegramService | null): Promise<void> {
    // Initialize services
    const installOnAirService = new InstallOnAirService();
    const uploadService = new UploadService();

    // Prepare forms data
    const token = await installOnAirService.getToken();
    const forms = createDefaultForms(token, config.installonairUserId);
    const formsMap = jsonToMap(forms);
    const fileFormsMap = createFileFormsFromPath(config.filePath);

    // Upload file to InstallOnAir
    const uploadResult = await installOnAirService.uploadFile(
        config.getInstallOnAirUrl(),
        formsMap,
        fileFormsMap,
        uploadService
    );

    // Create output object
    const outputObject = createOutputObject(
        config.method,
        config.getInstallOnAirUrl(),
        uploadResult.statusCode,
        uploadResult.data
    );

    // Handle result and send notifications
    if (uploadResult.statusCode >= 400) {
        const errorMessage = `❌ Upload Failed!
File: ${config.filePath.split('/').pop()}
Status Code: ${uploadResult.statusCode}
Error: ${uploadResult.error || 'Unknown error'}`;

        core.setFailed(`HTTP request failed with status code: ${uploadResult.statusCode}`);

        if (telegramService) {
            await telegramService.sendMessage(config.messageTitle, errorMessage);
        }

        outputObject.message = 'Upload failed';
    } else {
        const successMessage = installOnAirService.formatSuccessMessage(uploadResult.data);
        const imageUrl = installOnAirService.getImageUrl(uploadResult.data);

        if (telegramService) {
            await telegramService.sendMessage(config.messageTitle, successMessage, imageUrl);
        }

        const outputJSON = JSON.stringify(outputObject);
        core.setOutput('output', outputJSON);
        outputObject.message = 'Upload and notification completed successfully';
    }

    // Log result for debugging
    console.log('InstallOnAir build mode completed:', JSON.stringify(outputObject, undefined, 2));
}

async function handleLoadlyIOBuildMode(config: ActionConfig, telegramService: TelegramService | null): Promise<void> {
    // Initialize services
    const loadlyIOService = new LoadlyIOService();
    const uploadService = new UploadService();

    // Prepare file forms data for LoadlyIO
    const fileFormsMap = createLoadlyIOFileFormsFromPath(config.filePath);

    // Upload file to LoadlyIO
    const uploadResult = await loadlyIOService.uploadFile(fileFormsMap, uploadService, config.loadlyIoToken);

    // Create output object
    const outputObject = createOutputObject(
        config.method,
        config.getLoadlyIOUrl(),
        uploadResult.statusCode,
        uploadResult.data
    );

    // Handle result and send notifications
    if (uploadResult.statusCode >= 400) {
        const errorMessage = `❌ LoadlyIO Upload Failed!
File: ${config.filePath.split('/').pop()}
Status Code: ${uploadResult.statusCode}
Error: ${uploadResult.error || 'Unknown error'}`;

        core.setFailed(`LoadlyIO upload failed with status code: ${uploadResult.statusCode}`);

        if (telegramService) {
            await telegramService.sendMessage(config.messageTitle, errorMessage);
        }

        outputObject.message = 'LoadlyIO upload failed';
    } else {
        const successMessage = loadlyIOService.formatSuccessMessage(uploadResult.data);
        const imageUrl = loadlyIOService.getImageUrl(uploadResult.data);

        if (telegramService) {
            await telegramService.sendMessage(config.messageTitle, successMessage, imageUrl);
        }

        const outputJSON = JSON.stringify(outputObject);
        core.setOutput('output', outputJSON);
        outputObject.message = 'LoadlyIO upload and notification completed successfully';
    }

    // Log result for debugging
    console.log('LoadlyIO build mode completed:', JSON.stringify(outputObject, undefined, 2));
}

async function handleAllMode(config: ActionConfig, telegramService: TelegramService | null): Promise<void> {
    console.log('Starting all mode - uploading to both InstallOnAir and LoadlyIO...');

    const results: any[] = [];

    try {
        // Upload to InstallOnAir
        console.log('Uploading to InstallOnAir...');
        const installOnAirService = new InstallOnAirService();
        const uploadService = new UploadService();

        const token = await installOnAirService.getToken();
        const forms = createDefaultForms(token, config.installonairUserId);
        const formsMap = jsonToMap(forms);
        const fileFormsMap = createFileFormsFromPath(config.filePath);

        const installOnAirResult = await installOnAirService.uploadFile(
            config.getInstallOnAirUrl(),
            formsMap,
            fileFormsMap,
            uploadService
        );

        results.push({
            service: 'InstallOnAir',
            success: installOnAirResult.success,
            statusCode: installOnAirResult.statusCode,
            data: installOnAirResult.data,
            error: installOnAirResult.error
        });

    } catch (error) {
        console.error('InstallOnAir upload failed in all mode:', error);
        results.push({
            service: 'InstallOnAir',
            success: false,
            error: (error as Error).message
        });
    }

    try {
        // Upload to LoadlyIO
        console.log('Uploading to LoadlyIO...');
        const loadlyIOService = new LoadlyIOService();
        const uploadService2 = new UploadService();

        const loadlyIOFileFormsMap = createLoadlyIOFileFormsFromPath(config.filePath);
        const loadlyIOResult = await loadlyIOService.uploadFile(loadlyIOFileFormsMap, uploadService2, config.loadlyIoToken);

        results.push({
            service: 'LoadlyIO',
            success: loadlyIOResult.success,
            statusCode: loadlyIOResult.statusCode,
            data: loadlyIOResult.data,
            error: loadlyIOResult.error
        });

    } catch (error) {
        console.error('LoadlyIO upload failed in all mode:', error);
        results.push({
            service: 'LoadlyIO',
            success: false,
            error: (error as Error).message
        });
    }

    // Prepare summary message
    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    let summaryMessage = `🚀 Multi-Upload Summary (${successCount}/${totalCount} successful)
File: ${config.filePath.split('/').pop()}

`;

    results.forEach(result => {
        const status = result.success ? '✅' : '❌';
        summaryMessage += `${status} ${result.service}: ${result.success ? 'Success' : 'Failed'}
`;
        if (result.success && result.service === 'InstallOnAir') {
            const installOnAirService = new InstallOnAirService();
            summaryMessage += installOnAirService.formatSuccessMessage(result.data) + '\n';
        }
        if (result.success && result.service === 'LoadlyIO') {
            const loadlyIOService = new LoadlyIOService();
            summaryMessage += loadlyIOService.formatSuccessMessage(result.data) + '\n';
        }
        if (!result.success) {
            summaryMessage += `Error: ${result.error}\n`;
        }
        summaryMessage += '\n';
    });

    // Send notification
    if (telegramService) {
        await telegramService.sendMessage(config.messageTitle, summaryMessage);
    }

    // Create output
    const outputObject = createOutputObject(
        config.method,
        'Multiple services',
        successCount > 0 ? 200 : 500,
        {results, summary: {successful: successCount, total: totalCount}},
        `Multi-upload completed: ${successCount}/${totalCount} successful`
    );

    if (successCount === 0) {
        core.setFailed('All uploads failed');
    } else {
        const outputJSON = JSON.stringify(outputObject);
        core.setOutput('output', outputJSON);
    }

    console.log('All mode completed:', JSON.stringify(outputObject, undefined, 2));
}

main().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
});
