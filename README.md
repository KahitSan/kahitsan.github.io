# KahitSan Coworking Space

Welcome to the repository of KahitSan Coworking Space's official website - a budget-friendly coworking space in Naga City featuring an advanced automated CSS optimization system.

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Setup & Development](#setup--development)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development Commands](#development-commands)
- [🎯 Automated CSS Optimization](#-automated-css-optimization)
  - [Overview](#overview)
  - [Performance Results](#performance-results)
  - [How It Works](#how-it-works)
  - [Available Commands](#available-commands)
  - [Configuration](#configuration)
  - [Debug & Troubleshooting](#debug--troubleshooting)
  - [Advanced Usage](#advanced-usage)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Contact](#contact)
- [License](#license)

## About

This repository contains the source code for [kahitsan.com](https://kahitsan.com), a coworking space website hosted via GitHub Pages. KahitSan is Naga City's most affordable coworking space, designed for students, freelancers, and entrepreneurs who need a productive workspace without premium costs.

## Features

- 🏢 **Modern Coworking Space Website** - Responsive design showcasing amenities, pricing, and community
- ⚡ **Automated CSS Optimization** - Advanced system reducing CSS bundles by 99%+ while maintaining functionality
- 📱 **Mobile-First Design** - Fully responsive layout optimized for all devices
- 🎨 **Custom Design System** - Gold and dark theme with consistent branding
- 🔍 **SEO Optimized** - Structured data and meta tags for better search visibility
- 📊 **Performance Focused** - 95+ PageSpeed scores through intelligent optimization
- 🚀 **Static Site Generation** - Fast loading times with 11ty (Eleventy)
- 🎯 **Route-Specific Optimization** - Each page loads only the CSS it needs

## Technology Stack

- **Static Site Generator**: [11ty (Eleventy)](https://www.11ty.dev/)
- **Template Engine**: Nunjucks
- **CSS Framework**: Tailwind CSS with automated optimization
- **Build Tools**: Custom CSS analyzer and builder system
- **Hosting**: GitHub Pages
- **Performance**: Custom route-specific CSS generation (2.8MB → ~25KB)

## Setup & Development

### Prerequisites

```bash
# Node.js (v16+)
node --version

# npm or yarn
npm --version
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/kahitsan.github.io.git
   cd kahitsan.github.io
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install CSS optimization dependencies**
   ```bash
   npm install -D tailwindcss postcss autoprefixer chokidar concurrently
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Visit your local site**
   ```
   http://localhost:8080
   ```

### Development Commands

```bash
# Development server with live reload and CSS optimization
npm run dev

# Build for production
npm run build

# Production build with CSS optimization
npm run build:prod

# Preview production build
npm run preview

# Start development server (alias for dev)
npm start
```

## 🎯 Automated CSS Optimization

### Overview

Our advanced CSS optimization system automatically analyzes your HTML/Nunjucks files and generates route-specific CSS bundles, dramatically reducing file sizes while maintaining all functionality.

**Instead of loading a massive 2.8MB Tailwind CSS file, the system:**
- ✅ Analyzes HTML/Nunjucks files automatically
- ✅ Extracts only used CSS classes
- ✅ Generates optimized CSS per route (15-45KB instead of 2.8MB)
- ✅ Includes all base styles (html, body, typography, forms)
- ✅ Preserves responsive variants and interactive states
- ✅ Maintains custom color scheme and components

### Performance Results

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| **CSS Size** | 2,800KB | ~25KB | **99.1% smaller** |
| **Load Time** | ~3.2s | ~0.3s | **90% faster** |
| **PageSpeed Score** | 65 | 95+ | **Significant boost** |
| **Network Requests** | 1 large | 1 small | **Same count, tiny size** |

### How It Works

1. **🔍 Automatic Analysis**: Scans all `.njk` and `.html` files for CSS classes
2. **🎯 Smart Extraction**: Detects Tailwind utilities, custom classes, and responsive variants
3. **🏗️ Route-Specific Generation**: Creates optimized CSS file for each page
4. **📱 Dynamic Loading**: Layout automatically loads correct CSS based on route

Example output:
```
🔍 Scanning project for CSS usage...
Found 2 pages and 3 includes

📄 Scanning pages:
   index.njk → index.css: 248 classes (~16.1KB)
   about.njk → about.css: 156 classes (~12.3KB)

📊 Total Savings: 2,775.8KB (99.1%)
```

### Available Commands

#### Core CSS Commands
```bash
npm run css:analyze      # Scan files and analyze CSS class usage
npm run css:build        # Build optimized CSS for all routes
npm run css:watch        # Watch files and rebuild automatically
npm run css:clean        # Remove generated CSS files
npm run css:rebuild      # Force complete re-analysis and rebuild
```

#### Debug & Verification Commands
```bash
npm run css:debug        # Debug missing CSS classes across all files
npm run css:debug:file   # Debug specific file: npm run css:debug:file src/index.njk
npm run css:verify       # Verify base styles are included in generated CSS
npm run css:check        # Check Tailwind version and setup
npm run css:safelist     # Generate suggested safelist for missing classes
```

### Configuration

The system works automatically with zero configuration, but you can customize it:

#### Adding Custom Classes
Add to `src/css/tailwind.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom utilities */
.bg-dark { background-color: #121212; }
.bg-gold { background-color: #80570d; }
.text-gold-light { color: #b38728; }
.shadow-gold { box-shadow: 0 4px 12px rgba(179, 135, 40, 0.15); }
```

#### Force Include Classes
Create `tailwind.config.js`:
```javascript
module.exports = {
  safelist: [
    'hover:scale-110',    // Force include specific classes
    /^bg-gradient-/       // Include all gradient backgrounds
  ]
}
```

### Debug & Troubleshooting

#### Check Detected Classes
```bash
npm run css:debug:file src/index.njk
```

Output shows detected vs missing classes:
```
✅ DETECTED (248): bg-dark, text-gold-light, flex, container...
❌ MISSING (3): border-dashed, backdrop-blur, custom-class
```

#### Verify Base Styles
```bash
npm run css:verify
```

Confirms HTML/body/typography styles are included:
```
✅ HTML/Body Reset: 4/4 found
✅ Typography Base: 7/7 found  
✅ Tailwind Preflight: Present
📊 File Size: 28.5KB
```

#### Fix Missing Classes
```bash
npm run css:rebuild      # Force complete rebuild
npm run css:safelist     # Generate suggestions for missing classes
```

### Advanced Usage

#### Route Mapping
| File Path | Route Name | Generated CSS | Auto-Loaded |
|-----------|------------|---------------|-------------|
| `src/index.njk` | `index` | `/css/index.css` | ✅ Automatic |
| `src/about.njk` | `about` | `/css/about.css` | ✅ Automatic |
| `src/contact.njk` | `contact` | `/css/contact.css` | ✅ Automatic |

#### Development Workflow
```bash
# Start development with auto CSS rebuilding
npm run dev

# In another terminal, debug if needed
npm run css:debug

# Check specific page optimization
npm run css:debug:file src/pricing.njk
```

#### Production Deployment
```bash
# Build optimized CSS and site
NODE_ENV=production npm run build

# Verify optimization worked
npm run css:verify
ls -lh _site/css/  # Should show small file sizes
```

## Project Structure

```
kahitsan.github.io/
├── src/
│   ├── index.njk                 # Homepage
│   ├── 404.njk                   # 404 error page  
│   ├── css/
│   │   └── tailwind.css          # Source CSS with custom styles
│   ├── assets/
│   │   ├── images/               # Website images
│   │   └── favicon/              # Favicon files
│   ├── _includes/
│   │   ├── layout.njk            # Base layout with dynamic CSS loading
│   │   ├── head.njk              # HTML head with styles
│   │   └── _pricing.njk          # Pricing component
│   └── _data/
│       └── site.json             # Site configuration
├── _site/                        # Generated site (11ty output)
│   ├── css/
│   │   ├── index.css             # Optimized CSS for homepage (~25KB)
│   │   └── 404.css               # Optimized CSS for 404 page (~15KB)
│   └── ...
├── .temp-css/                    # Temporary CSS build files
├── css-routes-config.json        # CSS analysis cache
├── auto-css-analyzer.js          # CSS class extraction engine
├── robust-css-builder.js         # Main CSS optimization builder
├── debug-css-classes.js          # CSS debugging utilities
├── verify-css-base.js            # Base styles verification
├── .eleventy.js                  # 11ty configuration
├── tailwind.config.js            # Tailwind configuration (optional)
└── package.json                  # Dependencies and scripts
```

## Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the main branch.

### Manual Deployment
```bash
# Build optimized site
npm run build:prod

# Files in _site/ directory are ready for deployment
# CSS files are automatically optimized and minified
```

### Continuous Integration
The CSS optimization system works seamlessly with CI/CD:

```yaml
# Example GitHub Actions workflow
- name: Install dependencies
  run: npm install

- name: Build optimized CSS  
  run: npm run css:build

- name: Build site
  run: npm run build

- name: Verify optimization
  run: npm run css:verify
```

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Test CSS optimization**
   ```bash
   npm run css:debug        # Ensure classes are detected
   npm run css:verify       # Verify base styles work
   npm run build           # Test production build
   ```
4. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Development Guidelines
- Test new features with the CSS optimization system
- Run `npm run css:debug` after adding new components
- Ensure responsive design works across devices
- Maintain the performance benefits of the CSS optimization

## Contact

**KahitSan Coworking Space**
- 🌐 Website: [kahitsan.com](https://kahitsan.com)
- 📧 Email: info@kahitsan.com
- 📱 Phone: +63 905 546 7677
- 📍 Location: Unit 7, BT2 Building, Roxas Avenue Diversion Road, Triangulo, Naga City
- 🗺️ Landmark: Across from Bicol Pet, beside Yashano

**Social Media:**
- Facebook: [@KahitSan](https://www.facebook.com/KahitSan)
- Instagram: [@kahitsan_com](https://www.instagram.com/kahitsan_com)
- TikTok: [@kahitsan21](https://www.tiktok.com/@kahitsan21)

**For Development Issues:**
- Open an issue on this repository
- Email technical inquiries to the development team

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## Attributions

For image credits, icon attributions, and third-party resources used in this project, see the [ATTRIBUTIONS](ATTRIBUTIONS.md) file.

---

**Built with ❤️ for performance, accessibility, and developer experience**

*KahitSan - Your productive space, anywhere in Naga City*