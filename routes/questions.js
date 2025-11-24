const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Room = require('../models/Room');
const { protect } = require('../middleware/auth');

// @route   POST /api/questions
// @desc    Create a new question (for students)
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { questionText, roomId, studentTag } = req.body;

    if (!questionText || !roomId || !studentTag) {
      return res.status(400).json({
        success: false,
        message: 'Please provide questionText, roomId, and studentTag'
      });
    }

    // Check if room exists and is active
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    if (room.status === 'closed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot add questions to a closed room'
      });
    }

    // Create question
    const question = await Question.create({
      questionText,
      room: roomId,
      studentTag
    });

    // Increment room question count
    room.questionCount += 1;
    await room.save();

    // Emit socket event to notify all clients in the room
    const io = req.app.get('io');
    if (io) {
      io.to(room.roomCode).emit('new-question', question);
      console.log(`Socket: Emitted new-question to room ${room.roomCode}`);
    }

    res.status(201).json({
      success: true,
      message: 'Question added successfully',
      data: question
    });
  } catch (error) {
    console.error('Create Question Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating question',
      error: error.message
    });
  }
});

// @route   GET /api/questions/room/:roomId
// @desc    Get all questions for a room
// @access  Public (students see filtered based on room visibility)
router.get('/room/:roomId', async (req, res) => {
  try {
    const { studentTag, includeRejected } = req.query;
    const roomId = req.params.roomId;

    // Check if room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Fetch all questions for the room (frontend will handle visibility filtering)
    let query = { room: roomId };
    
    // Exclude rejected questions unless specifically requested (for lecturer panel)
    if (includeRejected !== 'true') {
      query.status = { $ne: 'rejected' };
    }

    const questions = await Question.find(query)
      .sort({ upvotes: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
      questionsVisible: room.questionsVisible // Send visibility status to frontend
    });
  } catch (error) {
    console.error('Get Questions Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching questions',
      error: error.message
    });
  }
});

// @route   PUT /api/questions/:id/upvote
// @desc    Upvote a question
// @access  Public
router.put('/:id/upvote', async (req, res) => {
  try {
    const { studentTag } = req.body;

    if (!studentTag) {
      return res.status(400).json({
        success: false,
        message: 'Please provide studentTag'
      });
    }

    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check if already upvoted
    if (question.upvotedBy.includes(studentTag)) {
      // Remove upvote
      question.upvotedBy = question.upvotedBy.filter(tag => tag !== studentTag);
      question.upvotes = Math.max(0, question.upvotes - 1);
    } else {
      // Add upvote
      question.upvotedBy.push(studentTag);
      question.upvotes += 1;
    }

    await question.save();

    // Emit socket event to notify all clients in the room
    const room = await question.populate('room');
    const io = req.app.get('io');
    if (io && room.room) {
      io.to(room.room.roomCode).emit('question-upvote-update', {
        questionId: question._id,
        upvotes: question.upvotes
      });
      console.log(`Socket: Emitted upvote update for question ${question._id}`);
    }

    res.status(200).json({
      success: true,
      message: question.upvotedBy.includes(studentTag) ? 'Question upvoted' : 'Upvote removed',
      data: question
    });
  } catch (error) {
    console.error('Upvote Question Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error upvoting question',
      error: error.message
    });
  }
});

// @route   PUT /api/questions/:id/report
// @desc    Report a question
// @access  Public
router.put('/:id/report', async (req, res) => {
  try {
    const { studentTag } = req.body;

    if (!studentTag) {
      return res.status(400).json({
        success: false,
        message: 'Please provide studentTag'
      });
    }

    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check if already reported by this student
    if (question.reportedBy.includes(studentTag)) {
      return res.status(400).json({
        success: false,
        message: 'You have already reported this question'
      });
    }

    // Add report
    question.reportedBy.push(studentTag);
    question.reportCount += 1;
    question.isReported = true;

    await question.save();

    res.status(200).json({
      success: true,
      message: 'Question reported successfully',
      data: question
    });
  } catch (error) {
    console.error('Report Question Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error reporting question',
      error: error.message
    });
  }
});

// @route   PUT /api/questions/:id/answer
// @desc    Mark question as answered
// @access  Private (Lecturer)
router.put('/:id/answer', protect, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate('room');

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check if user is the lecturer of this room
    if (question.room.lecturer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to mark this question as answered'
      });
    }

    question.status = 'answered';
    question.answeredAt = Date.now();
    await question.save();

    // Emit socket event to notify all clients in the room
    const io = req.app.get('io');
    if (io) {
      io.to(question.room.roomCode).emit('question-marked-answered', {
        questionId: question._id
      });
      console.log(`Socket: Emitted question-marked-answered for question ${question._id}`);
    }

    res.status(200).json({
      success: true,
      message: 'Question marked as answered',
      data: question
    });
  } catch (error) {
    console.error('Answer Question Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking question as answered',
      error: error.message
    });
  }
});

// @route   DELETE /api/questions/:id
// @desc    Delete a question (mark as rejected)
// @access  Private (Lecturer)
router.delete('/:id', protect, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate('room');

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check if user is the lecturer of this room
    if (question.room.lecturer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this question'
      });
    }

    // Mark as rejected instead of deleting
    question.status = 'rejected';
    await question.save();

    // Emit socket event to notify all clients in the room
    const io = req.app.get('io');
    if (io) {
      io.to(question.room.roomCode).emit('question-removed', {
        questionId: question._id
      });
      console.log(`Socket: Emitted question-removed for question ${question._id}`);
    }

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully',
      data: question
    });
  } catch (error) {
    console.error('Delete Question Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting question',
      error: error.message
    });
  }
});

// @route   PUT /api/questions/:id/restore
// @desc    Restore a deleted question
// @access  Private (Lecturer)
router.put('/:id/restore', protect, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate('room');

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check if user is the lecturer of this room
    if (question.room.lecturer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to restore this question'
      });
    }

    // Restore to pending status
    question.status = 'pending';
    await question.save();

    // Emit socket event to notify all clients in the room
    const io = req.app.get('io');
    if (io) {
      io.to(question.room.roomCode).emit('question-restored', {
        questionId: question._id
      });
      console.log(`Socket: Emitted question-restored for question ${question._id}`);
    }

    res.status(200).json({
      success: true,
      message: 'Question restored successfully',
      data: question
    });
  } catch (error) {
    console.error('Restore Question Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error restoring question',
      error: error.message
    });
  }
});

// @route   DELETE /api/questions/:id/permanent
// @desc    Permanently delete a question
// @access  Private (Lecturer)
router.delete('/:id/permanent', protect, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate('room');

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check if user is the lecturer of this room
    if (question.room.lecturer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this question'
      });
    }

    const roomCode = question.room.roomCode;
    const questionId = question._id;

    // Permanently delete the question
    await question.deleteOne();

    // Emit socket event to notify all clients in the room
    const io = req.app.get('io');
    if (io) {
      io.to(roomCode).emit('question-permanently-deleted', {
        questionId: questionId
      });
      console.log(`Socket: Emitted question-permanently-deleted for question ${questionId}`);
    }

    res.status(200).json({
      success: true,
      message: 'Question permanently deleted'
    });
  } catch (error) {
    console.error('Permanent Delete Question Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error permanently deleting question',
      error: error.message
    });
  }
});

module.exports = router;
