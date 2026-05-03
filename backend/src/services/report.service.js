import Post from '../models/Post.model.js';
import Party from '../models/Party.model.js';
import Candidate from '../models/Candidate.model.js';

export const generateReport = async ({ format, timeRange, includeCharts }) => {
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

  // Gather statistics
  const totalPosts = await Post.countDocuments({ publishedAt: { $gte: startDate } });
  
  const sentimentBreakdown = await Post.aggregate([
    { $match: { publishedAt: { $gte: startDate } } },
    {
      $group: {
        _id: '$sentiment.label',
        count: { $sum: 1 }
      }
    }
  ]);

  const topParties = await Post.aggregate([
    { $match: { publishedAt: { $gte: startDate } } },
    { $unwind: '$entities.parties' },
    {
      $group: {
        _id: '$entities.parties',
        mentions: { $sum: 1 }
      }
    },
    { $sort: { mentions: -1 } },
    { $limit: 5 }
  ]);

  const topCandidates = await Post.aggregate([
    { $match: { publishedAt: { $gte: startDate } } },
    { $unwind: '$entities.candidates' },
    {
      $group: {
        _id: '$entities.candidates',
        mentions: { $sum: 1 }
      }
    },
    { $sort: { mentions: -1 } },
    { $limit: 5 }
  ]);

  const topHashtags = await Post.aggregate([
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

  // Populate party and candidate details
  const partyIds = topParties.map(p => p._id);
  const parties = await Party.find({ _id: { $in: partyIds } });
  
  const candidateIds = topCandidates.map(c => c._id);
  const candidates = await Candidate.find({ _id: { $in: candidateIds } }).populate('party');

  const report = {
    generatedAt: new Date(),
    timeRange,
    summary: {
      totalPosts,
      sentiment: sentimentBreakdown,
      topParties: topParties.map(tp => {
        const party = parties.find(p => p._id.equals(tp._id));
        return {
          party: party ? { name: party.name, abbreviation: party.abbreviation } : null,
          mentions: tp.mentions
        };
      }),
      topCandidates: topCandidates.map(tc => {
        const candidate = candidates.find(c => c._id.equals(tc._id));
        return {
          candidate: candidate ? { name: candidate.name, party: candidate.party.name } : null,
          mentions: tc.mentions
        };
      }),
      topHashtags: topHashtags.map(h => ({ tag: h._id, count: h.count }))
    }
  };

  // In a real implementation, you would generate PDF/CSV here
  // For now, return JSON data
  return report;
};
