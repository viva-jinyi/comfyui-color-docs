import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// PrimeVue analysis patterns
const primevuePatterns = {
  // PrimeVue Components
  components: {
    Button: /<(?:p-button|Button)\b/g,
    Dialog: /<(?:p-dialog|Dialog)\b/g,
    InputText: /<(?:p-input-text|InputText)\b/g,
    Dropdown: /<(?:p-dropdown|Dropdown)\b/g,
    DataTable: /<(?:p-data-table|DataTable)\b/g,
    Card: /<(?:p-card|Card)\b/g,
    Panel: /<(?:p-panel|Panel)\b/g,
    Menu: /<(?:p-menu|Menu)\b/g,
    Toast: /<(?:p-toast|Toast)\b/g,
    Checkbox: /<(?:p-checkbox|Checkbox)\b/g,
    RadioButton: /<(?:p-radio-button|RadioButton)\b/g,
    SelectButton: /<(?:p-select-button|SelectButton)\b/g,
    Slider: /<(?:p-slider|Slider)\b/g,
    ProgressBar: /<(?:p-progress-bar|ProgressBar)\b/g,
    Tooltip: /<(?:p-tooltip|Tooltip|v-tooltip)\b/g,
    Badge: /<(?:p-badge|Badge)\b/g,
    Tag: /<(?:p-tag|Tag)\b/g,
    Divider: /<(?:p-divider|Divider)\b/g,
    Accordion: /<(?:p-accordion|Accordion)\b/g,
    TabView: /<(?:p-tab-view|TabView)\b/g,
    Tree: /<(?:p-tree|Tree)\b/g,
    TreeTable: /<(?:p-tree-table|TreeTable)\b/g,
    Sidebar: /<(?:p-sidebar|Sidebar)\b/g,
    OverlayPanel: /<(?:p-overlay-panel|OverlayPanel)\b/g,
    ConfirmDialog: /<(?:p-confirm-dialog|ConfirmDialog)\b/g,
    BlockUI: /<(?:p-block-ui|BlockUI)\b/g,
    ScrollPanel: /<(?:p-scroll-panel|ScrollPanel)\b/g,
    Splitter: /<(?:p-splitter|Splitter)\b/g,
    SplitButton: /<(?:p-split-button|SplitButton)\b/g,
    ToggleButton: /<(?:p-toggle-button|ToggleButton)\b/g,
    MultiSelect: /<(?:p-multi-select|MultiSelect)\b/g,
    Textarea: /<(?:p-textarea|Textarea)\b/g,
    AutoComplete: /<(?:p-auto-complete|AutoComplete)\b/g,
    Calendar: /<(?:p-calendar|Calendar)\b/g,
    InputNumber: /<(?:p-input-number|InputNumber)\b/g,
    InputMask: /<(?:p-input-mask|InputMask)\b/g,
    Password: /<(?:p-password|Password)\b/g,
    Editor: /<(?:p-editor|Editor)\b/g,
    Message: /<(?:p-message|Message)\b/g,
    InlineMessage: /<(?:p-inline-message|InlineMessage)\b/g,
    FileUpload: /<(?:p-file-upload|FileUpload)\b/g,
    Breadcrumb: /<(?:p-breadcrumb|Breadcrumb)\b/g,
    ContextMenu: /<(?:p-context-menu|ContextMenu)\b/g,
    Menubar: /<(?:p-menubar|Menubar)\b/g,
    Steps: /<(?:p-steps|Steps)\b/g,
    TabMenu: /<(?:p-tab-menu|TabMenu)\b/g,
    TieredMenu: /<(?:p-tiered-menu|TieredMenu)\b/g,
    Avatar: /<(?:p-avatar|Avatar)\b/g,
    Chip: /<(?:p-chip|Chip)\b/g,
    Skeleton: /<(?:p-skeleton|Skeleton)\b/g,
    ProgressSpinner: /<(?:p-progress-spinner|ProgressSpinner)\b/g,
    Ripple: /v-ripple/g
  },
  
  // CSS Variables used in styles
  cssVariables: {
    // Primary colors
    primaryColor: /var\(--p-primary-color\)/g,
    primaryHoverColor: /var\(--p-primary-hover-color\)/g,
    primaryActiveColor: /var\(--p-primary-active-color\)/g,
    
    // Surface colors
    surface0: /var\(--p-surface-0\)/g,
    surface50: /var\(--p-surface-50\)/g,
    surface100: /var\(--p-surface-100\)/g,
    surface200: /var\(--p-surface-200\)/g,
    surface300: /var\(--p-surface-300\)/g,
    surface400: /var\(--p-surface-400\)/g,
    surface500: /var\(--p-surface-500\)/g,
    surface600: /var\(--p-surface-600\)/g,
    surface700: /var\(--p-surface-700\)/g,
    surface800: /var\(--p-surface-800\)/g,
    surface900: /var\(--p-surface-900\)/g,
    surface950: /var\(--p-surface-950\)/g,
    
    // Text colors
    textColor: /var\(--p-text-color\)/g,
    textMutedColor: /var\(--p-text-muted-color\)/g,
    
    // Other semantic colors
    borderColor: /var\(--p-border-color\)/g,
    contentBackground: /var\(--p-content-background\)/g,
    highlightBackground: /var\(--p-highlight-background\)/g,
    maskBackground: /var\(--p-mask-background\)/g,
    
    // Form field colors
    formFieldBackground: /var\(--p-form-field-background\)/g,
    formFieldBorderColor: /var\(--p-form-field-border-color\)/g,
    formFieldFocusBorderColor: /var\(--p-form-field-focus-border-color\)/g,
    
    // Component-specific
    buttonPrimaryBackground: /var\(--p-button-primary-background\)/g,
    buttonSecondaryBackground: /var\(--p-button-secondary-background\)/g
  },
  
  // PrimeVue severity/state classes
  severityClasses: {
    success: /\bp-(?:button|badge|tag|message)-success\b/g,
    info: /\bp-(?:button|badge|tag|message)-info\b/g,
    warning: /\bp-(?:button|badge|tag|message)-warning\b/g,
    danger: /\bp-(?:button|badge|tag|message)-danger\b/g,
    help: /\bp-(?:button|badge|tag|message)-help\b/g,
    primary: /\bp-(?:button|badge|tag|message)-primary\b/g,
    secondary: /\bp-(?:button|badge|tag|message)-secondary\b/g,
    contrast: /\bp-(?:button|badge|tag|message)-contrast\b/g
  },
  
  // Surface color classes
  surfaceClasses: {
    surface0: /\bsurface-0\b/g,
    surface50: /\bsurface-50\b/g,
    surface100: /\bsurface-100\b/g,
    surface200: /\bsurface-200\b/g,
    surface300: /\bsurface-300\b/g,
    surface400: /\bsurface-400\b/g,
    surface500: /\bsurface-500\b/g,
    surface600: /\bsurface-600\b/g,
    surface700: /\bsurface-700\b/g,
    surface800: /\bsurface-800\b/g,
    surface900: /\bsurface-900\b/g,
    surface950: /\bsurface-950\b/g
  }
};

