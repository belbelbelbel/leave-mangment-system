#!/usr/bin/env node
/**
 * Simple test script to verify API is working
 * Run: node test-api.js
 */

const http = require('http');

const testEndpoint = (path, method = 'GET', data = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('🧪 Testing Leave Management System API\n');
  console.log('Make sure the server is running: npm start\n');
  
  await new Promise(resolve => setTimeout(resolve, 2000));

  try {
    // Test 1: Health check
    console.log('1. Testing /api endpoint...');
    const health = await testEndpoint('/api');
    console.log(`   Status: ${health.status}`);
    console.log(`   Response:`, health.data);
    console.log('');

    // Test 2: Debug endpoint
    console.log('2. Testing /api/debug endpoint...');
    const debug = await testEndpoint('/api/debug');
    console.log(`   Status: ${debug.status}`);
    if (debug.data.environment) {
      console.log(`   MongoDB URI exists: ${debug.data.environment.mongodb_uri_exists}`);
      console.log(`   JWT Secret exists: ${debug.data.environment.jwt_secret_exists}`);
    }
    console.log('');

    // Test 3: Auth endpoint (should fail without proper data, but endpoint should exist)
    console.log('3. Testing /api/auth/login endpoint...');
    const auth = await testEndpoint('/api/auth/login', 'POST', { email: 'test', password: 'test' });
    console.log(`   Status: ${auth.status}`);
    console.log(`   Response:`, typeof auth.data === 'string' ? auth.data.substring(0, 100) : auth.data);
    console.log('');

    console.log('✅ Basic API tests completed!');
    console.log('\nNote: Database operations will fail if MongoDB is not connected.');
    console.log('This is expected if MongoDB Atlas is not accessible from your network.');

  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Connection refused. Is the server running?');
      console.error('   Start the server with: npm start');
    } else {
      console.error('❌ Error:', error.message);
    }
    process.exit(1);
  }
};

runTests();

