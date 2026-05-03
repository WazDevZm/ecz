import Post from '../models/Post.model.js';
import Party from '../models/Party.model.js';
import Candidate from '../models/Candidate.model.js';
import Province from '../models/Province.model.js';

export const getOverview = async (req, res) => {
  try {
    const { timeRange = '24h' } = req.query;
    
    // Calculate time filter
    const now = new Date();
    let startDate;
    switch (timeRange) {
      case '24h':
        startDate = new Date(now - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now - 24 * 60 * 60 * 1000);
    }

    // Total mentions
    const totalMentions = await Post.countDocuments({
      publishedAt: { $gte: startDate }
    });

    // Sentiment breakdown
    const sentimentStats = await Post.aggregate([
      { $match: { publishedAt: { $gte: startDate } } },
      {
        $group: {
          _id: '$sentiment.label',
          count: { $sum: 1 }
        }
      }
    ]);

    const sentimentMap = sentimentStats.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    const positive = sentimentMap.positive || 0;
    const negative = sentimentMap.negative || 0;
    const neutral = sentimentMap.neutral || 0;
    const total = positive + negative + neutral || 1;

    // Trending hashtags
    const trendingHashtags = await Post.aggregate([
      { $match: { publishedAt: { $gte: startDate } } },
      { $unwind: '$entities.hashtags' },
      {
        $group: {
          _id: '$entities.hashtags',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Most discussed party
    const partyMentions = await Post.aggregate([
      { $match: { publishedAt: { $gte: startDate } } },
      { $unwind: '$entities.parties' },
      {
        $group: {
          _id: '$entities.parties',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    let mostDiscussedParty = null;
    if (partyMentions.length > 0) {
      mostDiscussedParty = await Party.findById(partyMentions[0]._id);
    }

    res.json({
      success: true,
      data: {
        totalMentions,
        sentiment: {
          positive: ((positive / total) * 100).toFixed(1),
          negative: ((negative / total) * 100).toFixed(1),
          neutral: ((neutral / total) * 100).toFixed(1)
        },
        trendingHashtags: trendingHashtags.map(h => ({
          tag: h._id,
          count: h.count
        })),
        mostDiscussedParty: mostDiscussedParty ? {
          name: mostDiscussedParty.name,
          abbreviation: mostDiscussedParty.abbreviation,
          color: mostDiscussedParty.color
        } : null
      }
    });
  } catch (error) {
    console.error('Get overview error:', error);
    res.status(500).json({ message: 'Error fetching overview data' });
  }
};

export const getSentimentTrends = async (req, res) => {
  try {
    const { timeRange = '7d', partyIds } = req.query;
    
    const now = new Date();
    let startDate;
    let groupBy;
    
    switch (timeRange) {
      case '24h':
        startDate = new Date(now - 24 * 60 * 60 * 1000);
        groupBy = { $hour: '$publishedAt' };
        break;
      case '7d':
        startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
        groupBy = { $dayOfMonth: '$publishedAt' };
        break;
      case '30d':
        startDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
        groupBy = { $dayOfMonth: '$publishedAt' };
        break;
      default:
        startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
        groupBy = { $dayOfMonth: '$publishedAt' };
    }

    const matchStage = {
      publishedAt: { $gte: startDate }
    };

    if (partyIds) {
      const partyIdArray = partyIds.split(',');
      matchStage['entities.parties'] = { $in: partyIdArray };
    }

    const trends = await Post.aggregate([
      { $match: matchStage },
      { $unwind: { path: '$entities.parties', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: {
            party: '$entities.parties',
            time: groupBy,
            sentiment: '$sentiment.label'
          },
          count: { $sum: 1 },
          avgScore: { $avg: '$sentiment.score' }
        }
      },
      { $sort: { '_id.time': 1 } }
    ]);

    // Populate party details
    const partyIds = [...new Set(trends.map(t => t._id.party).filter(Boolean))];
    const parties = await Party.find({ _id: { $in: partyIds } });
    const partyMap = parties.reduce((acc, p) => {
      acc[p._id.toString()] = p;
      return acc;
    }, {});

    res.json({
      success: true,
      data: trends.map(t => ({
        party: t._id.party ? partyMap[t._id.party.toString()] : null,
        time: t._id.time,
        sentiment: t._id.sentiment,
        count: t.count,
        avgScore: t.avgScore
      }))
    });
  } catch (error) {
    console.error('Get sentiment trends error:', error);
    res.status(500).json({ message: 'Error fetching sentiment trends' });
  }
};

export const getPartyComparison = async (req, res) => {
  try {
    const { timeRange = '7d' } = req.query;
    
    const now = new Date();
    let startDate;
    switch (timeRange) {
      case '24h':
        startDate = new Date(now - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
    }

    const comparison = await Post.aggregate([
      { $match: { publishedAt: { $gte: startDate } } },
      { $unwind: '$entities.parties' },
      {
        $group: {
          _id: {
            party: '$entities.parties',
            sentiment: '$sentiment.label'
          },
          count: { $sum: 1 },
          totalEngagement: {
            $sum: {
              $add: ['$engagement.likes', '$engagement.shares', '$engagement.comments']
            }
          },
          avgSentimentScore: { $avg: '$sentiment.score' }
        }
      },
      {
        $group: {
          _id: '$_id.party',
          mentions: { $sum: '$count' },
          engagement: { $sum: '$totalEngagement' },
          sentiments: {
            $push: {
              label: '$_id.sentiment',
              count: '$count'
            }
          },
          avgScore: { $avg: '$avgSentimentScore' }
        }
      },
      { $sort: { mentions: -1 } }
    ]);

    // Populate party details
    const partyIds = comparison.map(c => c._id);
    const parties = await Party.find({ _id: { $in: partyIds } });
    const partyMap = parties.reduce((acc, p) => {
      acc[p._id.toString()] = p;
      return acc;
    }, {});

    const result = comparison.map(c => {
      const party = partyMap[c._id.toString()];
      const sentimentMap = c.sentiments.reduce((acc, s) => {
        acc[s.label] = s.count;
        return acc;
      }, {});
      
      const total = c.mentions || 1;
      
      return {
        party: {
          id: party._id,
          name: party.name,
          abbreviation: party.abbreviation,
          color: party.color
        },
        mentions: c.mentions,
        engagement: c.engagement,
        sentiment: {
          positive: ((sentimentMap.positive || 0) / total * 100).toFixed(1),
          negative: ((sentimentMap.negative || 0) / total * 100).toFixed(1),
          neutral: ((sentimentMap.neutral || 0) / total * 100).toFixed(1),
          netScore: (c.avgScore * 100).toFixed(1)
        }
      };
    });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Get party comparison error:', error);
    res.status(500).json({ message: 'Error fetching party comparison' });
  }
};

export const getCandidateLeaderboard = async (req, res) => {
  try {
    const { timeRange = '7d', limit = 10 } = req.query;
    
    const now = new Date();
    let startDate;
    switch (timeRange) {
      case '24h':
        startDate = new Date(now - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
    }

    const leaderboard = await Post.aggregate([
      { $match: { publishedAt: { $gte: startDate } } },
      { $unwind: '$entities.candidates' },
      {
        $group: {
          _id: {
            candidate: '$entities.candidates',
            sentiment: '$sentiment.label'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.candidate',
          mentions: { $sum: '$count' },
          sentiments: {
            $push: {
              label: '$_id.sentiment',
              count: '$count'
            }
          }
        }
      },
      { $sort: { mentions: -1 } },
      { $limit: parseInt(limit) }
    ]);

    // Populate candidate and party details
    const candidateIds = leaderboard.map(l => l._id);
    const candidates = await Candidate.find({ _id: { $in: candidateIds } }).populate('party');

    const result = leaderboard.map(l => {
      const candidate = candidates.find(c => c._id.toString() === l._id.toString());
      const sentimentMap = l.sentiments.reduce((acc, s) => {
        acc[s.label] = s.count;
        return acc;
      }, {});
      
      const total = l.mentions || 1;
      const positive = sentimentMap.positive || 0;
      const negative = sentimentMap.negative || 0;
      
      return {
        candidate: {
          id: candidate._id,
          name: candidate.name,
          photo: candidate.photo,
          party: {
            name: candidate.party.name,
            abbreviation: candidate.party.abbreviation,
            color: candidate.party.color
          }
        },
        mentions: l.mentions,
        positivePercent: ((positive / total) * 100).toFixed(1),
        negativePercent: ((negative / total) * 100).toFixed(1),
        netSentiment: (((positive - negative) / total) * 100).toFixed(1)
      };
    });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Get candidate leaderboard error:', error);
    res.status(500).json({ message: 'Error fetching candidate leaderboard' });
  }
};

export const getWordCloud = async (req, res) => {
  try {
    const { timeRange = '7d', limit = 50 } = req.query;
    
    const now = new Date();
    let startDate;
    switch (timeRange) {
      case '24h':
        startDate = new Date(now - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
    }

    // Get hashtags
    const hashtags = await Post.aggregate([
      { $match: { publishedAt: { $gte: startDate } } },
      { $unwind: '$entities.hashtags' },
      {
        $group: {
          _id: '$entities.hashtags',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: parseInt(limit) }
    ]);

    // Get topics
    const topics = await Post.aggregate([
      { $match: { publishedAt: { $gte: startDate } } },
      { $unwind: '$entities.topics' },
      {
        $group: {
          _id: '$entities.topics',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.json({
      success: true,
      data: {
        hashtags: hashtags.map(h => ({ text: h._id, value: h.count })),
        topics: topics.map(t => ({ text: t._id, value: t.count }))
      }
    });
  } catch (error) {
    console.error('Get word cloud error:', error);
    res.status(500).json({ message: 'Error fetching word cloud data' });
  }
};

export const getRecentPosts = async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    
    const posts = await Post.find()
      .sort({ publishedAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('entities.parties', 'name abbreviation color')
      .populate('entities.candidates', 'name photo');

    const total = await Post.countDocuments();

    res.json({
      success: true,
      data: posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get recent posts error:', error);
    res.status(500).json({ message: 'Error fetching recent posts' });
  }
};
