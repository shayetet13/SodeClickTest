const express = require('express');
const router = express.Router();
const User = require('../models/User');
const MembershipPlan = require('../models/MembershipPlan');
const { requireAdmin, requireSuperAdmin } = require('../middleware/adminAuth');

// Get all users with pagination
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const role = req.query.role || '';
    const status = req.query.status || '';
    const premium = req.query.premium || '';
    const sort = req.query.sort || '-createdAt';

    const query = {};
    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) {
      query.role = role;
    }

    if (status === 'active') {
      query.isActive = true;
      query.isBanned = false;
    } else if (status === 'banned') {
      query.isBanned = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    // Filter for premium users only
    if (premium === 'true') {
      query['membership.tier'] = { 
        $in: ['platinum', 'diamond', 'vip2', 'vip1', 'vip', 'gold', 'silver'] 
      };
    }

    // Admin ไม่สามารถดู SuperAdmin ได้ (ซ่อน SuperAdmin จากรายการ)
    if (req.user.role === 'admin') {
      query.role = { $ne: 'superadmin' };
    }

    const skip = (page - 1) * limit;
    
    const users = await User.find(query)
      .select('-password -phoneVerificationCode -phoneVerificationExpires')
      .populate('membership.planId')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get premium statistics
router.get('/premium/stats', requireAdmin, async (req, res) => {
  try {
    const membershipTiers = ['platinum', 'diamond', 'vip2', 'vip1', 'vip', 'gold', 'silver'];
    const stats = {};

    // Count users by membership tier
    for (const tier of membershipTiers) {
      const count = await User.countDocuments({
        'membership.tier': tier,
        isActive: true
      });
      stats[tier] = count;
    }

    // Calculate total premium users
    stats.totalPremium = membershipTiers.reduce((total, tier) => total + stats[tier], 0);

    // Calculate revenue based on membership prices
    const prices = {
      platinum: 1000,
      diamond: 500,
      vip2: 300,
      vip1: 150,
      vip: 100,
      gold: 50,
      silver: 20
    };

    // Calculate total revenue
    stats.totalRevenue = membershipTiers.reduce((total, tier) => {
      return total + (stats[tier] * prices[tier]);
    }, 0);

    // Calculate monthly revenue (assuming all memberships are monthly)
    const monthlyTiers = ['platinum', 'diamond', 'vip2', 'vip1', 'vip'];
    stats.monthlyRevenue = monthlyTiers.reduce((total, tier) => {
      return total + (stats[tier] * prices[tier]);
    }, 0);

    // Add Gold and Silver revenue (they have different durations)
    stats.monthlyRevenue += stats.gold * prices.gold * 2; // 15 days = 2 per month
    stats.monthlyRevenue += stats.silver * prices.silver * 4; // 7 days = 4 per month

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get banned users with pagination
router.get('/banned-users', requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const sort = req.query.sort || '-createdAt';

    const query = { isBanned: true };
    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { banReason: { $regex: search, $options: 'i' } }
      ];
    }

    // Admin ไม่สามารถดู SuperAdmin ที่ถูกแบนได้
    if (req.user.role === 'admin') {
      query.role = { $ne: 'superadmin' };
    }

    const skip = (page - 1) * limit;
    
    const users = await User.find(query)
      .select('-password -phoneVerificationCode -phoneVerificationExpires')
      .populate('membership.planId')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user by ID
router.get('/users/:id', requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -phoneVerificationCode -phoneVerificationExpires')
      .populate('membership.planId');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Admin ไม่สามารถดูรายละเอียด SuperAdmin ได้
    if (req.user.role === 'admin' && user.role === 'superadmin') {
      return res.status(403).json({ 
        message: 'Cannot view SuperAdmin details',
        error: 'Admin users cannot view SuperAdmin account details'
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user
router.put('/users/:id', requireAdmin, async (req, res) => {
  try {
    const { role, membership, isActive, isBanned, banReason, coins, votePoints } = req.body;
    
    // ตรวจสอบว่าผู้ใช้ที่จะแก้ไขเป็น SuperAdmin หรือไม่
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Admin ไม่สามารถแก้ไข SuperAdmin ได้
    if (req.user.role === 'admin' && targetUser.role === 'superadmin') {
      return res.status(403).json({ 
        message: 'Cannot modify SuperAdmin user',
        error: 'Admin users cannot modify SuperAdmin accounts'
      });
    }
    
    const updateData = {};
    
    if (role && ['user', 'admin', 'superadmin'].includes(role)) {
      updateData.role = role;
    }
    
    if (membership) {
      updateData.membership = membership;
    }
    
    if (typeof isActive === 'boolean') {
      updateData.isActive = isActive;
    }
    
    if (typeof isBanned === 'boolean') {
      updateData.isBanned = isBanned;
    }
    
    if (banReason !== undefined) {
      updateData.banReason = banReason;
    }
    
    if (typeof coins === 'number') {
      updateData.coins = coins;
    }
    
    if (typeof votePoints === 'number') {
      updateData.votePoints = votePoints;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password -phoneVerificationCode -phoneVerificationExpires')
     .populate('membership.planId');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Ban/Unban user
router.patch('/users/:id/ban', requireAdmin, async (req, res) => {
  try {
    const { isBanned, banReason } = req.body;
    
    // ตรวจสอบว่าผู้ใช้ที่จะแบนเป็น SuperAdmin หรือไม่
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Admin ไม่สามารถแบน SuperAdmin ได้
    if (req.user.role === 'admin' && targetUser.role === 'superadmin') {
      return res.status(403).json({ 
        message: 'Cannot ban SuperAdmin user',
        error: 'Admin users cannot ban SuperAdmin accounts'
      });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { 
        isBanned: isBanned,
        banReason: isBanned ? banReason : null
      },
      { new: true }
    ).select('-password -phoneVerificationCode -phoneVerificationExpires')
     .populate('membership.planId');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Ban user with duration
router.patch('/users/:id/ban-duration', requireAdmin, async (req, res) => {
  try {
    const { isBanned, banReason, banDuration, banDurationType } = req.body;
    
    // ตรวจสอบว่าผู้ใช้ที่จะแบนเป็น SuperAdmin หรือไม่
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Admin ไม่สามารถแบน SuperAdmin ได้
    if (req.user.role === 'admin' && targetUser.role === 'superadmin') {
      return res.status(403).json({ 
        message: 'Cannot ban SuperAdmin user',
        error: 'Admin users cannot ban SuperAdmin accounts'
      });
    }
    
    let banExpiresAt = null;
    if (isBanned && banDuration && banDurationType) {
      const now = new Date();
      switch (banDurationType) {
        case 'hours':
          banExpiresAt = new Date(now.getTime() + (banDuration * 60 * 60 * 1000));
          break;
        case 'days':
          banExpiresAt = new Date(now.getTime() + (banDuration * 24 * 60 * 60 * 1000));
          break;
        case 'months':
          banExpiresAt = new Date(now.getTime() + (banDuration * 30 * 24 * 60 * 60 * 1000));
          break;
        case 'permanent':
          banExpiresAt = null; // Permanent ban
          break;
      }
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { 
        isBanned: isBanned,
        banReason: isBanned ? banReason : null,
        banExpiresAt: banExpiresAt
      },
      { new: true }
    ).select('-password -phoneVerificationCode -phoneVerificationExpires')
     .populate('membership.planId');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new user (admin only)
router.post('/users', requireAdmin, async (req, res) => {
  try {
    const { 
      username, 
      email, 
      password, 
      firstName, 
      lastName, 
      dateOfBirth, 
      gender, 
      lookingFor, 
      location,
      role = 'user',
      membership = { tier: 'member' }
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      lookingFor,
      location,
      role,
      membership,
      coordinates: {
        type: 'Point',
        coordinates: [0, 0] // Default coordinates
      }
    });

    await newUser.save();

    const userResponse = await User.findById(newUser._id)
      .select('-password -phoneVerificationCode -phoneVerificationExpires')
      .populate('membership.planId');

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user profile details
router.get('/users/:id/profile', requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -phoneVerificationCode -phoneVerificationExpires')
      .populate('membership.planId');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Admin ไม่สามารถดูรายละเอียดโปรไฟล์ SuperAdmin ได้
    if (req.user.role === 'admin' && user.role === 'superadmin') {
      return res.status(403).json({ 
        message: 'Cannot view SuperAdmin profile',
        error: 'Admin users cannot view SuperAdmin profile details'
      });
    }

    // Calculate age
    const age = user.age;

    res.json({
      ...user.toObject(),
      age
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user role
router.patch('/users/:id/role', requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'admin', 'superadmin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // ตรวจสอบว่าผู้ใช้ที่จะแก้ไขเป็น SuperAdmin หรือไม่
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Admin ไม่สามารถแก้ไข role ของ SuperAdmin ได้
    if (req.user.role === 'admin' && targetUser.role === 'superadmin') {
      return res.status(403).json({ 
        message: 'Cannot modify SuperAdmin role',
        error: 'Admin users cannot modify SuperAdmin roles'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password -phoneVerificationCode -phoneVerificationExpires')
     .populate('membership.planId');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user membership
router.patch('/users/:id/membership', requireAdmin, async (req, res) => {
  try {
    const { membership } = req.body;
    
    // ตรวจสอบว่าผู้ใช้ที่จะแก้ไขเป็น SuperAdmin หรือไม่
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Admin ไม่สามารถแก้ไข membership ของ SuperAdmin ได้
    if (req.user.role === 'admin' && targetUser.role === 'superadmin') {
      return res.status(403).json({ 
        message: 'Cannot modify SuperAdmin membership',
        error: 'Admin users cannot modify SuperAdmin memberships'
      });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { membership },
      { new: true }
    ).select('-password -phoneVerificationCode -phoneVerificationExpires')
     .populate('membership.planId');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete user (superadmin only)
router.delete('/users/:id', requireSuperAdmin, async (req, res) => {
  try {
    // ตรวจสอบว่าผู้ใช้ที่จะลบเป็น SuperAdmin หรือไม่
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // SuperAdmin ไม่สามารถลบ SuperAdmin อื่นได้
    if (targetUser.role === 'superadmin') {
      return res.status(403).json({ 
        message: 'Cannot delete SuperAdmin user',
        error: 'SuperAdmin users are protected from being deleted'
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get dashboard statistics
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    // 1. ผู้ใช้ทั้งหมด
    const totalUsers = await User.countDocuments();
    
    // 2. ข้อความทั้งหมด (จาก chat messages)
    const totalMessages = await User.aggregate([
      {
        $group: {
          _id: null,
          totalMessages: { $sum: { $ifNull: ['$dailyUsage.chatCount', 0] } }
        }
      }
    ]);
    
    // 3. ผู้ใช้ออนไลน์ (ผู้ใช้ที่ active และไม่ถูกแบน)
    const onlineUsers = await User.countDocuments({ 
      isActive: true, 
      isBanned: false 
    });
    
    // 4. สมาชิก Premium (ผู้ใช้ที่มี membership tier เป็น premium หรือสูงกว่า)
    const premiumUsers = await User.countDocuments({
      'membership.tier': { $in: ['premium', 'vip', 'diamond'] },
      isActive: true,
      isBanned: false
    });

    // สถิติตามระดับชั้นสมาชิก
    const membershipStats = await User.aggregate([
      {
        $group: {
          _id: '$membership.tier',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // สถิติตาม role
    const roleStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // ผู้ใช้ที่ถูกแบน
    const bannedUsers = await User.countDocuments({ isBanned: true });
    
    // ผู้ใช้ที่ยืนยันแล้ว
    const verifiedUsers = await User.countDocuments({ isVerified: true });

    // ผู้ใช้ใหม่ในเดือนนี้
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);
    
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: currentMonth }
    });

    // ผู้ใช้ที่ active ในเดือนนี้
    const activeUsersThisMonth = await User.countDocuments({
      isActive: true,
      isBanned: false,
      lastLoginAt: { $gte: currentMonth }
    });

    res.json({
      totalUsers,
      totalMessages: totalMessages[0]?.totalMessages || 0,
      onlineUsers,
      premiumUsers,
      bannedUsers,
      verifiedUsers,
      newUsersThisMonth,
      activeUsersThisMonth,
      membershipStats,
      roleStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get membership plans
router.get('/membership-plans', requireAdmin, async (req, res) => {
  try {
    const plans = await MembershipPlan.find().sort({ order: 1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get recent activities
router.get('/activities', requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // ดึงข้อมูลกิจกรรมล่าสุดแบบง่าย
    const allActivities = [];

    // 1. Recent registrations
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('firstName lastName createdAt');

    recentUsers.forEach(user => {
      allActivities.push({
        id: `${user._id}-register-${user.createdAt.getTime()}`,
        type: 'account_created',
        message: `ผู้ใช้ใหม่สมัครสมาชิก: ${user.firstName} ${user.lastName}`,
        timestamp: user.createdAt,
        status: 'success'
      });
    });

    // 2. Premium users
    const premiumUsers = await User.find({
      'membership.tier': { $in: ['platinum', 'diamond', 'vip2', 'vip1', 'vip', 'gold', 'silver'] }
    })
      .sort({ 'membership.updatedAt': -1 })
      .limit(5)
      .select('firstName lastName membership');

    premiumUsers.forEach(user => {
      if (user.membership && user.membership.updatedAt) {
        allActivities.push({
          id: `${user._id}-upgrade-${user.membership.updatedAt.getTime()}`,
          type: 'membership_upgrade',
          message: `อัพเกรดเป็น Premium: ${user.firstName} ${user.lastName}`,
          timestamp: user.membership.updatedAt,
          status: 'premium'
        });
      }
    });

    // 3. Banned users
    const bannedUsers = await User.find({ isBanned: true })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('firstName lastName banReason updatedAt');

    bannedUsers.forEach(user => {
      allActivities.push({
        id: `${user._id}-banned-${user.updatedAt.getTime()}`,
        type: 'account_banned',
        message: `แบนบัญชี: ${user.firstName} ${user.lastName} (เหตุผล: ${user.banReason || 'ไม่ระบุเหตุผล'})`,
        timestamp: user.updatedAt,
        status: 'warning'
      });
    });

    // เรียงลำดับตามเวลา
    allActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // จำกัดจำนวนและ pagination
    const startIndex = skip;
    const endIndex = skip + limit;
    const paginatedActivities = allActivities.slice(startIndex, endIndex);

    res.json({
      activities: paginatedActivities,
      pagination: {
        page,
        limit,
        total: allActivities.length,
        pages: Math.ceil(allActivities.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

