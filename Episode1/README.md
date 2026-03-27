# Catfacts Mainframe Report Generator

**Read my blog:** [Vibe Coding Your Way to the Mainframe](https://medium.com/@jessielaine.punongbayan/01415c0b4f61)

This project demonstrates how to integrate a modern Node.js application with an IBM mainframe using Zowe API. It fetches cat facts from an external API, uploads them to the mainframe, and generates a formatted report using COBOL.

## Overview

1. **Fetch** - Retrieves cat facts from [CatFacts API](https://catfact.ninja)
2. **Convert** - Transforms the data to CSV format
3. **Upload** - Sends the CSV to mainframe via Zowe SDK
4. **Process** - COBOL program reads and formats the data into a report

## Project Structure

```
Episode1/
├── src/
│   ├── index.ts           # Main entry point - extracts cat facts
│   ├── submit-jcl.ts      # Submits JCL jobs to mainframe
│   ├── config.ts          # Configuration (datasets, paths) - NOT committed
│   ├── services/
│   │   ├── catfacts.ts    # Fetches cat facts from API
│   │   └── zowe.ts        # Mainframe interactions via Zowe SDK
│   └── utils/
│       └── csv.ts         # CSV conversion utilities
├── jcl/
│   ├── CATREPORT.jcl      # JCL to run COBOL program
│   ├── DEFINE.jcl         # JCL to create datasets
│   ├── COMPILE.jcl        # JCL to compile COBOL program
│   └── CLEANUP.jcl        # JCL to delete datasets
├── cobol/
│   └── CATRPT01.cobol     # COBOL program that generates the report
├── .env.example           # Example environment variables
└── package.json
```

## Prerequisites

- Node.js and npm installed
- Zowe CLI configured (`zowe config init`)
- Mainframe credentials with permission to create datasets

### Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your mainframe credentials:
   ```
   ZOWE_HOST=your mainframe host
   ZOWE_USER=your username
   ZOWE_PASSWORD=your password
   ```

3. Copy `src/config.ts.example` to `src/config.ts` and update with your dataset names

## Usage

### Full Workflow

```bash
# 1. Clean up old datasets
npm run cleanup

# 2. Create new datasets
npm run define

# 3. Extract cat facts and upload to mainframe
npm run extract

# 4. Compile COBOL program (only needed after code changes)
npm run compile

# 5. Run the COBOL program to generate report
npm run run-report
```

### Individual Commands

| Command | Description |
|---------|-------------|
| `npm run define` | Creates input/output datasets |
| `npm run extract` | Fetches cat facts from API and uploads CSV |
| `npm run compile` | Compiles the COBOL program |
| `npm run run-report` | Runs the COBOL program |
| `npm run cleanup` | Deletes the datasets |

## Datasets

The project uses the following datasets (configurable in `src/config.ts`):

| Dataset | Description |
|---------|-------------|
| `Z85304.CATFACTS.INPUT` | Input CSV with cat facts |
| `Z85304.CATFACTS.REPORT` | Generated report output |

## Notes

- Host and port are loaded from `~/.zowe/zowe.config.json`
- User credentials come from environment variables (not committed)
- Configuration file `src/config.ts` is gitignored
- Run `npm run define` before first extract if datasets don't exist

## Dependencies

- `@zowe/cli` - Zowe CLI
- `@zowe/imperative` - Zowe core SDK
- `@zowe/zos-files-for-zowe-sdk` - Dataset operations
- `@zowe/zos-jobs-for-zowe-sdk` - Job submission
- `axios` - HTTP client for API calls
- `dotenv` - Environment variable management
