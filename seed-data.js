const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Room = require('./models/Room');
const Question = require('./models/Question');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

const seedData = async () => {
  try {
    console.log('\n🌱 Starting to seed sample data...\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Room.deleteMany({});
    await Question.deleteMany({});
    console.log('✅ Cleared existing data\n');

    // Create sample lecturers
    console.log('👨‍🏫 Creating sample lecturers...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const lecturers = await User.insertMany([
      {
        name: 'Dr. John Smith',
        email: 'john.smith@university.edu',
        password: hashedPassword,
        role: 'lecturer'
      },
      {
        name: 'Prof. Sarah Johnson',
        email: 'sarah.johnson@university.edu',
        password: hashedPassword,
        role: 'lecturer'
      },
      {
        name: 'Dr. Michael Brown',
        email: 'michael.brown@university.edu',
        password: hashedPassword,
        role: 'lecturer'
      }
    ]);
    console.log(`✅ Created ${lecturers.length} lecturers\n`);

    // Create sample rooms
    console.log('🏫 Creating sample rooms...');
    const rooms = await Room.insertMany([
      {
        roomName: 'Computer Science 101',
        roomCode: 'CS101A',
        lecturer: lecturers[0]._id,
        lecturerName: lecturers[0].name,
        questionsVisible: true,
        status: 'active',
        questionCount: 0,
        studentsCount: 15
      },
      {
        roomName: 'Data Structures & Algorithms',
        roomCode: 'DSA202',
        lecturer: lecturers[0]._id,
        lecturerName: lecturers[0].name,
        questionsVisible: false,
        status: 'active',
        questionCount: 0,
        studentsCount: 23
      },
      {
        roomName: 'Web Development',
        roomCode: 'WEB301',
        lecturer: lecturers[1]._id,
        lecturerName: lecturers[1].name,
        questionsVisible: true,
        status: 'active',
        questionCount: 0,
        studentsCount: 18
      },
      {
        roomName: 'Database Management',
        roomCode: 'DB401X',
        lecturer: lecturers[1]._id,
        lecturerName: lecturers[1].name,
        questionsVisible: true,
        status: 'active',
        questionCount: 0,
        studentsCount: 12
      },
      {
        roomName: 'Machine Learning Basics',
        roomCode: 'ML501Y',
        lecturer: lecturers[2]._id,
        lecturerName: lecturers[2].name,
        questionsVisible: false,
        status: 'active',
        questionCount: 0,
        studentsCount: 20
      }
    ]);
    console.log(`✅ Created ${rooms.length} rooms\n`);

    // Create sample questions for each room
    console.log('❓ Creating sample questions...');
    
    const sampleQuestions = [
      // CS101A - Computer Science 101 (Public)
      {
        questionText: 'What is the difference between synchronous and asynchronous programming?',
        room: rooms[0]._id,
        studentTag: 'Student #42',
        upvotes: 15,
        upvotedBy: [],
        status: 'approved',
        isReported: false
      },
      {
        questionText: 'Can you explain how recursion works with a practical example?',
        room: rooms[0]._id,
        studentTag: 'Student #17',
        upvotes: 23,
        upvotedBy: [],
        status: 'answered',
        answer: 'Recursion is when a function calls itself. Think of it like Russian nesting dolls - each doll contains a smaller version until you reach the smallest one (base case).',
        isReported: false
      },
      {
        questionText: 'Is there a recommended design pattern for state management in large applications?',
        room: rooms[0]._id,
        studentTag: 'Student #8',
        upvotes: 8,
        upvotedBy: [],
        status: 'pending',
        isReported: false
      },
      {
        questionText: 'How do I properly handle errors in async/await functions?',
        room: rooms[0]._id,
        studentTag: 'Student #31',
        upvotes: 12,
        upvotedBy: [],
        status: 'approved',
        isReported: false
      },

      // DSA202 - Data Structures (Private)
      {
        questionText: 'What is the time complexity of binary search?',
        room: rooms[1]._id,
        studentTag: 'Student #5',
        upvotes: 18,
        upvotedBy: [],
        status: 'answered',
        answer: 'Binary search has O(log n) time complexity because it divides the search space in half with each iteration.',
        isReported: false
      },
      {
        questionText: 'Can you explain the difference between a stack and a queue?',
        room: rooms[1]._id,
        studentTag: 'Student #12',
        upvotes: 10,
        upvotedBy: [],
        status: 'approved',
        isReported: false
      },
      {
        questionText: 'How do hash tables achieve O(1) lookup time?',
        room: rooms[1]._id,
        studentTag: 'Student #23',
        upvotes: 7,
        upvotedBy: [],
        status: 'pending',
        isReported: false
      },

      // WEB301 - Web Development (Public)
      {
        questionText: 'What are the best practices for API security?',
        room: rooms[2]._id,
        studentTag: 'Student #14',
        upvotes: 19,
        upvotedBy: [],
        status: 'answered',
        answer: 'Use HTTPS, implement JWT authentication, validate all inputs, use rate limiting, and keep dependencies updated.',
        isReported: false
      },
      {
        questionText: 'How does React Virtual DOM improve performance?',
        room: rooms[2]._id,
        studentTag: 'Student #9',
        upvotes: 14,
        upvotedBy: [],
        status: 'approved',
        isReported: false
      },
      {
        questionText: 'What is the difference between cookies and local storage?',
        room: rooms[2]._id,
        studentTag: 'Student #28',
        upvotes: 11,
        upvotedBy: [],
        status: 'pending',
        isReported: false
      },
      {
        questionText: 'Can you explain CORS and why it exists?',
        room: rooms[2]._id,
        studentTag: 'Student #3',
        upvotes: 16,
        upvotedBy: [],
        status: 'approved',
        isReported: false
      },

      // DB401X - Database Management (Public)
      {
        questionText: 'What is the difference between SQL and NoSQL databases?',
        room: rooms[3]._id,
        studentTag: 'Student #7',
        upvotes: 22,
        upvotedBy: [],
        status: 'answered',
        answer: 'SQL databases are relational with fixed schemas, while NoSQL databases are flexible and better for unstructured data. Choose SQL for complex queries and ACID compliance, NoSQL for scalability and flexibility.',
        isReported: false
      },
      {
        questionText: 'How do database indexes improve query performance?',
        room: rooms[3]._id,
        studentTag: 'Student #19',
        upvotes: 13,
        upvotedBy: [],
        status: 'approved',
        isReported: false
      },
      {
        questionText: 'What is database normalization and why is it important?',
        room: rooms[3]._id,
        studentTag: 'Student #11',
        upvotes: 9,
        upvotedBy: [],
        status: 'pending',
        isReported: false
      },

      // ML501Y - Machine Learning (Private)
      {
        questionText: 'What is the difference between supervised and unsupervised learning?',
        room: rooms[4]._id,
        studentTag: 'Student #6',
        upvotes: 25,
        upvotedBy: [],
        status: 'answered',
        answer: 'Supervised learning uses labeled data to train models (like teaching with answer keys), while unsupervised learning finds patterns in unlabeled data (like discovering hidden groups).',
        isReported: false
      },
      {
        questionText: 'How does gradient descent optimization work?',
        room: rooms[4]._id,
        studentTag: 'Student #15',
        upvotes: 17,
        upvotedBy: [],
        status: 'approved',
        isReported: false
      },
      {
        questionText: 'What is overfitting and how can we prevent it?',
        room: rooms[4]._id,
        studentTag: 'Student #22',
        upvotes: 20,
        upvotedBy: [],
        status: 'pending',
        isReported: false
      }
    ];

    const questions = await Question.insertMany(sampleQuestions);
    console.log(`✅ Created ${questions.length} questions\n`);

    // Update room question counts
    console.log('🔄 Updating room statistics...');
    for (const room of rooms) {
      const questionCount = questions.filter(q => q.room.toString() === room._id.toString()).length;
      await Room.findByIdAndUpdate(room._id, { questionCount });
    }
    console.log('✅ Updated room statistics\n');

    // Display summary
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🎉 Sample data seeded successfully!\n');
    console.log('📊 Summary:');
    console.log(`   👨‍🏫 Lecturers: ${lecturers.length}`);
    console.log(`   🏫 Rooms: ${rooms.length}`);
    console.log(`   ❓ Questions: ${questions.length}\n`);
    console.log('🔐 Login Credentials (for all lecturers):');
    console.log('   📧 Email: john.smith@university.edu');
    console.log('   📧 Email: sarah.johnson@university.edu');
    console.log('   📧 Email: michael.brown@university.edu');
    console.log('   🔑 Password: password123\n');
    console.log('🏫 Room Codes:');
    rooms.forEach(room => {
      console.log(`   📚 ${room.roomName}: ${room.roomCode} (${room.questionsVisible ? 'Public' : 'Private'})`);
    });
    console.log('═══════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('\n❌ Error seeding data:', error);
  } finally {
    mongoose.connection.close();
    console.log('👋 Database connection closed\n');
    process.exit(0);
  }
};

// Run the seed function
seedData();
