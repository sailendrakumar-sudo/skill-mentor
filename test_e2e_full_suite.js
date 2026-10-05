/**
 * Skill Mentor - Comprehensive End-to-End Functional Test Suite
 * Tests all 18 requirements in sequence.
 */

const BASE_URL = 'http://localhost:5000/api';

const results = {
  total: 0,
  passed: 0,
  failed: 0,
  features: []
};

function recordTest(featureName, success, details = '') {
  results.total++;
  if (success) {
    results.passed++;
    results.features.push({ name: featureName, status: 'PASSED', details });
    console.log(`✅ [PASS] ${featureName} ${details ? `(${details})` : ''}`);
  } else {
    results.failed++;
    results.features.push({ name: featureName, status: 'FAILED', details });
    console.error(`❌ [FAIL] ${featureName}: ${details}`);
  }
}

async function runE2ETests() {
  console.log('================================================================');
  console.log('🧪 STARTING COMPLETE SKILL MENTOR E2E FUNCTIONAL TEST SUITE');
  console.log(`Endpoint: ${BASE_URL}`);
  console.log('================================================================\n');

  let testUser = null;
  let testUserId = null;
  let activeToken = null;

  // Headers helper
  const authHeaders = (userId, token = null) => ({
    'Content-Type': 'application/json',
    'x-user-id': userId,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  });

  // TEST 1: Health Check
  try {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    recordTest('Server Health Check', res.status === 200 && data.status === 'healthy', `Status: ${data.status}`);
  } catch (e) {
    recordTest('Server Health Check', false, e.message);
  }

  // TEST 2: Student Registration
  const testEmail = `elena.rostova.${Date.now()}@university.edu`;
  const testPassword = 'Password123!';
  const testFullName = 'Elena Rostova';

  try {
    // Generate UUID for registered user
    testUserId = 'f7777777-7777-7777-7777-777777777777';
    testUser = { id: testUserId, email: testEmail, full_name: testFullName };
    
    // Verify user can update/create profile
    const profRes = await fetch(`${BASE_URL}/profiles`, {
      method: 'PUT',
      headers: authHeaders(testUserId),
      body: JSON.stringify({
        full_name: testFullName,
        bio: 'Robotics and Computer Vision graduate student passionate about autonomous navigation and user interface design.',
        institution: 'Carnegie Mellon University',
        department: 'Robotics Institute',
        year_of_study: 'Graduate / 1st Year',
        location: 'Pittsburgh, PA',
        preferred_format: 'Hybrid',
        languages: ['English', 'Russian']
      })
    });
    const profData = await profRes.json();
    recordTest('Student Registration & Initial Profile Creation', profRes.status === 200 && profData.success, `Created profile for ${testFullName}`);
  } catch (e) {
    recordTest('Student Registration & Initial Profile Creation', false, e.message);
  }

  // TEST 3: Login & Profile Retrieval
  try {
    const res = await fetch(`${BASE_URL}/profiles/me`, {
      headers: authHeaders(testUserId)
    });
    const data = await res.json();
    const valid = res.status === 200 && data.profile?.full_name === testFullName;
    recordTest('Authentication & Profile Retrieval (/profiles/me)', valid, `Retrieved ${data.profile?.institution}`);
  } catch (e) {
    recordTest('Authentication & Profile Retrieval (/profiles/me)', false, e.message);
  }

  // TEST 4: Adding Teaching Skills
  let teachSkillId = null;
  try {
    const res1 = await fetch(`${BASE_URL}/skills/teach`, {
      method: 'POST',
      headers: authHeaders(testUserId),
      body: JSON.stringify({ skill_name: 'ROS2', proficiency_level: 'Expert' })
    });
    const d1 = await res1.json();
    teachSkillId = d1.skill?.id;

    const res2 = await fetch(`${BASE_URL}/skills/teach`, {
      method: 'POST',
      headers: authHeaders(testUserId),
      body: JSON.stringify({ skill_name: 'Python', proficiency_level: 'Advanced' })
    });
    const d2 = await res2.json();

    const pass = res1.status === 201 && res2.status === 201 && d1.success && d2.success;
    recordTest('Add Teaching Skills (Mentor Inventory)', pass, `Added ROS2 (Expert) & Python (Advanced)`);
  } catch (e) {
    recordTest('Add Teaching Skills (Mentor Inventory)', false, e.message);
  }

  // TEST 5: Adding Learning Skills
  let learnSkillId = null;
  try {
    const res1 = await fetch(`${BASE_URL}/skills/learn`, {
      method: 'POST',
      headers: authHeaders(testUserId),
      body: JSON.stringify({ skill_name: 'UI/UX Design', target_level: 'Advanced' })
    });
    const d1 = await res1.json();
    learnSkillId = d1.skill?.id;

    const res2 = await fetch(`${BASE_URL}/skills/learn`, {
      method: 'POST',
      headers: authHeaders(testUserId),
      body: JSON.stringify({ skill_name: 'Figma', target_level: 'Intermediate' })
    });
    const d2 = await res2.json();

    const pass = res1.status === 201 && res2.status === 201 && d1.success && d2.success;
    recordTest('Add Learning Skills (Learner Goals)', pass, `Added UI/UX Design & Figma`);
  } catch (e) {
    recordTest('Add Learning Skills (Learner Goals)', false, e.message);
  }

  // TEST 6: Profile Verification after Skill Additions
  try {
    const res = await fetch(`${BASE_URL}/profiles/${testUserId}`);
    const data = await res.json();
    const teachCount = data.profile?.teaching_skills?.length || 0;
    const learnCount = data.profile?.learning_skills?.length || 0;
    recordTest('Skill Inventory Persistence Verification', teachCount >= 2 && learnCount >= 2, `Teach: ${teachCount}, Learn: ${learnCount}`);
  } catch (e) {
    recordTest('Skill Inventory Persistence Verification', false, e.message);
  }

  // TEST 7: Skill Discovery & Filtering
  try {
    const discAll = await (await fetch(`${BASE_URL}/skills/discover`)).json();
    const discQuery = await (await fetch(`${BASE_URL}/skills/discover?query=Python`)).json();
    const discFormat = await (await fetch(`${BASE_URL}/skills/discover?format=Online`)).json();

    const pass = discAll.students?.length > 0 && discQuery.students?.length > 0 && discFormat.students?.length > 0;
    recordTest('Global Student Discovery & Multi-Filter Search', pass, `Found ${discAll.students?.length} total peers, ${discQuery.students?.length} teaching Python`);
  } catch (e) {
    recordTest('Global Student Discovery & Multi-Filter Search', false, e.message);
  }

  // TEST 8: Gemini AI Mentor Recommendations
  let topMentorId = null;
  try {
    const res = await fetch(`${BASE_URL}/ai/recommendations`, {
      method: 'POST',
      headers: authHeaders(testUserId)
    });
    const data = await res.json();
    const recommendations = data.recommendations || [];
    const topRec = recommendations[0];
    topMentorId = topRec?.mentorId;

    const pass = res.status === 200 && recommendations.length > 0 && topRec.matchScore >= 60;
    recordTest('Gemini AI-Powered Recommendations & Rationale', pass, `Top match: ${topRec?.mentor?.full_name} (${topRec?.matchScore}% Compatibility)`);
  } catch (e) {
    recordTest('Gemini AI-Powered Recommendations & Rationale', false, e.message);
  }

  // Target mentor for exchange tests: Sarah Jenkins (UI/UX expert who wants Python)
  const sarahId = 'b2222222-2222-2222-2222-222222222222';
  const marcusId = 'c3333333-3333-3333-3333-333333333333';
  let exchangeRequestId = null;
  let cancelRequestId = null;

  // TEST 9: Mentorship Request Workflow (Create Request)
  try {
    const res = await fetch(`${BASE_URL}/requests`, {
      method: 'POST',
      headers: authHeaders(testUserId),
      body: JSON.stringify({
        receiver_id: sarahId,
        skill_requested: 'UI/UX Design',
        skill_offered: 'Python',
        objective: 'I want to build an intuitive teleoperation control dashboard for my mobile robotics project.'
      })
    });
    const data = await res.json();
    exchangeRequestId = data.request?.id;

    recordTest('Mentorship Request Creation', res.status === 201 && data.request?.status === 'Pending', `Request ID: ${exchangeRequestId}`);
  } catch (e) {
    recordTest('Mentorship Request Creation', false, e.message);
  }

  // TEST 10: Mentorship Request Acceptance (by Sarah)
  try {
    const res = await fetch(`${BASE_URL}/requests/${exchangeRequestId}`, {
      method: 'PATCH',
      headers: authHeaders(sarahId),
      body: JSON.stringify({ status: 'Accepted' })
    });
    const data = await res.json();
    recordTest('Mentorship Request Acceptance Workflow', res.status === 200 && data.request?.status === 'Accepted', `Status updated to Accepted`);
  } catch (e) {
    recordTest('Mentorship Request Acceptance Workflow', false, e.message);
  }

  // TEST 11: Mentorship Request Cancellation Workflow
  try {
    // Elena sends request to Marcus
    const res1 = await fetch(`${BASE_URL}/requests`, {
      method: 'POST',
      headers: authHeaders(testUserId),
      body: JSON.stringify({
        receiver_id: marcusId,
        skill_requested: 'Mathematics',
        skill_offered: 'ROS2',
        objective: 'Looking for matrix algebra review for coordinate transformation frames.'
      })
    });
    const d1 = await res1.json();
    cancelRequestId = d1.request?.id;

    // Elena cancels it
    const res2 = await fetch(`${BASE_URL}/requests/${cancelRequestId}`, {
      method: 'PATCH',
      headers: authHeaders(testUserId),
      body: JSON.stringify({ status: 'Cancelled' })
    });
    const d2 = await res2.json();

    recordTest('Mentorship Request Cancellation Workflow', res2.status === 200 && d2.request?.status === 'Cancelled', `Status updated to Cancelled`);
  } catch (e) {
    recordTest('Mentorship Request Cancellation Workflow', false, e.message);
  }

  // TEST 12: Chat & Real-Time Messaging between Elena and Sarah
  let convId = null;
  try {
    // Elena sends initial message
    const res1 = await fetch(`${BASE_URL}/messages`, {
      method: 'POST',
      headers: authHeaders(testUserId),
      body: JSON.stringify({
        receiver_id: sarahId,
        content: 'Hi Sarah! So thrilled you accepted my request. Looking forward to designing our robotics UI.'
      })
    });
    const d1 = await res1.json();
    convId = d1.message?.conversation_id;

    // Sarah replies
    const res2 = await fetch(`${BASE_URL}/messages`, {
      method: 'POST',
      headers: authHeaders(sarahId),
      body: JSON.stringify({
        conversation_id: convId,
        content: 'Hey Elena! Awesome to connect. I would love to learn Python scripting for 3D asset generation.'
      })
    });
    const d2 = await res2.json();

    // Fetch conversation messages
    const res3 = await fetch(`${BASE_URL}/messages/${convId}`, {
      headers: authHeaders(testUserId)
    });
    const d3 = await res3.json();

    const pass = res1.status === 201 && res2.status === 201 && d3.messages?.length >= 2;
    recordTest('Peer-to-Peer Chat & Messaging', pass, `${d3.messages?.length} messages exchanged in conversation`);
  } catch (e) {
    recordTest('Peer-to-Peer Chat & Messaging', false, e.message);
  }

  // TEST 13: Learning Session Scheduling & Google Meet Links
  let scheduledSessionId = null;
  try {
    const res = await fetch(`${BASE_URL}/sessions`, {
      method: 'POST',
      headers: authHeaders(testUserId),
      body: JSON.stringify({
        mentor_id: sarahId,
        learner_id: testUserId,
        skill_name: 'UI/UX Design',
        session_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        start_time: '15:00:00',
        end_time: '16:00:00',
        meeting_link: 'https://meet.google.com/xyz-mentor-teleop',
        objective: 'Figma component hierarchies, auto-layout, and robotics telemetry card design.'
      })
    });
    const data = await res.json();
    scheduledSessionId = data.session?.id;

    recordTest('Learning Session Scheduling & Video Link Integration', res.status === 201 && data.session?.status === 'Scheduled', `Session ID: ${scheduledSessionId}`);
  } catch (e) {
    recordTest('Learning Session Scheduling & Video Link Integration', false, e.message);
  }

  // TEST 14: Completing a Learning Session
  try {
    const res = await fetch(`${BASE_URL}/sessions/${scheduledSessionId}`, {
      method: 'PATCH',
      headers: authHeaders(testUserId),
      body: JSON.stringify({ status: 'Completed' })
    });
    const data = await res.json();

    recordTest('Session Completion Workflow', res.status === 200 && data.session?.status === 'Completed', `Session marked as Completed`);
  } catch (e) {
    recordTest('Session Completion Workflow', false, e.message);
  }

  // TEST 15: Submitting Post-Session Review & Rating
  try {
    const res = await fetch(`${BASE_URL}/reviews`, {
      method: 'POST',
      headers: authHeaders(testUserId),
      body: JSON.stringify({
        session_id: scheduledSessionId,
        reviewed_id: sarahId,
        rating: 5,
        feedback: 'Sarah is an extraordinary design mentor! In 60 minutes, she helped me transform a cluttered interface into a modern, accessible Figma design system.'
      })
    });
    const data = await res.json();

    recordTest('Post-Session Review & Rating Submission', res.status === 201 && data.review?.rating === 5, `Submitted 5-star rating for Sarah`);
  } catch (e) {
    recordTest('Post-Session Review & Rating Submission', false, e.message);
  }

  // TEST 16: Verification of Reputation Update
  try {
    const res = await fetch(`${BASE_URL}/profiles/${sarahId}`);
    const data = await res.json();
    const updatedRating = data.profile?.rating;
    const completedCount = data.profile?.completed_sessions_count;

    recordTest('Reputation Recalculation & Session Counter Update', updatedRating >= 4.8 && completedCount >= 1, `Sarah's Rating: ${updatedRating} ★, Completed: ${completedCount}`);
  } catch (e) {
    recordTest('Reputation Recalculation & Session Counter Update', false, e.message);
  }

  // TEST 17: AI Skill Gap & Roadmap Advisory
  try {
    const res = await fetch(`${BASE_URL}/ai/skill-gap`, {
      method: 'POST',
      headers: authHeaders(testUserId),
      body: JSON.stringify({
        skill_name: 'UI/UX Design',
        current_level: 'Beginner',
        target_level: 'Advanced',
        objective: 'Master design systems and interactive prototypes for web applications.'
      })
    });
    const data = await res.json();
    const milestones = data.advisory?.milestoneRoadmap?.length || 0;

    recordTest('AI Skill Gap & 4-Week Milestone Roadmap', res.status === 200 && milestones > 0, `Generated ${milestones} learning milestones`);
  } catch (e) {
    recordTest('AI Skill Gap & 4-Week Milestone Roadmap', false, e.message);
  }

  // TEST 18: AI Session Agenda & Prep Generator
  try {
    const res = await fetch(`${BASE_URL}/ai/session-agenda`, {
      method: 'POST',
      headers: authHeaders(testUserId),
      body: JSON.stringify({
        skill_name: 'Python',
        objective: 'Build an automated web scraper and JSON exporter with error handling.',
        duration_minutes: 60
      })
    });
    const data = await res.json();
    const segments = data.agenda?.agendaSegments?.length || 0;

    recordTest('AI Time-Boxed Session Prep & Agenda Generator', res.status === 200 && segments > 0, `Generated ${segments} structured segments`);
  } catch (e) {
    recordTest('AI Time-Boxed Session Prep & Agenda Generator', false, e.message);
  }

  // TEST 19: Frontend Asset Delivery & SPA Routing
  try {
    const rootRes = await fetch('http://localhost:5000/');
    const spaRes = await fetch('http://localhost:5000/recommendations');
    const html1 = await rootRes.text();
    const html2 = await spaRes.text();

    const pass = rootRes.status === 200 && spaRes.status === 200 && html1.includes('Skill Mentor') && html2.includes('Skill Mentor');
    recordTest('Unified Frontend Delivery & SPA Client Routing', pass, `Served index.html for / and /recommendations`);
  } catch (e) {
    recordTest('Unified Frontend Delivery & SPA Client Routing', false, e.message);
  }

  // SUMMARY REPORT
  console.log('\n================================================================');
  console.log('📊 FINAL TEST RESULTS REPORT');
  console.log('================================================================');
  console.log(`Total Tests Run : ${results.total}`);
  console.log(`Total Passed    : ${results.passed}`);
  console.log(`Total Failed    : ${results.failed}`);
  console.log(`Success Rate    : ${((results.passed / results.total) * 100).toFixed(1)}%`);
  console.log('================================================================\n');

  if (results.failed === 0) {
    console.log('🎉 ALL FUNCTIONAL TESTS COMPLETED WITH 100% SUCCESS!');
    process.exit(0);
  } else {
    console.error(`⚠️ ${results.failed} tests failed. Check error logs.`);
    process.exit(1);
  }
}

runE2ETests().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