// Results storage
const results = {
  components: {},
  cssVariables: {},
  severityClasses: {},
  surfaceClasses: {},
  totalFiles: 0,
  filesUsingPrimeVue: 0
};

// File extensions to scan
const extensions = ['.vue', '.ts', '.tsx', '.js', '.jsx', '.css', '.scss'];

// Directories to skip
const skipDirs = ['node_modules', '.git', 'dist', 'build', '.vscode', 'coverage', 'public'];

function analyzeFile(filePath) {
  if (!extensions.some(ext => filePath.endsWith(ext))) {
    return;
  }

  results.totalFiles++;
  let foundPrimeVue = false;

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check components
    Object.entries(primevuePatterns.components).forEach(([name, pattern]) => {
      const matches = content.match(pattern);
      if (matches) {
        results.components[name] = (results.components[name] || 0) + matches.length;
        foundPrimeVue = true;
      }
    });
    
    // Check CSS variables
    Object.entries(primevuePatterns.cssVariables).forEach(([name, pattern]) => {
      const matches = content.match(pattern);
      if (matches) {
        results.cssVariables[name] = (results.cssVariables[name] || 0) + matches.length;
        foundPrimeVue = true;
      }
    });
    
    // Check severity classes
    Object.entries(primevuePatterns.severityClasses).forEach(([name, pattern]) => {
      const matches = content.match(pattern);
      if (matches) {
        results.severityClasses[name] = (results.severityClasses[name] || 0) + matches.length;
        foundPrimeVue = true;
      }
    });
    
    // Check surface classes
    Object.entries(primevuePatterns.surfaceClasses).forEach(([name, pattern]) => {
      const matches = content.match(pattern);
      if (matches) {
        results.surfaceClasses[name] = (results.surfaceClasses[name] || 0) + matches.length;
        foundPrimeVue = true;
      }
    });
    
    if (foundPrimeVue) {
      results.filesUsingPrimeVue++;
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function walkDirectory(dir) {
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        if (!skipDirs.includes(file) && !file.startsWith('.')) {
          walkDirectory(filePath);
        }
      } else {
        analyzeFile(filePath);
      }
    });
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
}

