/**
 * Main entry point for the Catfacts Mainframe Report Generator.
 * This script fetches cat facts from an external API, converts them to CSV,
 * and uploads the data to an IBM mainframe for processing.
 */

import * as dotenv from 'dotenv';
import { fetchCatFacts } from './services/catfacts';
import { uploadCsvToMainframe, initZoweConfig, DATASET_INPUT } from './services/zowe';
import { convertToCsv } from './utils/csv';

dotenv.config();

async function main() {
  console.log('Starting Catfacts Mainframe Report Generator...\n');

  console.log('Initializing Zowe configuration...');
  await initZoweConfig();

  console.log('Step 1: Fetching 100 cat facts from API...');
  const facts = await fetchCatFacts(100);
  console.log(`Successfully fetched ${facts.length} cat facts\n`);

  console.log('Step 2: Converting to CSV format...');
  const csvContent = convertToCsv(facts);
  console.log(`CSV created with ${facts.length + 1} lines (including header)\n`);

  console.log('Step 3: Uploading CSV to mainframe via Zowe...');
  await uploadCsvToMainframe(csvContent);
  console.log(`CSV uploaded successfully to ${DATASET_INPUT}\n`);

  console.log('===========================================');
  console.log('Extract complete!');
  console.log('Run "npm run run-report" to compile and execute the COBOL program.');
  console.log('Note: If datasets do not exist, run "npm run define" first to create them.');
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
