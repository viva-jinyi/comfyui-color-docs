import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Categories we want to analyze
const categories = {
  background: /\bbg-[\w-]+/g,
  text: /\btext-[\w-]+/g,
  border: /\bborder(?:-[\w-]+)?/g,
  shadow: /\bshadow(?:-[\w-]+)?/g,
  rounded: /\brounded(?:-[\w-]+)?/g
};

// Color names to track
const colorNames = [
  'zinc', 'gray', 'neutral', 'slate', 'stone',
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose',
  'black', 'white', 'transparent'
];

// Results storage
const results = {
  background: {},
  text: {},
  border: {},
  shadow: {},
  rounded: {},
  usedTailwindColors: {}
};

// Initialize color counters
colorNames.forEach(color => {
  results.usedTailwindColors[color] = 0;
});

// File extensions to scan
const extensions = ['.vue', '.ts', '.tsx', '.js', '.jsx'];

// Directories to skip
const skipDirs = ['node_modules', '.git', 'dist', 'build', '.vscode', 'coverage', 'public'];

function extractClasses(content) {
  const classes = new Set();
  
  // Multiple patterns to catch different ways classes are defined
  const patterns = [
    // Standard class attribute
    /class="([^"]*)"/g,
    /class='([^']*)'/g,
    /class=`([^`]*)`/g,
    
    // Vue dynamic classes
    /:class="([^"]*)"/g,
    /:class='([^']*)'/g,
    /:class="`([^`]*)`"/g,
    
    // className (React/TSX)
    /className="([^"]*)"/g,
    /className='([^']*)'/g,
    /className=`([^`]*)`/g,
    
    // Dynamic class binding with object syntax
    /:class="\{([^}]*)\}"/g,
    /:class='\{([^}]*)\}'/g,
    
    // Dynamic class binding with array syntax
    /:class="\[([^\]]*)\]"/g,
    /:class='\[([^\]]*)\]'/g,
    
    // Template literal classes
    /\$\{[^}]*\s+([\w-]+)\s*\}/g
  ];

  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const classString = match[1];
      if (classString) {
        // Split by spaces and add each class
        classString.split(/\s+/).forEach(cls => {
          if (cls && cls.length > 0) {
            classes.add(cls.trim());
          }
        });
        
        // Also handle object syntax {'class-name': condition}
        if (classString.includes(':')) {
          const objectClasses = classString.match(/['"]?([\w-]+)['"]?\s*:/g);
          if (objectClasses) {
            objectClasses.forEach(cls => {
              const cleaned = cls.replace(/['":\s]/g, '');
              if (cleaned) classes.add(cleaned);
            });
          }
        }
      }
    }
  });

  return Array.from(classes);
}

function analyzeFile(filePath) {
  if (!extensions.some(ext => filePath.endsWith(ext))) {
    return;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const classes = extractClasses(content);
    
    classes.forEach(className => {
      // Analyze each category
      Object.entries(categories).forEach(([category, pattern]) => {
        const matches = className.match(pattern);
        if (matches) {
          matches.forEach(match => {
            results[category][match] = (results[category][match] || 0) + 1;
            
            // Check if this class contains a color
            colorNames.forEach(color => {
              if (match.includes(`-${color}-`) || match.endsWith(`-${color}`)) {
                results.usedTailwindColors[color]++;
              }
            });
          });
        }
      });
    });
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
console.log('Starting accurate Tailwind CSS analysis...\n');

// Analyze src directory
const srcDir = path.join(__dirname, 'src');
if (fs.existsSync(srcDir)) {
  console.log('Analyzing src directory...');
  walkDirectory(srcDir);
}

// Sort each category by usage count
Object.keys(results).forEach(category => {
  if (category !== 'usedTailwindColors') {
    const sorted = Object.entries(results[category])
      .sort((a, b) => b[1] - a[1])
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
    results[category] = sorted;
  }
});

// Remove colors with zero usage
const usedColors = {};
Object.entries(results.usedTailwindColors).forEach(([color, count]) => {
  if (count > 0) {
    usedColors[color] = count;
  }
});
results.usedTailwindColors = usedColors;

// Create final output
const output = {
  timestamp: new Date().toISOString(),
  categories: {
    background: {
      total: Object.values(results.background).reduce((a, b) => a + b, 0),
      unique: Object.keys(results.background).length,
      classes: results.background
    },
    text: {
      total: Object.values(results.text).reduce((a, b) => a + b, 0),
      unique: Object.keys(results.text).length,
      classes: results.text
    },
    border: {
      total: Object.values(results.border).reduce((a, b) => a + b, 0),
      unique: Object.keys(results.border).length,
      classes: results.border
    },
    shadow: {
      total: Object.values(results.shadow).reduce((a, b) => a + b, 0),
      unique: Object.keys(results.shadow).length,
      classes: results.shadow
    },
    rounded: {
      total: Object.values(results.rounded).reduce((a, b) => a + b, 0),
      unique: Object.keys(results.rounded).length,
      classes: results.rounded
    }
  },
  usedTailwindColors: results.usedTailwindColors
};

// Save to file
const outputPath = path.join(__dirname, 'tailwind-usage-stats.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

// Display summary
console.log('\n' + '='.repeat(60));
console.log('TAILWIND CSS USAGE ANALYSIS - COMPLETE');
console.log('='.repeat(60));

Object.entries(output.categories).forEach(([category, data]) => {
  console.log(`\n${category.toUpperCase()}:`);
  console.log(`  Total uses: ${data.total}`);
  console.log(`  Unique classes: ${data.unique}`);
  console.log(`  Top 10:`);
  Object.entries(data.classes).slice(0, 10).forEach(([cls, count], idx) => {
    console.log(`    ${idx + 1}. ${cls}: ${count} times`);
  });
});

console.log('\nUSED COLORS:');
Object.entries(output.usedTailwindColors).forEach(([color, count]) => {
  console.log(`  ${color}: ${count} times`);
});

console.log(`\n✅ Analysis complete! Results saved to: ${outputPath}`);