// Main execution
console.log('Starting PrimeVue usage analysis...\n');

// Analyze src directory
const srcDir = path.join(__dirname, 'src');
if (fs.existsSync(srcDir)) {
  console.log('Analyzing src directory...');
  walkDirectory(srcDir);
}

// Sort results
Object.keys(results).forEach(category => {
  if (typeof results[category] === 'object') {
    const sorted = Object.entries(results[category])
      .sort((a, b) => b[1] - a[1])
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
    results[category] = sorted;
  }
});

// Create output
const output = {
  timestamp: new Date().toISOString(),
  summary: {
    totalFiles: results.totalFiles,
    filesUsingPrimeVue: results.filesUsingPrimeVue,
    totalComponentUses: Object.values(results.components).reduce((a, b) => a + b, 0),
    totalCSSVariableUses: Object.values(results.cssVariables).reduce((a, b) => a + b, 0),
    uniqueComponents: Object.keys(results.components).length,
    uniqueCSSVariables: Object.keys(results.cssVariables).length
  },
  components: results.components,
  cssVariables: results.cssVariables,
  severityClasses: results.severityClasses,
  surfaceClasses: results.surfaceClasses
};

// Save to file
const outputPath = path.join(__dirname, 'primevue-usage-stats.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

// Display summary
console.log('\n' + '='.repeat(60));
console.log('PRIMEVUE USAGE ANALYSIS - COMPLETE');
console.log('='.repeat(60));

console.log('\nSUMMARY:');
console.log(`  Total files analyzed: ${results.totalFiles}`);
console.log(`  Files using PrimeVue: ${results.filesUsingPrimeVue}`);
console.log(`  Unique components used: ${Object.keys(results.components).length}`);
console.log(`  Total component instances: ${Object.values(results.components).reduce((a, b) => a + b, 0)}`);

console.log('\nTOP 10 COMPONENTS:');
Object.entries(results.components).slice(0, 10).forEach(([name, count], idx) => {
  console.log(`  ${idx + 1}. ${name}: ${count} times`);
});

console.log('\nCSS VARIABLES USAGE:');
Object.entries(results.cssVariables).slice(0, 10).forEach(([name, count]) => {
  console.log(`  ${name}: ${count} times`);
});

console.log('\nSURFACE CLASSES:');
Object.entries(results.surfaceClasses).forEach(([name, count]) => {
  console.log(`  ${name}: ${count} times`);
});

console.log('\nSEVERITY/STATE CLASSES:');
Object.entries(results.severityClasses).forEach(([name, count]) => {
  console.log(`  ${name}: ${count} times`);
});

console.log(`\n✅ Analysis complete! Results saved to: ${outputPath}`);