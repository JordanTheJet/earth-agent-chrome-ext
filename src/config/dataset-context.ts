/**
 * Dataset context configuration for the Earth Engine Assistant
 * This file contains dataset-specific information that gets injected into the system prompt
 */

export interface DatasetContext {
  name: string;
  assetPath: string;
  description?: string;
  bands?: string[];
  sampleCode?: string;
  usageNotes?: string;
}

/**
 * Available dataset contexts that can be injected into the system prompt
 */
export const DATASET_CONTEXTS: Record<string, DatasetContext> = {
  handheld_spectra_us: {
    name: "Handheld Spectra US",
    assetPath: "projects/sundai-woodwell-soil/assets/handheld_spectra_us",
    description: "Handheld spectral measurements dataset for soil analysis across the United States",
    bands: ["reflectance", "wavelength", "location"],
    sampleCode: `var handheldSpectra = ee.FeatureCollection('projects/sundai-woodwell-soil/assets/handheld_spectra_us');
print('Handheld Spectra Collection:', handheldSpectra.limit(5));`,
    usageNotes: "This dataset contains point-based spectral measurements. Use for soil spectral analysis and validation."
  }
  // Add more datasets as needed
};

/**
 * Default dataset context - can be changed to switch the primary dataset
 */
export const DEFAULT_DATASET_CONTEXT = DATASET_CONTEXTS.handheld_spectra_us;

/**
 * Generate dataset context text for injection into system prompt
 */
export function generateDatasetContext(datasetKey?: string): string {
  const dataset = datasetKey ? DATASET_CONTEXTS[datasetKey] : DEFAULT_DATASET_CONTEXT;
  
  if (!dataset) {
    return "";
  }

  const contextParts = [
    `\n## Primary Dataset Context`,
    `You have access to a primary dataset: **${dataset.name}**`,
    `- Asset Path: \`${dataset.assetPath}\``,
  ];

  if (dataset.description) {
    contextParts.push(`- Description: ${dataset.description}`);
  }

  if (dataset.bands && dataset.bands.length > 0) {
    contextParts.push(`- Available bands/properties: ${dataset.bands.join(', ')}`);
  }

  if (dataset.usageNotes) {
    contextParts.push(`- Usage Notes: ${dataset.usageNotes}`);
  }

  if (dataset.sampleCode) {
    contextParts.push(`- Example usage:`);
    contextParts.push('```javascript');
    contextParts.push(dataset.sampleCode);
    contextParts.push('```');
  }

  contextParts.push(`\nWhen users ask about soil analysis, spectral data, or related topics, consider using this dataset in your code examples and suggestions.\n`);

  return contextParts.join('\n');
}