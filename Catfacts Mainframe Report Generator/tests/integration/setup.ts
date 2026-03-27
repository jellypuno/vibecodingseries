import { beforeAll } from 'vitest';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

beforeAll(() => {
  if (!process.env.ZOWE_HOST || !process.env.ZOWE_USER || !process.env.ZOWE_PASSWORD) {
    throw new Error('Missing required environment variables: ZOWE_HOST, ZOWE_USER, ZOWE_PASSWORD');
  }
});
