# Telegram InstallOnAir & LoadlyIO Actions (TypeScript)

A GitHub Action built with TypeScript that uploads files to InstallOnAir/LoadlyIO and sends notifications via Telegram.

## Features

- 🚀 Built with TypeScript for type safety and better development experience
- 📱 Upload APK/IPA files to InstallOnAir and/or LoadlyIO
- 📢 Send success/failure notifications to Telegram
- 🔄 Four operation modes: send-only, installonair-build, loadlyio-build, and all
- ⚙️ Configurable parameters
- 🏗️ Clean, modular architecture with services pattern
- 🔒 Strong typing and error handling
- 🌐 Multi-service upload support

## Usage

### InstallOnAir Build Mode (Upload + Notify)
```yaml
- name: Upload to InstallOnAir and Notify
  uses: ./
  with:
    telegramToken: ${{ secrets.TELEGRAM_TOKEN }}
    telegramUid: ${{ secrets.TELEGRAM_CHAT_ID }}
    messageTitle: "InstallOnAir Build"
    installonairUserId: "74613"
    filePath: "./app.apk"
    method: "installonair-build"
```

### LoadlyIO Build Mode (Upload + Notify)
```yaml
- name: Upload to LoadlyIO and Notify
  uses: ./
  with:
    telegramToken: ${{ secrets.TELEGRAM_TOKEN }}
    telegramUid: ${{ secrets.TELEGRAM_CHAT_ID }}
    messageTitle: "LoadlyIO Build"
    filePath: "./app.apk"
    method: "loadlyio-build"
```

### All Services Mode (Upload to Both + Notify)
```yaml
- name: Upload to All Services
  uses: ./
  with:
    telegramToken: ${{ secrets.TELEGRAM_TOKEN }}
    telegramUid: ${{ secrets.TELEGRAM_CHAT_ID }}
    messageTitle: "Multi-Service Build"
    installonairUserId: "74613"
    filePath: "./app.apk"
    method: "all"
```

### Send Only Mode (Telegram Notification Only)
```yaml
- name: Send Build Notification
  uses: ./
  with:
    telegramToken: ${{ secrets.TELEGRAM_TOKEN }}
    telegramUid: ${{ secrets.TELEGRAM_CHAT_ID }}
    messageTitle: "Build Ready"
    filePath: "./app.apk"
    method: "send-only"
```

## Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `telegramToken` | No* | - | Telegram bot token for notifications |
| `telegramUid` | No* | - | Telegram chat ID for notifications |
| `messageTitle` | No | "App Build" | Title for notifications |
| `installonairUserId` | No | "74613" | InstallOnAir user ID |
| `filePath` | **Yes** | - | Path to the file to upload (APK/IPA) |
| `method` | **Yes** | "installonair-build" | Action method: "send-only" \| "installonair-build" \| "loadlyio-build" \| "all" |

*Required for `send-only` method, optional for other methods

## Operation Modes

### 1. `send-only`
- Only sends Telegram notification about the build
- Requires Telegram credentials
- Does not upload to any service
- Perfect for CI/CD notifications

### 2. `installonair-build` 
- Uploads file to InstallOnAir
- Sends Telegram notification with download link (if credentials provided)
- InstallOnAir integration workflow

### 3. `loadlyio-build`
- Uploads file to LoadlyIO
- Sends Telegram notification with download link (if credentials provided)
- LoadlyIO integration workflow

### 4. `all`
- Uploads file to both InstallOnAir and LoadlyIO
- Sends comprehensive Telegram notification with results from both services
- Multi-service upload with detailed status report
- Continues even if one service fails

## Services Integration

### InstallOnAir
- Endpoint: `https://fupload.installonair.com/ipafile`
- Supports APK and IPA files
- Requires user ID and CSRF token
- Provides download link and expiry date

### LoadlyIO
- Endpoint: `https://api.loadly.io/apiv2/app/upload`
- API Key: Built-in (configurable in service)
- Supports APK and IPA files
- Provides app ID and download URL

## Outputs

| Output | Description |
|--------|-------------|
| `output` | JSON object containing result details, status code, and response data |

## Architecture

### Services
- **TelegramService**: Handles Telegram notifications with type safety
- **InstallOnAirService**: Manages InstallOnAir interactions with proper error handling
- **LoadlyIOService**: Manages LoadlyIO API interactions
- **UploadService**: Handles file upload operations with FormData

### Utils
- **ActionConfig**: Manages GitHub Actions input configuration with validation
- **helpers**: Common utility functions with TypeScript support

### Types
- **Comprehensive type definitions** for all data structures
- **ActionMethod type**: Ensures type-safe method selection ("send-only" | "installonair-build" | "loadlyio-build" | "all")
- **Service-specific interfaces**: InstallOnAirUploadResult, LoadlyIOUploadResult
- **Custom declaration files** for third-party modules
- **Proper error typing** throughout the application

## Development

### Prerequisites
- Node.js 16+
- TypeScript knowledge

### Setup
```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run linting
npm run lint

# Build for distribution
npm run prepare

# Run tests
npm test

# Development mode
npm run dev
```

## Project Structure

```
├── index.ts                    # Main entry point
├── src/
│   ├── services/              # Business logic services
│   │   ├── telegramService.ts
│   │   ├── installOnAirService.ts
│   │   ├── loadlyIOService.ts
│   │   └── uploadService.ts
│   ├── types/                 # Type definitions
│   │   ├── index.ts
│   │   └── hd-html-parser.d.ts
│   └── utils/                 # Utility functions
│       ├── config.ts
│       └── helpers.ts
├── dist/                      # Compiled JavaScript (generated)
├── tsconfig.json             # TypeScript configuration
├── action.yml               # GitHub Action metadata
└── package.json            # Dependencies and scripts
```

## License

MIT
