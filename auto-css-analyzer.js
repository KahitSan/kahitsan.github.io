// auto-css-analyzer.js
const fs = require('fs');
const path = require('path');
const glob = require('glob');

class AutoCSSAnalyzer {
  constructor() {
    this.sourceDir = 'src';
    this.outputDir = '_site/css';
    this.includesDir = 'src/_includes';
  }

  // Extract all CSS classes from HTML/Nunjucks content (Enhanced)
  extractClasses(content) {
    const classes = new Set();
    
    // Method 1: Match class attributes: class="..." or class='...'
    const classMatches = content.match(/class\s*=\s*["']([^"']+)["']/gi) || [];
    
    classMatches.forEach(match => {
      // Extract the class content between quotes
      const classContent = match.match(/class\s*=\s*["']([^"']+)["']/i)[1];
      
      // Split by whitespace and filter out empty strings
      const classNames = classContent.split(/\s+/).filter(cls => cls.length > 0);
      
      classNames.forEach(className => {
        const cleanClass = className.trim();
        if (cleanClass) {
          classes.add(cleanClass);
        }
      });
    });

    // Method 2: Look for Tailwind patterns in text (even without class attributes)
    const tailwindPatterns = [
      // Common utility patterns
      /\b(bg|text|border|p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|w|h|min|max)-[\w-]+/g,
      /\b(flex|grid|block|inline|hidden|relative|absolute|fixed|static)\b/g,
      /\b(rounded|shadow|opacity|transform|transition|duration|ease)-[\w-]+/g,
      /\b(hover|focus|active|disabled|first|last|odd|even):[\w-]+/g,
      /\b(sm|md|lg|xl|2xl):[\w-]+/g,
      /\b(top|bottom|left|right|inset|z)-[\w-]+/g,
      /\b(overflow|font|leading|tracking|text|align)-[\w-]+/g,
      /\b(space|divide|gap|justify|items|content|self|order)-[\w-]+/g,
      /\b(col|row|span)-[\w-]+/g,
      /\b(container|sr-only)\b/g
    ];

    tailwindPatterns.forEach(pattern => {
      const matches = content.match(pattern) || [];
      matches.forEach(match => classes.add(match));
    });

    // Method 3: Extract from style attributes (for dynamic styles)
    const styleMatches = content.match(/style\s*=\s*["']([^"']+)["']/gi) || [];
    styleMatches.forEach(match => {
      // Look for CSS properties that might correspond to Tailwind classes
      const styleContent = match.match(/style\s*=\s*["']([^"']+)["']/i)[1];
      
      // Extract common patterns and convert to Tailwind equivalents
      if (styleContent.includes('display: flex')) classes.add('flex');
      if (styleContent.includes('display: grid')) classes.add('grid');
      if (styleContent.includes('display: block')) classes.add('block');
      if (styleContent.includes('display: none')) classes.add('hidden');
    });

    // Method 4: Look for template variables that might contain classes
    const templateVarMatches = content.match(/\{\{[^}]*class[^}]*\}\}/gi) || [];
    templateVarMatches.forEach(match => {
      // Try to extract class-like patterns from template variables
      const varContent = match.replace(/[{}]/g, '');
      const potentialClasses = varContent.match(/[\w-]+/g) || [];
      potentialClasses.forEach(cls => {
        if (this.isTailwindClass(cls)) {
          classes.add(cls);
        }
      });
    });

    return Array.from(classes);
  }

  // Scan a single file and extract all classes
  scanFile(filePath) {
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      return [];
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const classes = this.extractClasses(content);
    
    return {
      filePath,
      classes,
      classCount: classes.length
    };
  }

  // Get all page files (not includes)
  getPageFiles() {
    // Get all .njk and .html files in src/ but not in _includes/
    const pageFiles = glob.sync(`${this.sourceDir}/**/*.{njk,html}`, {
      ignore: [
        `${this.includesDir}/**/*`,
        `${this.sourceDir}/_data/**/*`
      ]
    });

    return pageFiles;
  }

  // Get all include files
  getIncludeFiles() {
    return glob.sync(`${this.includesDir}/**/*.{njk,html}`);
  }

  // Analyze all pages and generate route-specific CSS configs
  analyzeProject() {
    console.log('🔍 Scanning project for CSS usage...\n');

    const pageFiles = this.getPageFiles();
    const includeFiles = this.getIncludeFiles();
    
    console.log(`Found ${pageFiles.length} pages and ${includeFiles.length} includes`);

    // Scan includes first (these will be added to all pages)
    const includesClasses = new Set();
    console.log('\n📂 Scanning includes:');
    
    includeFiles.forEach(file => {
      const result = this.scanFile(file);
      const relativePath = path.relative(this.sourceDir, file);
      console.log(`   ${relativePath}: ${result.classCount} classes`);
      
      result.classes.forEach(cls => includesClasses.add(cls));
    });

    // Scan each page
    const pageConfigs = {};
    console.log('\n📄 Scanning pages:');

    pageFiles.forEach(file => {
      const result = this.scanFile(file);
      const relativePath = path.relative(this.sourceDir, file);
      const routeName = this.getRouteName(file);
      
      // Combine page classes with includes classes
      const allClasses = new Set([...result.classes, ...includesClasses]);
      
      pageConfigs[routeName] = {
        route: routeName,
        filePath: file,
        relativePath,
        classes: Array.from(allClasses),
        pageSpecificClasses: result.classes,
        totalClasses: allClasses.size,
        estimatedSize: this.estimateSize(Array.from(allClasses))
      };

      console.log(`   ${relativePath} → ${routeName}.css: ${allClasses.size} classes (~${pageConfigs[routeName].estimatedSize}KB)`);
    });

    // Save the configuration
    this.saveConfig(pageConfigs);
    this.generateReport(pageConfigs, includesClasses);

    return pageConfigs;
  }

  // Get route name from file path (improved for inputPath compatibility)
  getRouteName(filePath) {
    // Remove src/ prefix and any leading ./
    let cleanPath = filePath.replace(/^\.?\/src\//, '').replace(/^src\//, '');
    
    // Get the filename without extension
    const fileName = path.basename(cleanPath, path.extname(cleanPath));
    
    // Handle index files
    if (fileName === 'index') {
      return 'index';
    }
    
    // For nested paths, you can choose to:
    // Option 1: Use just the filename (recommended for simplicity)
    return fileName;
    
    // Option 2: Use the full path as route name (uncomment if needed)
    // return cleanPath.replace(/\//g, '-').replace(/\.(njk|html|md)$/, '');
  }

  // Estimate CSS size based on class count
  estimateSize(classes) {
    // Rough estimation: 
    // - Tailwind utility class ~50 bytes
    // - Custom class ~100 bytes
    // - Base CSS overhead ~2KB
    
    const tailwindClasses = classes.filter(cls => this.isTailwindClass(cls));
    const customClasses = classes.filter(cls => !this.isTailwindClass(cls));
    
    const tailwindSize = tailwindClasses.length * 50;
    const customSize = customClasses.length * 100;
    const baseSize = 2048; // 2KB base
    
    return Math.round((tailwindSize + customSize + baseSize) / 1024 * 10) / 10;
  }

  // Check if a class is likely a Tailwind utility (Enhanced)
  isTailwindClass(className) {
    const tailwindPatterns = [
      // Layout
      /^(bg|text|border|p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|w|h|min|max)-/,
      /^(flex|grid|block|inline|inline-block|hidden|relative|absolute|fixed|static|sticky)$/,
      
      // Styling
      /^(rounded|shadow|opacity|transform|transition|duration|ease)-/,
      /^(font|leading|tracking|text|align)-/,
      /^(border|outline|ring)-/,
      
      // Interactive states
      /^(hover|focus|active|disabled|first|last|odd|even|group-hover|group-focus):/,
      
      // Responsive
      /^(sm|md|lg|xl|2xl):/,
      
      // Positioning and spacing
      /^(top|bottom|left|right|inset|z)-/,
      /^(space|divide|gap|justify|items|content|self|order)-/,
      /^(overflow|resize|cursor|select|pointer)-/,
      
      // Grid and flex
      /^(col|row|span|place|auto)-/,
      /^(flex|grid|justify|items|content|self|place)-/,
      
      // Colors
      /^(bg|text|border|placeholder|ring|divide)-(current|transparent|black|white|gray|red|yellow|green|blue|indigo|purple|pink)-/,
      
      // Custom colors (from your config)
      /^(bg|text|border)-(dark|gold)/,
      
      // Special utilities
      /^(container|sr-only|not-sr-only|appearance-none|list-none)$/,
      
      // Animation and transforms
      /^(animate|scale|rotate|translate|skew|origin)-/,
      
      // Filters and effects
      /^(filter|blur|brightness|contrast|grayscale|hue|invert|saturate|sepia|backdrop)-/,
      
      // Typography
      /^(prose|antialiased|subpixel-antialiased|italic|not-italic|font|text|leading|tracking|decoration|underline|overline|line-through|no-underline)$/,
      /^(uppercase|lowercase|capitalize|normal-case)$/,
      
      // Visibility and display
      /^(visible|invisible|opacity|scale|rotate|translate)$/,
      
      // Forms
      /^(form|resize|appearance)$/
    ];

    return tailwindPatterns.some(pattern => pattern.test(className));
  }

  // Save configuration to file
  saveConfig(pageConfigs) {
    const config = {
      generated: new Date().toISOString(),
      pages: pageConfigs
    };

    fs.writeFileSync('css-routes-config.json', JSON.stringify(config, null, 2));
    console.log('\n💾 Saved configuration to css-routes-config.json');
  }

  // Generate analysis report
  generateReport(pageConfigs, includesClasses) {
    const totalPages = Object.keys(pageConfigs).length;
    const totalClasses = Math.max(...Object.values(pageConfigs).map(p => p.totalClasses));
    const totalEstimatedSize = Object.values(pageConfigs).reduce((sum, p) => sum + p.estimatedSize, 0);
    const averageSize = totalEstimatedSize / totalPages;

    console.log('\n📊 Analysis Report:');
    console.log('==================');
    console.log(`Total Pages: ${totalPages}`);
    console.log(`Include Classes: ${includesClasses.size}`);
    console.log(`Max Classes per Page: ${totalClasses}`);
    console.log(`Average CSS Size: ${averageSize.toFixed(1)}KB`);
    console.log(`Total Optimized Size: ${totalEstimatedSize.toFixed(1)}KB`);
    console.log(`Estimated Savings: ${(2800 - totalEstimatedSize).toFixed(1)}KB (${((2800 - totalEstimatedSize) / 2800 * 100).toFixed(1)}%)`);

    // Detailed breakdown
    console.log('\n📋 Per-Route Breakdown:');
    Object.values(pageConfigs).forEach(config => {
      const tailwindCount = config.classes.filter(cls => this.isTailwindClass(cls)).length;
      const customCount = config.classes.length - tailwindCount;
      
      console.log(`   ${config.route}.css:`);
      console.log(`      Total Classes: ${config.totalClasses}`);
      console.log(`      Tailwind: ${tailwindCount}, Custom: ${customCount}`);
      console.log(`      Estimated Size: ${config.estimatedSize}KB`);
    });

    return {
      totalPages,
      includesClasses: includesClasses.size,
      totalEstimatedSize,
      averageSize,
      savingsKB: 2800 - totalEstimatedSize,
      savingsPercent: (2800 - totalEstimatedSize) / 2800 * 100
    };
  }

  // List all detected classes for debugging
  listAllClasses(pageConfigs) {
    console.log('\n🔍 All Detected Classes:');
    console.log('========================');

    Object.entries(pageConfigs).forEach(([route, config]) => {
      console.log(`\n${route}.css (${config.classes.length} classes):`);
      
      const tailwind = config.classes.filter(cls => this.isTailwindClass(cls));
      const custom = config.classes.filter(cls => !this.isTailwindClass(cls));
      
      if (tailwind.length > 0) {
        console.log(`   Tailwind (${tailwind.length}): ${tailwind.slice(0, 10).join(', ')}${tailwind.length > 10 ? '...' : ''}`);
      }
      
      if (custom.length > 0) {
        console.log(`   Custom (${custom.length}): ${custom.join(', ')}`);
      }
    });
  }
}

// CLI usage
if (require.main === module) {
  const analyzer = new AutoCSSAnalyzer();
  const results = analyzer.analyzeProject();
  
  // Show detailed classes if requested
  if (process.argv.includes('--verbose')) {
    analyzer.listAllClasses(results);
  }
}

module.exports = AutoCSSAnalyzer;