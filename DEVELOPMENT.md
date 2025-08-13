# Development Guide

## 📁 Project Structure

```
comfyui-color-docs/
├── index.html                    # Main documentation page
├── tailwind.json                 # Tailwind color configuration
├── primevue-color-tokens.json   # PrimeVue color tokens
├── tailwind-usage-stats.json    # Generated Tailwind usage statistics
├── primevue-usage-stats.json    # Generated PrimeVue usage statistics
├── analyze-tailwind-accurate.js # Script to analyze Tailwind usage
├── analyze-primevue-usage.js    # Script to analyze PrimeVue usage
└── package.json                  # NPM scripts configuration
```

## 🔧 Updating Color Data

### 1. Update Tailwind Colors
Edit `tailwind.json` to modify Tailwind color palettes:
- `overriddenColors`: Custom color definitions
- `defaultColors`: Tailwind default colors

### 2. Update PrimeVue Tokens
Edit `primevue-color-tokens.json` to modify PrimeVue theme colors:
- `primitive`: Base color definitions
- `semantic`: Theme-aware color tokens

## 📊 Regenerating Usage Statistics

To analyze the ComfyUI frontend repository and update usage statistics:

### Prerequisites
1. Clone the ComfyUI_frontend repository
2. Place analysis scripts in the repository root

### Run Analysis

```bash
# Analyze Tailwind CSS usage
node analyze-tailwind-accurate.js

# Analyze PrimeVue usage
node analyze-primevue-usage.js

# Or run both
npm run analyze:all
```

### Analysis Scripts

#### `analyze-tailwind-accurate.js`
- Scans `.vue`, `.ts`, `.tsx`, `.js`, `.jsx` files
- Extracts Tailwind classes (bg-*, text-*, border-*, shadow-*, rounded-*)
- Generates `tailwind-usage-stats.json`

#### `analyze-primevue-usage.js`
- Scans for PrimeVue component usage
- Tracks CSS variable usage
- Tracks surface and severity classes
- Generates `primevue-usage-stats.json`

## 🎨 Modifying the Documentation

### Adding New Sections
1. Edit `index.html`
2. Add new tab button in the navigation
3. Add corresponding content div
4. Update `showTab()` function if needed

### Updating Color Display
- Tailwind colors are loaded from `tailwind.json`
- PrimeVue colors are loaded from `primevue-color-tokens.json`
- Statistics are loaded from `*-usage-stats.json` files

### Color Filtering in Statistics
The statistics view filters out non-color classes:
- Background: Only color-related `bg-*` classes
- Text: Only color-related `text-*` classes  
- Border: Only color-related `border-*` classes

## 🚀 Local Development

```bash
# Start local server
npm run serve
# Visit http://localhost:8000
```

## 📝 Important Notes

1. **Theme Switching**: Dark theme is applied with `.dark-theme` class
2. **Primary Color**: Using blue (#3b82f6) as primary in PrimeVue Aura theme
3. **Surface Colors**: 
   - Light theme: Slate colors
   - Dark theme: Zinc colors
4. **Semantic Tokens**: Automatically adapt to theme

## 🔄 Updating GitHub Pages

After making changes:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

Changes will be live at: https://viva-jinyi.github.io/comfyui-color-docs/

## 📌 Color System Principles

1. **Tailwind Neutral**: Independent color system (neutral-*)
2. **PrimeVue Surface**: Theme-aware surface colors (--p-surface-*)
3. **Semantic Tokens**: Context-aware colors that change with theme
4. **CSS Variables**: PrimeVue uses CSS variables for dynamic theming

## 🛠 Troubleshooting

### Statistics Not Loading
- Check browser console for errors
- Ensure JSON files are in the same directory
- Verify JSON syntax is valid

### Colors Not Displaying
- Check `tailwind.json` format
- Verify `primevue-color-tokens.json` structure
- Ensure proper JSON escaping of color values

### Analysis Scripts Failing
- Ensure Node.js is installed
- Scripts must be run from ComfyUI_frontend root
- Check file permissions