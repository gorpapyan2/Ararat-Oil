// Test script to verify Supabase Edge Functions are working
const SUPABASE_URL = 'https://qnghvjeunmicykrzpeog.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuZ2h2amV1bm1pY3lrcnpwZW9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NjYwODgsImV4cCI6MjA2NDA0MjA4OH0.hew8M3qEpmh5U0gXncj9blnPr2jKj1fuc-VQ7KnopsE';

async function testEdgeFunction(functionName) {
  const url = `${SUPABASE_URL}/functions/v1/${functionName}`;
  
  try {
    console.log(`Testing ${functionName}...`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY
      }
    });
    
    console.log(`${functionName} - Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.text();
      console.log(`${functionName} - Response: ${data.substring(0, 200)}...`);
    } else {
      const error = await response.text();
      console.log(`${functionName} - Error: ${error.substring(0, 200)}...`);
    }
    
    return response.ok;
  } catch (error) {
    console.error(`${functionName} - Network Error:`, error.message);
    return false;
  }
}

async function runTests() {
  console.log('Testing Supabase Edge Functions...\n');
  
  const functions = [
    'dashboard',
    'profit-loss',
    'finance/overview',
    'sales',
    'expenses'
  ];
  
  const results = {};
  
  for (const func of functions) {
    results[func] = await testEdgeFunction(func);
    console.log('---');
  }
  
  console.log('\nTest Results:');
  for (const [func, success] of Object.entries(results)) {
    console.log(`${func}: ${success ? '✅ PASS' : '❌ FAIL'}`);
  }
}

// Run if this is the main module
if (typeof window === 'undefined') {
  runTests().catch(console.error);
}

module.exports = { testEdgeFunction, runTests }; 