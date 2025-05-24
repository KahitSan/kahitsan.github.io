const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const AutoCSSAnalyzer = require('./auto-css-analyzer');

const execAsync = promisify(exec);

class RobustCSSBuilder {
  constructor() {
    this.analyzer = new AutoCSSAnalyzer();
    this.outputDir = '_site/css';
    this.sourceCSS = 'src/css/tailwind.css';
    this.configFile = 'css-routes-config.json';
    this.tempDir = '.temp-css';
    this.tailwindCommand = null; // Will be determined at runtime
    
    // Ensure directories exist
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  // Detect which Tailwind command works
  async detectTailwindCommand() {
    if (this.tailwindCommand) {
      return this.tailwindCommand;
    }

    const commands = [
      'npx tailwindcss',
      './node_modules/.bin/tailwindcss',
      'node ./node_modules/tailwindcss/lib/cli.js',
      'tailwindcss'
    ];

    console.log('🔍 Detecting Tailwind CSS command...');

    for (const cmd of commands) {
      try {
        await execAsync(`${cmd} --help`, { timeout: 5000 });
        console.log(`✅ Found working command: ${cmd}`);
        this.tailwindCommand = cmd;
        return cmd;
      } catch (error) {
        console.log(`❌ Failed: ${cmd}`);
      }
    }

    throw new Error('No working Tailwind CSS command found. Please install tailwindcss properly.');
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

  // Create temporary HTML file with all classes for Tailwind to scan
  createTempHTML(routeName, classes) {
    // Ensure temp directory exists
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
    
    const tempHtmlPath = path.join(this.tempDir, `${routeName}.html`);
    
    // Create HTML content that uses all the detected classes
    const classesHtml = classes.map(cls => `<div class="${cls}"></div>`).join('\n');
    
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Temp file for ${routeName}</title>
</head>
<body>
  <!-- Base HTML elements to ensure Tailwind base styles are included -->
  <main>
    <header>
      <nav>
        <a href="#">Link</a>
        <button>Button</button>
      </nav>
      <h1>Heading 1</h1>
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
      <h4>Heading 4</h4>
      <h5>Heading 5</h5>
      <h6>Heading 6</h6>
    </header>
    
    <section>
      <article>
        <p>Paragraph text with <strong>bold</strong> and <em>italic</em> text.</p>
        <ul>
          <li>List item 1</li>
          <li>List item 2</li>
        </ul>
        <ol>
          <li>Ordered item 1</li>
          <li>Ordered item 2</li>
        </ol>
        <blockquote>Blockquote text</blockquote>
        <code>Inline code</code>
        <pre>Preformatted text</pre>
      </article>
    </section>
    
    <footer>
      <form>
        <input type="text" placeholder="Input field">
        <textarea placeholder="Textarea"></textarea>
        <select>
          <option>Option 1</option>
          <option>Option 2</option>
        </select>
        <button type="submit">Submit</button>
      </form>
      
      <table>
        <thead>
          <tr>
            <th>Header 1</th>
            <th>Header 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Cell 1</td>
            <td>Cell 2</td>
          </tr>
        </tbody>
      </table>
    </footer>
  </main>
  
  <!-- All detected classes -->
  <div class="detected-classes">
    ${classesHtml}
  </div>
  
  <!-- Ensure common responsive and state variants are included -->
  <div class="variants">
    <div class="hover:bg-gray-100 focus:outline-none active:scale-95"></div>
    <div class="md:text-lg lg:text-xl xl:text-2xl"></div>
    <div class="sm:block md:flex lg:grid xl:hidden"></div>
    <div class="transition duration-300 ease-in-out transform"></div>
  </div>
</body>
</html>`;

    fs.writeFileSync(tempHtmlPath, htmlContent);
    return tempHtmlPath;
  }

  // Create temporary Tailwind config for this specific route
  createTempTailwindConfig(routeName, tempHtmlPath, classes) {
    // Ensure temp directory exists
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
    
    const tempConfigPath = path.join(this.tempDir, `tailwind.${routeName}.js`);
    
    // Load base config or create default
    let baseConfig;
    try {
      baseConfig = require('./tailwind.config.js');
    } catch (error) {
      baseConfig = {
        theme: {
          extend: {
            colors: {
              'dark': '#121212',
              'dark-secondary': '#1e1e1e',
              'gold': '#80570d',
              'gold-light': '#b38728',
            }
          }
        },
        plugins: []
      };
    }

    // Comprehensive safelist to ensure common utilities are preserved
    const comprehensiveSafelist = [
      // Detected classes
      ...classes,
      
      // Base element styles (ensure Tailwind base is preserved)
      'html', 'body', 'main', 'section', 'article', 'header', 'footer', 'nav', 'aside',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'strong', 'em', 'small',
      'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'blockquote', 'pre', 'code',
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
      'form', 'input', 'textarea', 'select', 'option', 'button', 'label',
      'img', 'figure', 'figcaption', 'video', 'audio', 'canvas', 'svg',
      
      // Typography base classes
      'antialiased', 'subpixel-antialiased', 'font-sans', 'font-serif', 'font-mono',
      'prose', 'prose-sm', 'prose-lg', 'prose-xl',
      
      // Essential layout classes
      'container', 'mx-auto', 'px-4', 'py-4', 'px-8', 'py-8', 'px-6', 'py-6',
      'px-2', 'py-2', 'px-3', 'py-3', 'px-12', 'py-12', 'px-16', 'py-16',
      
      // Display and positioning
      'flex', 'grid', 'block', 'inline', 'inline-block', 'hidden',
      'relative', 'absolute', 'fixed', 'static', 'sticky',
      
      // Flexbox and grid
      'flex-col', 'flex-row', 'items-center', 'items-start', 'items-end', 'items-stretch',
      'justify-center', 'justify-start', 'justify-end', 'justify-between', 'justify-around',
      'grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'grid-cols-4', 'grid-cols-12',
      'gap-2', 'gap-4', 'gap-6', 'gap-8', 'space-x-2', 'space-x-4', 'space-x-6', 'space-x-8',
      'space-y-2', 'space-y-4', 'space-y-6', 'space-y-8',
      
      // Colors and backgrounds
      'bg-white', 'bg-black', 'bg-gray-100', 'bg-gray-200', 'bg-gray-300', 'bg-gray-400',
      'bg-gray-500', 'bg-gray-600', 'bg-gray-700', 'bg-gray-800', 'bg-gray-900',
      'text-white', 'text-black', 'text-gray-100', 'text-gray-200', 'text-gray-300',
      'text-gray-400', 'text-gray-500', 'text-gray-600', 'text-gray-700', 'text-gray-800', 'text-gray-900',
      'bg-dark', 'bg-dark-secondary', 'bg-gold', 'bg-gold-light',
      'text-gold', 'text-gold-light',
      
      // Borders
      'border', 'border-0', 'border-2', 'border-4', 'border-8',
      'border-t', 'border-r', 'border-b', 'border-l',
      'border-solid', 'border-dashed', 'border-dotted',
      'border-white', 'border-black', 'border-gray-100', 'border-gray-200', 'border-gray-300',
      'border-gray-400', 'border-gray-500', 'border-gray-600', 'border-gray-700', 'border-gray-800', 'border-gray-900',
      'border-gold', 'border-gold-light',
      'rounded', 'rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-full',
      'rounded-t', 'rounded-r', 'rounded-b', 'rounded-l',
      
      // Typography
      'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl',
      'font-thin', 'font-light', 'font-normal', 'font-medium', 'font-semibold', 'font-bold', 'font-extrabold',
      'text-left', 'text-center', 'text-right', 'text-justify',
      'leading-none', 'leading-tight', 'leading-snug', 'leading-normal', 'leading-relaxed', 'leading-loose',
      'tracking-tighter', 'tracking-tight', 'tracking-normal', 'tracking-wide', 'tracking-wider', 'tracking-widest',
      'uppercase', 'lowercase', 'capitalize', 'normal-case',
      'underline', 'no-underline', 'line-through',
      
      // Width and height
      'w-full', 'w-auto', 'w-screen', 'w-1/2', 'w-1/3', 'w-2/3', 'w-1/4', 'w-3/4',
      'w-4', 'w-6', 'w-8', 'w-10', 'w-12', 'w-16', 'w-20', 'w-24', 'w-32',
      'h-full', 'h-auto', 'h-screen', 'h-1/2', 'h-1/3', 'h-2/3', 'h-1/4', 'h-3/4',
      'h-4', 'h-6', 'h-8', 'h-10', 'h-12', 'h-16', 'h-20', 'h-24', 'h-32',
      'min-h-screen', 'max-w-sm', 'max-w-md', 'max-w-lg', 'max-w-xl', 'max-w-2xl', 'max-w-3xl',
      
      // Shadows and effects
      'shadow', 'shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl',
      'shadow-gold', 'shadow-gold-lg',
      'opacity-0', 'opacity-25', 'opacity-50', 'opacity-75', 'opacity-100',
      
      // Transitions and transforms
      'transition', 'transition-all', 'transition-colors', 'transition-opacity', 'transition-transform',
      'duration-75', 'duration-100', 'duration-150', 'duration-200', 'duration-300', 'duration-500', 'duration-700', 'duration-1000',
      'ease-linear', 'ease-in', 'ease-out', 'ease-in-out',
      'transform', 'scale-95', 'scale-100', 'scale-105', 'scale-110',
      'translate-x-0', 'translate-y-0', '-translate-y-1', '-translate-y-2',
      
      // Interactive states
      'hover:bg-gray-100', 'hover:bg-gray-700', 'hover:text-white', 'hover:text-gold', 'hover:text-gold-light',
      'hover:border-gold', 'hover:shadow-lg', 'hover:scale-105', 'hover:-translate-y-1',
      'focus:outline-none', 'focus:ring-2', 'focus:ring-gold', 'focus:ring-opacity-50',
      'active:scale-95', 'active:bg-gray-800',
      
      // Responsive breakpoints
      'sm:block', 'sm:flex', 'sm:grid', 'sm:hidden',
      'md:block', 'md:flex', 'md:grid', 'md:hidden', 'md:text-lg', 'md:text-xl', 'md:text-2xl', 'md:text-3xl', 'md:text-4xl', 'md:text-5xl',
      'md:grid-cols-2', 'md:grid-cols-3', 'md:grid-cols-4', 'md:flex-row', 'md:flex-col',
      'lg:block', 'lg:flex', 'lg:grid', 'lg:hidden', 'lg:text-lg', 'lg:text-xl', 'lg:text-2xl', 'lg:text-3xl', 'lg:text-4xl', 'lg:text-5xl',
      'lg:grid-cols-2', 'lg:grid-cols-3', 'lg:grid-cols-4', 'lg:col-span-1', 'lg:col-span-2',
      'xl:block', 'xl:flex', 'xl:grid', 'xl:hidden',
      
      // Z-index and positioning
      'z-0', 'z-10', 'z-20', 'z-30', 'z-40', 'z-50',
      'top-0', 'right-0', 'bottom-0', 'left-0',
      'inset-0', 'inset-x-0', 'inset-y-0',
      
      // Form elements
      'appearance-none', 'focus:ring', 'focus:border-blue-500',
      'disabled:opacity-50', 'disabled:cursor-not-allowed',
      
      // Lists
      'list-none', 'list-disc', 'list-decimal',
      
      // Overflow
      'overflow-hidden', 'overflow-auto', 'overflow-scroll',
      'overflow-x-hidden', 'overflow-y-hidden',
      
      // Cursor
      'cursor-pointer', 'cursor-not-allowed', 'cursor-default'
    ];

    const configContent = `module.exports = {
  content: ['${tempHtmlPath.replace(/\\/g, '/')}'],
  safelist: ${JSON.stringify([...new Set(comprehensiveSafelist)], null, 2)},
  theme: ${JSON.stringify(baseConfig.theme || {}, null, 2)},
  corePlugins: {
    // Ensure base styles are always included
    preflight: true,
  },
  plugins: []
};`;

    fs.writeFileSync(tempConfigPath, configContent);
    return tempConfigPath;
  }

  // Build CSS using detected Tailwind command
  async buildRouteCSS(routeConfig) {
    const { route, classes } = routeConfig;
    console.log(`🔨 Building ${route}.css (${classes.length} classes)`);

    try {
      // Detect Tailwind command if not already done
      const tailwindCmd = await this.detectTailwindCommand();

      // Create temporary files
      console.log(`📝 Creating temp HTML for ${route}...`);
      const tempHtmlPath = this.createTempHTML(route, classes);
      console.log(`📝 Creating temp config for ${route}...`);
      const tempConfigPath = this.createTempTailwindConfig(route, tempHtmlPath, classes);
      const outputPath = `${this.outputDir}/${route}.css`;

      // Verify temp files were created
      if (!fs.existsSync(tempHtmlPath)) {
        throw new Error(`Temp HTML file was not created: ${tempHtmlPath}`);
      }
      if (!fs.existsSync(tempConfigPath)) {
        throw new Error(`Temp config file was not created: ${tempConfigPath}`);
      }

      console.log(`✅ Temp files created: ${path.basename(tempHtmlPath)}, ${path.basename(tempConfigPath)}`);

      // Build CSS using Tailwind
      const minifyFlag = process.env.NODE_ENV === 'production' ? '--minify' : '';
      const command = `${tailwindCmd} -i "${this.sourceCSS}" -o "${outputPath}" -c "${tempConfigPath}" ${minifyFlag}`.trim();
      
      console.log(`🏗️  Running: ${command}`);
      
      const { stdout, stderr } = await execAsync(command, { 
        timeout: 30000,
        cwd: process.cwd()
      });
      
      if (stderr && !stderr.includes('Done in') && !stderr.includes('Finished in')) {
        console.warn('⚠️  Tailwind warnings:', stderr);
      }

      // Check if file was created and get size
      if (fs.existsSync(outputPath)) {
        const stats = fs.statSync(outputPath);
        const sizeKB = (stats.size / 1024).toFixed(1);
        console.log(`✅ ${route}.css generated (${sizeKB}KB)`);

        // Clean up temp files
        this.cleanupTempFiles(tempHtmlPath, tempConfigPath);

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
      
      // Try PostCSS fallback
      return await this.buildWithPostCSS(routeConfig);
    }
  }

  // Fallback: Build with PostCSS if Tailwind CLI fails
  async buildWithPostCSS(routeConfig) {
    console.log('🔄 Trying PostCSS fallback...');
    
    try {
      const postcss = require('postcss');
      const autoprefixer = require('autoprefixer');
      
      // Try to load tailwindcss
      let tailwindcss;
      try {
        tailwindcss = require('tailwindcss');
      } catch (error) {
        try {
          tailwindcss = require('@tailwindcss/postcss');
        } catch (error2) {
          throw new Error('Neither tailwindcss nor @tailwindcss/postcss found');
        }
      }

      const { route, classes } = routeConfig;
      const outputPath = `${this.outputDir}/${route}.css`;

      // Create temp HTML and config (with directory check)
      console.log(`📝 Creating temp files for PostCSS fallback...`);
      const tempHtmlPath = this.createTempHTML(route, classes);
      const tempConfigPath = this.createTempTailwindConfig(route, tempHtmlPath, classes);

      // Verify temp files exist
      if (!fs.existsSync(tempHtmlPath) || !fs.existsSync(tempConfigPath)) {
        throw new Error('Could not create temp files for PostCSS fallback');
      }

      // Read source CSS
      const css = fs.readFileSync(this.sourceCSS, 'utf8');

      // Process with PostCSS
      const result = await postcss([
        tailwindcss(require(path.resolve(tempConfigPath))),
        autoprefixer
      ]).process(css, { 
        from: this.sourceCSS,
        to: outputPath 
      });

      // Write output
      fs.writeFileSync(outputPath, result.css);

      const sizeKB = (result.css.length / 1024).toFixed(1);
      console.log(`✅ ${route}.css generated via PostCSS (${sizeKB}KB)`);

      // Clean up temp files
      this.cleanupTempFiles(tempHtmlPath, tempConfigPath);

      return {
        route,
        outputPath,
        size: result.css.length,
        sizeKB: parseFloat(sizeKB),
        classCount: classes.length
      };

    } catch (error) {
      console.error(`❌ PostCSS fallback failed:`, error.message);
      
      // Final fallback: copy source CSS
      return await this.createBasicFallback(routeConfig);
    }
  }

  // Final fallback: create a basic CSS file
  async createBasicFallback(routeConfig) {
    console.log('🔄 Creating basic fallback CSS...');
    
    const { route } = routeConfig;
    const outputPath = `${this.outputDir}/${route}.css`;
    
    try {
      // Read source CSS and add basic comment
      const sourceCss = fs.readFileSync(this.sourceCSS, 'utf8');
      const fallbackCss = `/* Fallback CSS for ${route} - Basic Tailwind */\n${sourceCss}`;
      
      fs.writeFileSync(outputPath, fallbackCss);
      
      const sizeKB = (fallbackCss.length / 1024).toFixed(1);
      console.log(`📋 Basic fallback created: ${route}.css (${sizeKB}KB)`);
      
      return {
        route,
        outputPath,
        size: fallbackCss.length,
        sizeKB: parseFloat(sizeKB),
        classCount: 0
      };
    } catch (error) {
      console.error(`❌ Even basic fallback failed:`, error.message);
      throw error;
    }
  }

  // Clean up temporary files
  cleanupTempFiles(tempHtmlPath, tempConfigPath) {
    try {
      if (fs.existsSync(tempHtmlPath)) fs.unlinkSync(tempHtmlPath);
      if (fs.existsSync(tempConfigPath)) fs.unlinkSync(tempConfigPath);
    } catch (error) {
      console.warn('⚠️  Could not clean up temp files:', error.message);
    }
  }

  // Build CSS for all routes
  async buildAll() {
    console.log('🚀 Starting robust CSS build...\n');

    // Check if source CSS exists
    if (!fs.existsSync(this.sourceCSS)) {
      console.error(`❌ Source CSS file not found: ${this.sourceCSS}`);
      console.log('💡 Create the file with:');
      console.log(`   mkdir -p ${path.dirname(this.sourceCSS)}`);
      console.log(`   echo "@tailwind base;\\n@tailwind components;\\n@tailwind utilities;" > ${this.sourceCSS}`);
      return [];
    }

    // Load configuration
    const routeConfigs = this.loadConfig();
    
    if (Object.keys(routeConfigs).length === 0) {
      console.log('⚠️  No routes found to build CSS for');
      return [];
    }

    console.log(`\n🏗️  Building CSS for ${Object.keys(routeConfigs).length} routes...\n`);

    const results = [];

    // Build CSS for each route
    for (const [routeName, config] of Object.entries(routeConfigs)) {
      try {
        const result = await this.buildRouteCSS(config);
        results.push(result);
      } catch (error) {
        console.error(`❌ Complete failure for ${routeName}:`, error.message);
      }
    }

    // Generate build report
    this.generateBuildReport(results);

    return results;
  }

  // Generate comprehensive build report
  generateBuildReport(results) {
    if (results.length === 0) {
      console.log('❌ No CSS files were generated');
      return;
    }

    const totalSize = results.reduce((sum, r) => sum + r.sizeKB, 0);
    const averageSize = totalSize / results.length;
    const originalSize = 2800; // Full Tailwind CSS size
    const savings = originalSize - totalSize;
    const savingsPercent = (savings / originalSize * 100);

    console.log('\n📊 Build Results:');
    console.log('=================');
    
    // Individual file results
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

    // Save detailed report
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

  // Watch for file changes and rebuild
  async watch() {
    console.log('👀 Starting watch mode...');
    
    try {
      const chokidar = require('chokidar');
      
      const watcher = chokidar.watch([
        'src/**/*.{njk,html}',
        'src/css/**/*.css',
        'tailwind.config.js'
      ], {
        ignored: /node_modules/,
        persistent: true
      });

      watcher.on('change', async (filePath) => {
        console.log(`\n🔄 File changed: ${filePath}`);
        console.log('🔍 Re-analyzing and rebuilding CSS...');
        
        try {
          // Re-analyze the project
          this.analyzer.analyzeProject();
          
          // Rebuild all CSS
          await this.buildAll();
          
          console.log('✅ CSS rebuilt successfully\n');
        } catch (error) {
          console.error('❌ Rebuild failed:', error.message);
        }
      });

      // Initial build
      await this.buildAll();
      
      console.log('\n✅ Initial build complete. Watching for changes...');
      
    } catch (error) {
      console.error('❌ Watch mode failed to start:', error.message);
      console.log('💡 Try: npm install -D chokidar');
    }
  }

  // Clean output and temp directories
  clean() {
    // Clean output directory
    if (fs.existsSync(this.outputDir)) {
      const files = fs.readdirSync(this.outputDir);
      files.forEach(file => {
        if (file.endsWith('.css') || file.endsWith('.css.map')) {
          fs.unlinkSync(path.join(this.outputDir, file));
        }
      });
      console.log('🧹 Cleaned CSS output directory');
    }

    // Clean temp directory contents but keep the directory
    if (fs.existsSync(this.tempDir)) {
      const tempFiles = fs.readdirSync(this.tempDir);
      tempFiles.forEach(file => {
        const filePath = path.join(this.tempDir, file);
        if (fs.statSync(filePath).isFile()) {
          fs.unlinkSync(filePath);
        }
      });
      console.log('🧹 Cleaned temp directory');
    } else {
      // Create temp directory if it doesn't exist
      fs.mkdirSync(this.tempDir, { recursive: true });
      console.log('📁 Created temp directory');
    }
  }

  // Force re-analysis and rebuild
  async rebuild() {
    console.log('🔄 Force rebuilding...');
    
    // Remove existing config to force re-analysis
    if (fs.existsSync(this.configFile)) {
      fs.unlinkSync(this.configFile);
    }
    
    // Clean and rebuild
    this.clean();
    await this.buildAll();
  }
}

// CLI usage
if (require.main === module) {
  const builder = new RobustCSSBuilder();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'build':
      builder.buildAll().catch(console.error);
      break;
    case 'watch':
      builder.watch().catch(console.error);
      break;
    case 'clean':
      builder.clean();
      break;
    case 'rebuild':
      builder.rebuild().catch(console.error);
      break;
    case 'analyze':
      const analyzer = new AutoCSSAnalyzer();
      analyzer.analyzeProject();
      break;
    default:
      console.log(`
🎨 Robust CSS Builder
=====================

Usage: node robust-css-builder.js [command]

Commands:
  analyze   - Scan files and show CSS usage analysis
  build     - Build optimized CSS (tries multiple methods)
  watch     - Watch files and rebuild CSS automatically
  clean     - Remove generated CSS files and temp files
  rebuild   - Force re-analysis and rebuild

This builder tries multiple approaches:
1. Tailwind CLI (npx tailwindcss)
2. PostCSS with tailwindcss plugin
3. Basic fallback

Examples:
  node robust-css-builder.js analyze
  node robust-css-builder.js build
      `);
  }
}

module.exports = RobustCSSBuilder;