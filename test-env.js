const fs = require('fs');
const path = require('path');

// Test environment variable loading
console.log('🔍 Testing Environment Variables...\n');

// Load dotenv
require('dotenv').config({ path: '.env.local' });

console.log('Environment Variables:');
console.log('NEXT_PUBLIC_RPC_URL:', process.env.NEXT_PUBLIC_RPC_URL);
console.log('NEXT_PUBLIC_ADDRESS:', process.env.NEXT_PUBLIC_ADDRESS);
console.log('');

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local');
console.log('.env.local exists:', fs.existsSync(envPath));
console.log('.env.local path:', envPath);

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
  console.log('\n.env.local content:');
  console.log(content.split('\n').filter(line => !line.includes('PRIVATE_KEY')).join('\n'));
}
