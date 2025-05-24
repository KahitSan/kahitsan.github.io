const fs = require('fs');
const path = require('path');

class CSSBaseVerifier {
  constructor() {
    this.outputDir = '_site/css';
  }

  // Check if essential base styles are present in CSS
  verifyBaseStyles(cssFilePath) {
    if (!fs.existsSync(cssFilePath)) {
      console.error(`❌ CSS file not found: ${cssFilePath}`);
      return false;
    }

    const cssContent = fs.readFileSync(cssFilePath, 'utf8');
    
    const baseStyleChecks = {
      'HTML/Body Reset': [
        'html', 
        'body',
        'margin',
        'font-family'
      ],
      'Typography Base': [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'font-size',
        'font-weight',
        'line-height'
      ],
      'Link Styles': [
        'text-decoration',
        'color'
      ],
      'Form Elements': [
        'input',
        'button',
        'textarea',
        'select'
      ],
      'List Styles': [
        'ul', 'ol', 'li',
        'list-style'
      ],
      'Table Styles': [
        'table',
        'border-collapse'
      ]
    };

    console.log(`🔍 Verifying base styles in: ${cssFilePath}`);
    console.log('='.repeat(50));

    let allPassed = true;
    const results = {};

    Object.entries(baseStyleChecks).forEach(([category, checks]) => {
      const passed = [];
      const failed = [];

      checks.forEach(check => {
        if (cssContent.includes(check)) {
          passed.push(check);
        } else {
          failed.push(check);
        }
      });

      results[category] = { passed, failed };
      const status = failed.length === 0 ? '✅' : '⚠️';
      console.log(`${status} ${category}: ${passed.length}/${checks.length} found`);
      
      if (failed.length > 0) {
        console.log(`   Missing: ${failed.join(', ')}`);
        allPassed = false;
      }
    });

    // Check for Tailwind's normalize/preflight
    const tailwindBaseIndicators = [
      '*, ::before, ::after',  // Tailwind's universal reset
      'box-sizing: border-box', // Box-sizing reset
      '-webkit-font-smoothing', // Font smoothing
      'font-family: ui-sans-serif' // Tailwind's default font stack
    ];

    console.log(`\n🎨 Tailwind Base/Preflight Check:`);
    const preflightResults = tailwindBaseIndicators.map(indicator => {
      const found = cssContent.includes(indicator);
      console.log(`   ${found ? '✅' : '❌'} ${indicator}: ${found ? 'Found' : 'Missing'}`);
      return found;
    });

    const preflightPresent = preflightResults.some(result => result);

    // File size analysis
    const fileSizeKB = (fs.statSync(cssFilePath).size / 1024).toFixed(1);
    console.log(`\n📊 File Analysis:`);
    console.log(`   Size: ${fileSizeKB}KB`);
    console.log(`   Lines: ${cssContent.split('\n').length}`);
    
    // Check for common Tailwind utilities
    const utilityChecks = [
      '.container', '.mx-auto', '.flex', '.grid', '.hidden',
      '.bg-', '.text-', '.border-', '.rounded', '.shadow'
    ];
    
    const utilitiesFound = utilityChecks.filter(util => 
      cssContent.includes(util)
    ).length;
    
    console.log(`   Utility classes: ${utilitiesFound}/${utilityChecks.length} categories found`);

    console.log(`\n🎯 Overall Status:`);
    console.log(`   Base Styles: ${allPassed ? 'Complete' : 'Incomplete'}`);
    console.log(`   Tailwind Preflight: ${preflightPresent ? 'Present' : 'Missing'}`);
    console.log(`   Utilities: ${utilitiesFound >= 5 ? 'Good' : 'Limited'}`);

    if (!allPassed || !preflightPresent) {
      console.log(`\n💡 Recommendations:`);
      if (!preflightPresent) {
        console.log(`   - Ensure @tailwind base; is in your source CSS`);
        console.log(`   - Check that preflight is enabled in Tailwind config`);
      }
      if (!allPassed) {
        console.log(`   - Run: npm run css:rebuild`);
        console.log(`   - Add missing base elements to temp HTML generation`);
      }
    }

    return {
      baseStylesComplete: allPassed,
      preflightPresent: preflightPresent,
      utilitiesCount: utilitiesFound,
      fileSizeKB: parseFloat(fileSizeKB),
      details: results
    };
  }

