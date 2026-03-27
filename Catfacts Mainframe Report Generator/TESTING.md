# Testing

## Integration Tests

Integration tests verify end-to-end functionality with a live mainframe environment.

### Prerequisites

1. **Zowe CLI** installed and configured
2. **Mainframe access** with CATREPORT COBOL program deployed
3. **Environment variables** in `.env`:
   ```
ZOWE_HOST=your mainframe host
ZOWE_USER=z99999
ZOWE_PASSWORD=your password
   ```

Copy `.env.example` to `.env` and fill in your credentials. Change `z99999` to your own mainframe user ID.

### Running Integration Tests

```bash
npm run test:integration
```

### What is Tested

| Test | Description |
|------|-------------|
| End-to-End COBOL Report | Uploads CSV, runs COBOL program, downloads report |
| Empty CSV Handling | Verifies graceful handling of empty input |
| JCL Operations | Tests define, compile, and cleanup JCL jobs |

### Notes

- Tests require a working mainframe connection
- Each test has a 60-120 second timeout due to mainframe processing time
- Tests modify datasets on the mainframe - use cleanup JCL or a separate test environment
