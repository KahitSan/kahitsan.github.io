const fs = require('fs');
const path = require('path');

console.log('🧪 Testing temp directory creation...\n');

const tempDir = '.temp-css';
const testFile = path.join(tempDir, 'test.html');

// Test 1: Create directory
console.log('1. Creating temp directory...');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
  console.log('   ✅ Directory created');
} else {
  console.log('   ✅ Directory already exists');
}

// Test 2: Write a test file
console.log('2. Writing test file...');
try {
  fs.writeFileSync(testFile, '<html><body>Test</body></html>');
  console.log('   ✅ File written successfully');
} catch (error) {
  console.log('   ❌ Error writing file:', error.message);
}

// Test 3: Check file exists
console.log('3. Checking file exists...');
if (fs.existsSync(testFile)) {
  console.log('   ✅ File exists');
  const content = fs.readFileSync(testFile, 'utf8');
  console.log('   📝 Content:', content.substring(0, 30) + '...');
} else {
  console.log('   ❌ File does not exist');
}

// Test 4: List directory contents
console.log('4. Directory contents:');
try {
  const files = fs.readdirSync(tempDir);
  console.log('   📁 Files:', files.join(', ') || 'empty');
} catch (error) {
  console.log('   ❌ Error reading directory:', error.message);
}

// Test 5: Clean up
console.log('5. Cleaning up...');
try {
  fs.unlinkSync(testFile);
  console.log('   ✅ Test file removed');
} catch (error) {
  console.log('   ⚠️  Could not remove test file:', error.message);
}

console.log('\n🎯 Test complete!');