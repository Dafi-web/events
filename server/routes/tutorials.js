const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const CourseEnrollment = require('../models/CourseEnrollment');

// @route   GET /api/tutorials/courses
// @desc    Get available courses for enrollment
// @access  Public
router.get('/courses', async (req, res) => {
  try {
    const courses = [
    {
      id: 'math-grade-5-12',
      name: 'Mathematics (Grade 5-12)',
      nameAmharic: 'ሒሳብ (5-12 ክፍል)',
      description: 'Ethiopian curriculum mathematics from Grade 5 to Grade 12, taught by university lecturers with Master\'s degrees in Mathematics and Education. Duration and pricing can be customized based on your learning needs.',
      descriptionAmharic: 'ከ5-12 ክፍል የኢትዮጵያ የሒሳብ ሥርዓተ ትምህርት፣ በሒሳብ እና በትምህርት ውስጥ የማስተርስ ዲግሪ ያላቸው የዩኒቨርሲቲ ፕሮፌሰሮች ይሰጣል።',
      subjects: ['Algebra', 'Geometry', 'Trigonometry', 'Calculus', 'Statistics', 'Ethiopian Math Curriculum'],
      subjectsAmharic: ['አልጀብራ', 'ጂኦሜትሪ', 'ትሪጎኖሜትሪ', 'ካልኩለስ', 'ስታቲስቲክስ', 'የኢትዮጵያ የሒሳብ ሥርዓተ ትምህርት'],
      duration: 'Flexible',
      durationAmharic: 'ተለዋዋጭ',
      level: 'Grade 5-12',
      levelAmharic: '5-12 ክፍል',
      price: 'Negotiable',
      priceAmharic: 'በስምምነት'
    },
    {
      id: 'english-grade-5-12',
      name: 'English (Grade 5-12)',
      nameAmharic: 'እንግሊዝኛ (5-12 ክፍል)',
      description: 'English language and literature from Grade 5 to Grade 12, taught by university lecturers with Master\'s degrees in English Literature and Linguistics. Duration and pricing can be customized based on your learning needs.',
      descriptionAmharic: 'ከ5-12 ክፍል የእንግሊዝኛ ቋንቋ እና ስነ-ጽሁፍ፣ በእንግሊዝኛ ስነ-ጽሁፍ እና በቋንቋ ሳይንስ ውስጥ የማስተርስ ዲግሪ ያላቸው የዩኒቨርሲቲ ፕሮፌሰሮች ይሰጣል።',
      subjects: ['Grammar', 'Literature', 'Writing', 'Reading Comprehension', 'Speaking', 'Ethiopian English Curriculum'],
      subjectsAmharic: ['ግራመር', 'ስነ-ጽሁፍ', 'ጽሑፍ', 'የንባት ግንዛቤ', 'ንግግር', 'የኢትዮጵያ የእንግሊዝኛ ሥርዓተ ትምህርት'],
      duration: 'Flexible',
      durationAmharic: 'ተለዋዋጭ',
      level: 'Grade 5-12',
      levelAmharic: '5-12 ክፍል',
      price: 'Negotiable',
      priceAmharic: 'በስምምነት'
    },
    {
      id: 'physics-grade-5-12',
      name: 'Physics (Grade 5-12)',
      nameAmharic: 'ፊዚክስ (5-12 ክፍል)',
      description: 'Physics concepts and practical applications from Grade 5 to Grade 12, taught by university lecturers with Master\'s degrees in Physics and Applied Sciences. Duration and pricing can be customized based on your learning needs.',
      descriptionAmharic: 'ከ5-12 ክፍል የፊዚክስ ጽንሰ-ሀሳቦች እና ተግባራዊ አተገባበሮች፣ በፊዚክስ እና በተግባራዊ ሳይንስ ውስጥ የማስተርስ ዲግሪ ያላቸው የዩኒቨርሲቲ ፕሮፌሰሮች ይሰጣል።',
      subjects: ['Mechanics', 'Thermodynamics', 'Electricity', 'Magnetism', 'Optics', 'Ethiopian Physics Curriculum'],
      subjectsAmharic: ['ሜካኒክስ', 'ተርሞዳይናሚክስ', 'ኤሌክትሪክ', 'ማግኔቲዝም', 'ኦፕቲክስ', 'የኢትዮጵያ የፊዚክስ ሥርዓተ ትምህርት'],
      duration: 'Flexible',
      durationAmharic: 'ተለዋዋጭ',
      level: 'Grade 5-12',
      levelAmharic: '5-12 ክፍል',
      price: 'Negotiable',
      priceAmharic: 'በስምምነት'
    },
    {
      id: 'electrical-engineering',
      name: 'Electrical Engineering',
      nameAmharic: 'የኤሌክትሪክ ምህንድስና',
      description: 'Learn electrical engineering concepts and practical applications, taught by university lecturers with Master\'s degrees in Electrical Engineering. Duration and pricing can be customized based on your learning needs.',
      descriptionAmharic: 'የኤሌክትሪክ ምህንድስና ጽንሰ-ሀሳቦች እና ተግባራዊ አተገባበሮችን ይማሩ፣ በኤሌክትሪክ ምህንድስና ውስጥ የማስተርስ ዲግሪ ያላቸው የዩኒቨርሲቲ ፕሮፌሰሮች ይሰጣል።',
      subjects: ['Circuit Analysis', 'Digital Electronics', 'Power Systems', 'Control Systems', 'Signal Processing'],
      subjectsAmharic: ['የሰንሰለት ትንተና', 'ዲጂታል ኤሌክትሮኒክስ', 'የኃይል ስርዓቶች', 'የመቆጣጠሪያ ስርዓቶች', 'የምልክት ማስተካከል'],
      duration: 'Flexible',
      durationAmharic: 'ተለዋዋጭ',
      level: 'Advanced',
      levelAmharic: 'ላቀ',
      price: 'Negotiable',
      priceAmharic: 'በስምምነት'
    },
    {
      id: 'mern-fullstack',
      name: 'MERN Full Stack Web Development',
      nameAmharic: 'MERN ፉል ስታክ ዌብ ዲቬሎፕመንት',
      description: 'Master full-stack web development using MongoDB, Express, React, and Node.js, taught by university lecturers with Master\'s degrees in Computer Science and MERN stack expertise. Duration and pricing can be customized based on your learning needs.',
      descriptionAmharic: 'MongoDB፣ Express፣ React፣ እና Node.js በመጠቀም ፉል ስታክ ዌብ ዲቬሎፕመንትን ይማሩ፣ በኮምፒውተር ሳይንስ እና MERN ስታክ ሙያ ውስጥ የማስተርስ ዲግሪ ያላቸው የዩኒቨርሲቲ ፕሮፌሰሮች ይሰጣል።',
      subjects: ['JavaScript', 'React', 'Node.js', 'Express.js', 'MongoDB', 'HTML/CSS', 'API Development', 'Deployment'],
      subjectsAmharic: ['ጃቫስክሪፕት', 'ሪአክት', 'Node.js', 'Express.js', 'MongoDB', 'HTML/CSS', 'API ዲቬሎፕመንት', 'መሰራጨት'],
      duration: 'Flexible',
      durationAmharic: 'ተለዋዋጭ',
      level: 'Beginner to Advanced',
      levelAmharic: 'ጀማሪ እስከ ላቀ',
      price: '20,000 ETB/month',
      priceAmharic: '20,000 ብር/ወር'
    },
    {
      id: 'computer-basics',
      name: 'Basics of Computers',
      nameAmharic: 'የኮምፒውተር መሰረታዊ ነገሮች',
      description: 'Fundamental computer skills and concepts, taught by university lecturers with Master\'s degrees in Computer Science and Information Technology. Duration and pricing can be customized based on your learning needs.',
      descriptionAmharic: 'የኮምፒውተር መሰረታዊ ክህሎቶች እና ጽንሰ-ሀሳቦች፣ በኮምፒውተር ሳይንስ እና በመረጃ ቴክኖሎጂ ውስጥ የማስተርስ ዲግሪ ያላቸው የዩኒቨርሲቲ ፕሮፌሰሮች ይሰጣል።',
      subjects: ['Computer Hardware', 'Operating Systems', 'Microsoft Office', 'Internet Basics', 'File Management', 'Basic Programming'],
      subjectsAmharic: ['የኮምፒውተር ሃርድዌር', 'የኦፕሬቲንግ ሲስተሞች', 'ማይክሮሶፍት ኦፊስ', 'የኢንተርኔት መሰረታዊ ነገሮች', 'የፋይል አያያዝ', 'መሰረታዊ ፕሮግራሚንግ'],
      duration: 'Flexible',
      durationAmharic: 'ተለዋዋጭ',
      level: 'Beginner',
      levelAmharic: 'ጀማሪ',
      price: 'Negotiable',
      priceAmharic: 'በስምምነት'
    }
  ];

    // Get enrollment counts for each course
    const coursesWithCounts = await Promise.all(
      courses.map(async (course) => {
        const enrollmentCount = await CourseEnrollment.countDocuments({ course: course.id });
        return {
          ...course,
          enrollmentCount
        };
      })
    );

    res.json(coursesWithCounts);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/tutorials/enroll
// @desc    Enroll in a course
// @access  Private
router.post('/enroll', auth, async (req, res) => {
  try {
    const {
      course,
      courseName,
      fullName,
      address,
      city,
      telephone,
      email
    } = req.body;

    // Create new enrollment
    const enrollment = new CourseEnrollment({
      user: req.user.id,
      course,
      courseName,
      fullName,
      address,
      city,
      telephone,
      email,
      currentLevel: 'Not specified',
      learningGoals: 'Not specified',
      previousExperience: 'Not specified',
      availability: 'Not specified',
      motivation: 'Not specified',
      preferredLearningStyle: 'Not specified',
      budget: null,
      languages: [],
      contactInfo: {}
    });

    await enrollment.save();
    await enrollment.populate('user', 'name email');

    res.status(201).json({
      msg: 'Course enrollment submitted successfully',
      enrollment
    });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/tutorials/my-enrollments
// @desc    Get user's course enrollments
// @access  Private
router.get('/my-enrollments', auth, async (req, res) => {
  try {
    const enrollments = await CourseEnrollment.find({ user: req.user.id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(enrollments);
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/tutorials/enrollments
// @desc    Get all course enrollments (admin only)
// @access  Private (Admin)
router.get('/enrollments', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.course) filter.course = req.query.course;

    const enrollments = await CourseEnrollment.find(filter)
      .populate('user', 'name email')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await CourseEnrollment.countDocuments(filter);

    res.json({
      enrollments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/tutorials/enrollments/:id/status
// @desc    Update enrollment status (admin only)
// @access  Private (Admin)
router.put('/enrollments/:id/status', auth, async (req, res) => {
  try {
    const { status, adminNotes, rejectionReason } = req.body;

    const updateData = {
      status,
      reviewedBy: req.user.id,
      reviewedAt: new Date()
    };

    if (adminNotes) updateData.adminNotes = adminNotes;
    if (rejectionReason) updateData.rejectionReason = rejectionReason;
    if (status === 'enrolled') updateData.enrollmentDate = new Date();
    if (status === 'completed') updateData.completionDate = new Date();

    const enrollment = await CourseEnrollment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('user', 'name email');

    if (!enrollment) {
      return res.status(404).json({ msg: 'Enrollment not found' });
    }

    res.json({ msg: 'Enrollment status updated successfully', enrollment });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/tutorials/enrollments/:id
// @desc    Get specific enrollment details
// @access  Private
router.get('/enrollments/:id', auth, async (req, res) => {
  try {
    const enrollment = await CourseEnrollment.findById(req.params.id)
      .populate('user', 'name email')
      .populate('reviewedBy', 'name email');

    if (!enrollment) {
      return res.status(404).json({ msg: 'Enrollment not found' });
    }

    res.json(enrollment);
  } catch (error) {
    console.error('Get enrollment error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   DELETE /api/tutorials/enrollments/:id
// @desc    Delete enrollment
// @access  Private
router.delete('/enrollments/:id', auth, async (req, res) => {
  try {
    const enrollment = await CourseEnrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({ msg: 'Enrollment not found' });
    }

    await CourseEnrollment.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Enrollment deleted successfully' });
  } catch (error) {
    console.error('Delete enrollment error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;