  // Verify all generated CSS files
  verifyAllFiles() {
    if (!fs.existsSync(this.outputDir)) {
      console.error(`❌ Output directory not found: ${this.outputDir}`);
      return;
    }

    const cssFiles = fs.readdirSync(this.outputDir)
      .filter(file => file.endsWith('.css'))
      .map(file => path.join(this.outputDir, file));

    if (cssFiles.length === 0) {
      console.log('⚠️  No CSS files found. Run npm run css:build first.');
      return;
    }

    console.log(`🔍 CSS Base Styles Verification`);
    console.log(`Found ${cssFiles.length} CSS files to verify\n`);

    const allResults = {};

    cssFiles.forEach(filePath => {
      const fileName = path.basename(filePath);
      allResults[fileName] = this.verifyBaseStyles(filePath);
      console.log('\n' + '='.repeat(50) + '\n');
    });

    // Summary
    const summary = {
      totalFiles: cssFiles.length,
      filesWithCompleteBase: 0,
      filesWithPreflight: 0,
      totalSizeKB: 0
    };

    Object.values(allResults).forEach(result => {
      if (result.baseStylesComplete) summary.filesWithCompleteBase++;
      if (result.preflightPresent) summary.filesWithPreflight++;
      summary.totalSizeKB += result.fileSizeKB;
    });

    console.log(`📊 VERIFICATION SUMMARY:`);
    console.log(`   Total files: ${summary.totalFiles}`);
    console.log(`   Complete base styles: ${summary.filesWithCompleteBase}/${summary.totalFiles}`);
    console.log(`   Tailwind preflight: ${summary.filesWithPreflight}/${summary.totalFiles}`);
    console.log(`   Total size: ${summary.totalSizeKB.toFixed(1)}KB`);

    if (summary.filesWithCompleteBase < summary.totalFiles || summary.filesWithPreflight < summary.totalFiles) {
      console.log(`\n🔧 ACTION NEEDED:`);
      console.log(`   Some files are missing base styles or Tailwind preflight.`);
      console.log(`   Run: npm run css:rebuild`);
    } else {
      console.log(`\n✅ All files have complete base styles!`);
    }

    return summary;
  }

  // Extract and display actual CSS rules for base elements
  extractBaseRules(cssFilePath) {
    if (!fs.existsSync(cssFilePath)) {
      console.error(`❌ CSS file not found: ${cssFilePath}`);
      return;
    }

    const cssContent = fs.readFileSync(cssFilePath, 'utf8');
    
    console.log(`📋 Base CSS Rules in: ${path.basename(cssFilePath)}`);
    console.log('='.repeat(50));

    // Extract rules for base elements
    const baseElements = ['html', 'body', 'h1', 'h2', 'h3', 'p', 'a', 'button', 'input'];
    
    baseElements.forEach(element => {
      // Look for CSS rules targeting this element
      const regex = new RegExp(`(?:^|\\s)${element}(?:\\s*,|\\s*{)[^}]*}`, 'gm');
      const matches = cssContent.match(regex) || [];
      
      if (matches.length > 0) {
        console.log(`\n${element}:`);
        matches.slice(0, 3).forEach(match => {
          // Clean up the match for display
          const cleaned = match.trim().replace(/\s+/g, ' ').substring(0, 100);
          console.log(`   ${cleaned}${cleaned.length >= 100 ? '...' : ''}`);
        });
        if (matches.length > 3) {
          console.log(`   ... and ${matches.length - 3} more rules`);
        }
      } else {
        console.log(`\n${element}: ❌ No rules found`);
      }
    });
  }
}

// CLI usage
if (require.main === module) {
  const verifier = new CSSBaseVerifier();
  
  const command = process.argv[2];
  const file = process.argv[3];
  
  switch (command) {
    case 'file':
      if (file) {
        verifier.verifyBaseStyles(file);
      } else {
        console.log('Usage: node verify-css-base.js file <filepath>');
        console.log('Example: node verify-css-base.js file _site/css/index.css');
      }
      break;
    case 'all':
      verifier.verifyAllFiles();
      break;
    case 'rules':
      if (file) {
        verifier.extractBaseRules(file);
      } else {
        console.log('Usage: node verify-css-base.js rules <filepath>');
        console.log('Example: node verify-css-base.js rules _site/css/index.css');
      }
      break;
    default:
      console.log(`
🔍 CSS Base Styles Verifier
===========================

Usage: node verify-css-base.js [command] [options]

Commands:
  file <path>   - Verify base styles in a specific CSS file
  all          - Verify all generated CSS files
  rules <path> - Extract and display base CSS rules

Examples:
  node verify-css-base.js file _site/css/index.css
  node verify-css-base.js all
  node verify-css-base.js rules _site/css/index.css
      `);
  }
}

module.exports = CSSBaseVerifier;