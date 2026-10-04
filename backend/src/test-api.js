// Automated API Test Runner to verify all REST endpoints
const BASE_URL = 'http://localhost:5000';

const runTests = async () => {
  console.log('🧪 Starting End-to-End REST API Testing...\n');
  let token = '';
  let createdProjectId = '';
  const testEmail = `testuser_${Date.now()}@example.com`;

  const assert = (condition, message) => {
    if (!condition) {
      console.error(`❌ FAILED: ${message}`);
      process.exit(1);
    }
    console.log(`✅ PASSED: ${message}`);
  };

  try {
    // 1. Health check
    console.log('--- 1. Testing Health Check ---');
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200, 'GET /api/health returned 200');
    console.log('Response:', JSON.stringify(healthData, null, 2));

    // 2. Auth: Register
    console.log('\n--- 2. Testing Auth Registration (POST /api/auth/register) ---');
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Jane Developer',
        email: testEmail,
        password: 'Password123!',
        role: 'Manager'
      })
    });
    const regData = await regRes.json();
    assert(regRes.status === 201, 'POST /api/auth/register returned 201');
    assert(regData.data.token, 'Token returned upon registration');
    token = regData.data.token;
    console.log('User registered with ID:', regData.data._id);

    // 3. Auth: Login
    console.log('\n--- 3. Testing Auth Login (POST /api/auth/login) ---');
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'Password123!'
      })
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200, 'POST /api/auth/login returned 200');
    assert(loginData.data.token, 'Token returned upon login');

    // 4. Auth: Profile (Protected)
    console.log('\n--- 4. Testing Profile (GET /api/auth/profile) ---');
    const profileRes = await fetch(`${BASE_URL}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const profileData = await profileRes.json();
    assert(profileRes.status === 200, 'GET /api/auth/profile returned 200');
    assert(profileData.data.email === testEmail, 'Profile email matches');

    // 5. Project: Create (POST /api/projects)
    console.log('\n--- 5. Testing Create Project (POST /api/projects) ---');
    const createRes = await fetch(`${BASE_URL}/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title: 'Cloud Infrastructure Migration',
        description: 'Migrate on-premise microservices architecture to AWS and Kubernetes clusters with CI/CD automation.',
        category: 'DevOps',
        status: 'In Progress',
        priority: 'High',
        budget: 45000,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: 'DevOps Team Alpha'
      })
    });
    const createData = await createRes.json();
    assert(createRes.status === 201, 'POST /api/projects returned 201');
    assert(createData.data._id, 'Project created with ID');
    createdProjectId = createData.data._id;
    console.log('Created Project ID:', createdProjectId);

    // Create a second project for variety
    await fetch(`${BASE_URL}/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title: 'Customer Mobile App Redesign',
        description: 'Revamp mobile UX and streamline customer onboarding flow.',
        category: 'UI/UX Design',
        status: 'Planning',
        priority: 'Medium',
        budget: 18000,
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: 'Design Studio'
      })
    });

    // 6. Project: Get All (GET /api/projects)
    console.log('\n--- 6. Testing Get All Projects (GET /api/projects) ---');
    const getRes = await fetch(`${BASE_URL}/api/projects`);
    const getData = await getRes.json();
    assert(getRes.status === 200, 'GET /api/projects returned 200');
    assert(getData.count >= 2, `Projects count is at least 2 (actual: ${getData.count})`);

    // 7. Project: Filter by status
    console.log('\n--- 7. Testing Filter Projects (GET /api/projects?status=In Progress) ---');
    const filterRes = await fetch(`${BASE_URL}/api/projects?status=In%20Progress`);
    const filterData = await filterRes.json();
    assert(filterRes.status === 200, 'GET /api/projects?status=In Progress returned 200');
    console.log(`Filtered count: ${filterData.count}`);

    // 8. Project: Get By ID (GET /api/projects/:id)
    console.log(`\n--- 8. Testing Get Project By ID (GET /api/projects/${createdProjectId}) ---`);
    const getSingleRes = await fetch(`${BASE_URL}/api/projects/${createdProjectId}`);
    const getSingleData = await getSingleRes.json();
    assert(getSingleRes.status === 200, 'GET /api/projects/:id returned 200');
    assert(getSingleData.data.title === 'Cloud Infrastructure Migration', 'Project title matches');

    // 9. Project: Update (PUT /api/projects/:id)
    console.log(`\n--- 9. Testing Update Project (PUT /api/projects/${createdProjectId}) ---`);
    const updateRes = await fetch(`${BASE_URL}/api/projects/${createdProjectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        status: 'Completed',
        priority: 'Urgent',
        budget: 52000
      })
    });
    const updateData = await updateRes.json();
    assert(updateRes.status === 200, 'PUT /api/projects/:id returned 200');
    assert(updateData.data.status === 'Completed', 'Project status updated to Completed');
    assert(updateData.data.budget === 52000, 'Project budget updated to 52000');

    // 10. Project: Stats summary (GET /api/projects/stats/summary)
    console.log('\n--- 10. Testing Stats Summary (GET /api/projects/stats/summary) ---');
    const statsRes = await fetch(`${BASE_URL}/api/projects/stats/summary`);
    const statsData = await statsRes.json();
    assert(statsRes.status === 200, 'GET /api/projects/stats/summary returned 200');
    console.log('Project Metrics:', JSON.stringify(statsData.data, null, 2));

    // 11. Project: Delete (DELETE /api/projects/:id)
    console.log(`\n--- 11. Testing Delete Project (DELETE /api/projects/${createdProjectId}) ---`);
    const deleteRes = await fetch(`${BASE_URL}/api/projects/${createdProjectId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    assert(deleteRes.status === 200, 'DELETE /api/projects/:id returned 200');

    // 12. Verify Deletion (GET /api/projects/:id -> 404)
    console.log(`\n--- 12. Testing Verification of Deletion ---`);
    const verifyDelRes = await fetch(`${BASE_URL}/api/projects/${createdProjectId}`);
    assert(verifyDelRes.status === 404, 'GET deleted project returned 404 Not Found as expected');

    console.log('\n🎉 ALL CRUD AND AUTH ENDPOINTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Test failed with exception:', err);
    process.exit(1);
  }
};

runTests();
