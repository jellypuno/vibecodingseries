import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as zowe from '../../src/services/zowe';
import { Upload, Download, Create } from '@zowe/zos-files-for-zowe-sdk';
import { SubmitJobs, GetJobs, MonitorJobs } from '@zowe/zos-jobs-for-zowe-sdk';

vi.mock('@zowe/zos-files-for-zowe-sdk', () => ({
  Upload: {
    bufferToDataSet: vi.fn().mockResolvedValue({}),
    fileToDataSet: vi.fn().mockResolvedValue({})
  },
  Download: {
    dataSet: vi.fn().mockResolvedValue({ commandResponse: 'Downloaded successfully' })
  },
  Create: {
    dataSet: vi.fn().mockResolvedValue({})
  },
  CreateDataSetTypeEnum: {
    DATA_SET_SEQUENTIAL: 'DATA_SET_SEQUENTIAL',
    DATA_SET_PARTITIONED: 'DATA_SET_PARTITIONED',
    DATA_SET_DIRECT: 'DATA_SET_DIRECT'
  }
}));

vi.mock('@zowe/zos-jobs-for-zowe-sdk', () => ({
  SubmitJobs: {
    submitJcl: vi.fn().mockResolvedValue({ jobid: 'JOB12345', jobname: 'TESTJOB', status: 'INPUT' })
  },
  GetJobs: {
    getJob: vi.fn().mockResolvedValue({ jobid: 'JOB12345', status: 'OUTPUT', retcode: 'CC 0000' })
  },
  MonitorJobs: {
    waitForJobOutputStatus: vi.fn().mockResolvedValue({ jobid: 'JOB12345', status: 'OUTPUT', retcode: 'CC 0000' })
  }
}));

vi.mock('@zowe/imperative', () => ({
  Session: class Session {
    constructor(options: any) {
      this.type = options.type;
      this.hostname = options.hostname;
      this.port = options.port;
      this.user = options.user;
      this.password = options.password;
      this.rejectUnauthorized = options.rejectUnauthorized;
    }
    type = 'basic';
    hostname = 'localhost';
    port = 443;
    user = 'testuser';
    password = 'testpass';
    rejectUnauthorized = false;
  }
}));

describe('zowe.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('ZOWE_HOST', 'localhost');
    vi.stubEnv('ZOWE_USER', 'testuser');
    vi.stubEnv('ZOWE_PASSWORD', 'testpass');
  });

  describe('initZoweConfig', () => {
    it('should initialize Zowe configuration from environment', async () => {
      await zowe.initZoweConfig();
      const session = zowe.getSession();
      expect(session).toBeDefined();
    });
  });

  describe('uploadCsvToMainframe', () => {
    it('should upload CSV content to mainframe dataset', async () => {
      const csvContent = 'FACT,LENGTH\nTest fact,10';
      
      await zowe.initZoweConfig();
      await zowe.uploadCsvToMainframe(csvContent);

      expect(Create.dataSet).toHaveBeenCalled();
      expect(Upload.bufferToDataSet).toHaveBeenCalled();
    });
  });

  describe('submitJcl', () => {
    it('should submit run-report JCL and wait for completion', async () => {
      await zowe.initZoweConfig();
      const jobId = await zowe.submitJcl('run-report');

      expect(SubmitJobs.submitJcl).toHaveBeenCalled();
      expect(GetJobs.getJob).toHaveBeenCalled();
      expect(MonitorJobs.waitForJobOutputStatus).toHaveBeenCalled();
      expect(jobId).toBe('JOB12345');
    });

    it('should submit define JCL without waiting', async () => {
      await zowe.initZoweConfig();
      const jobId = await zowe.submitJcl('define');

      expect(SubmitJobs.submitJcl).toHaveBeenCalled();
      expect(MonitorJobs.waitForJobOutputStatus).not.toHaveBeenCalled();
      expect(jobId).toBe('JOB12345');
    });
  });

  describe('downloadReport', () => {
    it('should download report from mainframe', async () => {
      await zowe.initZoweConfig();
      const result = await zowe.downloadReport();

      expect(Download.dataSet).toHaveBeenCalled();
      expect(result).toBe('Downloaded successfully');
    });
  });
});
