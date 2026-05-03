import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  mockOverview,
  mockSentimentTrends,
  mockPartyComparison,
  mockCandidateLeaderboard,
  mockRecentPosts
} from '../lib/mockData';
import { 
  TrendingUp, 
  TrendingDown, 
  MessageSquare, 
  Hash,
  Users,
  RefreshCw
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const DashboardPage = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [overview, setOverview] = useState(null);
  const [sentimentTrends, setSentimentTrends] = useState([]);
  const [partyComparison, setPartyComparison] = useState([]);
  const [candidateLeaderboard, setCandidateLeaderboard] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use mock data (no backend required)
      setOverview(mockOverview);
      setSentimentTrends(mockSentimentTrends);
      setPartyComparison(mockPartyComparison);
      setCandidateLeaderboard(mockCandidateLeaderboard);
      setRecentPosts(mockRecentPosts);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  useEffect(() => {
    // Demo mode - simulate real-time updates
    const interval = setInterval(() => {
      // Randomly add a new post every 30 seconds
      if (Math.random() > 0.5) {
        const newPost = {
          _id: Date.now().toString(),
          content: 'New political discussion happening now...',
          source: ['twitter', 'facebook', 'news'][Math.floor(Math.random() * 3)],
          sentiment: { 
            label: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)],
            score: (Math.random() * 2 - 1).toFixed(2)
          },
          publishedAt: new Date().toISOString(),
          author: { username: 'demo_user_' + Math.floor(Math.random() * 1000) }
        };
        setRecentPosts(prev => [newPost, ...prev.slice(0, 9)]);
        toast.success('New post received!', { duration: 2000 });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="animate-spin text-green-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-gray-400 mt-1">Real-time political sentiment monitoring</p>
        </div>
        <div className="flex items-center space-x-2">
          {['24h', '7d', '30d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeRange === range
                  ? 'bg-green-600 text-white'
                  : 'bg-navy-800 text-gray-300 hover:bg-navy-700'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Mentions</span>
            <MessageSquare className="text-blue-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">
            {overview?.totalMentions?.toLocaleString() || 0}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Positive Sentiment</span>
            <TrendingUp className="text-green-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-green-400">
            {overview?.sentiment?.positive || 0}%
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Negative Sentiment</span>
            <TrendingDown className="text-red-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-red-400">
            {overview?.sentiment?.negative || 0}%
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Trending Hashtags</span>
            <Hash className="text-amber-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">
            {overview?.trendingHashtags?.length || 0}
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Trends */}
        <div className="card">
          <h3 className="text-xl font-semibold text-white mb-4">Sentiment Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sentimentTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334e68" />
              <XAxis dataKey="time" stroke="#9fb3c8" />
              <YAxis stroke="#9fb3c8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334e68',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#16a34a" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Party Comparison */}
        <div className="card">
          <h3 className="text-xl font-semibold text-white mb-4">Party Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={partyComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334e68" />
              <XAxis dataKey="party.abbreviation" stroke="#9fb3c8" />
              <YAxis stroke="#9fb3c8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334e68',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="mentions" fill="#16a34a" />
              <Bar dataKey="engagement" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Candidate Leaderboard & Recent Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Candidate Leaderboard */}
        <div className="card">
          <h3 className="text-xl font-semibold text-white mb-4">Candidate Leaderboard</h3>
          <div className="space-y-3">
            {candidateLeaderboard.map((item, index) => (
              <div
                key={item.candidate.id}
                className="flex items-center justify-between p-3 bg-navy-800 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-navy-700 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-white">{item.candidate.name}</div>
                    <div className="text-xs text-gray-400">{item.candidate.party.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-white">
                    {item.mentions.toLocaleString()} mentions
                  </div>
                  <div className="text-xs">
                    <span className="text-green-400">{item.positivePercent}%</span>
                    {' / '}
                    <span className="text-red-400">{item.negativePercent}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Posts */}
        <div className="card">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Posts</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {recentPosts.map((post) => (
              <div key={post._id} className="p-3 bg-navy-800 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-gray-400 uppercase">
                      {post.source}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        post.sentiment.label === 'positive'
                          ? 'bg-green-600/20 text-green-400'
                          : post.sentiment.label === 'negative'
                          ? 'bg-red-600/20 text-red-400'
                          : 'bg-gray-600/20 text-gray-400'
                      }`}
                    >
                      {post.sentiment.label}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(post.publishedAt).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-gray-300 line-clamp-2">{post.content}</p>
                {post.author && (
                  <div className="mt-2 text-xs text-gray-500">
                    @{post.author.username}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
