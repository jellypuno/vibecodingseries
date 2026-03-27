/**
 * Script to submit JCL jobs to the mainframe.
 * Supports three actions:
 *   - define: Creates the datasets
 *   - run-report: Runs the COBOL program
 *   - cleanup: Deletes temporary datasets
 */

import * as dotenv from 'dotenv';
import { submitJcl, downloadReport, initZoweConfig } from './services/zowe';

dotenv.config();

async function main() {
  const args = process.argv.slice(2);
  const action = args[0] as 'define' | 'run-report' | 'cleanup' | 'compile';

  if (!action || !['define', 'run-report', 'cleanup', 'compile'].includes(action)) {
    console.error('Usage: ts-node src/submit-jcl.ts <define|compile|run-report|cleanup>');
    process.exit(1);
  }

  console.log('Initializing Zowe configuration...');
  await initZoweConfig();

  let jclFile: string;
  switch (action) {
    case 'define':
      jclFile = 'DEFINE.jcl';
      break;
    case 'compile':
      jclFile = 'COMPILE.jcl';
      break;
    case 'run-report':
      jclFile = 'CATREPORT.jcl';
      break;
    case 'cleanup':
      jclFile = 'CLEANUP.jcl';
      break;
  }
  console.log(`Submitting ${jclFile}...\n`);

  try {
    const jobId = await submitJcl(action);
    console.log(`Job submitted successfully. Job ID: ${jobId}`);

    if (action === 'run-report') {
      console.log('\nWaiting for job to complete and downloading report...');
      const report = await downloadReport();
      console.log('\n========== REPORT CONTENT ==========\n');
      console.log(report);
      console.log('\n=====================================');
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
