const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN
  });
};

// @desc    Register a new user (Student or Organiser)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, department, rollNumber, organizationName, interests } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists'
      });
    }

    // Restrict direct admin registration from public form
    let assignedRole = role || 'student';
    if (assignedRole === 'admin') {
      assignedRole = 'student'; // Admins must be provisioned or seeded
    }

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
      department: department || 'Information Technology',
      rollNumber: rollNumber || '',
      organizationName: organizationName || '',
      interests: Array.isArray(interests) && interests.length > 0 ? interests : ['Web Development', 'Artificial Intelligence', 'Tech Events']
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        rollNumber: user.rollNumber,
        organizationName: user.organizationName,
        interests: user.interests,
        avatar: user.avatar
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact administrator.'
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        rollNumber: user.rollNumber,
        organizationName: user.organizationName,
        interests: user.interests,
        avatar: user.avatar
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get currently logged in user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile & interests
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, department, rollNumber, organizationName, interests, avatar } = req.body;

    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (department) fieldsToUpdate.department = department;
    if (rollNumber !== undefined) fieldsToUpdate.rollNumber = rollNumber;
    if (organizationName !== undefined) fieldsToUpdate.organizationName = organizationName;
    if (interests && Array.isArray(interests)) fieldsToUpdate.interests = interests;
    if (avatar !== undefined) fieldsToUpdate.avatar = avatar;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      user: updatedUser
    });
  } catch (err) {
    next(err);
  }
};
