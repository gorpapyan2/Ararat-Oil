import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase Integration...\n');

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Required: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

console.log('📊 Environment Variables:');
console.log(`- SUPABASE_URL: ${SUPABASE_URL}`);
console.log(`- ANON_KEY: ${SUPABASE_ANON_KEY.substring(0, 20)}...`);
console.log('');

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
  try {
    console.log('🔗 Testing database connection...');
    const { data, error } = await supabase
      .from('filling_systems')
      .select('count', { count: 'exact' })
      .limit(1);
      
    if (error) {
      console.log('❌ Database connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Database connection successful');
    return true;
  } catch (err) {
    console.log('❌ Database connection error:', err.message);
    return false;
  }
}

async function testEdgeFunctions() {
  const functions = ['dashboard', 'employees', 'filling-systems'];
  let success = 0;
  
  console.log('🚀 Testing Edge Functions...');
  
  for (const func of functions) {
    try {
      const { data, error } = await supabase.functions.invoke(func, {
        method: 'GET'
      });
      
      if (error) {
        console.log(`❌ ${func}: ${error.message}`);
      } else {
        console.log(`✅ ${func}: Function responded`);
        success++;
      }
    } catch (err) {
      console.log(`❌ ${func}: ${err.message}`);
    }
  }
  
  return success === functions.length;
}

async function testAuth() {
  try {
    console.log('🔐 Testing authentication...');
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error && error.message !== 'Auth session missing!') {
      console.log('❌ Auth test failed:', error.message);
      return false;
    }
    
    console.log('✅ Auth system accessible');
    console.log(`- Current user: ${user ? user.email : 'Not logged in'}`);
    return true;
  } catch (err) {
    console.log('❌ Auth error:', err.message);
    return false;
  }
}

async function runTests() {
  console.log('📋 Running Supabase Integration Tests\n');
  
  const tests = [
    { name: 'Database Connection', test: testConnection },
    { name: 'Edge Functions', test: testEdgeFunctions },
    { name: 'Authentication', test: testAuth }
  ];
  
  let passed = 0;
  
  for (const { name, test } of tests) {
    console.log(`\n--- ${name} ---`);
    const result = await test();
    if (result) passed++;
  }
  
  console.log('\n📊 Test Summary:');
  console.log(`- Tests passed: ${passed}/${tests.length}`);
  console.log(`- Status: ${passed === tests.length ? '✅ All tests passed!' : '⚠️ Some tests failed'}`);
  
  if (passed === tests.length) {
    console.log('\n🎉 Supabase integration is working correctly!');
  } else {
    console.log('\n🔧 Please check the failed tests and your Supabase configuration.');
  }
}

runTests().catch(err => {
  console.error('❌ Test runner error:', err);
  process.exit(1);
}); 