import mongoose from 'mongoose';
import { User } from '../app/modules/user/user.model';
import { Post } from '../app/modules/post/post.model';
import { WriterApplication } from '../app/modules/writer_application/writer_application.model';


/**
 * Get dashboard analysis data for writers and admins
 * @param userId - User ID
 * @param userRole - Role of the user (writer, admin, user)
 * @returns Dashboard statistics and analytics
 */
export const getDashboardAnalysis = async (userId: string, userRole: string) => {
  try {
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Base response object
    const dashboardData: any = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };

    // For writers and admins: Get post statistics
    if (userRole === 'writer' || userRole === 'admin') {
      // Total posts by user
      const totalPosts = await Post.countDocuments({ author: userId });
      
      // Posts per month (last 6 months)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      const postsPerMonth = await Post.aggregate([
        { 
          $match: { 
            author: new mongoose.Types.ObjectId(userId),
            createdAt: { $gte: sixMonthsAgo }
          } 
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]);
      
      // Topic distribution
      const topicDistribution = await Post.aggregate([
        { $match: { author: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: '$topic', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
      
      dashboardData.writerStats = {
        totalPosts,
        postsPerMonth,
        topicDistribution,
        engagement: {
          totalViews: 0,
          totalLikes: 0,
          totalComments: 0
        }
      };
    }
    
    // For admins only: Get system-wide statistics
    if (userRole === 'admin') {
      // Total users count
      const totalUsers = await User.countDocuments();
      
      // Total posts count
      const totalPostsAll = await Post.countDocuments();
      
      // Pending writer applications
      const pendingApplications = await WriterApplication.countDocuments({ 
        status: 'pending' 
      });
      
      dashboardData.adminStats = {
        totalUsers,
        totalPosts: totalPostsAll,
        pendingApplications,
        activeWriters: await User.countDocuments({ role: 'writer' })
      };
    }
    
    return {
      success: true,
      data: dashboardData
    };
    
  } catch (error: any) {
    console.error('Error in getDashboardAnalysis:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch dashboard analysis'
    };
  }
};

// Export all functions
export default {
  getDashboardAnalysis
};