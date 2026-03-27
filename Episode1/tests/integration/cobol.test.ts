import * as fs from 'fs';
import * as path from 'path';
import {
  initZoweConfig,
  uploadCsvToMainframe,
  submitJcl,
  downloadReport,
  DATASET_INPUT,
  DATASET_REPORT
} from '../../src/services/zowe';

describe('COBOL Integration Tests', () => {
  const testCsvPath = path.join(__dirname, '..', 'fixtures', 'sample-csv.csv');
  const expectedOutputPath = path.join(__dirname, '..', 'fixtures', 'expected-report.txt');

  beforeAll(async () => {
    console.log('Initializing Zowe config for integration tests...');
    await initZoweConfig();
    console.log(`Connected to mainframe: ${process.env.ZOWE_HOST}`);
  }, 30000);

  describe('End-to-End COBOL Report Generation', () => {
    it('should upload CSV, run COBOL program, and download report', async () => {
      const csvContent = fs.readFileSync(testCsvPath, 'utf-8');
      console.log(`\nTest CSV content:\n${csvContent}`);

      console.log(`\nUploading CSV to ${DATASET_INPUT}...`);
      await uploadCsvToMainframe(csvContent);
      console.log('Upload complete.');

      console.log('\nSubmitting CATREPORT.jcl...');
      const jobId = await submitJcl('run-report');
      console.log(`Job submitted: ${jobId}`);

      console.log(`\nDownloading report from ${DATASET_REPORT}...`);
      const reportContent = await downloadReport();
      console.log(`\nReport content:\n${reportContent}`);

      expect(jobId).toMatch(/^JOB/);
      expect(reportContent).toContain('CAT FACTS REPORT');
      expect(reportContent).toContain('TOTAL RECORDS:');
    }, 120000);

    it('should handle empty CSV input', async () => {
      const emptyCsv = 'FACT,LENGTH\n';
      
      await uploadCsvToMainframe(emptyCsv);
      
      const jobId = await submitJcl('run-report');
      const reportContent = await downloadReport();

      expect(jobId).toMatch(/^JOB/);
      expect(reportContent).toContain('CAT FACTS REPORT');
    }, 120000);
  });

  describe('JCL Operations', () => {
    it('should submit define JCL to create datasets', async () => {
      const jobId = await submitJcl('define');
      expect(jobId).toMatch(/^JOB/);
    }, 60000);

    it('should submit compile JCL', async () => {
      const jobId = await submitJcl('compile');
      expect(jobId).toMatch(/^JOB/);
    }, 60000);

    it('should submit cleanup JCL', async () => {
      const jobId = await submitJcl('cleanup');
      expect(jobId).toMatch(/^JOB/);
    }, 60000);
  });
});
