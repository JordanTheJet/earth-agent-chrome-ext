/**
 * Example: How to change the dataset context for the Earth Engine Assistant
 * 
 * This file demonstrates how to modify the dataset context that gets injected
 * into the system prompt, allowing you to customize the agent for different datasets.
 */

import { generateSystemPrompt } from '../src/background/chat-handler';
import { DATASET_CONTEXTS, DEFAULT_DATASET_CONTEXT } from '../src/config/dataset-context';

// Example 1: View the current default dataset
console.log('Current default dataset:', DEFAULT_DATASET_CONTEXT.name);
console.log('Asset path:', DEFAULT_DATASET_CONTEXT.assetPath);

// Example 2: Generate system prompt with default dataset
const defaultPrompt = generateSystemPrompt();
console.log('System prompt with default dataset (first 200 chars):', 
  defaultPrompt.substring(0, 200) + '...');

// Example 3: Generate system prompt with specific dataset
const specificPrompt = generateSystemPrompt('handheld_spectra_us');
console.log('System prompt with handheld_spectra_us dataset (first 200 chars):', 
  specificPrompt.substring(0, 200) + '...');

// Example 4: View all available datasets
console.log('Available datasets:');
Object.keys(DATASET_CONTEXTS).forEach(key => {
  const dataset = DATASET_CONTEXTS[key];
  console.log(`- ${key}: ${dataset.name} (${dataset.assetPath})`);
});

// Example 5: How to add a new dataset programmatically
// (In practice, you would add this to dataset-context.ts)
const newDatasetContext = {
  name: "Example Soil Dataset",
  assetPath: "projects/my-project/assets/soil-data",
  description: "Example soil analysis dataset",
  bands: ["organic_matter", "ph", "nitrogen"],
  sampleCode: `var soilData = ee.FeatureCollection('projects/my-project/assets/soil-data');
Map.addLayer(soilData, {}, 'Soil Data');`,
  usageNotes: "Use this dataset for soil property analysis and mapping."
};

// You could dynamically add it (though it's better to add to the config file)
// DATASET_CONTEXTS['my_soil_data'] = newDatasetContext;

export {};