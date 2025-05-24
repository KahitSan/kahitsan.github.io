const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const AutoCSSAnalyzer = require('./auto-css-analyzer');

const execAsync = promisify(exec);

class TailwindV4Builder {
  constructor() {
    this.analyzer = new AutoCSSAnalyzer();
    this.outputDir = '_site/css';
    this.sourceCSS = 'src/css/tailwind.css';
    this.configFile = 'css-routes-config.json';
    this.tempDir = '.temp-css';
    this.tailwindCommand = null;
    
    // Ensure directories exist
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  // Detect Tailwind version and command
  async detectTailwindVersion() {
    try {
      const { stdout } = await execAsync('npx tailwindcss --help');
      if (stdout.includes('v4.') || stdout.includes('version 4')) {
        console.log('✅ Detected Tailwind CSS v4');
        return 'v4';
      } else {
        console.log('✅ Detected Tailwind CSS v3');
        return 'v3';
      }
    } catch (error) {
      console.log('⚠️  Could not detect Tailwind version, assuming v3');
      return 'v3';
    }
  }

  // Create source CSS with explicit base styles for v4
  createV4SourceCSS() {
    const v4SourcePath = path.join(this.tempDir, 'tailwind-v4-source.css');
    
    // For v4, we need to be more explicit about including base styles
    const v4CSS = `@import "tailwindcss";

/* Force base styles inclusion */
@layer base {
  /* Tailwind's base reset */
  *, ::before, ::after {
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: theme(borderColor.DEFAULT, currentColor);
  }

  ::before, ::after {
    --tw-content: '';
  }

  html, :host {
    line-height: 1.5;
    -webkit-text-size-adjust: 100%;
    -moz-tab-size: 4;
    tab-size: 4;
    font-family: theme(fontFamily.sans, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji");
    font-feature-settings: theme(fontFamily.sans[1], normal);
    font-variation-settings: theme(fontFamily.sans[2], normal);
    -webkit-tap-highlight-color: transparent;
  }

  body {
    margin: 0;
    line-height: inherit;
    background-color: #121212;
    color: #e0e0e0;
  }

  hr {
    height: 0;
    color: inherit;
    border-top-width: 1px;
  }

  abbr:where([title]) {
    text-decoration: underline dotted;
  }

  h1, h2, h3, h4, h5, h6 {
    font-size: inherit;
    font-weight: inherit;
  }

  a {
    color: inherit;
    text-decoration: inherit;
  }

  b, strong {
    font-weight: bolder;
  }

  code, kbd, samp, pre {
    font-family: theme(fontFamily.mono, ui-monospace, SFMono-Regular, "Menlo", "Consolas", "Liberation Mono", "Courier New", monospace);
    font-feature-settings: theme(fontFamily.mono[1], normal);
    font-variation-settings: theme(fontFamily.mono[2], normal);
    font-size: 1em;
  }

  small {
    font-size: 80%;
  }

  sub, sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }

  sub {
    bottom: -0.25em;
  }

  sup {
    top: -0.5em;
  }

  table {
    text-indent: 0;
    border-color: inherit;
    border-collapse: collapse;
  }

  button, input, optgroup, select, textarea {
    font-family: inherit;
    font-feature-settings: inherit;
    font-variation-settings: inherit;
    font-size: 100%;
    font-weight: inherit;
    line-height: inherit;
    letter-spacing: inherit;
    color: inherit;
    margin: 0;
    padding: 0;
  }

  button, select {
    text-transform: none;
  }

  button, input:where([type='button']), input:where([type='reset']), input:where([type='submit']) {
    -webkit-appearance: button;
    background-color: transparent;
    background-image: none;
  }

  :-moz-focusring {
    outline: auto;
  }

  :-moz-ui-invalid {
    box-shadow: none;
  }

  progress {
    vertical-align: baseline;
  }

  ::-webkit-inner-spin-button, ::-webkit-outer-spin-button {
    height: auto;
  }

  [type='search'] {
    -webkit-appearance: textfield;
    outline-offset: -2px;
  }

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  ::-webkit-file-upload-button {
    -webkit-appearance: button;
    font: inherit;
  }

  summary {
    display: list-item;
  }

  blockquote, dl, dd, h1, h2, h3, h4, h5, h6, hr, figure, p, pre {
    margin: 0;
  }

  fieldset {
    margin: 0;
    padding: 0;
  }

  legend {
    padding: 0;
  }

  ol, ul, menu {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  dialog {
    padding: 0;
  }

  textarea {
    resize: vertical;
  }

  input::placeholder, textarea::placeholder {
    opacity: 1;
    color: theme(colors.gray.400, #9ca3af);
  }

  button, [role="button"] {
    cursor: pointer;
  }

  :disabled {
    cursor: default;
  }

  img, svg, video, canvas, audio, iframe, embed, object {
    display: block;
    vertical-align: middle;
  }

  img, video {
    max-width: 100%;
    height: auto;
  }

  [hidden] {
    display: none;
  }
}

/* Your custom styles */
html {
  scroll-behavior: smooth;
}

/* Custom color utilities */
@layer utilities {
  .bg-dark {
    background-color: #121212;
  }
  .bg-dark-secondary {
    background-color: #1e1e1e;
  }
  .bg-gold {
    background-color: #80570d;
  }
  .bg-gold-light {
    background-color: #b38728;
  }
  .text-gold {
    color: #80570d;
  }
  .text-gold-light {
    color: #b38728;
  }
  .border-gold {
    border-color: #80570d;
  }
  .shadow-gold {
    box-shadow: 0 4px 12px rgba(179, 135, 40, 0.15);
  }
  .shadow-gold-lg {
    box-shadow: 0 10px 25px rgba(179, 135, 40, 0.25);
  }
}
`;

    fs.writeFileSync(v4SourcePath, v4CSS);
    return v4SourcePath;
  }

  // Load or generate CSS configuration
  loadConfig() {
    if (fs.existsSync(this.configFile)) {
      console.log('📖 Loading existing CSS configuration...');
      const config = JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
      return config.pages;
    } else {
      console.log('🔍 No existing configuration found, analyzing project...');
      return this.analyzer.analyzeProject();
    }
  }

  // Create temporary HTML file for v4
  createTempHTML(routeName, classes) {
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
    
    const tempHtmlPath = path.join(this.tempDir, `${routeName}.html`);
    
    // Create comprehensive HTML with all base elements and detected classes
    const classesHtml = classes.map(cls => `<div class="${cls}"></div>`).join('\n');
    
    const htmlContent = `<!DOCTYPE html>
<html lang="en" class="antialiased">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Comprehensive HTML for ${routeName}</title>
</head>
<body class="font-sans">
  <!-- Base HTML elements to ensure styles are generated -->
  <main class="container mx-auto">
    <header class="relative">
      <nav class="flex items-center justify-between">
        <a href="#" class="text-blue-600 hover:text-blue-800 underline">Navigation Link</a>
        <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2">
          Button Element
        </button>
      </nav>
      
      <!-- All heading levels -->
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Main Heading H1</h1>
      <h2 class="text-3xl font-semibold text-gray-800 mb-3">Secondary Heading H2</h2>
      <h3 class="text-2xl font-medium text-gray-700 mb-2">Tertiary Heading H3</h3>
      <h4 class="text-xl font-normal text-gray-600 mb-2">Quaternary Heading H4</h4>
      <h5 class="text-lg text-gray-500 mb-1">Quinary Heading H5</h5>
      <h6 class="text-base text-gray-400 mb-1">Senary Heading H6</h6>
    </header>
    
    <section class="py-8">
      <article class="prose max-w-none">
        <p class="text-gray-700 leading-relaxed mb-4">
          This is a paragraph with <strong class="font-bold">bold text</strong>, 
          <em class="italic">italic text</em>, and <code class="bg-gray-100 px-1 rounded">inline code</code>.
        </p>
        
        <!-- Lists -->
        <ul class="list-disc list-inside mb-4 space-y-1">
          <li class="text-gray-600">Unordered list item 1</li>
          <li class="text-gray-600">Unordered list item 2</li>
          <li class="text-gray-600">Unordered list item 3</li>
        </ul>
        
        <ol class="list-decimal list-inside mb-4 space-y-1">
          <li class="text-gray-600">Ordered list item 1</li>
          <li class="text-gray-600">Ordered list item 2</li>
          <li class="text-gray-600">Ordered list item 3</li>
        </ol>
        
        <blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4">
          This is a blockquote element that should inherit proper styling.
        </blockquote>
        
        <pre class="bg-gray-100 p-4 rounded text-sm overflow-x-auto mb-4"><code>// This is preformatted code block
function example() {
  return "Hello, World!";
}</code></pre>
      </article>
    </section>
    
    <!-- Form elements -->
    <section class="py-8 border-t border-gray-200">
      <form class="space-y-4 max-w-md">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Text Input</label>
          <input type="text" placeholder="Enter text here..." 
                 class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Textarea</label>
          <textarea rows="3" placeholder="Enter longer text here..." 
                    class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Select</label>
          <select class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
          </select>
        </div>
        
        <button type="submit" 
                class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Submit Form
        </button>
      </form>
    </section>
    
    <!-- Table -->
    <section class="py-8 border-t border-gray-200">
      <table class="w-full border-collapse border border-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Header 1</th>
            <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Header 2</th>
            <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Header 3</th>
          </tr>
        </thead>
        <tbody>
          <tr class="hover:bg-gray-50">
            <td class="border border-gray-300 px-4 py-2">Cell 1</td>
            <td class="border border-gray-300 px-4 py-2">Cell 2</td>
            <td class="border border-gray-300 px-4 py-2">Cell 3</td>
          </tr>
          <tr class="hover:bg-gray-50">
            <td class="border border-gray-300 px-4 py-2">Cell 4</td>
            <td class="border border-gray-300 px-4 py-2">Cell 5</td>
            <td class="border border-gray-300 px-4 py-2">Cell 6</td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>
  
  <!-- All detected classes from the analyzer -->
  <div class="detected-classes-container hidden">
    ${classesHtml}
  </div>
  
  <!-- Additional utility combinations to ensure they're generated -->
  <div class="utility-combinations hidden">
    <!-- Responsive utilities -->
    <div class="sm:text-sm md:text-base lg:text-lg xl:text-xl"></div>
    <div class="sm:block md:flex lg:grid xl:hidden"></div>
    <div class="sm:px-2 md:px-4 lg:px-6 xl:px-8"></div>
    
    <!-- Interactive states -->
    <div class="hover:bg-gray-100 hover:text-gray-900 hover:scale-105"></div>
    <div class="focus:outline-none focus:ring-2 focus:ring-blue-500"></div>
    <div class="active:scale-95 active:bg-gray-200"></div>
    <div class="disabled:opacity-50 disabled:cursor-not-allowed"></div>
    
    <!-- Custom color combinations -->
    <div class="bg-dark text-white"></div>
    <div class="bg-dark-secondary text-gray-300"></div>
    <div class="bg-gold text-white"></div>
    <div class="bg-gold-light text-gray-900"></div>
    <div class="text-gold border-gold"></div>
    <div class="text-gold-light border-gold"></div>
    
    <!-- Layout combinations -->
    <div class="container mx-auto px-4 py-8"></div>
    <div class="flex items-center justify-between space-x-4"></div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
    
    <!-- Effect combinations -->
    <div class="shadow-lg rounded-lg border border-gray-200"></div>
    <div class="shadow-gold rounded-md border-gold"></div>
    <div class="transition duration-300 ease-in-out transform hover:scale-105"></div>
  </div>
</body>
</html>`;

    fs.writeFileSync(tempHtmlPath, htmlContent);
    return tempHtmlPath;
  }

  // Build CSS for a route using v4 approach
  async buildRouteCSS(routeConfig) {
    const { route, classes } = routeConfig;
    console.log(`🔨 Building ${route}.css (${classes.length} classes) with Tailwind v4`);

    try {
      // Detect Tailwind version
      const version = await this.detectTailwindVersion();
      
      // Create source CSS based on version
      let sourceCSS;
      if (version === 'v4') {
        sourceCSS = this.createV4SourceCSS();
        console.log('📝 Created v4-compatible source CSS with explicit base styles');
      } else {
        sourceCSS = this.sourceCSS;
      }

      // Create temporary HTML
      console.log(`📝 Creating comprehensive HTML for ${route}...`);
      const tempHtmlPath = this.createTempHTML(route, classes);
      const outputPath = `${this.outputDir}/${route}.css`;

      // For v4, we use a simpler approach - just scan the HTML directly
      const minifyFlag = process.env.NODE_ENV === 'production' ? '--minify' : '';
      const command = `npx tailwindcss -i "${sourceCSS}" -o "${outputPath}" --content "${tempHtmlPath}" ${minifyFlag}`.trim();
      
      console.log(`🏗️  Running: ${command}`);
      
      const { stdout, stderr } = await execAsync(command, { 
        timeout: 45000,
        cwd: process.cwd()
      });
      
      if (stderr && !stderr.includes('Done in') && !stderr.includes('Finished in')) {
        console.warn('⚠️  Tailwind output:', stderr);
      }

      // Check if file was created and get size
      if (fs.existsSync(outputPath)) {
        const stats = fs.statSync(outputPath);
        const sizeKB = (stats.size / 1024).toFixed(1);
        console.log(`✅ ${route}.css generated (${sizeKB}KB)`);

        // Clean up temp files
        this.cleanupTempFiles(tempHtmlPath, sourceCSS === this.sourceCSS ? null : sourceCSS);

        return {
          route,
          outputPath,
          size: stats.size,
          sizeKB: parseFloat(sizeKB),
          classCount: classes.length
        };
      } else {
        throw new Error('Output file was not created');
      }

    } catch (error) {
      console.error(`❌ Error building ${route}.css:`, error.message);
      
      // Fallback: create basic CSS with custom styles
      return await this.createBasicFallback(routeConfig);
    }
  }

  // Clean up temporary files
  cleanupTempFiles(tempHtmlPath, tempSourcePath) {
    try {
      if (tempHtmlPath && fs.existsSync(tempHtmlPath)) {
        fs.unlinkSync(tempHtmlPath);
      }
      if (tempSourcePath && tempSourcePath !== this.sourceCSS && fs.existsSync(tempSourcePath)) {
        fs.unlinkSync(tempSourcePath);
      }
    } catch (error) {
      console.warn('⚠️  Could not clean up temp files:', error.message);
    }
  }

  // Create basic fallback with custom styles
  async createBasicFallback(routeConfig) {
    console.log('🔄 Creating enhanced fallback CSS...');
    
    const { route } = routeConfig;
    const outputPath = `${this.outputDir}/${route}.css`;
    
    try {
      // Create a comprehensive fallback CSS with base styles
      const fallbackCSS = `/* Enhanced Fallback CSS for ${route} */

/* Base styles */
*, ::before, ::after {
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: currentColor;
}

html {
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
  scroll-behavior: smooth;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
}

body {
  margin: 0;
  line-height: inherit;
  background-color: #121212;
  color: #e0e0e0;
}

h1, h2, h3, h4, h5, h6 {
  font-size: inherit;
  font-weight: inherit;
  margin: 0;
}

p, blockquote, dl, dd, figure, pre {
  margin: 0;
}

a {
  color: inherit;
  text-decoration: inherit;
}

button, input, optgroup, select, textarea {
  font-family: inherit;
  font-size: 100%;
  font-weight: inherit;
  line-height: inherit;
  color: inherit;
  margin: 0;
  padding: 0;
}

button, [role="button"] {
  cursor: pointer;
}

img, svg, video, canvas, audio, iframe, embed, object {
  display: block;
  vertical-align: middle;
}

img, video {
  max-width: 100%;
  height: auto;
}

/* Essential utilities */
.container { width: 100%; }
.mx-auto { margin-left: auto; margin-right: auto; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.py-4 { padding-top: 1rem; padding-bottom: 1rem; }
.flex { display: flex; }
.grid { display: grid; }
.hidden { display: none; }
.block { display: block; }
.relative { position: relative; }
.absolute { position: absolute; }
.fixed { position: fixed; }
.text-center { text-align: center; }
.font-bold { font-weight: 700; }
.font-semibold { font-weight: 600; }
.text-white { color: rgb(255 255 255); }
.bg-white { background-color: rgb(255 255 255); }
.border { border-width: 1px; }
.rounded { border-radius: 0.25rem; }

/* Custom colors */
.bg-dark { background-color: #121212; }
.bg-dark-secondary { background-color: #1e1e1e; }
.bg-gold { background-color: #80570d; }
.bg-gold-light { background-color: #b38728; }
.text-gold { color: #80570d; }
.text-gold-light { color: #b38728; }
.border-gold { border-color: #80570d; }
.shadow-gold { box-shadow: 0 4px 12px rgba(179, 135, 40, 0.15); }
.shadow-gold-lg { box-shadow: 0 10px 25px rgba(179, 135, 40, 0.25); }
`;
      
      fs.writeFileSync(outputPath, fallbackCSS);
      
      const sizeKB = (fallbackCSS.length / 1024).toFixed(1);
      console.log(`📋 Enhanced fallback created: ${route}.css (${sizeKB}KB)`);
      
      return {
        route,
        outputPath,
        size: fallbackCSS.length,
        sizeKB: parseFloat(sizeKB),
        classCount: 0
      };
    } catch (error) {
      console.error(`❌ Even enhanced fallback failed:`, error.message);
      throw error;
    }
  }

  // Build all routes
  async buildAll() {
    console.log('🚀 Starting Tailwind v4 compatible CSS build...\n');

    const routeConfigs = this.loadConfig();
    
    if (Object.keys(routeConfigs).length === 0) {
      console.log('⚠️  No routes found to build CSS for');
      return [];
    }

    console.log(`🏗️  Building CSS for ${Object.keys(routeConfigs).length} routes...\n`);

    const results = [];

    for (const [routeName, config] of Object.entries(routeConfigs)) {
      try {
        const result = await this.buildRouteCSS(config);
        results.push(result);
      } catch (error) {
        console.error(`❌ Complete failure for ${routeName}:`, error.message);
      }
    }

    this.generateBuildReport(results);
    return results;
  }

  // Generate build report
  generateBuildReport(results) {
    if (results.length === 0) {
      console.log('❌ No CSS files were generated');
      return;
    }

    const totalSize = results.reduce((sum, r) => sum + r.sizeKB, 0);
    const averageSize = totalSize / results.length;
    const originalSize = 2800;
    const savings = originalSize - totalSize;
    const savingsPercent = (savings / originalSize * 100);

    console.log('\n📊 Build Results:');
    console.log('=================');
    
    results.forEach(result => {
      console.log(`📄 ${result.route}.css: ${result.sizeKB}KB (${result.classCount} classes)`);
    });

    console.log('\n🎯 Summary:');
    console.log(`   Files Generated: ${results.length}`);
    console.log(`   Total Size: ${totalSize.toFixed(1)}KB`);
    console.log(`   Average Size: ${averageSize.toFixed(1)}KB`);
    console.log(`   Original Size: ${originalSize.toFixed(0)}KB`);
    console.log(`   Total Savings: ${savings.toFixed(1)}KB (${savingsPercent.toFixed(1)}%)`);
    console.log(`   Compression Ratio: ${(originalSize / totalSize).toFixed(1)}x smaller`);

    const report = {
      timestamp: new Date().toISOString(),
      buildResults: results,
      summary: {
        filesGenerated: results.length,
        totalSizeKB: totalSize,
        averageSizeKB: averageSize,
        originalSizeKB: originalSize,
        savingsKB: savings,
        savingsPercent: savingsPercent,
        compressionRatio: originalSize / totalSize
      }
    };

    fs.writeFileSync('css-build-report.json', JSON.stringify(report, null, 2));
    console.log('\n📋 Detailed report saved to css-build-report.json');

    return report;
  }

  // Clean method
  clean() {
    if (fs.existsSync(this.outputDir)) {
      const files = fs.readdirSync(this.outputDir);
      files.forEach(file => {
        if (file.endsWith('.css') || file.endsWith('.css.map')) {
          fs.unlinkSync(path.join(this.outputDir, file));
        }
      });
      console.log('🧹 Cleaned CSS output directory');
    }

    if (fs.existsSync(this.tempDir)) {
      const tempFiles = fs.readdirSync(this.tempDir);
      tempFiles.forEach(file => {
        const filePath = path.join(this.tempDir, file);
        if (fs.statSync(filePath).isFile()) {
          fs.unlinkSync(filePath);
        }
      });
      console.log('🧹 Cleaned temp directory');
    }
  }

  // Rebuild method
  async rebuild() {
    console.log('🔄 Force rebuilding with v4 compatibility...');
    
    if (fs.existsSync(this.configFile)) {
      fs.unlinkSync(this.configFile);
    }
    
    this.clean();
    await this.buildAll();
  }
}

// CLI usage
if (require.main === module) {
  const builder = new TailwindV4Builder();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'build':
      builder.buildAll().catch(console.error);
      break;
    case 'rebuild':
      builder.rebuild().catch(console.error);
      break;
    case 'clean':
      builder.clean();
      break;
    default:
      console.log(`
🎨 Tailwind v4 CSS Builder
==========================

Usage: node tailwind-v4-builder.js [command]

Commands:
  build     - Build optimized CSS with v4 compatibility
  rebuild   - Force re-analysis and rebuild with base styles
  clean     - Remove generated CSS files

This builder is specifically designed for Tailwind CSS v4
and ensures base styles (html, body, typography) are included.

Examples:
  node tailwind-v4-builder.js rebuild
  node tailwind-v4-builder.js build
      `);
  }
}

module.exports = TailwindV4Builder;