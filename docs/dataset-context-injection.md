# Dataset Context Injection for GEE System Prompt

## Overview

The GEE_SYSTEM_PROMPT has been made modular to support dynamic dataset context injection. This allows you to configure the agent to work with specific datasets by injecting relevant information directly into the system prompt.

## Implementation

### Files Created/Modified

1. **`src/config/dataset-context.ts`** - Configuration file for dataset contexts
2. **`src/background/chat-handler.ts`** - Modified to support modular prompt generation
3. **`src/config/README.md`** - Documentation for dataset configuration
4. **`examples/change-dataset-context.ts`** - Example usage

### Key Components

#### 1. Dataset Context Configuration (`src/config/dataset-context.ts`)

```typescript
export interface DatasetContext {
  name: string;
  assetPath: string;
  description?: string;
  bands?: string[];
  sampleCode?: string;
  usageNotes?: string;
}

export const DATASET_CONTEXTS: Record<string, DatasetContext> = {
  handheld_spectra_us: {
    name: "Handheld Spectra US",
    assetPath: "projects/sundai-woodwell-soil/assets/handheld_spectra_us",
    // ... other properties
  }
};
```

#### 2. Modular System Prompt Generation

```typescript
// Base prompt template
const GEE_BASE_SYSTEM_PROMPT = `You are Earth Engine Assistant...`;

// Function to generate prompt with dataset context
export function generateSystemPrompt(datasetKey?: string): string {
  const datasetContext = generateDatasetContext(datasetKey);
  return GEE_BASE_SYSTEM_PROMPT + datasetContext;
}

// Default prompt with primary dataset
export const GEE_SYSTEM_PROMPT = generateSystemPrompt();
```

## Usage

### Current Configuration

The system is currently configured with the **Handheld Spectra US** dataset:
- **Asset Path**: `projects/sundai-woodwell-soil/assets/handheld_spectra_us`
- **Description**: Handheld spectral measurements dataset for soil analysis across the United States
- **Bands**: reflectance, wavelength, location

### Changing the Dataset Context

#### Option 1: Modify the Default Dataset

Edit `src/config/dataset-context.ts`:

```typescript
// Change the default dataset
export const DEFAULT_DATASET_CONTEXT = DATASET_CONTEXTS.your_dataset_key;
```

#### Option 2: Add New Dataset and Use It

1. Add new dataset to `DATASET_CONTEXTS`:

```typescript
export const DATASET_CONTEXTS: Record<string, DatasetContext> = {
  handheld_spectra_us: { /* existing */ },
  my_new_dataset: {
    name: "My New Dataset",
    assetPath: "projects/my-project/assets/my-dataset",
    description: "Description of my dataset",
    bands: ["band1", "band2"],
    sampleCode: `var myData = ee.FeatureCollection('projects/my-project/assets/my-dataset');`,
    usageNotes: "Usage instructions for the dataset."
  }
};
```

2. Update the default:

```typescript
export const DEFAULT_DATASET_CONTEXT = DATASET_CONTEXTS.my_new_dataset;
```

#### Option 3: Generate Prompt Programmatically

```typescript
import { generateSystemPrompt } from '../background/chat-handler';

// Use specific dataset
const promptWithSpecificDataset = generateSystemPrompt('my_new_dataset');

// Use default dataset
const promptWithDefault = generateSystemPrompt();
```

## Generated Context Format

The dataset context gets injected into the system prompt in this format:

```
## Primary Dataset Context
You have access to a primary dataset: **Dataset Name**
- Asset Path: `projects/path/to/dataset`
- Description: Dataset description
- Available bands/properties: band1, band2, band3
- Usage Notes: Usage instructions
- Example usage:
```javascript
var data = ee.FeatureCollection('projects/path/to/dataset');
print('Dataset:', data.limit(5));
```

When users ask about [relevant topics], consider using this dataset in your code examples and suggestions.
```

## Benefits

1. **Modularity**: Easy to switch between different datasets
2. **Context Awareness**: Agent knows about available datasets and can suggest them
3. **Code Examples**: Provides ready-to-use code snippets with correct asset paths
4. **Flexibility**: Can add multiple datasets and switch between them
5. **Maintenance**: Centralized configuration makes updates easy

## Future Enhancements

- Support for multiple simultaneous datasets
- Dynamic dataset selection based on user queries
- Integration with dataset search tools
- Automatic dataset discovery and context generation