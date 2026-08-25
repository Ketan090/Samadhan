import { Router, Response } from 'express';
import Challenge from '../models/Challenge';
import Solution from '../models/Solution';
import Organization from '../models/Organization';
import User from '../models/User';
import Collaboration from '../models/Collaboration';
import ImpactMetric from '../models/ImpactMetric';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/analytics/overview
router.get('/overview', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [
      totalChallenges,
      verifiedChallenges,
      openChallenges,
      inProgressChallenges,
      solvedChallenges,
      implementedChallenges,
      totalSolutions,
      approvedSolutions,
      pilotSolutions,
      totalOrganizations,
      universityCount,
      industryCount,
      governmentCount,
      ngoCount,
      totalUsers,
      activeCollaborations,
      impactMetrics
    ] = await Promise.all([
      Challenge.countDocuments(),
      Challenge.countDocuments({ verificationStatus: 'verified' }),
      Challenge.countDocuments({ status: 'open' }),
      Challenge.countDocuments({ status: 'in-progress' }),
      Challenge.countDocuments({ status: 'solved' }),
      Challenge.countDocuments({ status: 'implemented' }),
      Solution.countDocuments(),
      Solution.countDocuments({ status: 'approved' }),
      Solution.countDocuments({ status: 'pilot' }),
      Organization.countDocuments(),
      Organization.countDocuments({ type: 'university' }),
      Organization.countDocuments({ type: 'industry' }),
      Organization.countDocuments({ type: 'government' }),
      Organization.countDocuments({ type: 'ngo' }),
      User.countDocuments(),
      Collaboration.countDocuments({ status: 'active' }),
      ImpactMetric.countDocuments()
    ]);

    // Calculate total impact
    const impactData = await ImpactMetric.aggregate([
      { $group: { _id: '$category', totalImprovement: { $sum: '$improvement' }, count: { $sum: 1 } } }
    ]);

    const totalPeopleImpacted = await ImpactMetric.aggregate([
      { $match: { category: 'people-benefited' } },
      { $group: { _id: null, total: { $sum: '$afterValue' } } }
    ]);

    // Challenges by category
    const challengesByCategory = await Challenge.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Challenges by state
    const challengesByState = await Challenge.aggregate([
      { $group: { _id: '$location.state', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 15 }
    ]);

    // Recent activity
    const recentChallenges = await Challenge.find()
      .populate('submittedBy', 'name role')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title category status createdAt location');

    res.json({
      success: true,
      overview: {
        challenges: {
          total: totalChallenges,
          verified: verifiedChallenges,
          open: openChallenges,
          inProgress: inProgressChallenges,
          solved: solvedChallenges,
          implemented: implementedChallenges
        },
        solutions: {
          total: totalSolutions,
          approved: approvedSolutions,
          pilot: pilotSolutions
        },
        organizations: {
          total: totalOrganizations,
          universities: universityCount,
          industries: industryCount,
          government: governmentCount,
          ngos: ngoCount
        },
        users: totalUsers,
        activeCollaborations,
        impactMetrics: impactMetrics,
        totalPeopleImpacted: totalPeopleImpacted[0]?.total || 0,
        impactByCategory: impactData,
        challengesByCategory,
        challengesByState,
        recentChallenges
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch analytics', error: error.message });
  }
});

// GET /api/analytics/dashboard
router.get('/dashboard', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const role = req.user!.role;
    const userId = req.user!._id;

    let dashboardData: any = {};

    if (role === 'government' || role === 'admin') {
      const [
        pendingVerification,
        activePilots,
        submittedSolutions,
        totalImpact
      ] = await Promise.all([
        Challenge.countDocuments({ verificationStatus: 'pending' }),
        Solution.countDocuments({ status: 'pilot' }),
        Solution.countDocuments({ status: 'submitted' }),
        ImpactMetric.countDocuments({ verified: true })
      ]);

      dashboardData = {
        pendingVerification,
        activePilots,
        submittedSolutions,
        verifiedImpact: totalImpact
      };
    }

    if (role === 'university') {
      const orgId = req.user!.organization;
      dashboardData = {
        relevantChallenges: await Challenge.countDocuments({ status: 'open' }),
        myParticipations: await Challenge.countDocuments({ participatingOrganizations: orgId })
      };
    }

    if (role === 'industry') {
      dashboardData = {
        relevantChallenges: await Challenge.countDocuments({ status: 'open' }),
        mentorshipRequests: await Collaboration.countDocuments({
          partnerOrganization: req.user!.organization,
          status: 'pending',
          role: 'mentor'
        })
      };
    }

    res.json({ success: true, dashboard: dashboardData });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard data', error: error.message });
  }
});

export default router;
