/**
 * Service for interacting with IBM mainframe via Zowe API.
 * Handles USS file operations, dataset management, and JCL job submission.
 */

import { Upload, Download, Create, CreateDataSetTypeEnum } from '@zowe/zos-files-for-zowe-sdk';
import { GetJobs, MonitorJobs } from '@zowe/zos-jobs-for-zowe-sdk';
import { SubmitJobs } from '@zowe/zos-jobs-for-zowe-sdk';
import { IssueCommand } from '@zowe/zos-console-for-zowe-sdk';
import { Session } from '@zowe/imperative';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { DATASETS } from '../config';

interface ZoweConfigJson {
  profiles: {
    [key: string]: {
      type: string;
      properties: {
        host?: string;
        port?: number;
        rejectUnauthorized?: boolean;
      };
    };
  };
  defaults: {
    [key: string]: string;
  };
}

function loadZoweConfig(): { host: string; port: number; rejectUnauthorized: boolean; user: string; password: string } {
  const configPath = path.join(os.homedir(), '.zowe', 'zowe.config.json');
  
  let host = 'localhost';
  let port = 443;
  let rejectUnauthorized = false;
  
  if (fs.existsSync(configPath)) {
    const configData = JSON.parse(fs.readFileSync(configPath, 'utf-8')) as ZoweConfigJson;
    
    const baseProfileName = configData.defaults?.base || 'global_base';
    const baseProfile = configData.profiles?.[baseProfileName]?.properties;
    
    const zosmfProfileName = configData.defaults?.zosmf || 'zXplore-zosmf';
    const zosmfProfile = configData.profiles?.[zosmfProfileName]?.properties;
    
    host = baseProfile?.host || 'localhost';
    port = zosmfProfile?.port || 443;
    rejectUnauthorized = baseProfile?.rejectUnauthorized ?? false;
  }

  return {
    host: process.env.ZOWE_HOST || host,
    port: parseInt(process.env.ZOWE_PORT || String(port), 10),
    rejectUnauthorized: rejectUnauthorized,
    user: process.env.ZOWE_USER || '',
    password: process.env.ZOWE_PASSWORD || ''
  };
}

let zoweConfig: ReturnType<typeof loadZoweConfig>;

const DATASET_INPUT = DATASETS.INPUT;
const DATASET_REPORT = DATASETS.REPORT;

let session: Session;

export function getSession(): Session {
  if (!session) {
    if (!zoweConfig) {
      throw new Error('ZOWE_CONFIG not initialized. Call initZoweConfig() first.');
    }
    session = new Session({
      type: 'basic',
      hostname: zoweConfig.host,
      port: zoweConfig.port,
      user: zoweConfig.user,
      password: zoweConfig.password,
      rejectUnauthorized: zoweConfig.rejectUnauthorized
    });
  }
  return session;
}

export async function initZoweConfig(): Promise<void> {
  zoweConfig = loadZoweConfig();
}

export async function uploadCsvToMainframe(csvContent: string): Promise<void> {
  const session = getSession();

  try {
    try {
      await Create.dataSet(session, CreateDataSetTypeEnum.DATA_SET_SEQUENTIAL, DATASET_INPUT, {
        recfm: 'FB',
        lrecl: 304,
        blksize: 24320,
        primary: 5,
        secondary: 5
      });
      console.log(`Created dataset: ${DATASET_INPUT}`);
    } catch (createError: any) {
      if (createError.mDetails?.errorCode === 409) {
        console.log(`Dataset ${DATASET_INPUT} already exists`);
      } else {
        console.log(`Could not create dataset (may already exist or no permission): ${createError.message}`);
      }
    }

    await Upload.bufferToDataSet(session, Buffer.from(csvContent), DATASET_INPUT);

    console.log(`Uploaded CSV to dataset: ${DATASET_INPUT}`);
  } catch (error) {
    console.error('Error uploading to mainframe:', error);
    throw error;
  }
}

export async function submitJcl(jclType: 'define' | 'run-report' | 'cleanup' | 'compile'): Promise<string> {
  const session = getSession();

  const jclDir = path.join(process.cwd(), 'jcl');
  let jclFile: string;
  switch (jclType) {
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
  const jclPath = path.join(jclDir, jclFile);

  try {
    const jclContent = fs.readFileSync(jclPath, 'utf-8');

    const response = await SubmitJobs.submitJcl(session, jclContent);
    const jobId = response.jobid;

    console.log(`JCL ${jclFile} submitted successfully. Job ID: ${jobId}`);

    if (jclType === 'run-report') {
      console.log('Waiting for job to complete...');
      const job = await GetJobs.getJob(session, jobId);
      await MonitorJobs.waitForJobOutputStatus(session, job);
      console.log(`Job completed with status: ${job.status}`);
      if (job.retcode) {
        console.log(`Job RC: ${job.retcode}`);
      }
    }

    return jobId;
  } catch (error) {
    console.error(`Error submitting ${jclFile}:`, error);
    throw error;
  }
}

export async function downloadReport(): Promise<string> {
  const session = getSession();
  
  try {
    const response = await Download.dataSet(session, DATASET_REPORT);
    console.log(`Downloaded report from ${DATASET_REPORT}`);
    return response.commandResponse;
  } catch (error: any) {
    if (error.mDetails?.errorCode === 404) {
      console.error('Report dataset not found. The job may have failed. Check job output in SDSF.');
    } else {
      console.error('Error downloading report:', error);
    }
    throw error;
  }
}

export { DATASET_INPUT, DATASET_REPORT };
