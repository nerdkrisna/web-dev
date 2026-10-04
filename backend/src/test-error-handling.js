// Test script to verify API error handling and HTTP status codes
const BASE_URL = 'http://localhost:5000/api';

const runErrorTests = async () => {
  console.log('🧪 Starting API Error Handling Verification Tests...\n');

  const assertStatus = (actual, expected, testName) => {
    if (actual === expected) {
      console.log(`✅ PASSED: [${actual}] - ${testName}`);
    } else {
      console.error(`❌ FAILED: Expected ${expected} but received ${actual} - ${testName}`);
      process.exit(1);
    }
  };

  try {
    // 1. 404 Not Found on invalid API route
    const res1 = await fetch(`${BASE_URL}/non-existent-route`);
    const data1 = await res1.json();
    assertStatus(res1.status, 404, '404 for undefined routes');
    console.log('   Message:', data1.message);

    // 2. 400 CastError for invalid Mongoose ObjectId format
    const res2 = await fetch(`${BASE_URL}/projects/invalid-id-xyz-99`);
    const data2 = await res2.json();
    assertStatus(res2.status, 400, '400 CastError on malformed ObjectId');
    console.log('   Message:', data2.message);

    // 3. 404 for valid ObjectId that does not exist in DB
    const res3 = await fetch(`${BASE_URL}/projects/507f1f77bcf86cd799439011`);
    const data3 = await res3.json();
    assertStatus(res3.status, 404, '404 for non-existent valid ObjectId');
    console.log('   Message:', data3.message);

    // 4. 401 Unauthorized when missing token on protected route
    const res4 = await fetch(`${BASE_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Test Project' })
    });
    const data4 = await res4.json();
    assertStatus(res4.status, 401, '401 Unauthorized for missing token');
    console.log('   Message:', data4.message);

    // 5. 401 Unauthorized with forged / invalid JWT token
    const res5 = await fetch(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: 'Bearer forged.token.here' }
    });
    const data5 = await res5.json();
    assertStatus(res5.status, 401, '401 Unauthorized for invalid JWT token');
    console.log('   Message:', data5.message);

    // 6. 401 Bad Credentials on login with wrong password
    const res6 = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@projecthub.io',
        password: 'WrongPassword123'
      })
    });
    const data6 = await res6.json();
    assertStatus(res6.status, 401, '401 Bad Credentials on incorrect password');
    console.log('   Message:', data6.message);

    // 7. 400 Duplicate Key Error (Registration with duplicate email)
    const res7 = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Admin Duplicate',
        email: 'admin@projecthub.io',
        password: 'Password123!'
      })
    });
    const data7 = await res7.json();
    assertStatus(res7.status, 400, '400 Duplicate Key Error on existing email');
    console.log('   Message:', data7.message);

    // 8. 400 Mongoose Validation Error (Missing required fields when authenticated)
    // First login as admin
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@projecthub.io',
        password: 'Password123!'
      })
    });
    const loginData = await loginRes.json();
    const token = loginData.data.token;

    const res8 = await fetch(`${BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        // Missing title, description, deadline
        budget: -500
      })
    });
    const data8 = await res8.json();
    assertStatus(res8.status, 400, '400 Validation Error for missing fields & negative budget');
    console.log('   Message:', data8.message);

    console.log('\n🎉 ALL 8 ERROR HANDLING & STATUS CODE TESTS PASSED PERFECTLY!');
  } catch (err) {
    console.error('❌ Error testing failed:', err);
    process.exit(1);
  }
};

runErrorTests();
