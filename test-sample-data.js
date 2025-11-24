const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

const testSampleData = async () => {
  console.log('\n🧪 Testing Sample Data...\n');

  try {
    // Test 1: Login with sample lecturer
    console.log('1️⃣  Testing login with sample lecturer...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'john.smith@university.edu',
      password: 'password123'
    });
    console.log('✅ Login successful');
    console.log(`   Lecturer: ${loginResponse.data.data.user.name}`);
    const token = loginResponse.data.data.token;

    // Test 2: Get lecturer's rooms
    console.log('\n2️⃣  Testing get lecturer rooms...');
    const roomsResponse = await axios.get(`${BASE_URL}/rooms/my-rooms`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ Found ${roomsResponse.data.data.rooms.length} rooms`);
    roomsResponse.data.data.rooms.forEach(room => {
      console.log(`   📚 ${room.roomName} (${room.roomCode}) - ${room.questionCount} questions`);
    });

    // Test 3: Get questions for first room
    if (roomsResponse.data.data.rooms.length > 0) {
      const firstRoom = roomsResponse.data.data.rooms[0];
      console.log(`\n3️⃣  Testing get questions for room: ${firstRoom.roomName}...`);
      const questionsResponse = await axios.get(`${BASE_URL}/questions/${firstRoom._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`✅ Found ${questionsResponse.data.data.questions.length} questions`);
      questionsResponse.data.data.questions.forEach((q, index) => {
        console.log(`   ${index + 1}. [${q.status.toUpperCase()}] ${q.questionText.substring(0, 60)}...`);
        console.log(`      👍 ${q.upvotes} upvotes | ${q.studentTag}`);
      });
    }

    // Test 4: Join room as student
    console.log('\n4️⃣  Testing student join room...');
    const joinResponse = await axios.post(`${BASE_URL}/rooms/join`, {
      roomCode: 'CS101A'
    });
    console.log('✅ Successfully joined room');
    console.log(`   Room: ${joinResponse.data.data.roomName}`);
    console.log(`   Lecturer: ${joinResponse.data.data.lecturerName}`);
    console.log(`   Student Tag: ${joinResponse.data.data.studentTag}`);

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('✅ All tests passed! Sample data is working correctly.');
    console.log('═══════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('\n❌ Test failed:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Message:', error.response.data.message || error.response.data);
    } else {
      console.error('   Error:', error.message);
    }
    console.log('\n');
  }
};

testSampleData();
