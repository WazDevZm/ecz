import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { TrendingUp, Hash, RefreshCw } from 'lucide-react';
import { mockWordCloud } from '../lib/mockData';

const TrendsPage = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [wordCloud, setWordCloud] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const fetchData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setWordCloud(mockWordCloud);
    } catch (error) {
      toast.error('Failed to load trends');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="animate-spin text-green-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Trends</h1>
          <p className="text-gray-400 mt-1">Trending topics and hashtags</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trending Hashtags */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <Hash className="text-amber-400" size={24} />
            <h3 className="text-xl font-semibold text-white">Trending Hashtags</h3>
          </div>
          <div className="space-y-2">
            {wordCloud?.hashtags?.slice(0, 20).map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-navy-800 rounded-lg">
                <span className="text-white">#{item.text}</span>
                <span className="text-gray-400 text-sm">{item.value.toLocaleString()} mentions</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Topics */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="text-green-400" size={24} />
            <h3 className="text-xl font-semibold text-white">Trending Topics</h3>
          </div>
          <div className="space-y-2">
            {wordCloud?.topics?.slice(0, 20).map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-navy-800 rounded-lg">
                <span className="text-white capitalize">{item.text}</span>
                <span className="text-gray-400 text-sm">{item.value.toLocaleString()} mentions</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendsPage;
