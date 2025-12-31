# 🎉 QBox Sample Data

MongoDB Atlas has been populated with sample data for testing!

## 📊 What's Included

### 👨‍🏫 3 Sample Lecturers
| Name | Email | Password |
|------|-------|----------|
| Dr. John Smith | `john.smith@university.edu` | `password123` |
| Prof. Sarah Johnson | `sarah.johnson@university.edu` | `password123` |
| Dr. Michael Brown | `michael.brown@university.edu` | `password123` |

### 🏫 5 Sample Rooms

1. **Computer Science 101** 
   - Code: `CS101A`
   - Lecturer: Dr. John Smith
   - Visibility: 🌐 Public
   - Questions: 4 (pending, approved, answered)

2. **Data Structures & Algorithms**
   - Code: `DSA202`
   - Lecturer: Dr. John Smith
   - Visibility: Private
   - Questions: 3

3. **Web Development**
   - Code: `WEB301`
   - Lecturer: Prof. Sarah Johnson
   - Visibility: 🌐 Public
   - Questions: 4

4. **Database Management**
   - Code: `DB401X`
   - Lecturer: Prof. Sarah Johnson
   - Visibility: 🌐 Public
   - Questions: 3

5. **Machine Learning Basics**
   - Code: `ML501Y`
   - Lecturer: Dr. Michael Brown
   - Visibility: Private
   - Questions: 3

### ❓ 17 Sample Questions
- Questions with different statuses: **pending**, **approved**, **answered**
- Questions with various upvote counts
- Anonymous student tags (e.g., "Student #42")
- Some questions include answers from lecturers

## 🚀 How to Use

### For Lecturers (Mobile App):
1. **Open the QBox app**
2. **Login** with any lecturer credentials above
3. **View your rooms** - You'll see real rooms from the database
4. **Create new rooms** - They'll be saved to MongoDB
5. **Manage questions** - Approve, answer, or delete questions

### For Students (Mobile App):
1. **Open the QBox app**
2. **Join a room** using any room code above (e.g., `CS101A`)
3. **Ask questions** - They'll be saved to the database
4. **View questions** - See real questions based on room visibility

## 🔄 Reset Sample Data

To reset and repopulate the sample data:

```powershell
cd QBox-Backend
node seed-data.js
```

This will:
- ✅ Clear existing data
- ✅ Create fresh lecturers, rooms, and questions
- ✅ Display new credentials and room codes

## 🧪 Test the API

To verify the sample data is accessible:

```powershell
cd QBox-Backend
node test-sample-data.js
```

This will test:
- ✅ Lecturer login
- ✅ Fetching rooms
- ✅ Fetching questions
- ✅ Student joining rooms

## 🗄️ Database Info

- **Database**: MongoDB Atlas
- **Connection**: `mongodb+srv://cluster0.mv7ik1j.mongodb.net/qbox`
- **Collections**: `users`, `rooms`, `questions`

## 📱 Mobile App Testing

### Test Scenario 1: Lecturer Experience
1. Login as `john.smith@university.edu` / `password123`
2. You'll see 2 rooms (CS101A and DSA202)
3. Open CS101A - You'll see 4 real questions
4. Try approving, answering, or deleting questions

### Test Scenario 2: Student Experience
1. Join room with code `CS101A` (public room)
2. You'll see approved/answered questions from other students
3. Ask a new question - It will appear in the lecturer's panel
4. Try joining `DSA202` (private room) - You'll only see your own questions

### Test Scenario 3: Room Management
1. Login as any lecturer
2. Create a new room
3. Share the room code with students
4. Toggle question visibility (public/private)
5. Close the room when done

## 🎯 Key Features to Test

- ✅ **Real-time data** - All changes saved to MongoDB
- ✅ **Question visibility** - Public vs Private rooms
- ✅ **Question statuses** - Pending → Approved → Answered
- ✅ **Upvoting** - Students can upvote questions
- ✅ **Anonymous tags** - Each student gets a unique tag per room
- ✅ **Room management** - Create, close, share rooms

## 🐛 Troubleshooting

If you don't see data:
1. Make sure backend server is running: `node server.js`
2. Check MongoDB connection in `.env` file
3. Re-run seed script: `node seed-data.js`
4. Check API URL in mobile app: `http://10.0.2.2:5000/api` (emulator) or `http://192.168.1.19:5000/api` (real device)

## 📝 Notes

- All passwords are `password123` for testing
- Student tags are generated automatically when joining rooms
- Questions are associated with rooms via MongoDB ObjectIDs
- Room codes are 6 characters (letters/numbers)
